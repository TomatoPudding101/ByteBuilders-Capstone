import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';

const MENU_ITEMS = [
  { label: 'Goals / Chores', image: require('../assets/images/goals-chores1.png'), color: '#9b6fd4', route: '/kidsgoals' },
  { label: 'Calendar', image: require('../assets/images/calendar1.png'), color: '#5588e0', route: '/kidscalendar' },
  { label: 'My Progress', image: require('../assets/images/progress1.png'), color: '#3cc470', route: '/kidsprogress1' },
  { label: 'My Rewards', image: require('../assets/images/rewards1.png'), color: '#e8a020', route: '/kidsrewards1' },
  { label: 'Focus Timer', image: require('../assets/images/timer1.png'), color: '#e040a0', route: '/kidstimer' },
  { label: 'Settings', image: require('../assets/images/settings1.png'), color: '#6655cc', route: '/parentlogin' },
];

const NAME_TAGS = [
  { id: 'bunny', label: 'Bunny' },
  { id: 'bear', label: 'Bear' },
  { id: 'cat', label: 'Cat' },
  { id: 'penguin', label: 'Penguin' },
];

const CHAR_FULL = 200;
const CHAR_HALF = 100;

const CHARACTER_CROP: Record<string, { ml: number; mt: number }> = {
  bunny:   { ml: 0,          mt: 0 },
  bear:    { ml: -CHAR_HALF, mt: 0 },
  cat:     { ml: 0,          mt: -CHAR_HALF },
  penguin: { ml: -CHAR_HALF, mt: -CHAR_HALF },
};

// Nametag button — show the animal + the blank rectangle below it
// The image is 110x110 rendered, clip to show ~65% height (animal body + blank rect)
const BTN_FULL = 110;
const BTN_CLIP_H = 52; // how tall the clipped area is
const BTN_HALF = 55;

const BTN_CROP: Record<string, { ml: number; mt: number }> = {
  bunny:   { ml: 0,         mt: 0 },
  bear:    { ml: -BTN_HALF, mt: 0 },
  cat:     { ml: 0,         mt: -BTN_HALF },
  penguin: { ml: -BTN_HALF, mt: -BTN_HALF },
};

// The blank rectangle in the character image sits roughly in the bottom 28% of the image
// At BTN_FULL=110, that's around y=79. The rect is about 18px tall.
// Center the name overlay at ~80px from top of the clipped image
const NAME_TOP = 33;

