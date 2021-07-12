const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode:'development',
    devtool: 'source-map',
    entry: {
        init: './src/scripts/init.js',
        login: './src/scripts/init.login.js'
    },
    output: {
        path: path.join(__dirname, 'public/scripts/'),
        filename: '[name].bundle.js',
        publicPath: '/scripts/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            template: "./src/index.html",
            chunks: ["init"],
            filename: path.join(__dirname, "views/index.html"),
            minify: false
        }),
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            template: "./src/index.html",
            chunks: ["login"],
            filename: path.join(__dirname, "views/login.html"),
            minify: false
        }),
        new MiniCssExtractPlugin({
            filename: path.join('../css/[name].css')
        })
    ],
    module: {
       
        rules: [
            { test: /\.css$/i, 
                use: [MiniCssExtractPlugin.loader, 'css-loader'] 
            },
            { test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: '../img/[hash][ext][query]'
                }
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                use: ["url-loader"]
            },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, 
                use: [
                    { loader: "file-loader" },
                ] },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,

        host: 'localhost', // Defaults to `localhost`
        port: 8000, // Defaults to 8080
        proxy: {
            '^/*': {
                target: 'http://localhost:5000/',
                secure: false
            }
        }
    }
};