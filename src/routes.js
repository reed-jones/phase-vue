import { routeCodeGen } from "./templates/routes";

const createImport = (dynamic, chunkNamePrefix) => route => {
  const preparedImport = createImport(dynamic, chunkNamePrefix);
  const { name, prefix, componentName, file_path } = route;
  const webpackChunkName = `${chunkNamePrefix}${prefix || name}`;
  const code = dynamic
    ? `const ${name} = () => import(/* webpackChunkName: "${webpackChunkName}" */ '${name}')`
    : `import ${componentName} from '../../../${file_path}'`;

  return route.children
    ? [code].concat(route.children.map(preparedImport)).join("\n")
    : code;
};

function createRoute(config) {
  return function(route) {
    // If default child is exists, the route should not have a name.
    const routeName =
      route.children && route.children.some(m => m.file_path === "")
        ? ""
        : `name: '${route.name}'`;

    const routePath = `path: '${route.uri}'`;

    const routeBeforeEnter = `beforeEnter: phaseBeforeEnter`;

    const routeComponent = `component: ${route.componentName}`;

    const routeMeta = !route.middleware
      ? ""
      : `meta: { middleware: ${JSON.stringify(route.middleware.split(","))} }`;

    const routeChildren = !route.children
      ? ""
      : `children: [${children.map(createRoute(config)).join(",")}]`;

    return `
  {
    ${[
      routeName,
      routePath,
      routeBeforeEnter,
      routeComponent,
      routeMeta,
      routeChildren
    ]
      .filter(a => a)
      .join(",\n    ")}
  }`;
  };
}

export function createRoutes(
  meta,
  config,
  dynamic = false,
  chunkNamePrefix = ""
) {
  // get partial import
  const preparedImport = createImport(dynamic, chunkNamePrefix);

  // generate import headers
  const imports = meta.map(preparedImport).join("\n");

  // get partial routes
  const configRoute = createRoute(config);

  const code = meta.map(configRoute).join(",");

  return routeCodeGen(imports, code, config);
}
