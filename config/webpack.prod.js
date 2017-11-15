var webpack = require('webpack');
// var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpackMerge = require('webpack-merge');
var commonConfig = require('./webpack.common.js');
var path = require('path');

const ENV = process.env.NODE_ENV;
console.log(ENV);

module.exports = webpackMerge(commonConfig, {
    // devtool: 'source-map',

    output: {
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[id].[hash].chunk.js'
    },

    plugins: [
        new ExtractTextPlugin('css/[name].css'), // singleton stylesheet

        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                eval: true,
                toplevel: true,
            },
            comments: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'ENV': JSON.stringify(ENV)
            }
        })
        //, new CopyWebpackPlugin([
        //   {
        //     from: './images',
        //     to: './images',
        //     toType: 'dir'
        //   }
        // ]),
        // new HtmlWebpackPlugin({
        //     filename: 'index.html',
        //     template: 'src/product.ejs'
        // })
    ]
});