$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initCate();
    //初始化富文本编辑器
    initEditor()

    //获取文章分类
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败！')
                }
                var htmlStr = template('tpl-cate', res);
                $("[name=cate_id]").html(htmlStr);

                //通过layui重新渲染动态获得的表单数据
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image');
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };
    // 3. 初始化裁剪区域
    $image.cropper(options);

    //给选择封面按钮绑定点击事件
    $('.imgChoose').on('click', function() {
        $('[name=file]').click();
    });

    $('#file').on('change', function(e) {
        //获取用户选择的文件
        var fileList = e.target.files;
        // return console.log(fileList.length);
        if (fileList.length === 0) {
            return //layer.msg('请选择照片！')
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

    //定义文章的发布状态
    var art_status = '已发布';

    $(".btnSave2").on('click', function() {
        art_status = '草稿'
    });

    //为表单绑定提交事件
    $('#form-pub').on('submit', function(e) {
        //1.阻止表单默认提交
        e.preventDefault();

        //2.创建formData对象,传进去的对象要用原生js获取
        var fd = new FormData($(this)[0]);
        //3.将文章的发布状态存到fd对象中
        fd.append('state', art_status);
        //4.将封面裁剪过后的图片输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) {
                //将Canvas画布上的内容，转化为文件对象
                //得到文件后进行后续的操作
                //5.将文件对象存储到fd中
                fd.append('cover_img', blob);
                //6.发起ajax请求
                publishArticle(fd);
            })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('添加文章失败！')
                }
                layer.msg('添加文章失败！');

                location.href = '/article/art_list.html'
            }
        })
    }

})