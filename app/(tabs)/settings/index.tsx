/**
 * Settings page — matches page_settings.jsx SettingsPage
 * Sidebar nav + tabbed sections: Account, Subscription, Billing, Preferences, Notifications, Data.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch,
  Platform, useWindowDimensions, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', bg3: '#EDEAE3', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  brand: '#C04A06', brandLight: '#FFE5DE',
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
};

type TabId = 'account' | 'subscription' | 'billing' | 'preferences' | 'notifications' | 'data';

const NAV: { id: TabId; label: string }[] = [
  { id: 'account',       label: 'Account' },
  { id: 'subscription',  label: 'Subscription' },
  { id: 'billing',       label: 'Billing' },
  { id: 'preferences',   label: 'Preferences' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'data',          label: 'Data & Privacy' },
];

function SectionHd({ title, sub }: { title: string; sub?: string }) {
  if (Platform.OS === 'web') {
    return (
      <div style={{ marginBottom: 18 } as any}>
        <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, marginBottom: 4 } as any}>{title}</div>
        {sub && <div style={{ fontSize: 13, color: C.ink4, lineHeight: 1.55 } as any}>{sub}</div>}
      </div>
    );
  }
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 16, color: C.ink, marginBottom: 2 }}>{title}</Text>
      {sub && <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink4, lineHeight: 20 }}>{sub}</Text>}
    </View>
  );
}

function FormRow({ label, value, type = 'text', placeholder }: { label: string; value: string; type?: string; placeholder?: string }) {
  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 16, alignItems: 'center', padding: '14px 0', borderBottom: `1px solid ${C.hairline}` } as any}>
        <label style={{ fontSize: 12.5, color: C.ink3, fontWeight: 600 } as any}>{label}</label>
        <input type={type} defaultValue={value} placeholder={placeholder}
          style={{ padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.ink, fontFamily: "'Inter',sans-serif", outline: 'none', maxWidth: 380, width: '100%', boxSizing: 'border-box' } as any} />
      </div>
    );
  }
  return (
    <View style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.hairline, flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: C.ink3, width: 120 }}>{label}</Text>
      <TextInput
        defaultValue={value}
        placeholder={placeholder}
        style={{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink, padding: 0 }}
        placeholderTextColor={C.ink5}
      />
    </View>
  );
}

function ToggleRow({ label, sub, defaultOn = false }: { label: string; sub?: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  if (Platform.OS === 'web') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: `1px solid ${C.hairline}` } as any}>
        <div style={{ flex: 1 } as any}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 } as any}>{label}</div>
          {sub && <div style={{ fontSize: 12, color: C.ink4 } as any}>{sub}</div>}
        </div>
        <button onClick={() => setOn(x => !x)} style={{ width: 42, height: 24, borderRadius: 12, background: on ? C.brand : C.bg3, position: 'relative', cursor: 'pointer', transition: '.2s', border: 'none', flexShrink: 0 } as any}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: '#fff', position: 'absolute', top: 3, left: on ? 21 : 3, transition: '.2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)' } as any} />
        </button>
      </div>
    );
  }
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.hairline }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink, marginBottom: 2 }}>{label}</Text>
        {sub && <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink4 }}>{sub}</Text>}
      </View>
      <Switch value={on} onValueChange={setOn} trackColor={{ true: C.brand, false: C.bg3 }} thumbColor="#fff" />
    </View>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: any }) {
  if (Platform.OS === 'web') {
    return <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24, marginBottom: 24, ...style } as any}>{children}</div>;
  }
  return <View style={[{ backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 16 }, style]}>{children}</View>;
}

// ── Tabs ───────────────────────────────────────────────────────────
function AccountTab({ profile }: { profile: any }) {
  const displayName = profile?.name ?? 'User';
  const initial = displayName[0]?.toUpperCase() ?? 'U';
  return (
    <div style={{ maxWidth: 720 } as any}>
      <SectionHd title="Account details" sub="Update your name, email, and password. Changes apply across all devices." />
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '4px 0 18px', borderBottom: `1px solid ${C.hairline}`, marginBottom: 6 } as any}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg, ${C.brand}, #E8732F)`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28 } as any}>{initial}</div>
          <div style={{ flex: 1 } as any}>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 2 } as any}>{displayName}</div>
            <div style={{ fontSize: 12.5, color: C.ink4 } as any}>{profile?.email ?? ''} · Member since {new Date(profile?.created_at ?? Date.now()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
          </div>
          <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.ink2, cursor: 'pointer' } as any}>Change photo</button>
        </div>
        <FormRow label="Full name" value={displayName} />
        <FormRow label="Email" value={profile?.email ?? ''} type="email" />
        <FormRow label="Country" value="" placeholder="Your country" />
      </Card>

      <SectionHd title="Password & security" />
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${C.hairline}` } as any}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 } as any}>Password</div>
            <div style={{ fontSize: 12, color: C.ink4 } as any}>Last changed 2 months ago</div>
          </div>
          <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.ink2, cursor: 'pointer' } as any}>Change password</button>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0' } as any}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 } as any}>Two-factor authentication</div>
            <div style={{ fontSize: 12, color: C.ink4 } as any}>Adds an extra step when signing in</div>
          </div>
          <button style={{ padding: '7px 16px', borderRadius: 8, border: 'none', background: C.brand, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' } as any}>Enable</button>
        </div>
      </Card>

      <button style={{ padding: '12px 24px', borderRadius: 10, border: 'none', background: C.brand, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' } as any}>Save changes</button>
    </div>
  );
}

function SubscriptionTab() {
  return (
    <div style={{ maxWidth: 720 } as any}>
      <SectionHd title="Subscription" />
      <div style={{ background: C.ink, borderRadius: 18, padding: '28px 32px', color: '#fff', marginBottom: 24, position: 'relative', overflow: 'hidden' } as any}>
        <div style={{ position: 'absolute', inset: 0, opacity: .04, background: 'radial-gradient(circle at 100% 0%, #fff 0%, transparent 60%)' } as any} />
        <div style={{ position: 'relative', zIndex: 1 } as any}>
          <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,.1)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.85)', marginBottom: 14 } as any}>Current plan</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 } as any}>
            <div>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 36, lineHeight: 1, marginBottom: 6 } as any}>Fluentra Pro</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)' } as any}>Renews May 28, 2026 · $24 / month</div>
            </div>
            <div style={{ textAlign: 'right' } as any}>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, lineHeight: 1 } as any}>$24</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', marginTop: 3 } as any}>per month</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 } as any}>
            <button style={{ padding: '9px 18px', borderRadius: 9, border: 'none', background: '#fff', color: C.ink, fontSize: 12.5, fontWeight: 700, cursor: 'pointer' } as any}>Manage plan</button>
            <button style={{ padding: '9px 18px', borderRadius: 9, border: '1.5px solid rgba(255,255,255,.4)', background: 'transparent', color: 'rgba(255,255,255,.85)', fontSize: 12.5, fontWeight: 600, cursor: 'pointer' } as any}>Pause subscription</button>
          </div>
        </div>
      </div>

      <SectionHd title="What's included" />
      <Card>
        {[
          { label: 'Unlimited AI Tutor', v: 'Used 142 sessions this month' },
          { label: 'Speaking practice', v: 'Unlimited conversations' },
          { label: 'AI Writing feedback', v: 'Unlimited essays · Band-level scoring' },
          { label: 'Monthly Exam', v: '1 entry/month included · 3 used' },
          { label: 'Premium content', v: '500+ lessons · 24 IELTS practice tests' },
        ].map((f, i, arr) => (
          <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < arr.length - 1 ? `1px solid ${C.hairline}` : 'none' } as any}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: C.brandLight, color: C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <div style={{ flex: 1 } as any}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 } as any}>{f.label}</div>
              <div style={{ fontSize: 12, color: C.ink4 } as any}>{f.v}</div>
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.listening.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
        ))}
      </Card>
    </div>
  );
}

function BillingTab() {
  const INVOICES = [
    { date: 'Apr 28, 2026', desc: 'Fluentra Pro · Monthly', amt: '$24.00' },
    { date: 'Apr 12, 2026', desc: 'IELTS Practice Exam · April', amt: '$5.00' },
    { date: 'Mar 28, 2026', desc: 'Fluentra Pro · Monthly', amt: '$24.00' },
    { date: 'Mar 12, 2026', desc: 'IELTS Practice Exam · March', amt: '$5.00' },
  ];
  return (
    <div style={{ maxWidth: 720 } as any}>
      <SectionHd title="Billing & payment" />
      <SectionHd title="Payment method" />
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0' } as any}>
          <div style={{ width: 48, height: 32, borderRadius: 6, background: 'linear-gradient(135deg,#1A1F71,#3358D4)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 13, fontWeight: 700, letterSpacing: '.05em' } as any}>VISA</div>
          <div style={{ flex: 1 } as any}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, marginBottom: 2 } as any}>Visa ending in 4242</div>
            <div style={{ fontSize: 12, color: C.ink4 } as any}>Expires 09/27</div>
          </div>
          <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.ink2, cursor: 'pointer' } as any}>Replace</button>
        </div>
      </Card>

      <SectionHd title="Invoice history" />
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: 24 } as any}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 80px', padding: '12px 20px', fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', borderBottom: `1px solid ${C.hairline}` } as any}>
          <div>Date</div><div>Description</div><div style={{ textAlign: 'right' } as any}>Amount</div><div></div>
        </div>
        {INVOICES.map((inv, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 100px 80px', padding: '14px 20px', alignItems: 'center', borderBottom: i < INVOICES.length - 1 ? `1px solid ${C.hairline}` : 'none', fontSize: 13 } as any}>
            <div style={{ color: C.ink3 } as any}>{inv.date}</div>
            <div style={{ color: C.ink, fontWeight: 500 } as any}>{inv.desc}</div>
            <div style={{ color: C.ink, fontWeight: 600, textAlign: 'right' } as any}>{inv.amt}</div>
            <div style={{ textAlign: 'right' } as any}>
              <button style={{ fontSize: 12, color: C.brand, fontWeight: 600, cursor: 'pointer', background: 'transparent', border: 'none' } as any}>PDF</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreferencesTab() {
  const [exam, setExam] = useState('IELTS Academic');
  const [target, setTarget] = useState(8.0);
  return (
    <div style={{ maxWidth: 720 } as any}>
      <SectionHd title="Learning preferences" />
      <Card>
        <div style={{ marginBottom: 18 } as any}>
          <div style={{ fontSize: 12.5, color: C.ink3, fontWeight: 600, marginBottom: 8 } as any}>Target exam</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' } as any}>
            {['IELTS Academic', 'IELTS General', 'TOEFL iBT', 'Cambridge C2'].map(e => (
              <button key={e} onClick={() => setExam(e)} style={{ padding: '8px 14px', borderRadius: 9, border: `1.5px solid ${exam === e ? C.brand : C.border}`, background: exam === e ? C.brandLight : C.card, fontSize: 12.5, fontWeight: exam === e ? 700 : 500, color: exam === e ? C.brand : C.ink2, cursor: 'pointer' } as any}>{e}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 18 } as any}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 } as any}>
            <span style={{ fontSize: 12.5, color: C.ink3, fontWeight: 600 } as any}>Target band score</span>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: C.brand } as any}>{target.toFixed(1)}</span>
          </div>
          <input type="range" min="4" max="9" step="0.5" value={target} onChange={(e: any) => setTarget(+e.target.value)}
            style={{ width: '100%', accentColor: C.brand } as any} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.ink5, marginTop: 4 } as any}>
            {[4.0, 5.0, 6.0, 7.0, 8.0, 9.0].map(v => <span key={v}>{v.toFixed(1)}</span>)}
          </div>
        </div>
      </Card>

      <SectionHd title="Daily goal" />
      <Card>
        <div style={{ display: 'flex', gap: 10 } as any}>
          {[10, 20, 30, 45, 60].map(m => (
            <button key={m} style={{ flex: 1, padding: '14px 0', borderRadius: 11, border: `1.5px solid ${m === 20 ? C.brand : C.border}`, background: m === 20 ? C.brandLight : C.card, cursor: 'pointer', textAlign: 'center' } as any}>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: m === 20 ? C.brand : C.ink, lineHeight: 1 } as any}>{m}</div>
              <div style={{ fontSize: 10, color: m === 20 ? C.brand : C.ink4, fontWeight: 600, marginTop: 4 } as any}>min/day</div>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function NotificationsTab() {
  return (
    <div style={{ maxWidth: 720 } as any}>
      <SectionHd title="Notifications" />
      <Card>
        <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 } as any}>Streak & habits</div>
        <ToggleRow label="Daily reminder" sub="A nudge at your preferred time" defaultOn />
        <ToggleRow label="Streak warnings" sub="Tell me when my streak is at risk" defaultOn />
        <ToggleRow label="Weekly recap" sub="Sunday summary of your progress" defaultOn />
      </Card>
      <Card>
        <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 } as any}>Learning</div>
        <ToggleRow label="New content alerts" sub="When new lessons drop in your language" defaultOn />
        <ToggleRow label="AI Tutor reply" sub="Notify when async responses arrive" />
        <ToggleRow label="Exam reminders" sub="48h, 24h, 1h before scheduled exams" defaultOn />
      </Card>
      <Card>
        <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 } as any}>Marketing</div>
        <ToggleRow label="Product updates" sub="Important changes & new features" />
        <ToggleRow label="Tips & study advice" sub="Newsletter every other week" />
        <ToggleRow label="Promotions" sub="Discounts and special offers" />
      </Card>
    </div>
  );
}

function DataPrivacyTab() {
  return (
    <div style={{ maxWidth: 720 } as any}>
      <SectionHd title="Data & privacy" />
      <Card>
        <ToggleRow label="Personalised recommendations" sub="Use my activity to suggest content" defaultOn />
        <ToggleRow label="Anonymous analytics" sub="Help us improve Fluentra" defaultOn />
        <ToggleRow label="Show me on the leaderboard" sub="Your name & score visible to others" defaultOn />
        <ToggleRow label="Public profile" sub="Allow other learners to view your progress" />
      </Card>
      <SectionHd title="Your data" />
      <Card>
        {[
          { label: 'Export my data', sub: 'Download a JSON archive of your activity', cta: 'Request export' },
          { label: 'Privacy policy', sub: 'Read how we collect and use your data', cta: 'Open policy' },
          { label: 'Terms of service', sub: 'The agreement that governs your account', cta: 'Open terms' },
        ].map((r, i, a) => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < a.length - 1 ? `1px solid ${C.hairline}` : 'none' } as any}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 } as any}>{r.label}</div>
              <div style={{ fontSize: 12, color: C.ink4 } as any}>{r.sub}</div>
            </div>
            <button style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${C.border}`, background: C.card, fontSize: 12, fontWeight: 600, color: C.ink2, cursor: 'pointer' } as any}>{r.cta}</button>
          </div>
        ))}
      </Card>
      <SectionHd title="Danger zone" />
      <div style={{ background: '#FEF7F7', border: '1.5px solid #FECACA', borderRadius: 14, padding: 24 } as any}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as any}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#DC2626', marginBottom: 3 } as any}>Delete account permanently</div>
            <div style={{ fontSize: 12, color: '#991B1B' } as any}>This will erase your progress, exam history, and certificates. Cannot be undone.</div>
          </div>
          <button style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #DC2626', background: 'transparent', color: '#DC2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', marginLeft: 24, flexShrink: 0 } as any}>Delete account</button>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────────
export default function SettingsScreen() {
  const [tab, setTab] = useState<TabId>('account');
  const { profile, user } = useAuth();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const profileData = { name: profile?.name ?? user?.email?.split('@')[0] ?? 'User', email: user?.email ?? '', created_at: (user as any)?.created_at };

  if (isDesktop) {
    return (
      <AppLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
          <div style={{ flex: 1, overflow: 'auto', padding: '32px 36px' } as any}>
            <div style={{ maxWidth: 980, margin: '0 auto' } as any}>
              <div style={{ marginBottom: 24 } as any}>
                <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 } as any}>Settings</div>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 36, color: C.ink, lineHeight: 1.1 } as any}>Manage your account</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 32 } as any}>
                {/* Sidebar nav */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, position: 'sticky', top: 0, alignSelf: 'flex-start' } as any}>
                  {NAV.map(item => (
                    <button key={item.id} onClick={() => setTab(item.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, fontSize: 13, fontWeight: tab === item.id ? 700 : 500, color: tab === item.id ? C.ink : C.ink3, background: tab === item.id ? C.bg2 : 'transparent', textAlign: 'left', cursor: 'pointer', border: 'none' } as any}>
                      {item.label}
                    </button>
                  ))}
                  <div style={{ height: 1, background: C.border, margin: '12px 6px' } as any} />
                  <button
                    onClick={() => supabase.auth.signOut()}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 9, fontSize: 13, fontWeight: 500, color: C.brand, textAlign: 'left', cursor: 'pointer', background: 'transparent', border: 'none' } as any}>
                    Sign out
                  </button>
                </div>

                {/* Tab content */}
                <div>
                  {tab === 'account'       && <AccountTab profile={profileData} />}
                  {tab === 'subscription'  && <SubscriptionTab />}
                  {tab === 'billing'       && <BillingTab />}
                  {tab === 'preferences'   && <PreferencesTab />}
                  {tab === 'notifications' && <NotificationsTab />}
                  {tab === 'data'          && <DataPrivacyTab />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Mobile
  return (
    <AppLayout>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          <View style={s.header}>
            <Text style={s.pageTitle}>Settings</Text>
          </View>

          {/* Nav list */}
          {!tab || true ? (
            <View style={{ padding: 16, gap: 8 }}>
              {NAV.map(item => (
                <TouchableOpacity key={item.id} style={s.navRow} onPress={() => setTab(item.id)}>
                  <Text style={s.navLabel}>{item.label}</Text>
                  <Text style={{ color: C.ink4, fontSize: 18 }}>›</Text>
                </TouchableOpacity>
              ))}
              <View style={{ height: 1, backgroundColor: C.border, marginVertical: 8 }} />
              <TouchableOpacity style={s.navRow} onPress={() => supabase.auth.signOut()}>
                <Text style={[s.navLabel, { color: C.brand }]}>Sign out</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  header: { padding: 20, paddingBottom: 8 },
  pageTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: C.ink, lineHeight: 36 },
  navRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: C.border },
  navLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.ink },
});
