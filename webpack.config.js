/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
// import "./logo.ico";
// import './src/img/a0.jpg';
var webpack = require('webpack');
var path = require('path');
// Webpack Plugins
 var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin = require('webpack/lib/DefinePlugin');
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
 var CopyWebpackPlugin = require('copy-webpack-plugin');
var ImageminPlugin = require('imagemin-webpack-plugin').default;
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'development';
const autoprefixer = require('autoprefixer');

var metadata = {
    title: '飓风物流客户服务平台',
    // host: 'localhost',
    // port: 893,
    ENV: ENV
};
/*
 * Config
 */
module.exports = {
    metadata: metadata,

    devtool: 'source-map', //to point console errors to ts files instead of compiled js

    debug: true,

    entry: ['./src/main.ts'],

    // Config for our build files
    output: {
        path: root('dist'),
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },

    resolve: {
        // ensure loader extensions match
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.sass', '.html'],
        fallback: [path.join(__dirname, './node_modules')] //default to node_modules when not found
            // exclude: /static/
    },
    resolveLoader: {
        fallback: [path.join(__dirname, './node_modules')]
    },

    module: {
        loaders: [{
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            // {
            //     test: /\.js$/,
            //     loader: 'babel-loader',
            //     exclude: [/node_modules/]
            // },

            { test: /\.json$/, loader: 'json-loader' },

            { test: /\.css$/, loaders: ['style', 'css'] },

            { test: /\.html$/, loader: 'raw-loader', exclude: [root('src/index.html')] },

            { test: /\.(scss|sass)$/, loaders: ['style', 'css', 'sass'] },

            { test: /\.(woff|woff2|ttf|eot|svg|otf)\??.*$/, loader: 'file-loader?name=fonts/[name].[ext]' },

            { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' },

            { test: /\.(jpe?g|png|gif)$/, loader: 'file-loader?name=img/[name].[ext]' },

            { test: /\.(ico)$/, loader: 'file-loader?name=[name].[ext]' },

            { test: /\.(txt)$/, loader: 'file-loader?name=[name].[ext]' },
            // { test: /\aliyun-oss-sdk.min.js$/, loader: 'file-loader' },
            {
                test: /\.css$/,
                include: [
                    path.resolve(__dirname, "not_exist_path")
                ],
                loader: "style!css"
            }

        ]
    },
    // babel: {
    //     babelrc: false,
    //     presets: [
    //         ['es2015'],
    //     ],
    // },

    // sassResources: path.resolve(__dirname, "./node_modules/bootstrap/scss"),

    postcss: [autoprefixer], // <--- postcss

    plugins: [
        new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.bundle.js', minChunks: Infinity }),

        new ImageminPlugin({ test: /\.(jpe?g|png|gif|svg)$/i }),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({ template: 'src/index.html' }),
        new CopyWebpackPlugin([{ from: './src/static/aliyun-oss-sdk.min.js', to: './static/aliyun-oss-sdk.min.js' }]),
        new webpack.optimize.UglifyJsPlugin({
                 compress: {
                       warnings: false
                   },
                    mangle: false
              }),

        new DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(metadata.ENV),
                'NODE_ENV': JSON.stringify(metadata.ENV)
            }
        }),

        //Make jquery and Vue globally available without the need to import them
        new ProvidePlugin({
            bootbox: 'bootbox',
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            Vue: 'vue'
        })
    ],

    // our Webpack Development Server config
    devServer: {
        historyApiFallback: true,
        // watchOptions: { aggregateTimeout: 300, poll: 1000 },
        hot: true,
        inline: true,
        port: 886,
        host: 'localhost',
        proxy: {
            '/csp/**': {
                // 测试环境
                target: 'http://csp.sowl.cn',  // 接口域名
                changeOrigin: true,  //是否跨域
            },
            '/bda/**': {
                // 测试环境
                target: 'http://csp.sowl.cn',  // 接口域名
                changeOrigin: true,  //是否跨域
            },
     }
    }
};

// Helper functions

function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return root.apply(path, ['node_modules'].concat(args));
}