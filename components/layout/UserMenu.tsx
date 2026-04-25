import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Modal, Pressable, Platform, useWindowDimensions, Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import {
  PersonIcon, GearIcon, TrophyIcon, PhoneIcon,
  HelpCircleIcon, LogOutIcon, type IconProps,
} from '@/components/icons';
import Svg, { Path, Polyline, Rect } from 'react-native-svg';

// ── Local icons not yet in icons.tsx ─────────────────────────────
function KeyboardIcon(props: IconProps) {
  return (
    <Svg width={props.size ?? 15} height={props.size ?? 15} viewBox="0 0 24 24"
      stroke={props.color ?? '#888'} strokeWidth={1.5} fill="none"
      strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2" y="4" width="20" height="16" rx="2" />
      <Path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M6 16h12" />
    </Svg>
  );
}

// ── Prop types ────────────────────────────────────────────────────
type UserMenuProps = {
  name:       string;
  email:      string;
  avatarUrl?: string | null;
  plan:       'free' | 'pro' | 'elite';
};

// ── Desktop (HTML-based) ──────────────────────────────────────────
function DesktopUserMenu({ name, email, plan }: UserMenuProps) {
  const router       = useRouter();
  const [open, setOpen]             = useState(false);
  const [hovered, setHovered]       = useState(false);

  const initial   = name[0]?.toUpperCase() ?? email[0]?.toUpperCase() ?? '?';
  const isPro     = plan === 'pro' || plan === 'elite';
  const planLabel = isPro ? 'Pro plan' : 'Free plan';

  // Esc to close
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') setOpen(false); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function go(path: string) {
    setOpen(false);
    router.push(path as any);
  }

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  const triggerBg     = open ? '#F4F1EB' : hovered ? '#F8F6F1' : 'transparent';
  const triggerBorder = open ? '#E4DFD3' : 'transparent';

  const PRIMARY_ITEMS = [
    { icon: <PersonIcon    size={14} color="#888" />, label: 'Profile',                meta: 'View & edit', onPress: () => go('/settings/account') },
    { icon: <TrophyIcon    size={14} color="#888" />, label: 'Streak & achievements',  meta: undefined,     onPress: () => go('/streak') },
    { icon: <KeyboardIcon  size={14} color="#888" />, label: 'Keyboard shortcuts',     meta: '⌘/',          onPress: () => go('/shortcuts') },
    { icon: <PhoneIcon     size={14} color="#888" />, label: 'Get the app',            meta: undefined,     onPress: () => { setOpen(false); Linking.openURL('https://apps.apple.com/app/fluentra'); } },
  ] as const;

  const SECONDARY_ITEMS = [
    { icon: <GearIcon      size={14} color="#888" />, label: 'Settings',      onPress: () => go('/(tabs)/settings') },
    { icon: <HelpCircleIcon size={14} color="#888" />, label: 'Help & support', onPress: () => go('/help') },
  ] as const;

  return (
    <div style={{ position: 'relative' } as React.CSSProperties}>

      {/* Injected keyframe + hover rules */}
      <style>{`
        @keyframes um-fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .um-popover { animation: um-fadeInUp .16s ease-out; }
        .um-item:hover { background: #F8F6F1 !important; }
        .um-signout:hover { background: #FFF0EE !important; }
        .um-hdr-btn { border: none; border-bottom: 1px solid #F4F4F4; background: none; cursor: pointer; width: 100%; text-align: left; }
        .um-hdr-btn:hover { background: #F8F6F1 !important; }
      `}</style>

      {/* Click-outside catcher */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 60 } as React.CSSProperties}
        />
      )}

      {/* Popover */}
      {open && (
        <div
          className="um-popover"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            zIndex: 70,
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 16px 48px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.05)',
            padding: 6,
          } as React.CSSProperties}
        >
          {/* 1. Profile header */}
          <button
            className="um-hdr-btn"
            onClick={() => go('/settings/account')}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              padding: '10px 10px 12px',
              marginBottom: 4,
              borderRadius: 8,
            } as React.CSSProperties}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 20, flexShrink: 0,
              background: 'linear-gradient(135deg, #C04A06, #E8732F)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            } as React.CSSProperties}>
              <span style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: '#fff', fontWeight: 700 }}>
                {initial}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Inter_700Bold', fontSize: 13.5, color: '#000', fontWeight: 700,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {name}
              </div>
              <div style={{
                fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {email}
              </div>
            </div>
          </button>

          {/* 2. Plan card */}
          <div style={{
            margin: '0 2px 4px',
            padding: '8px 10px',
            background: '#F4F1EB',
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          } as React.CSSProperties}>
            <div style={{
              width: 20, height: 20, borderRadius: 5, flexShrink: 0,
              background: '#C04A06',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            } as React.CSSProperties}>
              <span style={{ color: '#fff', fontSize: 11, lineHeight: 1 }}>★</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'Inter_700Bold', fontSize: 11.5, color: '#000',
                fontWeight: 700, lineHeight: 1.1,
              }}>
                {isPro ? 'Fluentra Pro' : 'Fluentra Free'}
              </div>
              <div style={{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#888', marginTop: 1 }}>
                {isPro ? 'Renews Jun 12' : 'Upgrade to unlock more'}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); go('/upgrade'); }}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                fontFamily: 'Inter_700Bold', fontSize: 10.5, color: '#C04A06', fontWeight: 700,
              } as React.CSSProperties}
            >
              {isPro ? 'Manage' : 'Upgrade'}
            </button>
          </div>

          {/* 3. Primary items */}
          <div style={{ padding: '2px 0' }}>
            {PRIMARY_ITEMS.map(({ icon, label, meta, onPress }) => (
              <button
                key={label}
                className="um-item"
                onClick={onPress}
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8,
                  padding: '9px 10px', borderRadius: 8,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  width: '100%', textAlign: 'left',
                } as React.CSSProperties}
              >
                {icon}
                <span style={{
                  fontFamily: 'Inter_500Medium', fontSize: 12.5, color: '#333',
                  fontWeight: 500, flex: 1,
                }}>
                  {label}
                </span>
                {meta && (
                  <span style={{ fontFamily: 'Inter_400Regular', fontSize: 10.5, color: '#BBB' }}>
                    {meta}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* 4. Divider */}
          <div style={{ height: 1, background: '#F4F4F4', margin: '4px 8px' }} />

          {/* 5. Secondary items */}
          <div style={{ padding: '2px 0' }}>
            {SECONDARY_ITEMS.map(({ icon, label, onPress }) => (
              <button
                key={label}
                className="um-item"
                onClick={onPress}
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8,
                  padding: '9px 10px', borderRadius: 8,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  width: '100%', textAlign: 'left',
                } as React.CSSProperties}
              >
                {icon}
                <span style={{
                  fontFamily: 'Inter_500Medium', fontSize: 12.5, color: '#333', fontWeight: 500,
                }}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* 6. Sign out */}
          <button
            className="um-signout"
            onClick={handleSignOut}
            style={{
              display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8,
              padding: '9px 10px', borderRadius: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              width: '100%', textAlign: 'left',
            } as React.CSSProperties}
          >
            <LogOutIcon size={14} color="#C04A06" />
            <span style={{
              fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: '#C04A06', fontWeight: 600,
            }}>
              Sign out
            </span>
          </button>
        </div>
      )}

      {/* Trigger row */}
      <button
        onClick={() => setOpen(o => !o)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 12,
          border: `1px solid ${triggerBorder}`,
          background: triggerBg,
          transition: 'background .15s, border-color .15s',
          cursor: 'pointer',
          width: '100%', textAlign: 'left',
        } as React.CSSProperties}
      >
        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: 16, flexShrink: 0,
          background: 'linear-gradient(135deg, #C04A06, #E8732F)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        } as React.CSSProperties}>
          <span style={{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff', fontWeight: 700 }}>
            {initial}
          </span>
        </div>

        {/* Name + plan */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: '#000',
            fontWeight: 600, lineHeight: 1.1,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {name}
          </div>
          <div style={{
            fontFamily: 'Inter_400Regular', fontSize: 10.5, color: '#999', marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {planLabel}
          </div>
        </div>

        {/* Chevron */}
        <svg
          width={14} height={14} viewBox="0 0 24 24"
          stroke="#999" strokeWidth={1.5} fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            transition: 'transform .2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
          } as React.CSSProperties}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}

// ── Mobile bottom sheet ───────────────────────────────────────────
function MobileUserMenu({ name, email, plan }: UserMenuProps) {
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const [open, setOpen] = useState(false);

  const initial   = name[0]?.toUpperCase() ?? email[0]?.toUpperCase() ?? '?';
  const isPro     = plan === 'pro' || plan === 'elite';
  const planLabel = isPro ? 'Pro plan' : 'Free plan';

  function go(path: string) {
    setOpen(false);
    router.push(path as any);
  }

  async function handleSignOut() {
    setOpen(false);
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  const PRIMARY_ITEMS = [
    { Icon: PersonIcon,   label: 'Profile',               meta: 'View & edit', onPress: () => go('/settings/account') },
    { Icon: TrophyIcon,   label: 'Streak & achievements', meta: undefined,     onPress: () => go('/streak') },
    { Icon: KeyboardIcon, label: 'Keyboard shortcuts',    meta: '⌘/',          onPress: () => go('/shortcuts') },
    { Icon: PhoneIcon,    label: 'Get the app',           meta: undefined,     onPress: () => { setOpen(false); Linking.openURL('https://apps.apple.com/app/fluentra'); } },
  ] as const;

  const SECONDARY_ITEMS = [
    { Icon: GearIcon,       label: 'Settings',      onPress: () => go('/(tabs)/settings') },
    { Icon: HelpCircleIcon, label: 'Help & support', onPress: () => go('/help') },
  ] as const;

  return (
    <View>
      {/* Trigger */}
      <TouchableOpacity style={m.trigger} onPress={() => setOpen(true)} activeOpacity={0.8}>
        <View style={m.avatar}>
          <Text style={m.avatarText}>{initial}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={m.name} numberOfLines={1}>{name}</Text>
          <Text style={m.planText}>{planLabel}</Text>
        </View>
        <svg
          width={14} height={14} viewBox="0 0 24 24"
          stroke="#999" strokeWidth={1.5} fill="none"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </TouchableOpacity>

      {/* Bottom sheet */}
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={m.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[m.sheet, { paddingBottom: insets.bottom + 16 }]} onPress={() => {}}>
            <View style={m.handle} />

            {/* Profile header */}
            <TouchableOpacity style={m.sheetHeader} onPress={() => go('/settings/account')} activeOpacity={0.7}>
              <View style={m.sheetAvatar}>
                <Text style={m.sheetAvatarText}>{initial}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={m.sheetName} numberOfLines={1}>{name}</Text>
                <Text style={m.sheetEmail} numberOfLines={1}>{email}</Text>
              </View>
            </TouchableOpacity>

            {/* Plan card */}
            <View style={m.planCard}>
              <View style={m.sparkle}>
                <Text style={m.sparkleText}>★</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={m.planName}>{isPro ? 'Fluentra Pro' : 'Fluentra Free'}</Text>
                <Text style={m.planRenewal}>{isPro ? 'Renews Jun 12' : 'Upgrade to unlock more'}</Text>
              </View>
              <TouchableOpacity onPress={() => go('/upgrade')} activeOpacity={0.7}>
                <Text style={m.manageBtn}>{isPro ? 'Manage' : 'Upgrade'}</Text>
              </TouchableOpacity>
            </View>

            {/* Primary items */}
            <View style={m.section}>
              {PRIMARY_ITEMS.map(({ Icon, label, meta, onPress }) => (
                <TouchableOpacity key={label} style={m.item} onPress={onPress} activeOpacity={0.7}>
                  <Icon size={15} color="#888" />
                  <Text style={m.itemLabel}>{label}</Text>
                  {meta && <Text style={m.itemMeta}>{meta}</Text>}
                </TouchableOpacity>
              ))}
            </View>

            <View style={m.divider} />

            {/* Secondary items */}
            <View style={m.section}>
              {SECONDARY_ITEMS.map(({ Icon, label, onPress }) => (
                <TouchableOpacity key={label} style={m.item} onPress={onPress} activeOpacity={0.7}>
                  <Icon size={15} color="#888" />
                  <Text style={m.itemLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={m.divider} />

            {/* Sign out */}
            <TouchableOpacity style={m.item} onPress={handleSignOut} activeOpacity={0.7}>
              <LogOutIcon size={15} color="#C04A06" />
              <Text style={m.signOutLabel}>Sign out</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ── Export ────────────────────────────────────────────────────────
export function UserMenu(props: UserMenuProps) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  return isDesktop ? <DesktopUserMenu {...props} /> : <MobileUserMenu {...props} />;
}

// ── Mobile styles ─────────────────────────────────────────────────
const m = StyleSheet.create({
  trigger: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    height: 36, borderRadius: 6, paddingHorizontal: 8,
  },
  avatar: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: '#C04A06',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#fff' },
  name:       { fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: '#000' },
  planText:   { fontFamily: 'Inter_400Regular', fontSize: 10.5, color: '#999' },

  backdrop:   { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: '#E4E4E4',
    alignSelf: 'center', marginBottom: 8,
  },

  sheetHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
    marginBottom: 8,
  },
  sheetAvatar: {
    width: 40, height: 40, borderRadius: 20, flexShrink: 0,
    backgroundColor: '#C04A06',
    alignItems: 'center', justifyContent: 'center',
  },
  sheetAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#fff' },
  sheetName:       { fontFamily: 'Inter_700Bold', fontSize: 13.5, color: '#000' },
  sheetEmail:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999' },

  planCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 10, marginBottom: 8,
    padding: 10, backgroundColor: '#F4F1EB', borderRadius: 8,
  },
  sparkle: {
    width: 20, height: 20, borderRadius: 5,
    backgroundColor: '#C04A06',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  sparkleText: { color: '#fff', fontSize: 11 },
  planName:    { fontFamily: 'Inter_700Bold', fontSize: 11.5, color: '#000' },
  planRenewal: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#888' },
  manageBtn:   { fontFamily: 'Inter_700Bold', fontSize: 10.5, color: '#C04A06' },

  section: { paddingVertical: 2 },
  item: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  itemLabel:    { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#333', flex: 1 },
  itemMeta:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#BBB' },
  signOutLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#C04A06', flex: 1 },

  divider: { height: 1, backgroundColor: '#F4F4F4', marginHorizontal: 8, marginVertical: 2 },
});
