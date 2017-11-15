var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var ENV = process.env.NODE_ENV;

var cssLoader = ENV === 'production' ? ExtractTextPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'postcss-loader', 'sass-loader']
}) : ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'];

module.exports = {
    entry: {
        'index': ['./src/scripts/index.ts', './src/styles/index.scss'],
    },

    module: {
        rules: [{
                test: /\.ts$/,
                exclude: /(libs|node_modules)/,
                loader: 'ts-loader'
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        // limit: 8192,
                        // fallback options
                        name: '[name].[ext]',
                        outputPath: 'images/'
                    }
                }]
            },
            {
                test: /[^(\.g)]\.(scss|sass)$/,
                use: cssLoader
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            }
        ],
    },

    externals: {},

    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@styles': path.resolve(__dirname, '../src/styles'),
            '@images': path.resolve(__dirname, '../src/images')
        }
    },

    plugins: [
        // new webpack.ContextReplacementPlugin(
        //     /angular(\\|\/)core(\\|\/)@angular/,
        //     path.resolve(__dirname, '../src') // location of your src
        // ),

        new webpack.optimize.CommonsChunkPlugin({
            // name: ['index', 'game', 'record']
            name: 'vendors', // 将公共模块提取，生成名为`vendors`的chunk
            chunks: ['index', 'game', 'record'], //提取哪些模块共有的部分
            minChunks: 3 // 提取至少3个模块共有的部分
        }),

        new HtmlWebpackPlugin({
            template: 'src/index.html',
            chunks: ['vendors', 'index']
        })
    ]
};