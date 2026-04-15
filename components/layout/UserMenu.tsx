import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Pressable, Platform, useWindowDimensions, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import {
  PersonIcon, LightningIcon, FlameIcon, HelpCircleIcon,
  LogOutIcon, ChevronRightIcon, type IconProps,
} from '@/components/icons';
import Svg, { Path, Polyline, Rect, Line } from 'react-native-svg';

// ── Extra icons ───────────────────────────────────────────────────
function CreditCardIcon(props: IconProps) {
  return (
    <Svg width={props.size ?? 15} height={props.size ?? 15} viewBox="0 0 24 24"
      stroke={props.color ?? Colors.ink3} strokeWidth={1.5} fill="none"
      strokeLinecap="round" strokeLinejoin="round">
      <Rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <Line x1="1" y1="10" x2="23" y2="10" />
    </Svg>
  );
}

function KeyboardIcon(props: IconProps) {
  return (
    <Svg width={props.size ?? 15} height={props.size ?? 15} viewBox="0 0 24 24"
      stroke={props.color ?? Colors.ink3} strokeWidth={1.5} fill="none"
      strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12" />
    </Svg>
  );
}

function ArrowRightIcon(props: IconProps) {
  return (
    <Svg width={props.size ?? 12} height={props.size ?? 12} viewBox="0 0 24 24"
      stroke={props.color ?? Colors.ink3} strokeWidth={1.5} fill="none"
      strokeLinecap="round" strokeLinejoin="round">
      <Line x1="5" y1="12" x2="19" y2="12" />
      <Polyline points="12 5 19 12 12 19" />
    </Svg>
  );
}

function ChevronUpIcon(props: IconProps) {
  return (
    <Svg width={props.size ?? 14} height={props.size ?? 14} viewBox="0 0 24 24"
      stroke={props.color ?? Colors.ink3} strokeWidth={1.5} fill="none"
      strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="18 15 12 9 6 15" />
    </Svg>
  );
}

// ── Keyboard shortcuts modal ──────────────────────────────────────
const SHORTCUTS = [
  { key: '⌘K', desc: 'Quick search' },
  { key: '⌘/',  desc: 'Open shortcuts' },
  { key: '⌘H', desc: 'Go home' },
  { key: '⌘E', desc: 'Go to exams' },
  { key: '⌘P', desc: 'Go to progress' },
  { key: '⌘,', desc: 'Open settings' },
  { key: 'Esc', desc: 'Close / go back' },
];

function ShortcutsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={sc.overlay} onPress={onClose}>
        <Pressable style={sc.container} onPress={() => {}}>
          <Text style={sc.title}>Keyboard shortcuts</Text>
          <View style={sc.list}>
            {SHORTCUTS.map(({ key, desc }) => (
              <View key={key} style={sc.row}>
                <View style={sc.keyBadge}>
                  <Text style={sc.keyText}>{key}</Text>
                </View>
                <Text style={sc.desc}>{desc}</Text>
              </View>
            ))}
          </View>
          <TouchableOpacity style={sc.closeBtn} onPress={onClose} activeOpacity={0.75}>
            <Text style={sc.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const sc = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  container:  { backgroundColor: Colors.white, borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  title:      { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, color: Colors.ink, marginBottom: 16 },
  list:       { gap: 8, marginBottom: 20 },
  row:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  keyBadge:   { backgroundColor: Colors.bg2, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, minWidth: 40, alignItems: 'center' },
  keyText:    { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink2 },
  desc:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink },
  closeBtn:   { backgroundColor: Colors.bg2, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-end' },
  closeBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink },
});

