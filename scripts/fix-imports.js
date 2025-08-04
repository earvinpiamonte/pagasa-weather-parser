#!/usr/bin/env node

import { readFileSync, writeFileSync } from "fs";
import { glob } from "glob";

const jsFiles = glob.sync("dist/**/*.js");

jsFiles.forEach((file) => {
  let content = readFileSync(file, "utf8");

  // Replace relative imports without extensions
  content = content.replace(
    /from\s+['"](\.\/.+?)(?<!\.js)['"];?/g,
    "from '$1.js';"
  );

  content = content.replace(
    /import\s+['"](\.\/.+?)(?<!\.js)['"];?/g,
    "import '$1.js';"
  );

  writeFileSync(file, content);
});
