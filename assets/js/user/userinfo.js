$(function() {
    var form = layui.form;
    var layer = layui.layer;

    //个人信息表单验证
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称必须在1 ~ 6个字符之间'
            }
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
        }
    })

    //初始化用户信息
    $.ajax({
        url: '/my/userinfo',
        method: 'get',
        success: function(res) {
            if (res.status !== 0) {
                layer.msg('获取用户信息失败')
            }
            console.log(res);
        }
    })
})