const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  cache: {
    type: "filesystem"
  },
  experiments: {
    // experimental for ESM outputs
    // https://webpack.js.org/configuration/experiments/#experimentsoutputmodule
    outputModule: true
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    module: true,
    /**
     * need to include this to make sure that webpack knows your building
     * a library instead of an application. If you don't include the library
     * key you're going to continually get a blank output
     */
    //
    library: {
      type: "module"
    }
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".css"]
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: "swc-loader"
      },
      {
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sassOptions: {
                outputStyle: "compressed"
              }
            }
          }
        ],
        exclude: /node_modules/,
        sideEffects: true
      }
    ]
  },
  // only bundle the code that you write
  // and not the other external dependencies
  // it will be up to the consume to download them
  externals: [nodeExternals()],
  externalsPresets: { node: true },
  /**
   * Output the CSS that is imported so it can be imported into another project
   */
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css"
    })
  ]
};
