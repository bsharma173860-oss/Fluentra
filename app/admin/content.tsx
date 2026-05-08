/**
 * app/admin/content.tsx
 * Admin content management — view library items, trigger bulk generation.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { RefreshIcon } from '@/components/icons';
import { getLangNames } from '@/constants/languages';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';
const KEY  = process.env.EXPO_PUBLIC_ADMIN_KEY ?? '';

// Languages to bulk-generate for
const LANGUAGES = [
  { code: 'en', name: 'English',  flag: '🇬🇧', examType: 'IELTS' },
  { code: 'es', name: 'Spanish',  flag: '🇪🇸', examType: 'DELE'  },
  { code: 'fr', name: 'French',   flag: '🇫🇷', examType: 'DELF'  },
  { code: 'de', name: 'German',   flag: '🇩🇪', examType: 'Goethe' },
  { code: 'zh', name: 'Mandarin', flag: '🇨🇳', examType: 'HSK'   },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵', examType: 'JLPT'  },
];
const MODULES = ['writing', 'reading', 'listening', 'vocab', 'grammar'];

type LibraryItem = {
  id:           string;
  language_code: string;
  exam_type:    string;
  content_type: string;
  title:        string;
  difficulty:   string;
  date:         string;
  created_at:   string;
};

type GenerateStatus = Record<string, 'idle' | 'loading' | 'done' | 'error'>;

const TYPE_COLORS: Record<string, string> = {
  writing_prompt: Colors.orange,
  reading:        Colors.blue,
  listening:      Colors.green,
  vocab:          Colors.p,
  grammar:        '#E67E22',
  speaking:       '#9B59B6',
};

// ── Library row ────────────────────────────────────────────────────
function LibraryRow({ item }: { item: LibraryItem }) {
  const lang  = LANGUAGES.find(l => l.code === item.language_code);
  const color = TYPE_COLORS[item.content_type] ?? Colors.ink3;
  return (
    <View style={r.row}>
      <Text style={r.flag}>{lang?.flag ?? '🌐'}</Text>
      <View style={r.info}>
        <View style={r.infoTop}>
          <View style={[r.typeBadge, { backgroundColor: color + '18' }]}>
            <Text style={[r.typeText, { color }]}>{item.content_type.replace('_', ' ')}</Text>
          </View>
          <Text style={r.date}>{item.date}</Text>
        </View>
        <Text style={r.title} numberOfLines={2}>{item.title}</Text>
      </View>
    </View>
  );
}

// ── Generate progress row ──────────────────────────────────────────
function GenRow({ lang, status }: { lang: typeof LANGUAGES[0]; status: GenerateStatus }) {
  const getStatus = (mod: string) => status[`${lang.code}:${mod}`] ?? 'idle';
  const statusIcon = (s: string) =>
    s === 'loading' ? '⏳' : s === 'done' ? '✓' : s === 'error' ? '✗' : '·';
  const statusColor = (s: string) =>
    s === 'done' ? Colors.green : s === 'error' ? Colors.danger : Colors.ink3;

  return (
    <View style={g.row}>
      <Text style={g.flag}>{lang.flag}</Text>
      <Text style={g.name}>{lang.name}</Text>
      <View style={g.dots}>
        {MODULES.map(m => {
          const st = getStatus(m);
          return (
            <View key={m} style={[g.dot, { backgroundColor: st === 'done' ? Colors.green_bg : st === 'error' ? Colors.danger_bg : Colors.bg2 }]}>
              <Text style={[g.dotText, { color: statusColor(st) }]}>{statusIcon(st)}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────
export default function AdminContentScreen() {
  const [items,      setItems]      = useState<LibraryItem[]>([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [langFilter, setLangFilter] = useState('');
  const [genStatus,  setGenStatus]  = useState<GenerateStatus>({});
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    try {
      const qs = new URLSearchParams({ limit: '50' });
      if (langFilter) qs.set('code', langFilter);
      if (typeFilter) qs.set('type', typeFilter);
      const res = await fetch(`${API}/library?${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setItems(json.items ?? []);
      setTotal(json.items?.length ?? 0);
    } catch (err: any) {
      console.error('[admin/content]', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [langFilter, typeFilter]);

  useEffect(() => { load(); }, [load]);

  // Bulk generate for all languages × all modules
  const handleGenerate = async () => {
    setGenerating(true);
    const init: GenerateStatus = {};
    LANGUAGES.forEach(l => MODULES.forEach(m => { init[`${l.code}:${m}`] = 'loading'; }));
    setGenStatus(init);

    await Promise.allSettled(
      LANGUAGES.flatMap(lang =>
        MODULES.map(async mod => {
          const key = `${lang.code}:${mod}`;
          try {
            const res = await fetch(`${API}/content/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-key': KEY },
              body: JSON.stringify({
                userId: 'system',
                languageCode: lang.code,
                module: mod,
                examType: lang.examType,
              }),
            });
            setGenStatus(prev => ({ ...prev, [key]: res.ok ? 'done' : 'error' }));
          } catch {
            setGenStatus(prev => ({ ...prev, [key]: 'error' }));
          }
        })
      )
    );

    setGenerating(false);
    load(true);
  };

  const TYPES = ['', 'writing_prompt', 'reading', 'listening', 'vocab', 'grammar'];
  const isGenerating = generating || Object.values(genStatus).some(s => s === 'loading');

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Content Library</Text>
        <Text style={s.count}>{total}</Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
      >
        {/* Generate button */}
        <TouchableOpacity
          style={[s.genBtn, isGenerating && s.genBtnDisabled]}
          onPress={handleGenerate}
          activeOpacity={0.85}
          disabled={isGenerating}
        >
          {isGenerating
            ? <ActivityIndicator size="small" color={Colors.white} />
            : <RefreshIcon size={18} color={Colors.white} />
          }
          <Text style={s.genBtnText}>
            {isGenerating ? 'Generating…' : "Generate Today's Content"}
          </Text>
        </TouchableOpacity>

        {/* Generation progress */}
        {Object.keys(genStatus).length > 0 && (
          <View style={s.genProgress}>
            <Text style={s.genProgressTitle}>GENERATION PROGRESS</Text>
            <View style={g.moduleLabels}>
              {MODULES.map(m => (
                <View key={m} style={g.dot}>
                  <Text style={g.modLabel}>{m.slice(0, 3).toUpperCase()}</Text>
                </View>
              ))}
            </View>
            {LANGUAGES.map(lang => (
              <GenRow key={lang.code} lang={lang} status={genStatus} />
            ))}
          </View>
        )}

        {/* Filters */}
        <View style={s.filtersWrap}>
          {/* Language filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
            {['', ...LANGUAGES.map(l => l.code)].map(code => {
              const active = langFilter === code;
              const lang = LANGUAGES.find(l => l.code === code);
              return (
                <TouchableOpacity
                  key={code || 'all'}
                  style={[s.pill, active && s.pillActive]}
                  onPress={() => setLangFilter(code)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.pillText, active && s.pillTextActive]}>
                    {code ? `${lang?.flag} ${lang?.name}` : 'All languages'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Type filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
            {TYPES.map(t => {
              const active = typeFilter === t;
              return (
                <TouchableOpacity
                  key={t || 'all'}
                  style={[s.pill, active && s.pillActive]}
                  onPress={() => setTypeFilter(t)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.pillText, active && s.pillTextActive]}>
                    {t ? t.replace('_', ' ') : 'All types'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Library items */}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.p} style={{ marginTop: 40 }} />
        ) : items.length === 0 ? (
          <Text style={s.empty}>No content yet. Hit "Generate Today's Content" to fill the library.</Text>
        ) : (
          <View style={s.list}>
            {items.map(item => <LibraryRow key={item.id} item={item} />)}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Row styles ─────────────────────────────────────────────────────
const r = StyleSheet.create({
  row: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start',
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  flag:      { fontSize: 22 },
  info:      { flex: 1, gap: 5 },
  infoTop:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBadge: { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  typeText:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 },
  date:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink4 },
  title:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink, lineHeight: 18 },
});

