import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// animalschar.png is a 2x2 grid: bunny(top-left), bear(top-right), cat(bottom-left), penguin(bottom-right)
// We render the full image at 200x200 and clip to 100x100 per quadrant
const CHAR_FULL = 200;
const CHAR_HALF = 100;

const CHARACTER_CROP: Record<string, { ml: number; mt: number }> = {
  bunny:   { ml: 0,         mt: 0 },
  bear:    { ml: -CHAR_HALF, mt: 0 },
  cat:     { ml: 0,         mt: -CHAR_HALF },
  penguin: { ml: -CHAR_HALF, mt: -CHAR_HALF },
};

// Smaller version for the nametag button on dashboard
const BTN_FULL = 96;
const BTN_HALF = 48;
const BTN_CROP: Record<string, { ml: number; mt: number }> = {
  bunny:   { ml: 0,        mt: 0 },
  bear:    { ml: -BTN_HALF, mt: 0 },
  cat:     { ml: 0,        mt: -BTN_HALF },
  penguin: { ml: -BTN_HALF, mt: -BTN_HALF },
};

export default function KidsHome() {
  const router = useRouter();
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
            <View>
              <Text style={styles.dashTitle}>My Dashboard</Text>
              {kidName ? <Text style={styles.kidNameText}>Hi, {kidName}! 👋</Text> : null}
            </View>

            {/* Rectangular nametag button showing chosen character */}
            <TouchableOpacity style={styles.nameTagBtn} onPress={openModal}>
              <View style={styles.nameTagRect}>
                <View style={styles.btnCharClip}>
                  <Image
                    source={require('../assets/images/animalschar.png')}
                    style={[styles.btnCharImg, { marginLeft: btnCrop.ml, marginTop: btnCrop.mt }]}
                  />
                </View>
                <Text style={styles.nameTagName} numberOfLines={1}>
                  {kidName || 'My Name'}
                </Text>
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

      {/* Edit Profile Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#fde8d0', '#f8c8d4', '#d4c8f0', '#c8e0f0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalBox}
          >
            <TouchableOpacity style={styles.closeBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Edit Profile</Text>

            <Text style={styles.modalLabel}>Enter your Name:</Text>
            <TextInput
              style={styles.modalInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your name..."
              placeholderTextColor="#aaa"
            />

            <Text style={styles.modalLabel}>Choose your character nametag:</Text>
            <View style={styles.charGrid}>
              {NAME_TAGS.map((tag) => {
                const c = CHARACTER_CROP[tag.id];
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={[styles.charTile, editCharacter === tag.id && styles.charTileSelected]}
                    onPress={() => setEditCharacter(tag.id)}
                  >
                    <View style={styles.charTileClip}>
                      <Image
                        source={require('../assets/images/animalschar.png')}
                        style={[styles.charTileImg, { marginLeft: c.ml, marginTop: c.mt }]}
                      />
                    </View>
                    <Text style={[styles.charTileLabel, editCharacter === tag.id && styles.charTileLabelSelected]}>
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
  bannerImage: { width: '100%', height: 118, marginBottom: 8 },
  inner: {
    paddingHorizontal: 12,
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 12,
  },
  dashTitle: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  kidNameText: { fontSize: 13, color: '#555', fontWeight: '500', marginTop: 2 },

  nameTagBtn: { alignItems: 'center', gap: 3 },
  nameTagRect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#5bbfb0',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 8,
    minWidth: 130,
  },
  // Button character crop: clip 48x48 from full 96x96 image
  btnCharClip: {
    width: BTN_HALF,
    height: BTN_HALF,
    overflow: 'hidden',
    borderRadius: 6,
  },
  btnCharImg: {
    width: BTN_FULL,
    height: BTN_FULL,
  },
  nameTagName: { fontSize: 13, fontWeight: '700', color: '#333', flex: 1 },
  editLabel: { fontSize: 11, color: '#5bbfb0', fontWeight: '700' },

  // Dashboard grid — bigger images, centered
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { fontSize: 14, color: '#555', fontWeight: '700' },
  modalTitle: { fontSize: 26, fontWeight: 'bold', color: '#5bbfb0', textAlign: 'center', marginTop: -8 },
  modalLabel: { fontSize: 15, fontWeight: '700', color: '#333' },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#333',
  },
  charGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  charTile: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 2.5,
    borderColor: 'transparent',
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.5)',
    gap: 4,
  },
  charTileSelected: { borderColor: '#5bbfb0', backgroundColor: 'rgba(91,191,176,0.15)' },
  // Modal character crop: clip 100x100 from full 200x200 image
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
  charTileLabel: { fontSize: 11, fontWeight: '600', color: '#555' },
  charTileLabelSelected: { color: '#5bbfb0', fontWeight: '700' },
  saveBtn: {
    backgroundColor: 'rgba(91,191,176,0.8)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
});