// ── Popover / sheet content ───────────────────────────────────────
function MenuContent({
  name, email, plan, rowHeight,
  onClose, onShortcuts,
}: {
  name: string; email: string; plan: string; rowHeight: number;
  onClose: () => void; onShortcuts: () => void;
}) {
  const router   = useRouter();
  const initial  = name[0]?.toUpperCase() ?? email[0]?.toUpperCase() ?? '?';
  const isPro    = plan === 'pro' || plan === 'elite';
  const planLabel = isPro ? 'Pro plan' : 'Free plan';

  function go(path: string) {
    onClose();
    router.push(path as any);
  }

  async function handleSignOut() {
    onClose();
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  const items = [
    { Icon: PersonIcon,    label: 'Profile settings',       onPress: () => go('/settings/account') },
    { Icon: CreditCardIcon, label: 'Subscription',          onPress: () => go('/upgrade') },
    { Icon: FlameIcon,     label: 'Streak & achievements',  onPress: () => go('/(tabs)/home') },
    { Icon: KeyboardIcon,  label: 'Keyboard shortcuts',     onPress: onShortcuts },
    { Icon: HelpCircleIcon, label: 'Help',                  onPress: () => { onClose(); Linking.openURL('https://fluentra.app/help'); } },
  ];

  return (
    <>
      {/* User header */}
      <View style={mc.header}>
        <View style={mc.headerAvatar}>
          <Text style={mc.headerAvatarText}>{initial}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={mc.headerName} numberOfLines={1}>{name}</Text>
          <Text style={mc.headerEmail} numberOfLines={1}>{email}</Text>
        </View>
        <View style={[mc.planBadge, isPro && mc.planBadgePro]}>
          <Text style={[mc.planBadgeText, isPro && mc.planBadgeTextPro]}>{planLabel}</Text>
        </View>
      </View>

      {/* Upgrade row (free only) */}
      {!isPro && (
        <TouchableOpacity style={mc.upgradeRow} onPress={() => go('/upgrade')} activeOpacity={0.8}>
          <LightningIcon size={14} color={Colors.p} />
          <Text style={mc.upgradeText}>Upgrade to Pro</Text>
          <ArrowRightIcon size={12} color={Colors.p} />
        </TouchableOpacity>
      )}

      {/* Menu items */}
      <View style={mc.itemsWrap}>
        {items.map(({ Icon, label, onPress }) => (
          <TouchableOpacity
            key={label}
            style={[mc.item, { height: rowHeight }]}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Icon size={15} color={Colors.ink3} />
            <Text style={mc.itemLabel}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Divider */}
      <View style={mc.divider} />

      {/* Log out */}
      <TouchableOpacity
        style={[mc.item, { height: rowHeight }]}
        onPress={handleSignOut}
        activeOpacity={0.7}
      >
        <LogOutIcon size={15} color={Colors.ink3} />
        <Text style={mc.itemLabel}>Log out</Text>
      </TouchableOpacity>
    </>
  );
}

const mc = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: '#F2F0EB',
  },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  headerAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.white },
  headerName:       { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  headerEmail:      { fontFamily: 'Inter_400Regular',  fontSize: 12, color: Colors.ink3, marginTop: 1 },
  planBadge: {
    backgroundColor: Colors.bg2, borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 2,
  },
  planBadgePro:     { backgroundColor: Colors.p_soft },
  planBadgeText:    { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3 },
  planBadgeTextPro: { color: Colors.p },

  upgradeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#FAF7F4',
    borderBottomWidth: 1, borderBottomColor: '#F2F0EB',
  },
  upgradeText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p, flex: 1 },

  itemsWrap: { paddingVertical: 4 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14,
  },
  itemLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, flex: 1 },

  divider: { height: 1, backgroundColor: '#F2F0EB', marginVertical: 4 },
});

// ── Main UserMenu ─────────────────────────────────────────────────
type UserMenuProps = {
  name:      string;
  email:     string;
  avatarUrl?: string | null;
  plan:      'free' | 'pro' | 'elite';
};

export function UserMenu({ name, email, plan }: UserMenuProps) {
  const { width }  = useWindowDimensions();
  const insets     = useSafeAreaInsets();
  const isDesktop  = Platform.OS === 'web' && width >= 768;

  const [open, setOpen]           = useState(false);
  const [shortcuts, setShortcuts] = useState(false);

  const initial   = name[0]?.toUpperCase() ?? email[0]?.toUpperCase() ?? '?';
  const planLabel = plan === 'pro' || plan === 'elite' ? 'Pro plan' : 'Free plan';

  function handleShortcuts() {
    setOpen(false);
    setShortcuts(true);
  }

  // ── Trigger row ──────────────────────────────────────────────
  const trigger = (
    <TouchableOpacity style={t.row} onPress={() => setOpen(o => !o)} activeOpacity={0.8}>
      <View style={t.avatar}>
        <Text style={t.avatarText}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={t.name} numberOfLines={1}>{name}</Text>
        <Text style={t.plan}>{planLabel}</Text>
      </View>
      {open ? <ChevronUpIcon size={12} color={Colors.textMuted} /> : <ChevronRightIcon size={12} color={Colors.textMuted} />}
    </TouchableOpacity>
  );

  // ── Desktop popover ──────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={t.wrap}>
        {open && (
          <>
            {/* click-outside overlay */}
            <Pressable style={t.clickOutside} onPress={() => setOpen(false)} />
            {/* popover */}
            <View style={t.popover}>
              <MenuContent
                name={name} email={email} plan={plan} rowHeight={36}
                onClose={() => setOpen(false)}
                onShortcuts={handleShortcuts}
              />
            </View>
          </>
        )}
        {trigger}
        <ShortcutsModal visible={shortcuts} onClose={() => setShortcuts(false)} />
      </View>
    );
  }

  // ── Mobile bottom sheet ──────────────────────────────────────
  return (
    <View style={t.wrap}>
      {trigger}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={bs.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[bs.sheet, { paddingBottom: insets.bottom + 16 }]} onPress={() => {}}>
            <View style={bs.handle} />
            <MenuContent
              name={name} email={email} plan={plan} rowHeight={48}
              onClose={() => setOpen(false)}
              onShortcuts={handleShortcuts}
            />
          </Pressable>
        </Pressable>
      </Modal>
      <ShortcutsModal visible={shortcuts} onClose={() => setShortcuts(false)} />
    </View>
  );
}

// ── Trigger styles ────────────────────────────────────────────────
const t = StyleSheet.create({
  wrap:  { position: 'relative' },

  // Click-outside layer for desktop
  clickOutside: {
    position:  'fixed' as any,
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 99,
  },

  // Popover for desktop
  popover: {
    position:  'absolute' as any,
    bottom:    '100%' as any,
    left:      0,
    right:     0,
    marginBottom: 6,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    zIndex: 100,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    } as any : {
      shadowColor: '#000', shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 4 }, shadowRadius: 24,
    }),
  },

  row: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              8,
    height:           36,
    borderRadius:     6,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.logoAccent,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  name:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.textPrimary },
  plan:       { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.textMuted },
});

// ── Bottom sheet styles ───────────────────────────────────────────
const bs = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor:    Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 8,
  },
});
