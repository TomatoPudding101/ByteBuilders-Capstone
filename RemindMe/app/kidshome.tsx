import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const MENU_ITEMS = [
  {
    label: 'Goals / Chores',
    image: require('../assets/images/goals-chores1.png'),
    color: '#9b6fd4',
    route: '/kidsgoals',
  },
  {
    label: 'Calendar',
    image: require('../assets/images/calendar1.png'),
    color: '#5588e0',
    route: '/kidscalendar',
  },
  {
    label: 'My Progress',
    image: require('../assets/images/progress1.png'),
    color: '#3cc470',
    route: '/kidsprogress1',
  },
  {
    label: 'My Rewards',
    image: require('../assets/images/rewards1.png'),
    color: '#e8a020',
    route: '/kidsrewards1',
  },
  {
    label: 'Focus Timer',
    image: require('../assets/images/timer1.png'),
    color: '#e040a0',
    route: '/kidstimer',
  },
  {
    label: 'Settings',
    image: require('../assets/images/settings1.png'),
    color: '#6655cc',
    route: '/parentlogin',
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

        <Image
          source={require('../assets/images/dash-icons/welcome-banner.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        />

        <View style={styles.inner}>
          <View style={styles.headerRow}>
            <Text style={styles.dashTitle}>My Dashboard</Text>
            <Image
              source={require('../assets/images/dash-icons/Penguin.jpg')}
              style={styles.penguinImage}
              resizeMode="contain"
            />
          </View>

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
                  resizeMode="contain"
                />
                <Text style={styles.tileLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingTop: 0 },
  bannerImage: {
    width: '100%',
    height: 118,
    marginBottom: 8,
  },
  inner: {
    paddingHorizontal: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginBottom: 12,
  },
  dashTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  penguinImage: {
    width: 68,
    height: 68,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  tile: {
    width: '47%',
    height: 138,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  tileImage: {
    width: '70%',
    height: '58%',
    borderRadius: 12,
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 16,
  },
});
