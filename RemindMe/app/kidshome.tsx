import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
 
const MENU_ITEMS = [
  {
    label: 'Goals / Chores',
    image: require('../assets/images/dash-icons/Goals-Chores.jpg'),
    color: '#9b6fd4',
    route: '/kidsgoals',
  },
  {
    label: 'Calendar',
    image: require('../assets/images/Calendar.jpg'),
    color: '#5588e0',
    route: '/kidscalendar',
  },
  {
    label: 'My Progress',
    image: require('../assets/images/My-Progress.jpg'),
    color: '#3cc470',
    route: '/kidsprogress1',
  },
  {
    label: 'My Rewards',
    image: require('../assets/images/My-Rewards.jpg'),
    color: '#e8a020',
    route: '/kidsrewards1',
  },
  {
    label: 'Focus Timer',
    image: require('../assets/images/Focus-Timer.jpg'),
    color: '#e040a0',
    route: '/kidstimer',
  },
  {
    label: 'Settings',
    image: require('../assets/images/Settings.jpg'),
    color: '#6655cc',
    route: '/settings',
  },
];
 
export default function KidsHome() {
  const router = useRouter();
 
  return (
    <LinearGradient
      colors={['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
 
       {/* Welcome Banner Image */}
<Image
  source={require('../assets/images/dash-icons/welcome-banner.png')}
  style={styles.bannerImage}
  resizeMode="cover"
/>
 
        {/* Dashboard Header Row */}
        <View style={styles.headerRow}>
          <Text style={styles.dashTitle}>My Dashboard</Text>
          <View style={styles.nameTagContainer}>
            <Image
              source={require('../assets/images/dash-icons/Penguin.jpg')}
              style={styles.penguinImage}
              resizeMode="cover"
            />
          </View>
        </View>
 
        {/* Menu Grid */}
        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.tile, { backgroundColor: item.color }]}
              onPress={() => router.push(item.route as any)}
            >
              <Image
                source={item.image}
                style={styles.tileImage}
                resizeMode="cover"
              />
              <Text style={styles.tileLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
 
        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    paddingTop: 16,
  },
  bannerImage: {
    width: '100%',
    height: 160,
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 16,
  },
  dashTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
  },
  nameTagContainer: {
    alignItems: 'center',
  },
  penguinImage: {
    width: 80,
    height: 80,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  tile: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  tileImage: {
    width: '65%',
    height: '55%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tileLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 18,
  },
});
 
