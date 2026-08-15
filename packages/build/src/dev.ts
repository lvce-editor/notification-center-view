import { execa } from 'execa'

const root = new URL('../../..', import.meta.url).pathname

execa('npm', ['run', 'build:watch'], {
  cwd: root,
  stdio: 'inherit',
})

execa('node', ['node_modules/@lvce-editor/server/bin/server.js', '--test-path=packages/e2e'], {
  cwd: root,
  stdio: 'inherit',
})
