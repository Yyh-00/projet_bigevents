$(function() {
    var layer = layui.layer;

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

        return y + '-' + m + '-' + 'd' + '' + 'hh' + ':' + 'mm' + ':' + 'ss'
    };

    //时间补零
    function zeroPadding(n) {
        return n = n < 0 ? n : '0' + n;
    }

    initTable();
    //获取表格的数据
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                // return console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }
                layer.msg('获取文章列表数据成功！')
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
            }

        })
    }
})