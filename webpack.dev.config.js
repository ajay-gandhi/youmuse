/* global require, module */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: "./client/index.html",
  filename: "index.html",
  inject: "body",
});

module.exports = {
  entry: "./client/index.js",
  output: {
    path: path.resolve("public"),
    filename: "bundle.js",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devServer: {
    historyApiFallback: true,
  },
  module: {
    rules: [
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.s?css$/, use: ["style-loader", "css-loader", "sass-loader"] },
    ],
  },
  plugins: [HtmlWebpackPluginConfig],
};