// ── Generate progress styles ───────────────────────────────────────
const g = StyleSheet.create({
  row:          { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  flag:         { fontSize: 18 },
  name:         { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink, width: 70 },
  dots:         { flexDirection: 'row', gap: 4 },
  dot:          { width: 28, height: 22, borderRadius: 4, alignItems: 'center', justifyContent: 'center' },
  dotText:      { fontFamily: 'Inter_700Bold', fontSize: 12 },
  moduleLabels: { flexDirection: 'row', gap: 4, marginLeft: 80, marginBottom: 6 },
  modLabel:     { fontFamily: 'Inter_500Medium', fontSize: 9, color: Colors.ink3 },
});

// ── Screen styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 16, gap: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  back:  { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  count: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink3 },
  genBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    height: 52, backgroundColor: Colors.p, borderRadius: 14,
  },
  genBtnDisabled: { opacity: 0.6 },
  genBtnText:     { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
  genProgress: {
    backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 16,
  },
  genProgressTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 10 },
  filtersWrap: { gap: 8 },
  filters:     { flexDirection: 'row', gap: 8 },
  pill:        { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  pillActive:  { backgroundColor: Colors.p, borderColor: Colors.p },
  pillText:    { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink2 },
  pillTextActive: { color: Colors.white },
  list:  { borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center', marginTop: 40, lineHeight: 22, paddingHorizontal: 20 },
});
