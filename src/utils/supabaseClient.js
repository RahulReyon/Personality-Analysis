import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://floxnhixvnghszzolhng.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsb3huaGl4dm5naHN6em9saG5nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNTA0NDUsImV4cCI6MjA2MTkyNjQ0NX0.cr-nXzrSD3T4EwQ4qpTcjFQA8vMOGKmL_TQQeL5JTUA'  
export const supabase = createClient(supabaseUrl, supabaseKey)
