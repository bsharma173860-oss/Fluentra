/**
 * Library — matches page_library.jsx LibraryPage
 * Editorial content browser: continue reading, collections, list with filters.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { MicIcon, PenIcon, HeadphoneIcon, BookIcon } from '@/components/icons';

const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', bg3: '#EDEAE3', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  brand: '#C04A06', brandLight: '#FFE5DE',
  speaking:  { c: '#5B4EFF', bg: '#EEEDFF' },
  writing:   { c: '#A65A00', bg: '#FFEAC2' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
  reading:   { c: '#C04A06', bg: '#FFE5DE' },
};

const COLLECTIONS = [
  { title: 'IELTS Speaking', count: 24, color: C.speaking.c, bg: C.speaking.bg, Icon: MicIcon },
  { title: 'IELTS Writing Task 1', count: 18, color: C.writing.c, bg: C.writing.bg, Icon: PenIcon },
  { title: 'IELTS Listening', count: 32, color: C.listening.c, bg: C.listening.bg, Icon: HeadphoneIcon },
  { title: 'IELTS Reading', count: 21, color: C.reading.c, bg: C.reading.bg, Icon: BookIcon },
  { title: 'DELE B2 Vocab', count: 42, color: C.brand, bg: C.brandLight, Icon: BookIcon },
  { title: 'JLPT N4 Kanji', count: 300, color: '#C84070', bg: '#FFE0EC', Icon: BookIcon },
];

const ITEMS = [
  { kind: 'Lesson',     title: 'Past tense — passé composé',           tag: 'French · Grammar',   time: '10 min', saved: true,  c: C.writing },
  { kind: 'Phrasebook', title: 'Ordering at a café',                   tag: 'Spanish · A2',        time: '8 min',  saved: false, c: C.speaking },
  { kind: 'Audio',      title: 'Train station announcements',           tag: 'Japanese · N4',       time: '6 min',  saved: true,  c: C.listening },
  { kind: 'Article',    title: 'How to use cohesive devices in essays', tag: 'English · Writing',   time: '14 min', saved: false, c: C.writing },
  { kind: 'Lesson',     title: 'Conditionals — third type',             tag: 'English · B2',        time: '11 min', saved: false, c: C.reading },
  { kind: 'Phrasebook', title: 'Travel & directions',                   tag: 'French · A2',         time: '9 min',  saved: true,  c: C.speaking },
];

const FILTERS = ['All', 'Lesson', 'Audio', 'Phrasebook', 'Article'];

export default function LibraryScreen() {
  const [filter, setFilter] = useState('All');
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const filtered = filter === 'All' ? ITEMS : ITEMS.filter(it => it.kind === filter);

  if (isDesktop) {
    return (
      <AppLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
          <div style={{ flex: 1, overflow: 'auto', padding: '28px 36px 40px' } as any}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 } as any}>
              <div>
                <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 } as any}>LIBRARY</div>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 40, color: C.ink, lineHeight: 1.05 } as any}>Saved lessons, audio, phrasebooks.</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 } as any}>
                <button style={{ padding: '9px 16px', borderRadius: 9, border: `1px solid ${C.border}`, background: C.card, fontSize: 12.5, fontWeight: 600, color: C.ink3, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 } as any}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                  Search library
                </button>
                <button style={{ padding: '9px 16px', borderRadius: 9, border: 'none', background: C.brand, color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 } as any}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Add lesson
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 28, alignItems: 'start' } as any}>
              <div style={{ minWidth: 0 } as any}>
                {/* Continue reading */}
                <div style={{ background: C.bg2, borderRadius: 18, padding: '28px 32px', display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 36, alignItems: 'center', marginBottom: 32, border: `1px solid ${C.border}` } as any}>
                  <div>
                    <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, background: C.brandLight, fontSize: 11, fontWeight: 700, color: C.brand, marginBottom: 14 } as any}>Continue reading</div>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, color: C.ink, lineHeight: 1.1, marginBottom: 12 } as any}>Past tense — passé composé</div>
                    <div style={{ fontSize: 14, color: C.ink3, lineHeight: 1.5, marginBottom: 18 } as any}>You stopped halfway through this lesson 2 days ago. Pick up where you left off.</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 } as any}>
                      <button style={{ padding: '10px 20px', borderRadius: 10, background: C.brand, color: '#fff', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 } as any}>
                        Resume
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                      <span style={{ fontSize: 12, color: C.ink4 } as any}>4 min left</span>
                    </div>
                  </div>
                  <div style={{ aspectRatio: '4/3', borderRadius: 14, background: `linear-gradient(135deg, ${C.brand} 0%, #E8732F 100%)`, position: 'relative', overflow: 'hidden', minHeight: 140 } as any}>
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(20,1fr)', gap: 10, opacity: .1, padding: 18 } as any}>
                      {Array.from({ length: 160 }).map((_, i) => <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' } as any} />)}
                    </div>
                    <div style={{ position: 'absolute', bottom: 24, left: 24, right: 24, color: '#fff' } as any}>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', opacity: .85, marginBottom: 6 } as any}>Audio preview</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 } as any}>
                        <div style={{ width: 38, height: 38, borderRadius: 19, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                        </div>
                        <div style={{ flex: 1 } as any}>
                          <div style={{ height: 3, background: 'rgba(255,255,255,.3)', borderRadius: 99, overflow: 'hidden' } as any}>
                            <div style={{ width: '40%', height: '100%', background: '#fff' } as any} />
                          </div>
                          <div style={{ fontSize: 11, opacity: .8, marginTop: 5 } as any}>0:48 / 2:14</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collections */}
                <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 14 } as any}>Collections</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 32 } as any}>
                  {COLLECTIONS.map(col => (
                    <button key={col.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16, textAlign: 'left', cursor: 'pointer' } as any}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: col.bg, color: col.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 } as any}>
                        <col.Icon size={14} color={col.color} />
                      </div>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink, marginBottom: 2, lineHeight: 1.2 } as any}>{col.title}</div>
                      <div style={{ fontSize: 11, color: C.ink4 } as any}>{col.count} items</div>
                    </button>
                  ))}
                </div>

                {/* List + filter */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 } as any}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink } as any}>Recently saved</div>
                  <div style={{ display: 'flex', gap: 4 } as any}>
                    {FILTERS.map((f) => {
                      const active = filter === f;
                      return (
                        <button key={f} onClick={() => setFilter(f)} style={{ padding: '6px 12px', fontSize: 12, fontWeight: active ? 700 : 500, color: active ? C.ink : C.ink3, background: active ? C.card : 'transparent', border: `1px solid ${active ? C.border : 'transparent'}`, borderRadius: 8, cursor: 'pointer' } as any}>{f}</button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 } as any}>
                  {filtered.map((item, i) => (
                    <button key={i} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 18px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' } as any}
                      onMouseEnter={(e: any) => e.currentTarget.style.borderColor = C.brand + '44'}
                      onMouseLeave={(e: any) => e.currentTarget.style.borderColor = C.border}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: item.c.bg, color: item.c.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                        {item.kind === 'Audio' ? <HeadphoneIcon size={15} color={item.c.c} /> : item.kind === 'Lesson' ? <PenIcon size={15} color={item.c.c} /> : <BookIcon size={15} color={item.c.c} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 } as any}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 } as any}>
                          <span style={{ display: 'inline-flex', padding: '2px 7px', borderRadius: 99, background: C.bg2, fontSize: 9.5, fontWeight: 700, color: C.ink3 } as any}>{item.kind}</span>
                          <span style={{ fontSize: 10.5, color: C.ink4 } as any}>{item.tag}</span>
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, lineHeight: 1.25 } as any}>{item.title}</div>
                        <div style={{ fontSize: 10.5, color: C.ink4, marginTop: 3 } as any}>{item.time}</div>
                      </div>
                      <div style={{ color: item.saved ? C.brand : C.ink5, flexShrink: 0 } as any}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={item.saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right rail */}
              <aside style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 14 } as any}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 } as any}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.ink4, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 } as any}>Reading goal</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 10 } as any}>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: C.ink, lineHeight: 1 } as any}>3.4h</div>
                    <div style={{ fontSize: 11.5, color: C.ink4 } as any}>/ 5h this week</div>
                  </div>
                  <div style={{ height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden', marginBottom: 8 } as any}>
                    <div style={{ height: '100%', width: '68%', background: C.brand, borderRadius: 99 } as any} />
                  </div>
                  <div style={{ fontSize: 10.5, color: C.ink4 } as any}>1h 36m to go · resets Monday</div>
                </div>

                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 } as any}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 } as any}>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: C.ink4, letterSpacing: '.12em', textTransform: 'uppercase' } as any}>Tags</div>
                    <button style={{ fontSize: 11, color: C.ink3, fontWeight: 600, background: 'transparent', border: 'none', cursor: 'pointer' } as any}>Manage</button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 } as any}>
                    {[{ l: 'IELTS', n: 42 }, { l: 'Grammar', n: 28 }, { l: 'Vocab', n: 31 }, { l: 'Audio', n: 18 }, { l: 'B2', n: 14 }, { l: 'Travel', n: 9 }].map(t => (
                      <button key={t.l} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 7, padding: '5px 9px', fontSize: 11, color: C.ink2, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5 } as any}>
                        {t.l} <span style={{ color: C.ink4, fontWeight: 500 } as any}>{t.n}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 4, marginBottom: 8 }}>
            <Text style={s.eyebrow}>LIBRARY</Text>
            <Text style={s.pageTitle}>Saved lessons, audio, phrasebooks.</Text>
          </View>

          {/* Continue reading */}
          <View style={s.continueCard}>
            <View style={s.continueBadge}>
              <Text style={s.continueBadgeText}>Continue reading</Text>
            </View>
            <Text style={s.continueTitle}>Past tense — passé composé</Text>
            <Text style={s.continueSub}>You stopped halfway through this lesson 2 days ago.</Text>
            <TouchableOpacity style={s.resumeBtn}>
              <Text style={s.resumeBtnText}>Resume →</Text>
            </TouchableOpacity>
          </View>

          {/* Collections */}
          <Text style={s.sectionTitle}>Collections</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {COLLECTIONS.map(col => (
              <View key={col.title} style={[s.collectionCard, { borderColor: C.border }]}>
                <View style={[s.collectionIcon, { backgroundColor: col.bg }]}>
                  <col.Icon size={14} color={col.color} />
                </View>
                <Text style={s.collectionTitle} numberOfLines={2}>{col.title}</Text>
                <Text style={s.collectionCount}>{col.count} items</Text>
              </View>
            ))}
          </ScrollView>

          {/* Filter chips */}
          <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
            {FILTERS.map(f => (
              <TouchableOpacity key={f} style={[s.chip, filter === f && s.chipActive]} onPress={() => setFilter(f)}>
                <Text style={[s.chipText, filter === f && s.chipTextActive]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Item list */}
          {filtered.map((item, i) => (
            <View key={i} style={s.itemCard}>
              <View style={[s.itemIcon, { backgroundColor: item.c.bg }]}>
                {item.kind === 'Audio' ? <HeadphoneIcon size={14} color={item.c.c} /> : item.kind === 'Lesson' ? <PenIcon size={14} color={item.c.c} /> : <BookIcon size={14} color={item.c.c} />}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <View style={s.kindBadge}><Text style={s.kindBadgeText}>{item.kind}</Text></View>
                  <Text style={s.itemTag} numberOfLines={1}>{item.tag}</Text>
                </View>
                <Text style={s.itemTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={s.itemTime}>{item.time}</Text>
              </View>
              <View style={{ color: item.saved ? C.brand : C.ink5 } as any}>
                <Text style={{ color: item.saved ? C.brand : C.ink5, fontSize: 16 }}>{item.saved ? '🔖' : '⬜'}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase' },
  pageTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: C.ink, lineHeight: 32 },
  continueCard: { backgroundColor: C.bg2, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: C.border },
  continueBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, backgroundColor: C.brandLight, alignSelf: 'flex-start', marginBottom: 10 },
  continueBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.brand, textTransform: 'uppercase', letterSpacing: 0.8 },
  continueTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: C.ink, lineHeight: 26, marginBottom: 6 },
  continueSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink3, marginBottom: 14 },
  resumeBtn: { backgroundColor: C.brand, borderRadius: 10, padding: 12, alignItems: 'center' },
  resumeBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff' },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink },
  collectionCard: { width: 130, backgroundColor: C.card, borderRadius: 12, padding: 14, borderWidth: 1 },
  collectionIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  collectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 11.5, color: C.ink, lineHeight: 16, marginBottom: 2 },
  collectionCount: { fontFamily: 'Inter_400Regular', fontSize: 10, color: C.ink4 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  chipActive: { backgroundColor: C.ink, borderColor: C.ink },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.ink3 },
  chipTextActive: { color: '#fff' },
  itemCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, backgroundColor: C.card, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  itemIcon: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  kindBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99, backgroundColor: C.bg2 },
  kindBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 9.5, color: C.ink3 },
  itemTag: { fontFamily: 'Inter_400Regular', fontSize: 10.5, color: C.ink4, flex: 1 },
  itemTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink, lineHeight: 18 },
  itemTime: { fontFamily: 'Inter_400Regular', fontSize: 10.5, color: C.ink4, marginTop: 3 },
});
