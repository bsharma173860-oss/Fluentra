import { supabase } from './supabase';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '/api';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  token?: string;
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, token } = options;

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: reqHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(`API ${method} ${path} failed [${res.status}]: ${error}`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

// ── Rate limiting ────────────────────────────────────────────────

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  plan: string;
  usage?: number;
  limit?: number;
};

export async function checkRateLimit(module: string): Promise<RateLimitResult> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { allowed: false, remaining: 0, plan: 'free' };

    return await api.post<RateLimitResult>('/rate/check', {
      userId: user.id,
      module,
    });
  } catch {
    // Fail open — don't block the user if the API is unreachable
    return { allowed: true, remaining: 1, plan: 'free' };
  }
}

export async function incrementUsage(module: string): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await api.post('/rate/increment', { userId: user.id, module });
  } catch (e) {
    console.error('incrementUsage error:', e);
  }
}

// ── Writing grading ──────────────────────────────────────────────

export type GradeWritingParams = {
  essay: string;
  taskType: string;
  examType: string;
  prompt?: string;
  languageCode?: string;
};

export type GradeWritingResult = {
  overall: number;
  task_achievement: number;
  coherence: number;
  lexical_resource: number;
  grammar: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  corrections: { original: string; correction: string; explanation: string }[];
};

export async function gradeWriting(params: GradeWritingParams): Promise<GradeWritingResult> {
  const { data: { user } } = await supabase.auth.getUser();

  return await api.post<GradeWritingResult>('/grade/writing', {
    userId: user?.id,
    ...params,
  });
}
