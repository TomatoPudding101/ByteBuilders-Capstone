import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

export default function ParentForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSend = () => {
    if (!email) {
      Alert.alert('Please enter your email address.');
      return;
    }
    Alert.alert('Password Sent!', `Check the inbox for ${email}`);
    router.back();
  };

  return (
    <LinearGradient
      colors={['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot{'\n'}Password?</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Enter Parent/Guardian{'\n'}Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="---"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={handleSend}>
          <Text style={styles.sendText}>Send password</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  backBtn: {
    position: 'absolute',
    top: 56,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20, color: '#555' },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#5bbfb0',
    textAlign: 'center',
    lineHeight: 46,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(200,185,185,0.45)',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    gap: 16,
  },
  label: { fontSize: 16, fontWeight: '700', color: '#333', textAlign: 'center' },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,245,248,0.85)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  sendText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#5bbfb0',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});
