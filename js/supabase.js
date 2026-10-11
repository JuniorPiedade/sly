
/* ==========================================
   MÓDULO DE INTEGRAÇÃO SUPABASE — ISLY.ME
========================================== */

(function () {
  'use strict';

  const SUPABASE_URL =
    'https://hmnuafaihsbvzejqsakt.supabase.co'.trim();

  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbnVhZmFpaHNidnplanFzYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NjIzODEsImV4cCI6MjEwNzIzODM4MX0.N83_jt4K0ypcls6zW8_J8tLzwFmKuGxshqMsagwszcU'.trim();

  let client = null;

  function initSupabase() {
    if (client) return client;

    if (
      window.supabase &&
      typeof window.supabase.createClient === 'function'
    ) {
      try {
        client = window.supabase.createClient(
          SUPABASE_URL,
          SUPABASE_ANON_KEY,
          {
            auth: {
              persistSession: true,
              autoRefreshToken: true,
              detectSessionInUrl: true
            }
          }
        );
      } catch (error) {
        console.error(
          'Erro ao criar cliente Supabase:',
          error
        );
      }
    } else {
      console.error(
        'Biblioteca Supabase não encontrada. Verifique o carregamento do SDK.'
      );
    }

    return client;
  }

  window.islySupabase = {
    async getUser() {
      const sb = initSupabase();

      if (!sb) return null;

      try {
        const {
          data: { session },
          error
        } = await sb.auth.getSession();

        if (error) throw error;

        if (session && session.user) {
          return session.user;
        }

        const {
          data: { user },
          error: userError
        } = await sb.auth.getUser();

        if (userError) throw userError;

        return user;
      } catch (error) {
        console.error('Erro ao consultar usuário:', error);
        return null;
      }
    },

    async getProfileById(userId) {
      const sb = initSupabase();

      if (!sb) return null;

      try {
        const { data, error } = await sb
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        return data;
      } catch (error) {
        console.error('Erro ao buscar perfil por ID:', error);
        return null;
      }
    },

    async getProfileByHandle(handle) {
      const sb = initSupabase();

      if (!sb) return null;

      try {
        const cleanHandle = String(handle || '')
          .trim()
          .replace(/^@/, '');

        const { data, error } = await sb
          .from('profiles')
          .select('*')
          .ilike('handle', cleanHandle)
          .single();

        if (error) throw error;

        return data;
      } catch (error) {
        console.error(
          'Erro ao buscar perfil por identificador:',
          error
        );

        return null;
      }
    },

    async saveProfile(payload) {
      const sb = initSupabase();

      if (!sb) {
        return 'Cliente Supabase indisponível.';
      }

      try {
        const profile = { ...payload };

        if (profile.handle) {
          profile.handle = profile.handle
            .trim()
            .replace(/^@/, '');
        }

        const { error } = await sb
          .from('profiles')
          .upsert(profile);

        if (error) throw error;

        return null;
      } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        return error.message || 'Não foi possível salvar o perfil.';
      }
    },

    async uploadMedia(filePath, file) {
      const sb = initSupabase();

      if (!sb) {
        return 'Cliente Supabase indisponível.';
      }

      try {
        const { error } = await sb.storage
          .from('media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (error) throw error;

        return null;
      } catch (error) {
        console.error('Erro ao enviar mídia:', error);

        return error.message ||
          'Erro ao enviar ficheiro.';
      }
    },

    getPublicUrl(filePath) {
      const sb = initSupabase();

      if (!sb) return '';

      try {
        const { data } = sb.storage
          .from('media')
          .getPublicUrl(filePath);

        return data?.publicUrl || '';
      } catch (error) {
        console.error('Erro ao obter URL pública:', error);
        return '';
      }
    },

    async signIn(email) {
      const sb = initSupabase();

      if (!sb) {
        return 'Cliente Supabase indisponível. Verifique o carregamento da biblioteca.';
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
          console.error(
            'Erro no login Supabase:',
            error
          );

          return error.message ||
            'Não foi possível enviar o link de acesso.';
        }

        return null;
      } catch (error) {
        console.error(
          'Erro inesperado no login:',
          error
        );

        return 'Falha ao solicitar o login. Confira o console do navegador.';
      }
    }
  };

  // Inicializa o cliente quando a biblioteca está disponível.
  initSupabase();

})();
