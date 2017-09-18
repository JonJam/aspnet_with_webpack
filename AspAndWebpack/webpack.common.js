const path = require("path");
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractLess = new ExtractTextPlugin({
    filename: "[name].[contenthash].css"
});

// Images, Fonts Loading: https://webpack.js.org/guides/asset-management/
// LESS Loading: https://webpack.js.org/loaders/less-loader/
// Code splitting: https://webpack.js.org/guides/code-splitting
// Caching: https://webpack.js.org/guides/caching/

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        vendor: [
            "jquery",
            "jquery-validation",
            "bootstrap"
        ]
    },
    target: 'web',
    output: {
        filename: "[name].[chunkhash].js",
        path: __dirname + "/dist",
        // Making sure the CSS and JS files that are split out do not break the template cshtml.
        publicPath: "/dist/",
        // Defining a global var that can used to call functions from within ASP.NET Razor pages.
        library: "aspAndWebpack",
        libraryTarget: "var"
    },
    resolve: {
        // Add ".ts" and ".tsx" as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", ".html"],
    },
    module: {
        loaders: [
            // All files with a ".ts" or ".tsx" extension will be handled by "awesome-typescript-loader".
            { test: /.ts$/, loader: "awesome-typescript-loader" },
            // All css files will be handled here
            {
                test: /\.css$/,
                use: extractLess.extract({ fallback: 'style-loader', use: ['css-loader'] })
            },
            // All files with ".less" will be handled and transpiled to css
            {
                test: /\.less$/,
                use: extractLess.extract({
                    use: [{
                        loader: "css-loader", options: {
                            sourceMap: true
                        }
                    }, {
                        loader: "less-loader", options: {
                            sourceMap: true
                        }
                    }]
                })
            },
            // All image files will be handled here
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            },
            // All font files will be handled here
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader'
                    }
                ]
            },
            // All files with ".html" will be handled 
            { test: /\.html$/, loader: "html-loader" },
            // All output ".js" files will have any sourcemaps re-processed by "source-map-loader".
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
    },
    plugins: ([
        // Always expose NODE_ENV to webpack, you can now use `process.env.NODE_ENV`
        // inside your code for any environment checks;
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),

        // make sure we allow any jquery usages outside of our webpack modules
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),

        // Clean dist folder.
        new CleanWebpackPlugin(['./dist'], {
            "verbose": true // Write logs to console.
        }),

        // avoid publishing when compilation failed.
        new webpack.NoEmitOnErrorsPlugin(),

        // Split out library into seperate bundle and remove from app bundle.
        new webpack.HashedModuleIdsPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),

        // Webpack boilerplate and manifest in seperate file.
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),

        // Write out CSS bundle to its own file:
        extractLess,

        new HtmlWebpackPlugin({
            inject: "body",
            filename: "../../Views/Shared/_Layout.cshtml",
            template: "./Views/Shared/_Layout_Template.cshtml"
        })
    ]),

    // pretty terminal output
    stats: { colors: true }
};