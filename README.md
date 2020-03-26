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

### ui

### css

antd-mobile require normalize.css导致编译报错bug,

vi node_modules\antd-mobile\lib\style\index.js

```javascript
// 去除此项，如需要在_app.js import 'normalize.css/normalize.css'
// require('normalize.css/normalize.css');
```

### animate

https://github.com/alexvcasillas/animated-styled-components

### icon

https://github.com/jacobwgillespie/styled-icons

```bash
# 最好
# https://akveo.github.io/eva-icons/#/
yarn add @styled-icons/evaicons-outline
# https://github.com/refactoringui/heroicons/tree/master/src/outline-md
yarn add @styled-icons/heroicons-outline
# https://ionicons.com/
yarn add @styled-icons/ionicons-outline #安装不成功

# 其他
yarn add @styled-icons/feather
yarn add @styled-icons/foundation
```

### 其他

https://github.com/rebassjs/rebass

https://github.com/Fausto95/styled-grid-component

https://github.com/SaraVieira/styled-flex-component

https://www.smooth-code.com/open-source/smooth-ui/docs/theming/

### query库比较

很多库用到fetch库，需要abortcontroller-polyfill

```javascript
import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only'
```

首选：

restful-react: 简单，可直接写dom，状态也可在dom维护

有特色的：

use-axios-client：可注入axios实例，有refetch功能

rest-hook: 定义resource，可直接写dom，如果要状态，写法没有优势

其他：

use-http: 有简单的时间cache

swa/react-query: 需要设定cache key

swr: 需要设定cache key




```bash
yarn fixant
```

### react-dom-server

在现在next9框架下，ReactDOMServer does not yet support Suspense，故某些使用suspense的库如，use-http, rest-hook均不可用。

https://spectrum.chat/next-js/general/suspense-support~f83c5c32-cb4d-419e-ba3d-f08948e63584

## IDE

为在模板中正确显示pug, 尤其是if, each等，应安装pug-tmbundle，并选择pypug语法, 不要pug和sublime-pug-extened


