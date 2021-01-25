$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage

    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示两条数据
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }

    //定义模板中时间美化的过滤器
    template.defaults.imports.date = function(date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = zeroPadding(dt.getMonth() + 1);
        var d = zeroPadding(dt.getDate());

        var hh = zeroPadding(dt.getHours());
        var mm = zeroPadding(dt.getMinutes());
        var ss = zeroPadding(dt.getSeconds());

        return y + '-' + m + '-' + d + '    ' + hh + ':' + mm + ':' + ss
    };

    //时间补零
    function zeroPadding(n) {
        return n = n > 9 ? n : '0' + n;
    }

    initTable();
    initCate();

    //获取表格的数据
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }
                layer.msg('获取文章列表数据成功！')
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)

                //调用分页渲染  
                renderPage(res.total)
            }
        })
    }

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

    //为筛选表单绑定提交事件
    $("#form-search").on('submit', function(e) {
        e.preventDefault();

        //获取表单中选项的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();

        //给查询对象q中的相应属性赋值.
        q.cate_id = cate_id;
        q.state = state;
        // console.log(cate_id);
        // console.log(state);
        console.log(q);

        initTable();
        layer.msg('筛选成功')

    })

    //定义分页渲染的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox', //指定分页容器
            count: total, //数据总数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10], //定义每条页数的选择项

            //分页发生切换的时候，触发jump回调
            //触发jump回调的方式有两种
            //1.点击页码的时候会触发jump回调
            //2.只要调用了renderPage方法就会触发jump回调
            jump: function(obj, first) {

                //把最新的页码值复制给q查询对象中
                q.pagenum = obj.curr;
                //把条目数赋值给q的pagesize参数
                q.pagesize = obj.limit;

                //可以通过first的值来判断通过哪种方式触发的jump回调
                //如果first的值为true，证明方式2触发
                //否则就是方式1触发
                if (!first) {
                    //重新渲染表格
                    initTable();
                }
            }
        })
    }

    //用代理的方式给删除按钮绑定点击事件
    $('tbody').on('click', '.delete', function() {
        var id = $(this).attr('data-id')
            //获取表格中删除按钮的个数
        var len = $(".delete").length

        layer.confirm('确定删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg("删除失败！")
                    }
                    layer.msg("删除成功！");
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余的数据了，则让页码值-1
                    //之后再重新调用inittable方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        initTable()
                    }

                }

            })

            layer.close(index);
        });
    })
})