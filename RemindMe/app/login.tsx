import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ImageBackground,
    StatusBar,
    Platform,
    KeyboardAvoidingView,
    ScrollView,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
const BG_IMAGE = require( '../assets/images/login_bg.png');

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [studentId, setStudentId] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = () => {
        console.log('Signing in pressed', studentId, password);
        // Example: navigation.replace?.('MainTabs');
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar
                barStyle="dark-content"
                translucent
                backgroundColor="transparent"
            />

            <ImageBackground
                source={BG_IMAGE}
                style={styles.bg}
                resizeMode="cover"
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Top Brand */}
                    <View style={styles.topContainer}>
                        <Text style={styles.brand}>RemindME</Text>
                        <Text style={styles.subtitle}>Your accessible reminder companion</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.welcome}>Welcome Back</Text>

                        <Text style={styles.label}>Student ID</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                                style={styles.input}
                                value={studentId}
                                onChangeText={setStudentId}
                                placeholder="Enter your Student ID"
                                autoCapitalize="none"
                                keyboardType="default"
                                accessibilityLabel="Student ID input"
                            />
                            {/* Decorative icon placeholder */}
                            <Image style={styles.leftIcon} source={BG_IMAGE} />
                        </View>

                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputRow}>
                            <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            autoCapitalize="none"
                            accessibilityLabel="Password input"
                            />
                            <Image style={styles.leftIconSmall} source={BG_IMAGE} />
                        </View>

                        <TouchableOpacity
                            onPress={handleSignIn}
                            activeOpacity={0.85}
                            accessibilityRole="button"
                            accessibilityLabel="Sign In"
                        >
                            <LinearGradient
                                colors={[
                                    'rgba(46,33,229,0.84)',
                                    'rgba(142,29.208,0.84)',
                                    'rgba(237,46,101,0.84)',
                                ]}
                                start={[0, 0]}
                                end={[1, 0]}
                            >
                                <Text style={styles.signInButton}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <Text style={styles.footerText}>No Account?</Text>
                        <TouchableOpacity accessibilityRole="button">
                            <Text style={styles.createAccount}>Create Account</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1},
    bg: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.10)',
        paddingTop: Platform.OS === 'android' ? 40 : 64,
    },
    scrollContainer: {
        alignItems: 'center',
        paddingBottom: 48,
    },

    topContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    brand: {
        color: '#FFB700',
        fontSize: 32,
        fontWeight: '400',
    },
    subtitle: {
        color: '#757575',
        fontSize: 16,
        lineHeight: 16,
        textAlign: 'center',
        width: Math.min(272, width * 0.9),
        marginTop: 6,
    },

    card: {
        width: '86%',
        maxWidth: 328,
        minHeight: 472,
        backgroundColor: 'rgba(255,255,255,0.60)',
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'stretch',
        marginTop: 6,
    },

    welcome: {
        fontSize: 32,
        color: 'rgba(203,94,125,0.84)',
        fontWeight: '400',
        marginBottom: 12,
    },

    label: {
        color: '#757575',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 6,
    },

    input: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        color: '#000000',
    },

    leftIcon: {
        width: 24,
        height: 24,
        position: 'absolute',
        left: 8,
        top: 12,
        opacity: 0,
    },
    leftIconSmall: {
        width: 20,
        height: 20,
        position: 'absolute',
        left: 8,
        top: 14,
        opacity: 0,
    },

    signInButton: {
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },
    signInText: {
        color: '#F5F5F5',
        fontSize: 16,
        fontWeight: '700',
    },

    divider: {
        height: 1,
        backgroundColor: '#FFB700',
        marginTop: 18,
        marginBottom: 12,
    },

    footerText: {
        textAlign: 'center',
        color: '#757575',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },
    createAccount: {
        textAlign: 'center',
        color: '#757575',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },

});