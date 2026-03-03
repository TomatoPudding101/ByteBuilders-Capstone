import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function AppOpener() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo Circle */}
      <Image
  source={require('../assets/images/RMlogo.png')}
  style={styles.logoImage}
/>

      {/* Arrow Button */}
      <TouchableOpacity
        style={styles.arrowButton}
        onPress={() => router.push('/kids-login')}
      >
        <Text style={styles.arrowText}>→</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
  },
  logoImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  arrowButton: {
    width: 120,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(180, 150, 200, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});
