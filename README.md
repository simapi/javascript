## 配合SimApi的Vue 请求类

### 注意只支持post方法

安装方法：
> yarn add @simcu/simapi

调用方法:
在vue的main.js中

```js
import SimApi from "@simcu/simapi"
//此处进行相关的配置
SimApi.config.server = "http://xx.xx.xx"
SimApi.config.debug = false;

Vue.use(SimApi)
```

配置相关：

下方给出的为默认配置，不需要更改的不需要写出
```js
this.$simapi.config = 
{
        //请求超时设置
        timeout: 5000,
        //服务器地址
        server: null,
        //是否为调试模式
        debug: false,
        //请求结果预处理
        responseCallback: {
            //请求成功预处理
            success(response) {
                return response.data;
            },

            //请求失败预处理
            error(response) {
            }
        },
        //业务结果状态码预处理
        businessCallback: {
            401(data) {
                localStorage.removeItem('token');
                window.alert("登陆失效，需要登陆");
                location.href = "/#/login";
            }
        }
    }
```

请求api接口

```js
this.$simapi.query("uri不带域名",{}).then(resp=> {
  //resp 为 axios 的 resp.data 
}).catch(error=>{
   //error 为业务返回的错误信息，不是axios的错误信息
})
```

可以用方法：

```js
this.$simapi.login(token)  //本方法将token存入localstorage，并在后续query中自动附加
this.$simapi.logout()      //删除token
this.$simapi.getToken()    //获取登陆标识
this.$simapi.checkLogin(url="/auth/check") //检测登陆状态
this.$simapi.debug(string)  //本方法将自动在debug模式打印string信息，非debug模式不会打印
this.$simapi.isDebug()      //是否为debug模式
this.$simapi.getServerUrl()  //获取服务器Url
this.$simapi.formatDt(dt, format = "yyyy-MM-dd hh:mm:ss", dv = "暂无")  //格式化时间戳
this.$simapi.formatNow(format)  //格式化当前时间
```
