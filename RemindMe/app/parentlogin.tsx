import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const PARENT_USER_ID = 'devuser';
const PARENT_PASSWORD = 'devuser';

export default function ParentLogin() {
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (!userId || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (userId === PARENT_USER_ID && password === PARENT_PASSWORD) {
      router.push('/parentsettings');
    } else {
      setError('Incorrect User ID or password. Please try again.');
    }
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

      <Text style={styles.title}>Parent/Guardian{'\n'}Login</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Parent User ID:</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="---"
          placeholderTextColor="#bbb"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={password}
            onChangeText={setPassword}
            placeholder="---"
            placeholderTextColor="#bbb"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(p => !p)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push('/parentforgotpassword')}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      <TouchableOpacity style={styles.loginArrow} onPress={handleLogin}>
        <Text style={styles.loginArrowText}>→</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 28,
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5bbfb0',
    textAlign: 'center',
    lineHeight: 40,
  },
  card: {
    width: '100%',
    backgroundColor: 'rgba(210,190,200,0.45)',
    borderRadius: 20,
    padding: 24,
    gap: 10,
  },
  label: { fontSize: 16, fontWeight: '700', color: '#333' },
  input: {
    backgroundColor: 'rgba(255,245,248,0.85)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 8 },
  forgotBtn: {
    alignSelf: 'center',
    marginTop: 4,
    backgroundColor: 'rgba(180,180,180,0.4)',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  forgotText: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#d44',
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '600',
  },
  loginArrow: {
    width: 120,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(91,191,176,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginArrowText: { fontSize: 26, color: '#fff', fontWeight: 'bold' },
});