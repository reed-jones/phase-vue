
export const routeCodeGen = (imports, code, config) => `${imports}

const redirects = ${JSON.stringify(config.redirects)}

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

export default [${code}]`
