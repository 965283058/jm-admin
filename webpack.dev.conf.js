var path = require('path')
var webpack = require('webpack')
var autoprefixer = require('autoprefixer')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
    entry: {
        main: [path.resolve(__dirname, 'src/entry.js')]
    },
    output: {
        publicPath: '/admin',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js', '.css', '.vue', '.json'],
        alias: {
            'vue': 'vue/dist/vue.js',
            'pages': path.resolve(__dirname, 'src/pages'),
            'plugins': path.resolve(__dirname, 'src/plugins'),
            'components': path.resolve(__dirname, 'src/components'),
            'apis': path.resolve(__dirname, 'src/apis'),
            'plugin': path.resolve(__dirname, 'src/plugin')
        }
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, 'index.html')
        }),
        new CopyWebpackPlugin([
            {
                from: path.resolve(process.cwd(), 'static'),
                to: 'static',
                ignore: ['.*']
            }
        ])
    ],
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                loader: 'file-loader',
                query: {
                    name: '[name].[ext]?[hash]'
                }
            }
        ]
    },
    babel: {
        presets: ['es2015', 'stage-0'],
        plugins: ['transform-vue-jsx', 'transform-runtime']
    },
    vue: {
        postcss: [
            autoprefixer({browsers: ['last 7 versions']}),
        ]
    },
    devServer: {
        noInfo: true
    },
    server: {
        port: 9998,
        proxy: {
            host: 'http://127.0.0.1:9999',
            match: /^\/manage\//
        }
    }
}
