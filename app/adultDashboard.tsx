import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const adultDashboard = () => {

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.dashboardTitle}>Dashboard</Text>
                    <View style={styles.userInfo}>
                        <Ionicons name="person-circle-outline" size={16} color="#666" />
                        <Text style={styles.username}>TestUser</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moonIcon}>
                    <Ionicons name="moon-outline" size={24} color="#9333EA" />
                </TouchableOpacity>
            </View>

            {/* Stats */}
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, styles.statCardLeft]}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>Total Reminders</Text>
                </View>
                 <View style={[styles.statCard, styles.statCardRight]}>
                    <Text style={[styles.statNumber, styles.statNumberOrange]}>0</Text>
                    <Text style={styles.statLabel}>Todays Tasks</Text>
                </View>
            </View>

             <View style={styles.statsGrid}>
                <View style={[styles.statCard, styles.statCardLeft]}>
                    <Text style={[styles.statNumber, styles.statNumberCyan]}>0</Text>
                    <Text style={styles.statLabel}>Completed Today</Text>
                </View>
                 <View style={[styles.statCard, styles.statCardRight]}>
                    <Text style={[styles.statNumber, styles.statNumberPurple]}>0%</Text>
                    <Text style={styles.statLabel}>Progress</Text>
                </View>
            </View>

            {/* Add Reminder Button */}
            <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonText}>+ Add Reminder</Text>
            </TouchableOpacity>

            {/* Action Icons Row */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionIcon}>
                    <Ionicons name="mic-outline" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon}>
                    <Ionicons name="notifications-outline" size={24} color="#666" />
                </TouchableOpacity>
            </View>

            {/* Your Reminders Section */}
             <TouchableOpacity style={styles.remindersHeader}>
                <Ionicons name="calendar-outline" size={20} color="#9333EA" />
                <Text style={styles.remindersHeaderText}>Your Reminders</Text>
            </TouchableOpacity>

            {/* Empty State} */}
            <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={60} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No reminders yet</Text>
                <TouchableOpacity style={styles.addFirstButton}>
                    <Text style={styles.addFirstButtonText}>+ Add Your First Reminder</Text>
                </TouchableOpacity>
            </View>

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
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    dashboardTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#9333EA',
        marginBottom: 4,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    username: {
        fontSize: 13,
        color: '#666',
    },
    moonIcon: {
        padding: 8,
    },
    statsGrid: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statCardLeft: {
        marginRight: 5,
    },
    statCardRight: {
        marginLeft: 5,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: '700',
        color: '#666',
        marginBottom: 4,
    },
    statNumberOrange: {
        color: '#F97316',
    },
    statNumberCyan: {
        color: '#06B6D4',
    },
    statNumberPurple: {
        color: '#9333EA',
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    addButton: {
        backgroundColor: '#9333EA',
        marginHorizontal: 20,
        marginTop: 10,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginTop: 16,
        marginBottom: 20,
    },
    actionIcon: {
        padding: 8,
    },
    remindersHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    remindersHeaderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#9333EA',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 16,
        marginBottom: 20,
    },
    addFirstButton: {
        backgroundColor: '#9333EA',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 10,
    },
    addFirstButtonText: {
        color: '#FFF',
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

export default adultDashboard;