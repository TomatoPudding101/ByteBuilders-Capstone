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
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ColorValue } from 'react-native';

const { width } = Dimensions.get('window');
const BG_IMAGE = require( '../assets/images/adult-bg.png');

export default function LoginScreen() {
    const [parentId, setParentId] = useState('');
    const [password, setPassword] = useState('');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const handleSignIn = () => {
        console.log('Signing in with', parentId, password);
        // Example: navigation.replace?.('MainTabs');
    };

    const gradientColors: readonly [ColorValue, ColorValue, ColorValue] =
        theme === 'light'
        ? ['#2E21E5D6', '#8E1DD0D6', '#ED2E65D6']
        : ['#4b3bff', '#a22ee0', '#ff2f65'];
        
    
    const cardBg = theme === 'light' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const inputBg = theme === 'light' ? '#FFF' : '#1E1E1E';
    const inputColor = theme === 'light' ? '#000' : '#FFF';
    const labelColor = theme === 'light' ? '#757575' : '#CCC';

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} translucent backgroundColor="transparent" />
            
            <ImageBackground source={BG_IMAGE} style={styles.bg} resizeMode="cover">
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    {/* Top Brand */}
                    <View style={styles.topContainer}>
                        <Text style={styles.brand}>RemindME</Text>
                        <Text style={styles.subtitle}>Your accessible reminder companion</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        <Text style={styles.welcome}>Welcome Back</Text>

                        {/* Parent ID Input */}
                        <Text style={styles.label}>Parent ID</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: inputColor }]}
                                value={parentId}
                                onChangeText={setParentId}
                                placeholder="Enter your Parent ID"
                                placeholderTextColor="#999"
                                autoCapitalize="none"
                                keyboardType="default"
                                accessibilityLabel="Parent ID input"
                            />

                        {/* Password Input */}
                        <Text style={[styles.label, { color: labelColor }]}>Password</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, color: inputColor }]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Enter your password"
                                secureTextEntry
                                autoCapitalize="none"
                            />

                        {/* Sign In Button */}
                        <TouchableOpacity onPress={handleSignIn} activeOpacity={0.85} style={{marginTop: 18}}>
                            <LinearGradient 
                                colors={gradientColors} 
                                start={[0, 0]} 
                                end={[1, 0]} 
                                style={styles.signInButton}
                            >
                                <Text style={styles.signInText}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={[styles.divider, {backgroundColor: gradientColors[0]}]} />

                        {/* Footer */}
                        <Text style={[styles.footerText, { color: labelColor }]}>No Account?</Text>
                        <TouchableOpacity>
                            <Text style={[styles.createAccount, { color: labelColor}]}>Create Account</Text>
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
        borderRadius: 8,
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'stretch',
        marginTop: 6,
    },
    welcome: {
        fontSize: 32,
        fontWeight: '400',
        marginBottom: 12,
        textAlign: 'center',
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 12,
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        fontSize: 16,
    },
    signInButton: {
        height: 48,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        color: '#F5F5F5',
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },

    divider: {
        height: 1,
        marginTop: 18,
        marginBottom: 12,
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },
    createAccount: {
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 6,
    },

});