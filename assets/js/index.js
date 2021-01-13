 $(function() {
     //调用获去用户信息
     getUserinfo();
     //实现退出功能
     $("#btnLoginout").on("click", function() {
         layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
             //清空本地存储内容
             localStorage.removeItem('token');
             //跳转到登陆界面
             location.href = "/login.html";

             //关闭comfirm询问框
             layer.close(index);
         });
     });
     //封装获取用户信息函数
     function getUserinfo() {
         $.ajax({
             url: '/my/userinfo',
             method: 'get',
             //headers就是请求头配置对象
             /* headers: {
                 Authorization: localStorage.getItem('token')
             }, */
             success: function(res) {
                 if (res.status !== 0) {
                     return layui.layer.msg('获取用户信息失败！')
                 }
                 //调用渲染用户头像函数
                 renderAvatar(res.data);
             },
             //不论请求成功还是失败，都会调用complete回调函数
             /*  complete: function(res) {
                  console.log(res);
                  if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                      //强制清除本地存储的内容
                      localStorage.removeItem("token");
                      //强制跳转到登陆界面
                      location.href = '/login.html';
                  }
              } */

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