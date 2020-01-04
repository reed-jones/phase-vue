import { execSync } from "child_process";
import * as fs from "fs";
import fse from "fs-extra";
import { componentSkeleton } from "./templates/component";
import { createRoutes } from "./routes";
import merge from "lodash.merge";

export const fileEqualsCode = (to, code) => {
  const isEqual = (file, code) => {
    return fs.readFileSync(file, "utf8").trim() === code.trim();
  };
  return fs.existsSync(to) && isEqual(to, code);
};

export const writeCodeToFile = (to, code) => {
  if (fileEqualsCode(to, code)) {
    return;
  }

  return fs.writeFileSync(to, code);
};

export const generateRouteFile = route => {
  return fse.outputFileSync(route.file_path, componentSkeleton(route));
};

export const artisan = (cmd, raw = false) => {
  return raw
    ? execSync(`php artisan ${cmd}`).toString()
    : JSON.parse(execSync(`php artisan ${cmd}`).toString());
};

export const normalizeUri = uri => {
  let normal = uri.startsWith("/") ? uri : `/${uri}`;
  return normal.replace(/{(.*?)}/g, ":$1");
};

// TODO: generate missing files in parallel. currently all run as sync
const createMissingTemplates = routes => {
  routes.filter(r => !fs.existsSync(r.file_path)).forEach(generateRouteFile);
};

const formatForVue = ({ name, uri, prefix, middleware }) => {
  const file_path = `resources/js/pages/${name.replace(/(@|\.|\\)/g, "/")}.vue`;

  const nameArray = name.split(/(@|\.|\/)/g);

  return {
    // from php: name, uri, prefix, middleware (for meta?)
    // to vue:  name, path(uri), path(file_path), component(end of file path)
    uri: normalizeUri(uri), // convert {user} to :user style params
    componentName: nameArray[nameArray.length - 1], // get last part of name for the component name
    prefix,
    children: null, // group all components with same prefix
    middleware,
    name: name.replace("\\", "/"),
    file_path
  };
};

export function generateRoutes(options) {
  // get the phase:routes JSON output
  const output = artisan("phase:routes --json --config");

  // merge webpack supplied options with config('phase')
  const config = merge(output.config, options);

  // format route data
  const routes = output.routes.map(formatForVue);

  // generates missing .vue page files from template
  createMissingTemplates(routes);

  return createRoutes(routes, config);
}
