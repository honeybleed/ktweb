const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: "development",
    devtool: "source-map",
    target: "web",
    watch: true,
    entry: {
        index: path.join(__dirname, 'src/index.ts')
    },
    optimization: {

    },
    output: {
        filename: "[name].js",
        publicPath: "/public/",
        path: path.join(__dirname, 'public/')
    },
    resolve:{
        extensions: ['.ts', '.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.scss?$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                            config: {
                                path: './postcss.config.js'
                            }
                        }
                    },
                    "sass-loader"
                ]
            }
        ]
    },
    devServer: {
        port: 8080,
        inline: true
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename:"style.css"
        })
    ]
};