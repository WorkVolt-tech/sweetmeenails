// Depends on config.js and the Supabase UMD script both being loaded
// first (see the <script> order in each page's <head>).
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
