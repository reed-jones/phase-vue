import * as fs from 'fs'
import * as path from 'path'
import { execSync } from 'child_process';
import { createRoutes } from './routes'

function generateRoutes(options) { // there are no options

    const output = JSON.parse(execSync('php artisan phase:routes --json').toString());

    const routes = output.map(r => {
        let uri = r.uri.startsWith('/') ? r.uri : `/${r.uri}`;
        return {
            name: r.controller,
            path: uri.replace(/{(.*?)}/g, ":$1"),
            specifier: r.controller.split('@')[1],
            component: `../../resources/js/pages/${r.controller.replace('@', '/')}.vue`
        }
    })

    const missing = routes.filter(r => !fs.existsSync(r.component))

    if (missing.length) {
        for (let route of notYet) {
            // generate template component
            fs.writeFileSync(route.component, `
<template>
    <h1>Welcome to: ${route.name}</h1>
</template>

<script>
export default {
    //
}
</script>

<style lang="scss">
//
</style>
`)
        }
    }

    return createRoutes(routes);
}

const pluginName = 'VueRouterAutoloadPlugin'

export default class VueRouterAutoloadPlugin {
  constructor(options) {
    this.options = options
  }

  apply(compiler) {
    const generate = () => {
      const code = generateRoutes(this.options)
      const to = path.resolve(__dirname, '../routes.js')

      if (
        fs.existsSync(to) &&
        fs.readFileSync(to, 'utf8').trim() === code.trim()
      ) {
        return
      }

      fs.writeFileSync(to, code)
    }

    compiler.hooks.run.tap(pluginName, generate)
    compiler.hooks.watchRun.tap(pluginName, generate)
  }
}
