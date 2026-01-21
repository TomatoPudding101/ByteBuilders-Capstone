import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AdultSettings = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'accessibility'>('profile');
    const [fullName, setFullName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Heading */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#9333EA" />
                    <Text style={styles.backText}>Back to Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.moonIcon}>
                    <Ionicons name="moon-outline" size={24} color="#9333EA" />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
                <Text style={styles.settingsLabel}>settings</Text>
                <Text style={styles.pageTitle}>Account Settings</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'profile' && styles.tabActive]}
                    onPress={() => setActiveTab('profile')}
                >
                    <Ionicons name="person-outline" size={18} color={activeTab === 'profile' ? '#9333EA' : '#666'} />
                    <Text style={[styles.tabText, activeTab === 'profile' && styles.tabTextActive]}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'preferences' && styles.tabActive]}
                    onPress={() => setActiveTab('preferences')}
                >
                    <Ionicons name="settings-outline" size={18} color={activeTab === 'preferences' ? '#9333EA' : '#666'} />
                    <Text style={[styles.tabText, activeTab === 'preferences' && styles.tabTextActive]}>Preferences</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tab, activeTab === 'accessibility' && styles.tabActive]}
                    onPress={() => setActiveTab('accessibility')}
                >
                    <MaterialCommunityIcons name="account-voice" size={18} color={activeTab === 'accessibility' ? '#9333EA' : '#666'} />
                    <Text style={[styles.tabText, activeTab === 'accessibility' && styles.tabTextActive]}>Accessibility</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Profile Information */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Profile Information</Text>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.cardSubtitle}>Update your personal details</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={fullName}
                            onChangeText={setFullName}
                            placeholder="Enter your full name"
                            placeholderTextColor="#999"
                        />
                    </View>

                   <View style={styles.inputGroup}>
                        <Text style={styles.label}>EmailAddress</Text>
                        <TextInput
                            style={styles.input}
                            value={emailAddress}
                            onChangeText={setEmailAddress}
                            placeholder="Enter your email address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                {/* Account Actions */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Account Actions</Text>

                    <TouchableOpacity style={styles.signOutButton}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <MaterialCommunityIcons name="chart-box-outline" size={28} color="#EF4444" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="checkmark-circle-outline" size={28} color="#F59E0B" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="settings-outline" size={28} color="#06B6D4" />
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FDF4F5',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },

    backText: {
        flex: 1,
        backgroundColor: '#FDF4F5',
    },

    moonIcon: {
        padding: 2
    },

    titleContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },

    settingsLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },

    pageTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#9333EA',
    },

    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
        marginBottom: 20,
    },

    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: '#FFF',
    },

    tabActive: {
        backgroundColor: '#F3E8FF',
    },

    tabText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },

    tabTextActive: {
        color: '#9333EA',
        fontWeight: '600',
    },

    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    
    card: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },

    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 4,
    },

    cardSubtitle: {
        fontSize: 13,
        color: '#9333EA',
        marginBottom: 20,
    },

    editButton: {
        backgroundColor: '#9333EA',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },

    editButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },

    inputGroup: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },

    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        color: '#333',
    },

    signOutButton: {
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#9333EA',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 12,
    },

    signOutText: {
        color: '#9333EA',
        fontSize: 15,
        fontWeight: '600',
    },

    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 16,
        paddingBottom: 20,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    
    navItem: {
        padding: 8,
    },

});

export default AdultSettings;