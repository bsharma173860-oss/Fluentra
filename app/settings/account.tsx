import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Modal, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ChevronLeftIcon } from '@/components/icons';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

export default function AccountScreen() {
  const { user, profile, signOut } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [error,       setError]       = useState('');

  async function handleDeleteAccount() {
    setDeleting(true);
    setError('');
    try {
      // Delete all user data via RPC (server-side for security)
      const { error: rpcErr } = await supabase.rpc('delete_user_data');
      if (rpcErr) {
        // Fallback: delete known tables directly
        const uid = user?.id;
        if (uid) {
          await supabase.from('user_languages').delete().eq('user_id', uid);
          await supabase.from('sessions').delete().eq('user_id', uid);
          await supabase.from('writing_attempts').delete().eq('user_id', uid);
          await supabase.from('score_history').delete().eq('user_id', uid);
          await supabase.from('profiles').delete().eq('id', uid);
        }
      }
      await signOut();
      router.replace('/(auth)/login');
    } catch (e: any) {
      setError(e?.message ?? 'Something went wrong. Please try again.');
      setDeleting(false);
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ChevronLeftIcon size={14} color={Colors.ink2} />
          </TouchableOpacity>
          <Text style={s.title}>Account</Text>
        </View>

        {/* Info */}
        <View style={s.card}>
          <View style={s.row}>
            <Text style={s.label}>Name</Text>
            <Text style={s.value}>{profile?.name ?? '—'}</Text>
          </View>
          <View style={[s.row, s.rowBorder]}>
            <Text style={s.label}>Email</Text>
            <Text style={s.value}>{user?.email ?? '—'}</Text>
          </View>
        </View>

        {/* Danger zone */}
        <Text style={s.dangerLabel}>Danger zone</Text>
        <View style={s.card}>
          <TouchableOpacity
            style={s.deleteRow}
            onPress={() => setShowConfirm(true)}
            activeOpacity={0.8}
          >
            <Text style={s.deleteText}>Delete account</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>

      {/* Confirmation modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Delete account?</Text>
            <Text style={s.modalBody}>
              This will permanently delete all your data including scores, streak,
              and language progress. This cannot be undone.
            </Text>

            {error !== '' && <Text style={s.errorText}>{error}</Text>}

            <View style={s.modalButtons}>
              <TouchableOpacity
                style={s.cancelBtn}
                onPress={() => { setShowConfirm(false); setError(''); }}
                disabled={deleting}
                activeOpacity={0.8}
              >
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[s.deleteBtn, deleting && { opacity: 0.6 }]}
                onPress={handleDeleteAccount}
                disabled={deleting}
                activeOpacity={0.8}
              >
                {deleting
                  ? <ActivityIndicator color="#FFF" size="small" />
                  : <Text style={s.deleteBtnText}>Delete permanently</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 20 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 28 },
  backBtn: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.textPrimary },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: Colors.border },
  label: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textSecondary },
  value: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.textPrimary },

  dangerLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 12,
    color: '#DC2626', marginBottom: 8, letterSpacing: 0.4,
  },
  deleteRow: { paddingHorizontal: 16, paddingVertical: 14 },
  deleteText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#DC2626' },

  // Modal
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#FFF', borderRadius: 16,
    padding: 24, width: '100%', maxWidth: 380,
  },
  modalTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#000', marginBottom: 10 },
  modalBody:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#666', lineHeight: 21, marginBottom: 20 },
  errorText:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#DC2626', marginBottom: 16 },
  modalButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: {
    flex: 1, height: 44, borderRadius: 10,
    backgroundColor: '#F4F4F4',
    alignItems: 'center', justifyContent: 'center',
  },
  cancelBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#666' },
  deleteBtn: {
    flex: 1, height: 44, borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center', justifyContent: 'center',
  },
  deleteBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFF' },
});
