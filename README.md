#assets-webpack-plugin-new

为了减少后端人员误操作引起前端方面的种种Bug,经过商议站点静态资源统一由前端提供资源配置表.json文件，后端动态读取输出。 

这里使用 assets-webpack-plugin 插件生成资源文件.json 如下：,

```javascript
 {
    "one": {
        "js": "/js/one_2bb80372ebe8047a68d4.bundle.js"
    },
    "two": {
        "js": "/js/two_2bb80372ebe8047a68d4.bundle.js"
    }
}
```
自身的业务需要是这样的：

```javascript
{
    "home": {
        "search": {
            "libs": "asset/js/page/home/search-libs-10b04238p.js",
            "common": "true",
            "search": "asset/js/page/home/search-e8ab584sd.js"
        }
    },
    "user": {
        "article": {
            "libs": "asset/js/page/home/article-libs-52fe4f1e.js",
            "common": "true",
            "article": "asset/js/page/home/article-fwe7f72.js",
            "dialogs": "true"
        }
    },
    "common": "asset/js/page/home/common-6d4542a4.js",
    "dialog": "asset/js/page/home/dialogs-193820d8.js"
}
```

## 注解：

home模块,user模块下分别有搜索页和文章页(同名的业务js)。

全局公共模块common.js,dialog.js... 置于json对象顶级,全站共同维护一份,以防有修改后涉及到的业务重新打包的问题

页面如果使用该全局模块,直接配置成true,后端判断为true直接查找顶级同名属性动态输出即可。 


## 修改插件：

于是根据自身需要必须修改 assets-webpack-plugin 插件,这里保存了插件所有原有的功能，添加了一些没有的功能,提交合并无果,索性发布一个.添加了如下功能：

* 忽略模块：打包后忽略要生成到资源路径.json文件的模块
* 模块排序：按先后顺序排列资源路径，以便于后端动态输出
* 公共模块：全站公共模块
* 打包模块：如：user 模块
* 入口文件: 如：user/main.js


##为什么要设全站公共模块？

如果有多个页面引入了公共模块，后面发现公共模块有Bug要修改，这下就麻烦了，涉及到的页面都要重新打包才能生效，就增加了工作量，

这里公共模块置于资源json对象顶层 ，全站共同维护一份，有修改也不用重新打包涉及到的页面。


##为什么要忽略模块？

如果使用了异步加载，assets-webpack-plugin 也会生成该路径到.json文件，动态输出时也一并输出请求了，这是不允许的，所以忽略模块参数就起了作用，
生成的.json文件就不会包含异步请求的资源路径


##为什么要模块模块排序？

assets-webpack-plugin生成的资源路径是一个json对象，没有顺序可言，后端动态输出后JS有可能会报错,排序之后就没有这样的问题了。

##为什么要打包模块和业务模块？

assets-webpack-plugin 生成的资源路径json文件，没有明显的模块可言，如果多个模块下都有 main.js 就麻烦了 会被覆盖掉，因此

添加了两个参数 模块和自身页面同名js文件名，这样会生成相应的目录。

## DEMO：

在home模块下有一个搜索页面，页面上有一个按钮 点击按钮弹出url参数 key 的值，并异步加载 underscore.js
在user模块下有一个文章页面，页面上有一个按钮 点击按钮弹出用户信息

生成 assets.js.json 到根目录

详情查看 demo 目录源码


























