import type { SupabaseClient } from '@supabase/supabase-js'
import { Profile } from '@/modules/account/adapters/Profile'

export class ProfileApi {
  constructor(private readonly client: SupabaseClient) {}

  async load(id: string, signal: AbortSignal): Promise<Profile> {
    const { data, error } = await this.client.from('profiles')
      .select('name, telegram_username, theme, language').eq('id', id)
      .abortSignal(signal).maybeSingle()
    if (error) throw error
    return Profile.fromRaw(data)
  }

  async save(id: string, profile: Profile): Promise<Profile> {
    const { data, error } = await this.client.from('profiles')
      .upsert({ id, ...profile.toRaw() }, { onConflict: 'id' })
      .select('name, telegram_username, theme, language').single()
    if (error) throw error
    return Profile.fromRaw(data)
  }
}
