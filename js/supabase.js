// ==========================================
// MÓDULO DE INTEGRAÇÃO SUPABASE (NATIVO FETCH) — ISLY.ME
// ==========================================
(function() {
  const SUPABASE_URL = 'https://hmnuafaihsbvzejqsakt.supabase.co'.trim();
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbnVhZmFpaHNidnplanFzYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NjIzODEsImV4cCI6MjEwNzIzODM4MX0.N83_jt4K0ypcls6zW8_J8tLzwFmKuGxshqMsagwszcU'.trim();

  let client = null;

  function initSupabase() {
    if (client) return client;
    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
          auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
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

    // LOGIN VIA FETCH NATIVO (Isola completamente o SDK e mostra o erro real)
    async signIn(email) {
      try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            email: email.trim(),
            create_user: true,
            gotrue_meta_security: {},
            options: {
              emailRedirectTo: 'https://sly-inky.vercel.app/landing'
            }
          })
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          return errData.msg || errData.error_description || `Erro HTTP ${response.status}: Falha na autenticação.`;
        }

        return null; // Sucesso absoluto
      } catch (err) {
        return 'Falha de rede ao contactar o Supabase. Verifique extensões do browser ou bloqueadores.';
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
