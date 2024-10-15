import { createTamagui } from 'tamagui';
import { config } from '@tamagui/config/v3';

const appConfig = createTamagui(config);

export type AppConfig = typeof appConfig;
export default appConfig;
