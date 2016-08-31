// 异步加载
require.ensure([], function(require) {
    var _ = require('underscore');
    console.log(_);
},"underscore");

var _key = common.GetQueryString("key");
$("#btn").click(()=>$.dialog({content:_key}));

