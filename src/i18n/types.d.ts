import type messages from '../../messages/zh.json';
import type { Locale } from './routing';

declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale;
    Messages: typeof messages;
  }
}
