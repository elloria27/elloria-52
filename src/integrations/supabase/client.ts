// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nzgqxbvudlbonwttootn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56Z3F4YnZ1ZGxib253dHRvb3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNDc5MTQsImV4cCI6MjA1MjkyMzkxNH0.YWjYa-P0sQG4jFI4XScYQsng1mZikwChuC4w5tEwSL0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);