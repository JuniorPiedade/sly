// ==========================================
// MÓDULO DE INTEGRAÇÃO SUPABASE — ISLY.ME
// ==========================================
(function() {
  const SUPABASE_URL = 'https://hmnuafaihsbvjejqsakt.supabase.co'.trim();
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbnVhZmFpaHNidnplanFzYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NjIzODEsImV4cCI6MjEwNzIzODM4MX0.N83_jt4K0ypcls6zW8_J8tLzwFmKuGxshqMsagwszcU'.trim();

  let client = null;

  function initSupabase() {
    if (client) return client;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
      } catch (e) {
        console.error("Erro ao criar cliente Supabase:", e);
      }
    }
    return client;
  }

  window.islySupabase = {
    async getUser() {
      const sb = initSupabase();
      if (!sb) return null;
      try {
        const { data: { user }, error } = await sb.auth.getUser();
        if (error) throw error;
        return user;
      } catch (e) {
        return null;
      }
    },

    async getProfileById(userId) {
      const sb = initSupabase();
      if (!sb) return null;
      try {
        const { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
        return error ? null : data;
      } catch (e) {
        return null;
      }
    },

    async saveProfile(payload) {
      const sb = initSupabase();
      if (!sb) return 'Cliente Supabase indisponível.';
      try {
        const { error } = await sb.from('profiles').upsert(payload);
        return error ? error.message : null;
      } catch (e) {
        return e.message;
      }
    },

    async signIn(email) {
      const sb = initSupabase();
      if (!sb) return 'Cliente Supabase não inicializado.';
      
      try {
        // Chamada direta e limpa para o Magic Link
        const { data, error } = await sb.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: 'https://sly-inky.vercel.app/landing'
          }
        });

        if (error) {
          return error.message;
        }
        return null; // Sem erros, sucesso!
      } catch (err) {
        return err.message || 'Erro de conexão ao enviar Magic Link.';
      }
    },

    async signOut() {
      const sb = initSupabase();
      if (!sb) return;
      try { await sb.auth.signOut(); } catch (e) {}
    }
  };

  initSupabase();
})();
