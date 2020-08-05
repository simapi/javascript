## 配合SimApi的Vue 请求类

### 注意只支持post方法

安装方法：
> yarn add @simcu/simapi

调用方法:
在vue的main.js中

```js
import SimApi from "@simcu/simapi"

Vue.use(SimApi)
```

配置相关：

```js
this.$simapi.config = 
{
        //请求超时设置
        timeout: 5000,
        //服务器地址
        server: null,
        //是否为调试模式
        debug: false,
        //登陆地址
        loginUrl: "/",
        //是否强制登陆，如果为true，监测到401响应会强制跳转到登陆页面
        forceLogin: true,
        //提示信息相关
        notices: {
            //提示方式方法
            method: window.alert,
            needLogin: "登陆失效，需要登陆",
            networkError: "网络请求发生错误"
        }
 }
```

其中 server 和 debug 可以通过全局方式配置，但是配置文件优先级高于全局变量

```js
window.server = "http://xxxxxx"
window.debug = true   //默认debug为false
```

请求api接口

```js
this.$simapi.query("uri不带域名",{}).then(resp=> {
  //resp 为 axios 的 resp.data 
}).catch(error=>{
   //error 为业务返回的错误信息，不是axios的错误信息
})
```

认证相关

```js
this.$simapi.auth.login(token)  //本方法将token存入localstorage，并在后续query中自动附加
this.$simapi.auth.logout()      //删除token
```


debug 输出

```js
this.$simapi.debug(string)  //本方法将自动在debug模式打印string信息，非debug模式不会打印
```
