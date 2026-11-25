import i18n from '@/modules/common/config/i18n'
import { storePreferences } from '@/modules/common/services/preferences'
import type { Preferences } from '@/modules/common/types/Preferences'

export const applyPreferences = async (value: Preferences): Promise<void> => {
  await i18n.changeLanguage(value.language)
  storePreferences(value)
}
