$(function() {
    var layer = layui.layer;
    var form = layui.form;

    initArtCate()

    //初始化表格数据
    function initArtCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }
        })
    }

    //点击添加类别弹出层
    var indexAdd = null;

    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#tpl-add').html()
        });
    })

    //因为form-add在页面中其实不存在（动态创建出来），所以要用代理的方式为submit按钮添加监听提交事件
    $("body").on('submit', '#form-add', function(e) {
        // console.log('ok');
        e.preventDefault();

        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加文章类别失败!')
                }
                layer.msg('添加文章类别成功!');
                //初始化表格数据
                initArtCate();
                //根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //给编辑按钮绑定点击事件
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#tpl-edit').html()
        });

        //获取元素自定义属性id
        var id = $(this).attr('data-id')

        //编辑按钮弹出框添加原始数据
        $.ajax({
            method: 'get',
            url: '/my/article/cates/' + id,
            // headers: {
            //     Authorization: localStorage.getItem('token')
            // },
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的方式为确认修改按钮绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        //阻止表单默认提交事件
        e.preventDefault();

        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('文章修改失败')
                }
                layer.msg('文章修改成功');

                initArtCate()
                layer.close(indexEdit)
            }
        })
    })

    //通过代理的方式为删除按钮绑定点击事件
    $("tbody").on('click', '.delete', function() {
        var id = $(this).attr('data-id');

        layer.confirm('确定删除吗？', { icon: 3, title: '提示' }, function(index) {
            // var id = $(this).attr('data-id');
            // return console.log(id);
            $.ajax({
                method: "get",
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除类别失败！')
                    }

                    layer.msg('删除类别成功！');
                    //删除询问框
                    layer.close(index);
                    initArtCate()
                }

            })
        });
    })
})