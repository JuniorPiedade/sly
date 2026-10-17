/* ==========================================
   MÓDULO SUPABASE — ISLY.ME
   Login, cadastro, recuperação de senha e métricas
========================================== */

(function () {
  'use strict';

  const SUPABASE_URL =
    'https://hmnuafaihsbvzejqsakt.supabase.co';

  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtbnVhZmFpaHNidnplanFzYWt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE2NjIzODEsImV4cCI6MjEwNzIzODM4MX0.N83_jt4K0ypcls6zW8_J8tLzwFmKuGxshqMsagwszcU';

  let client = null;

  function initSupabase() {
    if (client) return client;

    if (
      window.supabase &&
      typeof window.supabase.createClient === 'function'
    ) {
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
    } else {
      console.error('Biblioteca Supabase não carregada.');
    }

    return client;
  }

  function getRedirectUrl(path) {
    return new URL(path, window.location.origin).href;
  }

  window.islySupabase = {
    get client() {
      return initSupabase();
    },

    async getUser() {
      const sb = initSupabase();
      if (!sb) return null;

      try {
        const { data, error } = await sb.auth.getUser();
        if (error) return null;
        return data.user || null;
      } catch (error) {
        console.error('Erro ao consultar usuário:', error);
        return null;
      }
    },

    
async getProfileById(userId) {
  const sb = initSupabase();

  if (!sb) {
    alert('Diagnóstico SLYE: cliente Supabase não inicializado.');
    return null;
  }

  try {
    const { data, error } = await sb
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil:', error);

      alert(
        'Diagnóstico SLYE — falha ao carregar o perfil.\n\n' +
        'Código: ' + (error.code || 'não informado') + '\n' +
        'Mensagem: ' + (error.message || 'sem detalhes') + '\n\n' +
        'Nenhum dado foi alterado.'
      );

      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);

    alert(
      'Diagnóstico SLYE: ocorreu um erro inesperado ao buscar o perfil.'
    );

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
        console.error('Erro ao buscar identificador:', error);
        return null;
      }
    },

    // INCREMENTAR HYPE (PERSISTÊNCIA DE LIKES)
    async incrementHype(profileId, currentHypes) {
      const sb = initSupabase();
      if (!sb || !profileId) return null;

      try {
        const newHypeCount = (parseInt(currentHypes, 10) || 0) + 1;
        const { data, error } = await sb
          .from('profiles')
          .update({ hypes: newHypeCount })
          .eq('id', profileId)
          .select('hypes')
          .single();

        if (error) throw error;
        return data?.hypes ?? newHypeCount;
      } catch (error) {
        console.error('Erro ao incrementar hype:', error);
        return null;
      }
    },

    async saveProfile(payload) {
      const sb = initSupabase();
      if (!sb) return 'Cliente Supabase indisponível.';

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

    // CADASTRO COM E-MAIL E SENHA
    async signUp(email, password) {
      const sb = initSupabase();

      if (!sb) {
        return { error: 'Cliente Supabase indisponível.' };
      }

      try {
        const { data, error } = await sb.auth.signUp({
          email: String(email || '').trim(),
          password,
          options: {
            emailRedirectTo: getRedirectUrl('/index.html')
          }
        });

        if (error) return { error: error.message };

        if (data.session) {
          return {
            error: null,
            message: 'Conta criada! Entrando no ISLY.ME...',
            loggedIn: true
          };
        }

        return {
          error: null,
          message:
            'Cadastro iniciado! Confira seu e-mail para confirmar a conta.',
          loggedIn: false
        };
      } catch (error) {
        console.error('Erro no cadastro:', error);
        return {
          error: error.message || 'Não foi possível criar a conta.'
        };
      }
    },

    // LOGIN COM E-MAIL E SENHA
    async signInWithPassword(email, password) {
      const sb = initSupabase();

      if (!sb) {
        return { error: 'Cliente Supabase indisponível.' };
      }

      try {
        const { error } = await sb.auth.signInWithPassword({
          email: String(email || '').trim(),
          password
        });

        if (error) {
          if (error.message === 'Invalid login credentials') {
            return {
              error: 'E-mail ou senha incorretos.'
            };
          }

          return { error: error.message };
        }

        return { error: null };
      } catch (error) {
        console.error('Erro no login:', error);
        return {
          error: error.message || 'Não foi possível entrar.'
        };
      }
    },

    // RECUPERAÇÃO DE SENHA
    async sendPasswordReset(email) {
      const sb = initSupabase();

      if (!sb) {
        return { error: 'Cliente Supabase indisponível.' };
      }

      try {
        const { error } = await sb.auth.resetPasswordForEmail(
          String(email || '').trim(),
          {
            redirectTo: getRedirectUrl('/reset-password.html')
          }
        );

        if (error) return { error: error.message };

        return {
          error: null,
          message:
            'Se o endereço estiver cadastrado, você receberá as instruções de recuperação por e-mail.'
        };
      } catch (error) {
        console.error('Erro ao solicitar recuperação:', error);
        return {
          error: error.message || 'Não foi possível solicitar a recuperação.'
        };
      }
    },

    // SALVAR A NOVA SENHA APÓS ABRIR O LINK DE RECUPERAÇÃO
    async updatePassword(password) {
      const sb = initSupabase();

      if (!sb) {
        return { error: 'Cliente Supabase indisponível.' };
      }

      try {
        const { data, error: sessionError } =
          await sb.auth.getSession();

        if (sessionError) {
          return { error: sessionError.message };
        }

        if (!data.session) {
          return {
            error:
              'Sua sessão de recuperação não está ativa. Solicite um novo link.'
          };
        }

        const { error } = await sb.auth.updateUser({
          password
        });

        if (error) return { error: error.message };

        return { error: null };
      } catch (error) {
        console.error('Erro ao atualizar senha:', error);
        return {
          error: error.message || 'Não foi possível atualizar a senha.'
        };
      }
    },

    async uploadMedia(filePath, file) {
      const sb = initSupabase();
      if (!sb) return 'Cliente Supabase indisponível.';

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
        return error.message || 'Erro ao enviar arquivo.';
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
    }
  };

  initSupabase();
})();
