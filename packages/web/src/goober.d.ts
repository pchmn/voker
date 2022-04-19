// goober.d.t.s

import { MantineTheme } from '@mantine/core';
import 'goober';

declare module 'goober' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends MantineTheme {}
}
