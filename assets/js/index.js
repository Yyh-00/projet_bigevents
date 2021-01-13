$(function() {
    getUserinfo();

    function getUserinfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'get',
            //headers就是请求头配置对象
            headers: {
                Authorization: localStorage.getItem('token')
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败！')
                }
                //调用渲染用户头像函数
                renderAvatar(res.data);
            }

        })
    }

    //渲染用户头像
    function renderAvatar(user) {
        //1.获取用户名称
        let name = user.nickname || user.username;
        //2.设置欢迎的文本
        $("#welcome").html("欢迎&nbsp&nbsp;" + name);
        //3.按需渲染用户头像
        if (user.user_pic !== null) {
            $(".layui-nav-img").attr("src", user.user_pic).show();
            $(".text-avatar").hide();
        } else {
            $(".layui-nav-img").hide();
            let first = name[0].toUpperCase();
            $(".text-avatar").html(first).show();

        }

    }
})