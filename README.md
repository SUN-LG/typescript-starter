# typescript-starter
从零开始构建typescript开发项目

## 配置环境

- Init
- Git commit Message
- Typescript


### Init

采用 NPM 可以对任何普通的项目进行初始化操作，执行 [`npm init`](https://docs.npmjs.com/cli/init) 会在项目根目录下生成 `package.json` 包描述文件。

> 温馨提示：更多关于该配置的变更可以查看 [Commit](https://github.com/SUN-LG/typescript-starter/commit/8b28b61228e5f5e010c7a3388c9807bdcd2c97d4)

### Git Commit Message

[Commitizen](https://github.com/commitizen/cz-cli) 是一个规范Git提交说明（Commit Message）的CLI工具，具体配置可查看[Cz 工具集使用介绍](https://juejin.im/post/5cc4694a6fb9a03238106eb9)。本项目中主要使用了以下功能：

- [cz-customizable](https://github.com/leonardoanalista/cz-customizable)
- [commitlint](https://commitlint.js.org/#/)
- [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog)]

配置以后得到以下功能：

- 使用 `git cz` 代替 `git commit` 提交符合 Angular 规范的 Commit Message
- 代码提交前会通过 [husky](https://github.com/typicode/husky) 配合 git hook 进行提交信息校验，提交信息不符合 Angular 规范，则会失败，终止提交。
- 执行 `npm run changelog` 会在跟目录生成 `CHANGELOG.md` 版本日志

> 温馨提示：如果不知道什么是 CLI （命令行接口），可查看 [使用 NPM 发布和使用 CLI 工具](https://juejin.im/post/5eb89053e51d454de54db501)。

### Typescript

本项目会构建输出 CommonJS 工具包（npm包）供外部使用，采用 Typescript 设计并输出声明文件，有助于外部更好的使用该资源包。Typescript 编译采用官方推荐的 Gulp 工具，配合 [gulp-typescript](https://github.com/ivogabe/gulp-typescript) 和 [tsconfig.json](https://www.tslang.cn/docs/handbook/tsconfig-json.html) 配置文件，可快速进行项目构建。在根目录下新建 `tsconfig.json` 文件并新增以下配置：

```javascript
{
  "compilerOptions": {
    // 指定 ECMAScript 目标版本 "ES3"（默认）， "ES5"， "ES6" / "ES2015"， "ES2016"， "ES2017" 或 "ESNext"。
    "target": "ES5",
    // 构建的目标代码删除所有注释，除了以 /!* 开头的版权信息
    "removeComments": true,
    // 可配合 gulp-typescript 生成相应的 .d.ts 文件
    "declaration": true,
    // 启用所有严格类型检查选项。启用 --strict 相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict， --strictNullChecks, --strictFunctionTypes 和 --strictPropertyInitialization
    "strict": true,
    // 禁止对同一个文件的不一致的引用
    "forceConsistentCasingInFileNames": true,
    // 报错时不生成输出文件
    "noEmitOnError": true
  }
}
```

> 温馨提示：这里没有配置 `module`信息，因为默认输出 CommonJS规范，更多关于 TypeScript 配置信息可查看 [Typescript 官方文档 / 编译选项](https://www.tslang.cn/docs/handbook/compiler-options.html)。如果对于 CommonJS 和 ES6 规范的区别不是很清晰，这里有一篇非常好的文档[ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)。

同时在根目录下新建 `gulpfile.js` 文件：

```javascript
const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
// 输出 CommonJS 规范到 dist 目录下
gulp.task("default", function () {
  const tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest("dist"));
});
```

在 `package.json` 中新增 script 脚本：

```javascript
"scripts": {
  "build": "rimraf dist && gulp"
},
```

其中 [rimraf](https://github.com/isaacs/rimraf) 用于构建前清除 dist 目录中的文件。使用 `npm run build` 命令，构建编译 `src` 下的 typescript 源码并输出 CommonJS 规范的代码到 `dist` 目录下。

除此之外，项目希望可以快速生成声明文件供外部调用，进行代码提示。此时仍然可以借助 `gulp-typescript` 工具自动生成声明文件。在 `gulpfile.js` 中新增以下配置：

```javascript
const gulp = require("gulp");
const ts = require("gulp-typescript");
const tsProject = ts.createProject("tsconfig.json");
const merge = require("merge2");
// 输出 CommonJS 规范到 dist 目录下
gulp.task("default", function () {
  const tsResult = tsProject.src().pipe(tsProject());
  return merge([
    tsResult.dts.pipe(gulp.dest("types")),
    tsResult.js.pipe(gulp.dest("dist")),
  ]);
});
```

修改 `build` 命令，使其在构建前，同时删除 `dist` 和 `types` 目录：

```javascript
"scripts": {
  "build": "rimraf dist types && gulp",
},
```

再次执行 `npm run build` 会在项目根目录生成 `types` 文件夹，该文件夹主要存放自动生成的 Typescript 声明文件。

需要注意发布 npm 包时默认会将当前项目的所有文件进行发布处理，如果你希望只发布编译过后的 `dist` 和 `types`，通过 `package.json` 中的 [files](https://docs.npmjs.com/files/package.json#files) （用于指定发布的 NPM 包，包含哪些文件）字段进行控制：

```javascript
"files": [
  "dist",
  "types"
],
```

> 温馨提示：发布的 npm 包中的某些文件将会忽略 `files` 字段的配置。包括 `package.json`、`LICENSE`、`README.md` 等。

除此之外，如果你希望发布的 npm 包被 `require('package-name')` 或 `import` 形式引入时指向 `dist/index.js` 文件，那么需要配置 `package.json` 中的 [main](https://docs.npmjs.com/files/package.json#main) 字段信息：

```javascript
"main": "dist/index.js"
```

> 温馨提示： 对于工具包使用全量引入的方式并不是一个好的选择，可以通过具体的工具方法进行按需引入。