$(function() {
    //点击去注册账号链接
    $('#link-login').on('click contextmenu selectstart', function(e) {
        $(".box-login").hide();
        $(".box-reg").show();
        e.preventDefault();
    });
    //点击去登陆链接
    $('#link-reg').on('click contextmenu selectstart', function(e) {
        $(".box-login").show();
        $(".box-reg").hide();
        e.preventDefault();
    });
    //从layui中获取form对象
    var form = layui.form;
    //从layui中获取layer对象
    var layer = layui.layer
        // 通过form.verify()自定义校验规则
    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === '啊') {
                // alert('用户名不能为敏感词');
                return '用户名不能为敏感词';
            }
        },
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]

        pass: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        repass: function(value) {
            var pwd = $('.box-reg [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }

        }
    });
    // 监听注册表单的提交事件
    $("#form_reg").on('submit', function(e) {
            e.preventDefault();
            var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message);
                //注册成功自动进入登录界面
                $('#link-reg').click();
            })
        })
        //监听登陆表单的登陆时间
    $("#form_login").on("submit", function(e) {
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'post',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败!');
                };
                layer.msg('登陆成功！');
                //将登陆成功等得到的token保存在本地存储库localstorage中
                localStorage.setItem('token', res.token);
                console.log(res.token);
                location.href = '/index.html'
            }
        })
    })
})