export default function KidsHome() {
  const router = useRouter();
  const { isDarkMode, toggleDarkMode, theme } = useTheme();
  const [kidName, setKidName] = useState('');
  const [kidCharacter, setKidCharacter] = useState('penguin');
  const [modalVisible, setModalVisible] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCharacter, setEditCharacter] = useState('penguin');

  useEffect(() => {
    const load = async () => {
      const name = await AsyncStorage.getItem('kidName');
      const char = await AsyncStorage.getItem('kidCharacter');
      if (name) setKidName(name);
      if (char) setKidCharacter(char);
    };
    load();
  }, []);

  const openModal = () => {
    setEditName(kidName);
    setEditCharacter(kidCharacter);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (editName.trim()) {
      await AsyncStorage.setItem('kidName', editName.trim());
      setKidName(editName.trim());
    }
    await AsyncStorage.setItem('kidCharacter', editCharacter);
    setKidCharacter(editCharacter);
    setModalVisible(false);
  };

  const btnCrop = BTN_CROP[kidCharacter] ?? BTN_CROP.penguin;

  const gradientColors: [string, string, string, string] = isDarkMode
    ? ['#0f0f1a', '#1a1035', '#150d2e', '#0f0f1a']
    : ['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0'];

  const headerBg = isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.4)';
  const nameTagBg = isDarkMode ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.9)';

  return (
    <LinearGradient
      colors={gradientColors}
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
          <View style={[styles.headerRow, { backgroundColor: headerBg }]}>

            {/* Sun / moon toggle */}
            <TouchableOpacity style={[styles.themeToggle, { backgroundColor: isDarkMode ? '#1e1b4b' : '#fff8e1' }]} onPress={toggleDarkMode}>
              <Ionicons
                name={isDarkMode ? 'moon' : 'sunny'}
                size={20}
                color={isDarkMode ? '#a5b4fc' : '#f59e0b'}
              />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <Text style={[styles.dashTitle, { color: theme.text }]}>My Dashboard</Text>
              {kidName ? (
                <Text style={[styles.kidNameText, { color: isDarkMode ? '#e0d8f0' : '#555' }]}>Hi, {kidName}! 👋</Text>
              ) : null}
            </View>

            {/* Nametag button */}
            <TouchableOpacity style={styles.nameTagBtn} onPress={openModal}>
              <View style={[styles.nameTagRect, { backgroundColor: nameTagBg }]}>
                {/* Clipped character image showing animal + blank rectangle */}
                <View style={styles.btnCharClip}>
                  <Image
                    source={require('../assets/images/animalschar.png')}
                    style={[styles.btnCharImg, { marginLeft: btnCrop.ml, marginTop: btnCrop.mt }]}
                  />
                  {/* Name text overlaid centered on the blank rectangle area */}
                  <View style={[styles.nameOverlay, { top: NAME_TOP }]}>
                    <Text style={styles.nameOverlayText} numberOfLines={1}>
                      {kidName || 'Name'}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.editLabel}>Edit</Text>
            </TouchableOpacity>
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

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalBox}
          >
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.closeBtnText, { color: theme.text }]}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={[styles.modalLabel, { color: theme.text }]}>Enter your Name:</Text>
            <TextInput
              style={[styles.modalInput, {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.75)',
                color: theme.text,
              }]}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name..."
              placeholderTextColor={isDarkMode ? '#a09cc0' : '#aaa'}
            />

            <Text style={[styles.modalLabel, { color: theme.text }]}>Choose your character nametag:</Text>
            <View style={styles.charGrid}>
              {NAME_TAGS.map((tag) => {
                const c = CHARACTER_CROP[tag.id];
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[
                      styles.charTile,
                      { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.5)' },
                      editCharacter === tag.id && styles.charTileSelected,
                    ]}
                    onPress={() => setEditCharacter(tag.id)}
                  >
                    <View style={styles.charTileClip}>
                      <Image
                        source={require('../assets/images/animalschar.png')}
                        style={[styles.charTileImg, { marginLeft: c.ml, marginTop: c.mt }]}
                      />
                    </View>
                    <Text style={[
                      styles.charTileLabel,
                      { color: isDarkMode ? '#e0d8f0' : '#555' },
                      editCharacter === tag.id && styles.charTileLabelSelected,
                    ]}>
                      {tag.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
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
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 10,
  },
  themeToggle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  headerCenter: {
    flex: 1,
  },
  dashTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  kidNameText: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  nameTagBtn: {
    alignItems: 'center',
    gap: 3,
  },
  nameTagRect: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#5bbfb0',
    padding: 5,
  },
  btnCharClip: {
    width: BTN_HALF,
    height: BTN_CLIP_H,
    overflow: 'hidden',
    borderRadius: 6,
    position: 'relative',
  },
  btnCharImg: {
    width: BTN_FULL,
    height: BTN_FULL,
  },
  nameOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameOverlayText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2a2a2a',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  editLabel: {
    fontSize: 11,
    color: '#5bbfb0',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  tile: {
    width: '47%',
    height: 160,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 5,
  },
  tileImage: {
    width: 90,
    height: 90,
  },
  tileLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    gap: 12,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5bbfb0',
    textAlign: 'center',
    marginTop: -8,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  modalInput: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
  },
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  charTile: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: 'transparent',
    padding: 6,
    gap: 4,
  },
  charTileSelected: {
    borderColor: '#5bbfb0',
    backgroundColor: 'rgba(91,191,176,0.15)',
  },
  charTileClip: {
    width: CHAR_HALF,
    height: CHAR_HALF,
    overflow: 'hidden',
    borderRadius: 10,
  },
  charTileImg: {
    width: CHAR_FULL,
    height: CHAR_FULL,
  },
  charTileLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  charTileLabelSelected: {
    color: '#5bbfb0',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: 'rgba(91,191,176,0.85)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});