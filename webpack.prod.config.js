/* global module, __dirname */

module.exports = {
  entry: ["./client/index.js"],
  output: {
    path: __dirname,
    publicPath: "/",
    filename: "bundle.js",
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
};
