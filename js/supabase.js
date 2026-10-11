// ==========================================
// MÓDULO DE INTEGRAÇÃO SUPABASE — ISLY.ME
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
        const { data: { session } } = await sb.auth.getSession();
        if (session && session.user) return session.user;

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

    async getProfileByHandle(handle) {
      const sb = initSupabase();
      if (!sb) return null;
      try {
        const cleanHandle = String(handle).trim().replace(/^@/, '');
        const { data, error } = await sb.from('profiles').select('*').ilike('handle', cleanHandle).single();
        return error ? null : data;
      } catch (e) {
        return null;
      }
    },

    async saveProfile(payload) {
      const sb = initSupabase();
      if (!sb) return 'Cliente Supabase indisponível.';
      try {
        if (payload.handle) {
          payload.handle = payload.handle.trim().replace(/^@/, '');
        }
        const { error } = await sb.from('profiles').upsert(payload);
        return error ? error.message : null;
      } catch (e) {
        return e.message;
      }
    },

    async uploadMedia(filePath, file) {
      const sb = initSupabase();
      if (!sb) return 'Cliente Supabase indisponível.';
      try {
        const { error } = await sb.storage.from('media').upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        return error ? error.message : null;
      } catch (err) {
        return err.message || 'Erro ao enviar ficheiro.';
      }
    },

    getPublicUrl(filePath) {
      const sb = initSupabase();
      if (!sb) return '';
      const { data } = sb.storage.from('media').getPublicUrl(filePath);
      return data ? data.publicUrl : '';
    },

    // LOGIN VIA FETCH NATIVO (Isola o SDK e evita qualquer Failed to fetch interno)
   
async signIn(email) {
  const sb = initSupabase();

  if (!sb) {
    return 'O módulo Supabase não foi carregado. Atualize a página e tente novamente.';
  }

  const cleanEmail = String(email || '').trim();

  if (!cleanEmail) {
    return 'Informe seu e-mail.';
  }

  try {
    const redirectUrl = new URL(
      '/index.html',
      window.location.origin
    ).href;

    const { error } = await sb.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        emailRedirectTo: redirectUrl,
        shouldCreateUser: true
      }
    });

    if (error) {
      console.error('Erro no login Supabase:', error);
      return error.message || 'Não foi possível enviar o link de acesso.';
    }

    return null;

  } catch (error) {
    console.error('Erro inesperado no login:', error);

    
    return 'Falha ao solicitar o login. Confira o console do navegador.';
  }
};

initSupabase();
})();
