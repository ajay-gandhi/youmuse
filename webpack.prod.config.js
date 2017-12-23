/* global require, module, __dirname */
const path = require("path");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const MinifyPlugin = require("babel-minify-webpack-plugin");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./client/index.html",
  filename: "index.html",
  inject: "body",
});

module.exports = {
  entry: "./client/index.js",
  context: path.resolve(__dirname,"./client"),
  output: {
    path: path.resolve("public"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.s?css$/, use: ["style-loader", "css-loader", "sass-loader"] },
    ],
  },
  plugins: [HtmlWebpackPluginConfig, new UglifyJSPlugin(), new MinifyPlugin()],
};
