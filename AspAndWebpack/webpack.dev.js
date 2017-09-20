const path = require("path");
const webpack = require("webpack");
const Merge = require("webpack-merge");
const CommonConfig = require("./webpack.common.js");

module.exports = Merge(CommonConfig, {
    devtool: "inline-source-map",

    entry: path.resolve(__dirname, "src/index.ts"),

    output: {
        filename: "bundle.js",
        path: __dirname + "/dist",
        // Making sure the CSS and JS files that are split out do not break the template cshtml.
        publicPath: "/dist/",
        // Defining a global var that can used to call functions from within ASP.NET Razor pages.
        library: "aspAndWebpack",
        libraryTarget: "var"
    },

    module: {
        loaders: [
            // All css files will be handled here
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },

            // All files with ".less" will be handled and transpiled to css
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            }
        ]
    },

    plugins: ([
        new webpack.DefinePlugin({
            "process.env": {
                "NODE_ENV": JSON.stringify("development")
            }
        })
    ]),
})