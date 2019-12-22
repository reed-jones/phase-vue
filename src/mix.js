import VueRouterAutoloadPlugin from './webpack-plugin';

export default mix => {

  class PhaseRoutes {

    name() {
      return "phaseRoutes";
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
};
