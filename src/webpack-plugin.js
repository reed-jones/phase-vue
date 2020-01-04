import * as path from "path";
import { writeCodeToFile, generateRoutes } from "./utils";

const pluginName = "VueRouterAutoloadPlugin";

export default class VueRouterAutoloadPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    const generate = () => {
      const code = generateRoutes(this.options);
      const to = path.resolve(__dirname, "../routes.js");
      writeCodeToFile(to, code);
    };

    compiler.hooks.run.tap(pluginName, generate);
    compiler.hooks.watchRun.tap(pluginName, generate);
  }
}
