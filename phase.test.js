const esmRequire = require('esm')(module)
const { createRoutes } = esmRequire('./src/routes.js')

describe('generates route file', () => {
    test('creates a basic routes example file', () => {
      expect(createRoutes([{
        name: 'TestPage',
        prefix: '',
        componentName: "TestComponent",
        file_path: 'test/TestComponent.js'
      }], {
          unauthorized: 'LoginPage'
      })).toBe(`import TestComponent from '../../../test/TestComponent.js'

const redirects = undefined

const phaseBeforeEnter = async (to, from, next) => {
  try {
    // retrieve data from controller
    const { request } = await axios.get(to.fullPath)

    // check for server side redirects
    const finalUrl = new URL(request.responseURL).pathname

    // follow redirects (if any)
    if (to.path !== finalUrl) {
      return next({
        path: finalUrl,
        query: { redirect: to.fullPath }
      })
    }

    // proceed to next page as usual
    return next()

  } catch (err) {
    if (err && err.response && err.response.status && redirects[err.response.status]) {
      return next({
        name: redirects[err.response.status],
        query: { redirect: to.fullPath }
      })
    }
  }
}

export default [
  {
    name: 'TestPage',
    path: 'undefined',
    beforeEnter: phaseBeforeEnter,
    component: TestComponent
  }]`);
      });
})
