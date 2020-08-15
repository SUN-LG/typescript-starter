# typescript-starter
从零开始构建typescript开发项目

## 配置环境

- Init
- Git commit Message


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