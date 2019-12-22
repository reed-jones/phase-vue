function createChildrenRoute(children) {
  return `,children: [${children.map(createRoute).join(',')}]`
}

function createRoute(meta) {
  const children = !meta.children ? '' : createChildrenRoute(meta.children)

  // If default child is exists, the route should not have a name.
  const routeName =
    meta.children && meta.children.some(m => m.path === '')
      ? ''
      : `name: '${meta.name}',`

  const routeMeta = !meta.routeMeta
    ? ''
    : ',meta: ' + JSON.stringify(meta.routeMeta, null, 2)

  return `
  {
    ${routeName}
    path: '${meta.path}',
    beforeEnter: async (to, from, next) => {
        await axios.get(to.fullPath)
        next()
    },
    component: ${meta.specifier}${routeMeta}${children}
  }`
}

function createImport(
  meta,
  dynamic,
  chunkNamePrefix
) {

  const code = dynamic
    ? `function ${meta.specifier}() { return import(/* webpackChunkName: "${chunkNamePrefix}${meta.name}" */ '${meta.component}') }`
    : `import ${meta.specifier} from '${meta.component}'`

  return meta.children
    ? [code]
        .concat(
          meta.children.map(child =>
            createImport(child, dynamic, chunkNamePrefix)
          )
        )
        .join('\n')
    : code
}

export function createRoutes(
  meta,
  dynamic = false,
  chunkNamePrefix = ''
) {
  const imports = meta
    .map(m => createImport(m, dynamic, chunkNamePrefix))
    .join('\n')
  const code = meta.map(createRoute).join(',')
  return `${imports}\n\nexport default [${code}]`
}
