import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = 'https://walhpjrdohyawpyoexsp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhbGhwanJkb2h5YXdweW9leHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTg0MDIsImV4cCI6MjA5MjgzNDQwMn0.4GiWOloyuZpTE553dW0VIk557YUBXdilmrYUB_Z6b8c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const PROGRESS_ROW_ID = "nitin-foundation-tracker";