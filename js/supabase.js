// ==========================================
// MÓDULO DE INTEGRAÇÃO SUPABASE — ISLY.ME
// ==========================================
(function() {
  // Limpeza rigorosa de espaços para evitar erros de fetch por URL corrompido
  const SUPABASE_URL = 'https://hmnuafaihsbvjejqsakt.supabase.co'.trim();
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbnVhZmFpaHNidnplanFzYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NjIzODEsImV4cCI6MjEwNzIzODM4MX0.N83_jt4K0ypcls6zW8_J8tLzwFmKuGxshqMsagwszcU'.trim();

  let client = null;

  function initSupabase() {
    if (client) return client;

    if (window.supabase && typeof window.supabase.createClient === 'function') {
      try {
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log("🟢 Supabase Client inicializado com sucesso.");
      } catch (e) {
        console.error("🔴 Erro crítico ao criar cliente Supabase:", e);
      }
    } else {
      console.warn("⚠️ Biblioteca global do Supabase ainda não está disponível.");
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
        console.error("Erro ao obter utilizador:", e.message);
        return null;
      }
    },

    async signIn(email) {
      const sb = initSupabase();
      if (!sb) {
        return "Erro crítico: Cliente Supabase não foi inicializado. Verifique a ligação ao CDN.";
      }
      
      try {
        console.log("🔄 A enviar Magic Link para:", email);
        const { error } = await sb.auth.signInWithOtp({ 
          email: email.trim(),
          options: {
            emailRedirectTo: 'https://sly-inky.vercel.app/index.html'
          }
        });

        if (error) {
          console.error("🔴 Erro retornado pelo Supabase Auth:", error);
          return error.message;
        }

        console.log("🟢 Magic link enviado com sucesso!");
        return null; // Sem erros
      } catch (e) {
        console.error("🔴 Exceção de rede capturada (Failed to fetch):", e);
        return e.message || "Erro de ligação à rede (Failed to fetch). Verifique o seu bloqueador de anúncios ou consola.";
      }
    },

    async signOut() {
      const sb = initSupabase();
      if (!sb) return;
      try { await sb.auth.signOut(); } catch (e) {}
    }
  };

  // Tentar inicializar logo ao carregar o script
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSupabase);
  } else {
    initSupabase();
  }
})();
