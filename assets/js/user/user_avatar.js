$(function() {
    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
        // 1.2 配置选项
    const options = {
            // 纵横比
            aspectRatio: 1,
            // 指定预览区域
            preview: '.img-preview'
        }
        // 1.3 创建裁剪区域
    $image.cropper(options)

    $('.btnImageSend').on('click', function() {
        $('#btnImageChoose').click();
    })

    //给文件选择框绑定change事件
    $('#btnImageChoose').on('change', function(e) {
        //获取用户选择的文件
        var fileList = e.target.files;
        // return console.log(fileList.length);
        if (fileList.length === 0) {
            return layer.msg('请选择照片！')
        }

        //拿到用户选择的文件
        var file = fileList[0];
        //根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //为确定按钮绑定点击事件
    $("#btnUpload").on('click', function() {
        //1.拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

        //2.调用接口把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！');
                //调用父页面的方法
                window.parent.getUserInfo();
            }
        })

    })
})