import {cloudflareTest} from '@cloudflare/vitest-plugin';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins:[cloudflareTest({wrangler:{configPath:'./wrangler.jsonc'}})],
  test:{
    include:['test/hibernation-workers.spec.mjs'],
    testTimeout:20000
  }
});
