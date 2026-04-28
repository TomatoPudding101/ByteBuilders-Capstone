import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const PARENT_USER_ID = 'devuser';
const PARENT_PASSWORD = 'devuser';

export default function ParentLogin() {
  const router = useRouter();
  const { isDarkMode, theme } = useTheme();
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

  const gradientColors: [string, string, string, string] = isDarkMode
    ? ['#0f0f1a', '#1a1035', '#150d2e', '#0f0f1a']
    : ['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0'];

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.5)' }]}
        onPress={() => router.back()}
      >
        <Text style={[styles.backText, { color: theme.text }]}>←</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Parent/Guardian{'\n'}Login</Text>

      <View style={[styles.card, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.08)' : 'rgba(210,190,200,0.45)' }]}>
        <Text style={[styles.label, { color: theme.text }]}>Parent User ID:</Text>
        <TextInput
          style={[styles.input, {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(255,245,248,0.85)',
            color: theme.text,
          }]}
          value={userId}
          onChangeText={setUserId}
          placeholder="---"
          placeholderTextColor={isDarkMode ? '#a09cc0' : '#bbb'}
          autoCapitalize="none"
        />

        <Text style={[styles.label, { color: theme.text }]}>Password:</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }, {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(255,245,248,0.85)',
              color: theme.text,
            }]}
            value={password}
            onChangeText={setPassword}
            placeholder="---"
            placeholderTextColor={isDarkMode ? '#a09cc0' : '#bbb'}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(p => !p)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={isDarkMode ? '#b0a8d0' : '#888'}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.forgotBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(180,180,180,0.4)' }]}
          onPress={() => router.push('/parentforgotpassword')}
        >
          <Text style={[styles.forgotText, { color: isDarkMode ? '#e0d8f0' : '#555' }]}>Forgot Password?</Text>
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
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { fontSize: 20 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#5bbfb0',
    textAlign: 'center',
    lineHeight: 40,
  },
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    gap: 10,
  },
  label: { fontSize: 16, fontWeight: '700' },
  input: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyeBtn: { padding: 8 },
  forgotBtn: {
    alignSelf: 'center',
    marginTop: 4,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#f87171',
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