// ==========================================
// MÓDULO DE INTEGRAÇÃO SUPABASE — ISLY.ME
// ==========================================
(function() {
  const SUPABASE_URL = 'https://hmnuafaihsbvjejqsakt.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbnVhZmFpaHNidnplanFzYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NjIzODEsImV4cCI6MjEwNzIzODM4MX0.N83_jt4K0ypcls6zW8_J8tLzwFmKuGxshqMsagwszcU';

  let client = null;
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn("Erro ao iniciar Supabase client:", e);
    }
  }

  window.islySupabase = {
    async getUser() {
      if (!client) return null;
      try {
        const { data: { user } } = await client.auth.getUser();
        return user;
      } catch (e) {
        return null;
      }
    },

    async getProfileById(userId) {
      if (!client) return null;
      try {
        const { data, error } = await client.from('profiles').select('*').eq('id', userId).single();
        return error ? null : data;
      } catch (e) {
        return null;
      }
    },

    async getProfileByHandle(handle) {
      if (!client) return null;
      try {
        const { data, error } = await client.from('profiles').select('*').eq('handle', handle).single();
        return error ? null : data;
      } catch (e) {
        return null;
      }
    },

    async saveProfile(payload) {
      if (!client) return 'Cliente Supabase indisponível.';
      try {
        const { error } = await client.from('profiles').upsert(payload);
        return error ? error.message : null;
      } catch (e) {
        return e.message;
      }
    },

    async signIn(email) {
      if (!client) return 'Cliente indisponível.';
      try {
        const { error } = await client.auth.signInWithOtp({ 
          email,
          options: {
            emailRedirectTo: 'https://sly-inky.vercel.app/index.html'
          }
        });
        return error ? error.message : null;
      } catch (e) {
        return e.message;
      }
    },

    async signOut() {
      if (!client) return;
      try { await client.auth.signOut(); } catch (e) {}
    }
  };
})();
