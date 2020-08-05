import Axios from 'axios'

export default {
    //http请求组件
    http: null,

    //系统配置
    config: {
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
    },

    //获取服务器地址
    getServerUrl() {
        return this.config.server ? this.config.server : window.server
    },

    //是否为调试模式
    isDebug() {
        return window.debug || this.config.debug
    },

    //Vue插件支持
    install(Vue) {
        Vue.prototype.$simapi = this;
    },

    //调试模式输出信息
    debug(object) {
        if (this.isDebug()) {
            window.console.log("[DEBUG]", object)
        }
    },

    //格式化时间戳
    formatDt(dt, format = "yyyy-MM-dd hh:mm:ss", dv = "暂无") {
        return dt ? (new Date(dt)).format(format) : dv;
    },

    //格式化时间
    formatNow(format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        }

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },

    //认证相关操作
    auth: {
        login(token) {
            localStorage.setItem('token', token);
        },
        logout(url = "/auth/logout") {
            localStorage.removeItem('token');
            return this.query(url);
        },
        check(url = "/auth/check") {
            return this.query(url);
        },
        getToken() {
            return localStorage.getItem('token');
        }
    },

    //发起post请求
    query(uri, params = {}) {
        if (null == this.http) {
            this.http = Axios.create({
                baseURL: this.getServerUrl(),
                timeout: this.config.timeout,
                headers: {'Content-Type': 'application/json'}
            });
        }
        if (null !== localStorage.getItem('token')) {
            this.http.defaults.headers.common['Token'] = localStorage.getItem('token');
        }
        if (this.isDebug()) {
            let S4 = () => {
                return (((1 + Math.random()) * 0x10000 * Date.parse(new Date())) | 0).toString(16).substring(1);
            };
            let query_id = S4() + S4();
            this.http.defaults.headers.common['Query-Id'] = query_id;
            window.console.log('[REQUEST*]', query_id, '->', uri, 'AUTH:', localStorage.getItem('token'), params);
        }
        let resp = this.http.post(uri, params);
        return new Promise((resolve, reject) => {
            resp.then((res) => {
                if (this.isDebug()) {
                    window.console.log('[RESPONSE]', res.config.headers['Query-Id'], '->', res.data)
                }
                /**
                 * API返回全局拦截
                 */
                switch (res.data.code) {
                    case 200:
                        resolve(res.data);
                        break;
                    //需要登录
                    case 401:
                        localStorage.removeItem('token');
                        this.config.notices.method(this.config.notices.needLogin);
                        location.href = this.config.loginUrl;
                        break;
                    default:
                        reject(res.data);
                }
            }).catch((res) => {
                if (this.isDebug()) {
                    window.console.log('[RESPONSE]', res.config.headers['Query-Id'], '->', this.config.notices.networkError)
                }
                this.config.notices.method(this.config.notices.networkError);
            });
        });
    }
}
