import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, useWindowDimensions,
  Modal, Pressable, TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';

// ── Field row ─────────────────────────────────────────────────────
function FieldRow({
  label, value, editable = true, isLast, onPress,
}: {
  label: string; value: string; editable?: boolean; isLast: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.fieldRow, !isLast && s.fieldBorder]}
      onPress={editable ? onPress : undefined}
      activeOpacity={editable ? 0.65 : 1}
    >
      <Text style={s.fieldLabel}>{label}</Text>
      <View style={s.fieldRight}>
        <Text style={[s.fieldValue, !editable && s.fieldValueGray]} numberOfLines={1}>
          {value || '—'}
        </Text>
        {editable && <ChevronRightIcon size={14} color={Colors.borderStrong} />}
      </View>
    </TouchableOpacity>
  );
}

// ── Edit modal ────────────────────────────────────────────────────
function EditModal({
  visible, title, initialValue, onSave, onClose,
}: {
  visible: boolean; title: string; initialValue: string;
  onSave: (v: string) => Promise<void>; onClose: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [focused, setFocused] = useState(false);

  async function handleSave() {
    setSaving(true);
    await onSave(value.trim());
    setSaving(false);
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={em.overlay} onPress={onClose}>
        <Pressable style={em.sheet} onPress={() => {}}>
          <View style={em.handle} />
          <Text style={em.title}>{title}</Text>

          <TextInput
            style={[em.input, focused && em.inputFocused]}
            value={value}
            onChangeText={setValue}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoFocus
            placeholder={`Enter ${title.toLowerCase()}`}
            placeholderTextColor={Colors.ink4}
          />

          <TouchableOpacity style={em.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
            {saving
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <Text style={em.saveBtnText}>Save</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={em.cancelBtn} onPress={onClose} activeOpacity={0.65}>
            <Text style={em.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const em = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, paddingBottom: 40,
  },
  handle: {
    width: 40, height: 4, borderRadius: 99,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 20,
  },
  title:     { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: Colors.ink, marginBottom: 16 },
  input: {
    height: 44, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.white,
    paddingHorizontal: 14,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.ink,
    marginBottom: 16,
  },
  inputFocused: { borderColor: Colors.p },
  saveBtn: {
    height: 44, borderRadius: 10,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  saveBtnText:   { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white },
  cancelBtn:     { height: 40, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
});

// ── Screen ────────────────────────────────────────────────────────
export default function AccountScreen() {
  const { width }  = useWindowDimensions();
  const isDesktop  = Platform.OS === 'web' && width >= 768;
  const { profile, user, refreshProfile } = useAuth() as any;

  const displayName    = profile?.name            ?? '';
  const email          = user?.email              ?? '';
  const nativeLang     = profile?.native_language ?? '';
  const targetExam     = profile?.target_exam     ?? '';
  const targetScore    = profile?.target_score ? `Band ${profile.target_score}` : '';
  const initial        = displayName[0]?.toUpperCase() ?? (email[0]?.toUpperCase() ?? '?');

  const [uploading, setUploading]   = useState(false);
  const [editField, setEditField]   = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState('');

  function openEdit(field: string, current: string) {
    setFieldValue(current);
    setEditField(field);
  }

  async function handleSaveField(field: string, value: string) {
    if (!profile?.id) return;
    const update: Record<string, string | number> = {};
    if (field === 'name')            update.name            = value;
    if (field === 'native_language') update.native_language = value;
    if (field === 'target_exam')     update.target_exam     = value;
    if (field === 'target_score')    update.target_score    = parseFloat(value) || 7.0;
    if (field === 'country')         update.country         = value;

    await supabase.from('profiles').update(update).eq('id', profile.id);
    if (typeof refreshProfile === 'function') await refreshProfile();
  }

  const handlePickPhoto = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo access to change your avatar.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });
    if (result.canceled || !result.assets[0]) return;

    setUploading(true);
    try {
      const asset   = result.assets[0];
      const base64  = asset.base64!;
      const ext     = asset.uri.split('.').pop() ?? 'jpg';
      const path    = `${user!.id}/avatar.${ext}`;
      const decoded = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      const { error: upErr } = await supabase.storage
        .from('avatars')
        .upload(path, decoded, { upsert: true, contentType: `image/${ext}` });

      if (upErr) { Alert.alert('Upload failed', upErr.message); return; }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profile.id);
      if (typeof refreshProfile === 'function') await refreshProfile();
    } finally {
      setUploading(false);
    }
  }, [user, profile]);

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all your data. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  }

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.content, isDesktop && s.contentDesktop]}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ChevronLeftIcon size={16} color={Colors.ink2} />
          </TouchableOpacity>
          <Text style={s.title}>Account</Text>
        </View>

        {/* Profile picture */}
        <View style={s.photoCard}>
          <View style={s.avatarWrap}>
            {uploading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.avatarText}>{initial}</Text>
            }
          </View>
          <TouchableOpacity onPress={handlePickPhoto} activeOpacity={0.75}>
            <Text style={s.changePhoto}>Change photo</Text>
          </TouchableOpacity>
        </View>

        {/* Personal info */}
        <View style={s.infoCard}>
          <FieldRow
            label="Name" value={displayName} isLast={false}
            onPress={() => openEdit('name', displayName)}
          />
          <FieldRow
            label="Email" value={email} editable={false} isLast={false}
          />
          <FieldRow
            label="Native language" value={nativeLang} isLast={false}
            onPress={() => openEdit('native_language', nativeLang)}
          />
          <FieldRow
            label="Target exam" value={targetExam || 'IELTS Academic'} isLast={false}
            onPress={() => openEdit('target_exam', targetExam || 'IELTS Academic')}
          />
          <FieldRow
            label="Target score" value={targetScore || 'Band 7.0'} isLast={false}
            onPress={() => openEdit('target_score', String(profile?.target_score ?? 7.0))}
          />
          <FieldRow
            label="Country" value={profile?.country ?? ''} isLast
            onPress={() => openEdit('country', profile?.country ?? '')}
          />
        </View>

        {/* Danger zone */}
        <View style={s.dangerCard}>
          <Text style={s.dangerTitle}>DANGER ZONE</Text>
          <TouchableOpacity
            style={s.deleteRow}
            onPress={handleDeleteAccount}
            activeOpacity={0.7}
          >
            <Text style={s.deleteText}>Delete account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Edit modals */}
      {editField && (
        <EditModal
          visible
          title={
            editField === 'name'            ? 'Name'            :
            editField === 'native_language' ? 'Native language' :
            editField === 'target_exam'     ? 'Target exam'     :
            editField === 'target_score'    ? 'Target score'    : 'Country'
          }
          initialValue={fieldValue}
          onSave={v => handleSaveField(editField, v)}
          onClose={() => setEditField(null)}
        />
      )}
    </SafeAreaView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  contentDesktop: {
    maxWidth:          680,
    width:             '100%',
    alignSelf:         'center',
    paddingHorizontal: 32,
    paddingTop:        40,
  },

  header: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           14,
    marginBottom:  28,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: Colors.ink },

  // Photo card
  photoCard: {
    backgroundColor: Colors.white,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         24,
    alignItems:      'center',
    marginBottom:    16,
  },
  avatarWrap: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText:  { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.white },
  changePhoto: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p },

  // Info card
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    overflow:        'hidden',
    marginBottom:    16,
  },
  fieldRow: {
    flexDirection:    'row',
    alignItems:       'center',
    height:           52,
    paddingHorizontal: 16,
  },
  fieldBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F0EB' },
  fieldLabel:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, width: 130 },
  fieldRight:  { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  fieldValue:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, flexShrink: 1 },
  fieldValueGray: { color: Colors.ink3 },

  // Danger zone
  dangerCard: {
    backgroundColor: Colors.white,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    overflow:        'hidden',
    marginTop:       16,
  },
  dangerTitle: {
    fontFamily:    'Inter_600SemiBold',
    fontSize:      11,
    color:         Colors.ink3,
    letterSpacing: 0.6,
    padding:       16,
    paddingBottom: 8,
  },
  deleteRow: {
    height: 48, paddingHorizontal: 16,
    justifyContent: 'center',
    borderTopWidth: 1, borderTopColor: '#F2F0EB',
  },
  deleteText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.danger },
});
