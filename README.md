# typescript-starter
从零开始构建typescript开发项目

## 配置环境

- Init
- Git commit Message
- Typescript
- Eslint


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

### ESlint

#### 背景

TypeScript 的代码检查工具主要有 TSLint 和 ESLint 两种。早期的 TypeScript 项目一般采用 TSLint 进行检查，TSLint 和 TypeScript 采用同样的 AST 格式进行编译，但主要问题是对于 JavaScript 生态的项目支持不够友好，因此 TypeScript 团队在 2019 年宣布全面转向 ESLint，更多关于转向 ESLint 的原因可查看：

- <https://medium.com/palantir/tslint-in-2019-1a144c2317a9>
- <https://github.com/microsoft/TypeScript/issues/30553>

TypeScript 和 ESlint 使用不同的AST进行解析，因此使用ESlint支持 Typscript 代码检测需要额外的[自定义解析器](https://cn.eslint.org/docs/developer-guide/working-with-custom-parsers)（Custome Parsers，Eslint 的自定义解析器功能需基于[ESTree](https://github.com/estree/estree)），目的是为了能够解析 Typescript 语法并转换成与 ESlint兼容的AST。[@typescript-eslint](https://github.com/typescript-eslint/typescript-eslint#getting-started--installation)在这样的背景下诞生，它会处理所有特定的ESLint配置并调用[@typescript-eslint/typescript-estree](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/typescript-estree)生成 ESTreet-compatible AST (需要注意，仅仅是兼容ESLint，也能兼容 Prettier)

`@typecsript-eslint` 是一个 Monorepo 体系结构的仓库，采用 [learn](https://github.com/lerna/lerna) 进行设计，除了上述提到的NPM包以外，还包含以下两个重要的NPM包：

- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin), 配合`@typescript-eslint/parser`一起使用的 ESLint 插件，可以设置 Typescript 的校验规则。
- [@typescript-eslint/eslint-plugin-tslint](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin-tslint): TSLint 向 ESLint 迁移的插件。

> 温馨提示：如果你正在使用 TSLint，并且你希望兼容 ESLint 或者向 ESLint 进行过渡（TSLint 和 ESLint 并存）， 可查看 [Migrating from TSLint to ESLint](https://github.com/typescript-eslint/typescript-eslint#migrating-from-tslint-to-eslint)。除此之外，以上所介绍的这些包发布时版本一致（为了联合使用的适配性），如果还有什么需要注意的话你可能需要关心一下 `@typescript-eslint` 对于 TypeScript 和 ESLint 的版本支持性，更多可查看该库包的 @typescript-eslint/parser 的仓库信息。

#### 配置

从背景介绍中可以理解，对于全新的 Typescript 项目（直接抛弃 TSLint）需要包含解析能够解析TS的解析器 @typescript-eslint/parser，和校验规则的插件 @typescript-eslint/eslint-plugin，这里需要在项目中就进行安装：

```shell
npm i --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

在根目录新建 `.eslintrc.js` 配置文件，设置一下配置：
```javascript
  module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      '@typescript-eslint'
    ],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ]
  }
```

其中：

- `parser: '@typescript-eslint/parser'`：使用 ESlint 解析 Typescript 语法
- `plugins: ['@typescript-eslint']`: 加载 `@typescript-eslint/eslint-plugin` ESLint 插件，用于配置 Typescript 校验规则
- `extends: [...]`: 在ESLint中设置[共享规则配置](https://cn.eslint.org/docs/developer-guide/shareable-configs)，其中`eslint:recommended` 是 ESLint 内置的推荐校验规则配置（也被称作最佳规则实践），`plugin:@typescript-eslint/recommended` 是类似于 `eslint:recommended` 的 TypeScript 推荐校验规则配置。

> 温馨提示：如果你稍微阅读一下 recommended 源码你会发现，其内部可以理解为推荐校验规则的集合。因此如果想基于 `@typescript-eslint/eslint-plugin` 进行自定义规则，则可以参考[TypeScript Supported Rules](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules)。
> 温馨提示：[为什么在ESLint输出中看不到TS提示的错误？](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#why-dont-i-see-typescript-errors-in-my-eslint-output) ESLint 不会复制ts提供的错误信息，因为那样做会减慢ESLint的运行速度，并且重复输出了TS已经提供的错误信息。

配置完成后在 `package.json` 中设置校验命令

```javascript
"lint": "eslint src",
```

此时如果在 `src` 目录下书写错误的语法，执行 `npm run lint` 就会输出错误信息：

```shell
$ npm run lint

> typescript-starter@1.0.0 lint D:\workspace\learn\typescript-starter
> eslint src


D:\workspace\learn\typescript-starter\src\index.ts
  6:3  warning  Missing return type on function  @typescript-eslint/explicit-module-boundary-types

✖ 1 problem (0 errors, 1 warning)
```

> 温馨提示：输出的错误信息是通过 [ESLint Formatters](https://cn.eslint.org/docs/user-guide/formatters/) 生成，查看 ESLint 源码并调试可发现默认采用的是 [stylish](https://cn.eslint.org/docs/user-guide/formatters/#stylish) formatter。

#### ESlint vscode 插件

如果不使用插件，很难发现写的代码可能存在 TypeScript 格式错误（除非手动 `npm run lint` 或监听代码的变更并实时运行 `npm run lint`），此时可以通过 VS Code 插件进行处理。安装 ESLint 插件后可进行代码的实时提示，具体如下图所示：

![eslint-error](eslint-error.jpg)

此时可以发现之前执行 `lint` 命令的错误通过插件的形式可实时在 VS Code 编辑器中进行显示。除此之外，一些简单的 ESLint 格式错误（例如 多余的`;` 等）可通过配置 Save Auto Fix 进行保存自动格式化处理。具体 VS Code 的配置可参考 [ESLint 插件](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)的文档说明，这边应该需要进行如下配置：
``` javascript
"editor.codeActionsOnSave": {
  "source.fixAll": true,
  "source.fixAll.eslint": true
}
```

> 温馨提示：VS Code 的配置分为两种类型（用户和工作区），针对上述通用的配置主要放在用户里，针对不同项目的不同配置则需要放入工作区进行处理。

## 文档

- [Npm 官方文档](https://docs.npmjs.com/)
- [使用 NPM 发布和使用 CLI 工具](https://juejin.im/post/5eb89053e51d454de54db501)
- [Cz 工具集使用介绍](https://juejin.im/post/5cc4694a6fb9a03238106eb9)（强烈推荐阅读）
- [TypeScript 中文网](https://www.tslang.cn/)
- [tsconfig.json 编译选项](https://www.tslang.cn/docs/handbook/compiler-options.html)
- [gulp-typescript](https://github.com/ivogabe/gulp-typescript)
- [ES modules: A cartoon deep-dive](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)（强烈推荐阅读）
- [ESLint 中文网](https://cn.eslint.org/)
- [typescript-eslint](https://github.com/typescript-eslint/typescript-eslint)
- [Getting Started - Linting your TypeScript Codebase](https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/README.md)