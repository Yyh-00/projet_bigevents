$(function() {
    //点击去注册账号链接
    $('#link-login').on('click', function() {
        $(".box-login").hide();
        $(".box-reg").show();
    });
    //点击去登陆链接
    $('#link-reg').on('click', function() {
        $(".box-login").show();
        $(".box-reg").hide();
    })

})