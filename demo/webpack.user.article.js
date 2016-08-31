var webpack = require('webpack');
var path = require('path');
var AssetsPlugin = require('assets-webpack-plugin-new');  

//
var jsModule = "user";
var jsPage = "article"; 

module.exports = {  
    entry:{
        libs:["./static/js/libs/jquery/jquery.js"],
        dialog:"./static/js/component/dialog/main.js",
        common:"./static/js/common/common.js",
        [jsPage.toString()]:"./static/js/page/"+jsModule+"/"+jsPage,
    },    
    output: {
        path: path.resolve(__dirname, "asset/js/page/"+jsModule+"/"),         
        filename: "[name]-[chunkhash:8].js",
        publicPath:"asset/js/page/"+jsModule+"/", 
        chunkFilename:"[name]-[chunkhash:8].js"
    },
    resolve: {
        alias: {
            'jquery': path.join(__dirname,"./static/js/libs/jquery/jquery.js")
        }   
    },
    module: {
        loaders: [
            {test: /\.js$/, loaders: ["babel"], exclude: /node_modules/ },
            {test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
            {
                test: /\.css$/,
                loader: "style!css"
            }
            
        ]
    },
    plugins: [  
        new webpack.ProvidePlugin({
            jQuery:path.join(__dirname,"./static/js/libs/jquery/jquery.js"),
            $: path.join(__dirname,"./static/js/libs/jquery/jquery.js"),
            'window.jQuery':path.join(__dirname,"./static/js/libs/jquery/jquery.js")
        }), 
		
        new webpack.optimize.CommonsChunkPlugin("libs",jsPage+'-[name]-[chunkhash:8].js'), 
           
        new AssetsPlugin({    
			module:jsModule,
            page:jsPage,
            // 公共模块 common
            publicModule:["common","dialog"],
            // 排序 1:libs 2:common,其它任意....
            sort:["libs","common"],
            prettyPrint: true, 
            update:true,  
            filename: path.join(__dirname,'assets.js.json'),
            processOutput: function (assets) {
                return JSON.stringify(assets); 
            }
        })
    ]
};