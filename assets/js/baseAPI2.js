$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前，统一拼接请求的根路径url
    // options.url = 'http://www.liulongbin.top:3007' + options.url;
    options.url = ' http://api-breakingnews-web.itheima.net' + options.url;

    // console.log(options.url);

    //统一为有权限的接口设置headers请求头
    if (options.url.indexOf("/my/") !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token')
        }
    }

    //全局统一挂载complete函数
    options.complete = function(res) {
        // console.log(res.responseJSON);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清除本地存储的内容
            localStorage.removeItem("token");
            //强制跳转到登陆界面
            location.href = '/login.html';
        }
    }
})