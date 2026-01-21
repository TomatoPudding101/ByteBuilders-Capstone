import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const PersonIcon = require('../assets/images/person.png');
const LockIcon = require('../assets/images/pinklock.png');
const LockIcon2 = require('../assets/images/bluelock.png');
const EyeIcon = require('../assets//images/eyeicon.png');

export default function CreateAccount() {
    const [parentId, setParentId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            {/* App Title */}
            <Text style={styles.title}>RemindME</Text>

            {/* Subtitle */}
            <Text style={styles.subtitle}>
                Your accessible reminder companion
            </Text>

            {/* Card */}
            <View style={styles.card}>
                <Text style={styles.title}>Create Account</Text>

                {/* Parent ID */}
                <View style={styles.field}>
                    <Text style={styles.label}>Parent ID</Text>
                    <View style={styles.inputContainer}>
                        <PersonIcon width={20} height={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your Parent ID"
                            value={parentId}
                            onChangeText={setParentId}
                        />
                    </View>
                </View>

                {/* Password */}
                <View style={styles.field}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <LockIcon width={20} height={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your password"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity 
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <EyeIcon width={20} height={20} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password */}
                <View style={styles.field}>
                    <Text style={styles.labelLight}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <LockIcon2 width={20} height={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm your password"
                            secureTextEntry={!showPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                    </View>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity>
                    <LinearGradient
                        colors={[
                            'rgba(46, 33, 229, 0.84)',
                            'rgba(142, 29, 208, 0.84)',
                            'rgba(237, 46, 101, 0.84)',
                        ]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Sign Up</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Footer */}
                <Text style={styles.remember}>Remember Password</Text>
                <TouchableOpacity>
                    <Text style={styles.login}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.10)',
        alignItems: 'center',
    },

    appTitle: {
        marginTop: 40,
        color: '#FFB700',
        fontSize: 32,
        fontFamily: 'SF Pro',
        fontWeight: '400',
    },

    subtitle: {
        marginTop: 8,
        color: '#757575',
        fontSize: 16,
        fontFamily: 'SF Pro Rounded',
    },

    card: {
        marginTop: 24,
        width: 328,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: 8,
        padding: 20,
    },

    title: {
        textAlign: 'center',
        color: 'rgba(203, 94, 126, 0.84)',
        fontSize: 32,
        fontFamily: 'SF Pro',
        marginBottom: 20,
    },

    field: {
        marginBottom: 18,
    },

    label: {
        color: '#757575',
        fontSize: 14,
        fontFamily: 'SF Compact',
        fontWeight: '600',
        marginBottom: 6,
    },

    labelLight: {
        color: '#757575',
        fontSize: 14,
        fontFamily: 'SF Compact',
        fontWeight: '400',
        marginBottom: 6,
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
        gap: 8,
    },

    input: {
        flex: 1,
        fontSize: 14.
    },

    button: {
        height: 44,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
        color: '#F5F5F5',
        fontSize: 16,
        fontFamily: 'SF Pro',
        fontWeight: '700',
    },

    divider: {
        height: 1,
        backgroundColor: '#FFB700',
        marginVertical: 16,
    },

    remember: {
        textAlign: 'center',
        color: '#757575',
        fontSize: 16,
        fontFamily: 'SF Pro Rounded',
    },

    login: {
        textAlign: 'center',
        marginTop: 6,
        color: '#757575',
        fontSize: 12,
        fontFamily: 'SF Compact',
        fontWeight: '600',
    },
});