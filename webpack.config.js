const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

function scriptRules() {
  return [
    {
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{ loader: "babel-loader" }],
    },
  ];
}

module.exports = {
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
    minimize: true,
  },
  entry: {},
  output: {
    path: __dirname + "/public/js",
    filename: "[name].js",
  },
  module: {
    rules: scriptRules(),
    loaders: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
