import config from '@lvce-editor/eslint-config'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  ...config,
  {
    // The application runtime has its own Node version in the pinned checkout.
    files: ['.github/workflows/integration.yml'],
    rules: { 'github-actions/node-version-file': 'off' },
  },
])
