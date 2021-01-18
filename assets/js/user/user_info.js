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

    initUserInfo();
    //初始化用户信息
    function initUserInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            success: function(res) {
                if (res.status !== 0) {
                    layer.msg('获取用户信息失败')
                }
                // console.log(res);
                //利用layui的form.val（）进行表单赋值
                form.val("userinfo", res.data);
            }
        })
    };

    //重置表单的数据
    $("#btnReset").on("click", function(e) {
        //组织按钮的默认重置表单里所有数据
        e.preventDefault();
        //在调用用户初始化数据
        initUserInfo();
    });

    //监听提交按钮
    $(".layui-form").on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault();
        //发起ajax请求
        $.ajax({
            url: '/my/userinfo',
            method: 'post',
            //获取表单所有数据
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                };
                layer.msg('更新用户信息成功！');

                //子页面调用父页面的方法，渲染用户头像和欢迎信息
                window.parent.getUserInfo();
            }
        })
    });

})