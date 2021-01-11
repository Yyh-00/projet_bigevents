$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前，统一拼接请求的根路径url
    options.url = 'http://www.liulongbin.top:3007' + options.url;
    console.log(options.url);
})