const esmRequire = require('esm')(module)
const { createRoutes } = esmRequire('./src/routes.js')
console.log()
const sum = (a,b) => a + b
describe('it does things', () => {
    test('adds 1 + 2 to equal 3', () => {
      expect(createRoutes([{
        name: 'TestPage',
        prefix: '',
        componentName: "TestComponent",
        file_path: 'test/TestComponent.js'
      }], {
          unauthorized: 'LoginPage'
      })).toBe(`import TestComponent from '../../../test/TestComponent.js'

const phaseBeforeEnter = async (to, from, next) => {
  try {
    // retrieve data from controller
    const { request } = await axios.get(to.fullPath)

    // check for server redirects
    const finalUrl = new URL(request.responseURL).pathname

    // proceed to next stage
    if (to.fullPath === finalUrl) {
      next()
    } else {
      next(finalUrl)
    }
  } catch (err) {
    // unauthenticated
    if (err && err.response && err.response.status === 401) {
      next({ name: 'LoginPage' })
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
