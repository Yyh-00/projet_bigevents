$(function() {
    var layer = layui.layer;

    initArtCate()

    //初始化表格数据
    function initArtCate() {
        $.ajax({
            method: 'get',
            url: 'http://api-breakingnews-web.itheima.net/my/article/cates',
            headers: {
                Authorization: localStorage.getItem('token')
            },
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
            url: 'http://api-breakingnews-web.itheima.net/my/article/addcates',
            data: $('#form-add').serialize(),
            headers: {
                Authorization: localStorage.getItem('token')
            },
            success: function(res) {
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
            title: '添加文章分类',
            content: $('#tpl-edit').html()
        });
    })
})