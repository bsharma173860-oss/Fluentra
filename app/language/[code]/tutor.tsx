import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView,
  Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Colors } from '@/constants/colors';
import { getLangNames } from '@/constants/languages';
import { ChevronLeftIcon, ArrowUpIcon } from '@/components/icons';

// ── Types ─────────────────────────────────────────────────────────
type Role = 'user' | 'assistant';
type Message = { id: string; role: Role; text: string };

// ── Starter prompts ───────────────────────────────────────────────
const STARTERS = [
  'Help me practice for IELTS speaking',
  'Correct my grammar',
  'Teach me new vocabulary',
  'Explain a grammar rule',
];

// ── Fluentra avatar (AI) ──────────────────────────────────────────
function AIAvatar() {
  return (
    <View style={av.wrap}>
      <Text style={av.letter}>F</Text>
    </View>
  );
}
const av = StyleSheet.create({
  wrap: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2, flexShrink: 0,
  },
  letter: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
});

// ── Message bubble ────────────────────────────────────────────────
function MessageBubble({ msg }: { msg: Message }) {
  if (msg.role === 'user') {
    return (
      <View style={mb.userRow}>
        <View style={mb.userBubble}>
          <Text style={mb.userText}>{msg.text}</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={mb.aiRow}>
      <AIAvatar />
      <Text style={mb.aiText}>{msg.text}</Text>
    </View>
  );
}
const mb = StyleSheet.create({
  userRow:   { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 12 },
  userBubble:{
    backgroundColor: Colors.white,
    borderRadius: 18, borderBottomRightRadius: 4,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 10,
    maxWidth: '75%',
  },
  userText:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, lineHeight: 22 },
  aiRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingHorizontal: 16, marginBottom: 16 },
  aiText:    { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, lineHeight: 24, flex: 1 },
});

// ── Screen ────────────────────────────────────────────────────────
export default function TutorScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const langCode  = code ?? 'en';
  const names     = getLangNames(langCode);

  const [messages,  setMessages]  = useState<Message[]>([]);
  const [input,     setInput]     = useState('');
  const [responding, setResponding] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || responding) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setResponding(true);

    // Scroll to bottom
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);

    // Simulate AI response (replace with actual API call)
    await new Promise(r => setTimeout(r, 1200));
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: `That's a great question about ${names.english}! I'm your AI Tutor. Connect me to an LLM endpoint to get real responses.`,
    };
    setMessages(prev => [...prev, aiMsg]);
    setResponding(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }, [responding, names.english]);

  const isEmpty = messages.length === 0;

  return (
    <AppLayout languageCode={langCode}>
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* ── Top bar ── */}
      <View style={s.topBar}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={16} color={Colors.ink2} />
        </TouchableOpacity>
        <View style={s.topCenter}>
          <View style={s.topTitleRow}>
            <Text style={s.topTitle}>AI Tutor</Text>
            <View style={s.topFlagWrap}>
              <Text style={s.topFlag}>{names.flag}</Text>
            </View>
          </View>
          <Text style={s.topSub}>{names.english} · Free conversation</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ── Chat area ── */}
        <ScrollView
          ref={scrollRef}
          style={s.chatArea}
          contentContainerStyle={[s.chatContent, isEmpty && s.chatContentEmpty]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
        >
          {isEmpty ? (
            <View style={s.emptyState}>
              <View style={s.emptyAvatar}>
                <Text style={s.emptyAvatarText}>F</Text>
              </View>
              <Text style={s.emptyTitle}>AI Tutor</Text>
              <Text style={s.emptySub}>
                Practice {names.english} through natural conversation. Ask questions, get corrections, or explore new vocabulary.
              </Text>
            </View>
          ) : (
            messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)
          )}
          {responding && (
            <View style={mb.aiRow}>
              <AIAvatar />
              <ActivityIndicator size="small" color={Colors.ink3} style={{ marginTop: 4 }} />
            </View>
          )}
        </ScrollView>

        {/* ── Starter chips (empty state only) ── */}
        {isEmpty && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.starterRow}
            style={s.starterScroll}
          >
            {STARTERS.map(text => (
              <TouchableOpacity
                key={text}
                style={s.starterChip}
                onPress={() => sendMessage(text)}
                activeOpacity={0.75}
              >
                <Text style={s.starterText}>{text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Input bar ── */}
        <View style={s.inputBar}>
          <View style={s.inputWrap}>
            <TextInput
              style={s.input}
              value={input}
              onChangeText={setInput}
              placeholder={`Message AI Tutor…`}
              placeholderTextColor={Colors.ink3}
              multiline
              maxLength={2000}
              returnKeyType="default"
              editable={!responding}
            />
            <TouchableOpacity
              style={[s.sendBtn, (!input.trim() || responding) && s.sendBtnDisabled]}
              onPress={() => sendMessage(input)}
              disabled={!input.trim() || responding}
              activeOpacity={0.85}
            >
              <ArrowUpIcon size={16} color={Colors.white} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:     { flex: 1, backgroundColor: Colors.bg },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  topCenter:   { flex: 1, gap: 2 },
  topTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  topFlagWrap: { width: 22, height: 14, borderRadius: 3, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  topFlag:     { fontSize: 11 },
  topSub:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  // Chat
  chatArea:        { flex: 1 },
  chatContent:     { paddingTop: 16, paddingBottom: 8 },
  chatContentEmpty:{ flex: 1, justifyContent: 'center', paddingHorizontal: 32, paddingTop: 40 },

  // Empty state
  emptyState:       { alignItems: 'center', gap: 12 },
  emptyAvatar:      { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center' },
  emptyAvatarText:  { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: Colors.white },
  emptyTitle:       { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: Colors.ink },
  emptySub:         { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center', lineHeight: 22 },

  // Starters
  starterScroll: { flexShrink: 0, marginBottom: 8 },
  starterRow:    { paddingHorizontal: 16, gap: 8, paddingBottom: 4 },
  starterChip: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  starterText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2 },

  // Input bar
  inputBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
    padding: 12,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'flex-end',
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.borderStrong,
    paddingLeft: 16, paddingRight: 8, paddingVertical: 8, gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.ink,
    minHeight: 28, maxHeight: 120, lineHeight: 22,
    paddingVertical: 0,
  },
  sendBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  sendBtnDisabled: { backgroundColor: Colors.bg2 },
});
