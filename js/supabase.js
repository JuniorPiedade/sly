async signIn(email) {
      const sb = initSupabase();
      if (!sb) return 'Cliente Supabase não inicializado.';
      try {
        const { error } = await sb.auth.signInWithOtp({ 
          email: email.trim(),
          options: {
            emailRedirectTo: String('https://sly-inky.vercel.app/landing').trim()
          }
        });
        return error ? error.message : null;
      } catch (e) {
        return e.message;
      }
    },
