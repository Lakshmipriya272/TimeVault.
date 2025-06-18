import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          estimated_pomodoros: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          estimated_pomodoros?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          estimated_pomodoros?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      pomodoro_sessions: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          session_type: 'focus' | 'short_break' | 'long_break';
          planned_duration: number;
          actual_duration: number | null;
          started_at: string;
          ended_at: string | null;
          completed: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          session_type: 'focus' | 'short_break' | 'long_break';
          planned_duration: number;
          actual_duration?: number | null;
          started_at?: string;
          ended_at?: string | null;
          completed?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          task_id?: string | null;
          session_type?: 'focus' | 'short_break' | 'long_break';
          planned_duration?: number;
          actual_duration?: number | null;
          started_at?: string;
          ended_at?: string | null;
          completed?: boolean;
        };
      };
    };
  };
};