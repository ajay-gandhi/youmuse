/* global require, module, __dirname */
const path = require("path");
const webpack = require("webpack");

module.exports = {
  // devtool: "source-map",
  entry: ["./client/index.js"],
  output: {
    path: path.join(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/public/",
  },
  plugins: [
    // new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: { warnings: false },
    }),
    new webpack.DefinePlugin({
      "process.env": { "NODE_ENV": JSON.stringify("production") },
    }),
  ],
  module: {
    rules: [
      { test: /\.jsx?$/, use: "babel-loader", exclude: /node_modules/ },
      { test: /\.s?css$/, use: ["style-loader", "css-loader", "sass-loader"] },
    ],
  },
  // plugins: [HtmlWebpackPluginConfig, new UglifyJSPlugin(), new MinifyPlugin()],
};
