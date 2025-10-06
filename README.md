# `@writepoetry/webpack-utils`

Utility helpers for managing dynamic Webpack entry points in WordPress projects.  
Built on top of `@wordpress/scripts`, this package simplifies handling of JavaScript and CSS/SCSS assets with flexible folder mapping and exclusions.

---

## Using GitHub Packages

This package is hosted on **GitHub Packages**, not on the public npm registry.  
That means you need to configure authentication before you can install or publish it.

### Configure `.npmrc`

Create a file named `.npmrc` in your project root (or edit your global `.npmrc`) and add the following content:

```ini
@writepoetry:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Replace `YOUR_GITHUB_TOKEN` with a GitHub Personal Access Token that has at least:
- `read:packages` to install,
- `write:packages` to publish.

> ⚠️ Never commit `.npmrc` with a real token into your repository.

## Installation

```bash
npm install @writepoetry/webpack-utils --save-dev
````

Requires `@wordpress/scripts` as a peer dependency.

---

## Features

* Dynamically collect assets (`.js`, `.ts`, `.jsx`, `.tsx`, `.scss`, `.css`) from your `src` directory.
* Exclude specific folders from being processed.
* Remap folder paths to custom namespaces.
* Utility to detect `--output-path` from CLI arguments.

---

## API

### `getAllAssets(options = {})`

Scans the project source path (from `@wordpress/scripts`) and builds an object of entry points.

**Options:**

* `excludeDirs: string[]`
  Additional directories to exclude (default: `['blocks']`).
* `remapDirs: Record<string,string>`
  Mapping of directory prefixes to alternate names in the generated chunk keys.

**Returns:**
`Object.<string, string>` — mapping of chunk names → absolute file paths.

**Example:**

```js
const { getAllAssets } = require('@writepoetry/webpack-utils');

module.exports = {
  entry: {
    ...getAllAssets({
      excludeDirs: ['vendor'],
      remapDirs: {
        'js': 'scripts',
        'scss': 'styles',
      },
    }),
  },
};
```

---

### `getAsset(dir, { remapDirs } = {})`

Processes files inside a specific directory. Only returns entries for supported extensions.

**Arguments:**

* `dir: string`
  Absolute path to the directory to scan.
* `remapDirs: Record<string,string>` *(optional)*
  Same mapping rules as in `getAllAssets`.

---

### `getOutputPathFromArgs()`

Scans `process.argv` for `--output-path=...` and returns the value, or `null` if not found.

---

## Example `webpack.config.js`

```js
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const { getAllAssets } = require('@writepoetry/webpack-utils');

module.exports = {
  ...defaultConfig,
  entry: {
    ...getAllAssets({
      remapDirs: {
        'js': 'scripts',
        'scss': 'styles',
      },
    }),
  },
};
```

---

## License

This project is released under the MIT License — free to use, modify, and distribute for any purpose without restrictions.

MIT © [WritePoetry](https://github.com/writePoetry)
 
