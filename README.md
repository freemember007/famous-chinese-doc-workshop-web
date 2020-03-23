# ddyy-common-business-react

点点医院通用业务模块微信前端react，如量表问卷，健康订制等

## 环境

使用create-next-app构建，版本为next9，babel7，webpack相关包已集成，无需重新安装。

### babel

next/babel预设可处理各种 React 应用所需要的情况。包括，如自定preset，则应手动安装：

```
preset-env
preset-react
plugin-proposal-class-properties
plugin-proposal-object-rest-spread
plugin-transform-runtime
styled-jsx
```

### css

antd-mobile require normalize.css导致编译报错bug,

vi node_modules\antd-mobile\lib\style\index.js

```javascript
// 去除此项，如需要在_app.js import 'normalize.css/normalize.css'
// require('normalize.css/normalize.css');
```

```bash
yarn fixant
```

### react-dom-server

在现在next9框架下，ReactDOMServer does not yet support Suspense，故某些使用suspense的库如，use-http, rest-hook均不可用。

https://spectrum.chat/next-js/general/suspense-support~f83c5c32-cb4d-419e-ba3d-f08948e63584

## IDE

为在模板中正确显示pug, 尤其是if, each等，应安装pug-tmbundle，并选择pypug语法, 不要pug和sublime-pug-extened


