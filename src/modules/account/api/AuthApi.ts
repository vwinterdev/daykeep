import type { SupabaseClient } from '@supabase/supabase-js'

export class AuthApi {
  constructor(private readonly client: SupabaseClient) {}

  async signIn(email: string, password: string): Promise<void> {
    const { error } = await this.client.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut({ scope: 'local' })
    if (error) throw error
  }
}
