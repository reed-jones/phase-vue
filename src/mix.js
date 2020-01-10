import VueRouterAutoloadPlugin from "./webpack-plugin";
import { artisan } from "./utils";
import mix from "laravel-mix";

export default class PhaseRoutes {
  name() {
    return "phase";
  }

  dependencies() {
    return ['@vuexcellent/vuex'];
}

  /**
   * Register the component.
   *
   * When your component is called, all user parameters
   * will be passed to this method.
   *
   * Ex: register(src, output) {}
   * Ex: mix.yourPlugin('src/path', 'output/path');
   *
   * @param  {*} ...params
   * @return {void}
   *
   */
  register(options = {}) {
    // get the phase:routes JSON output
    const output = artisan("phase:routes --json --config");

    output.config.assets.js.forEach(script => {
      mix.js(`resources/${script}`, "public/js");
    })

    output.config.assets.sass.forEach(style => {
      mix.sass(`resources/${style}`, "public/css");
    })

    this.options = options;
  }

  /*
   * Plugins to be merged with the master webpack config.
   *
   * @return {Array|Object}
   */
  webpackPlugins() {
    return new VueRouterAutoloadPlugin(this.options);
  }
}

mix.extend("phaseRoutes", new PhaseRoutes());
