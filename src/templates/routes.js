
export const routeCodeGen = (imports, code, config) => `${imports}

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
      next({ name: '${config.unauthorized}' })
    }
  }
}

export default [${code}]`
