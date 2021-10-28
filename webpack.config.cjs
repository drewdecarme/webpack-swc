const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "production",
  // experimental for ESM outputs
  experiments: {
    // https://webpack.js.org/configuration/experiments/#experimentsoutputmodule
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    /**
     * need to include this to make sure that webpack knows your building
     * a library instead of an application. If you don't include the library
     * key you're going to continually get a blank output
     */
    //
    library: {
      /**
       * Need to remove `name`. Naming your library doesn't jive with exporting it as a module
       */
      // name: "components",
      type: "module",
    },
    // sets the output to ESM syntax
    module: true,
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)?$/,
        use: "swc-loader",
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              /**
               * Allows us to hash the names of our CSS
               * in the library so they don't clash
               */
              modules: true,
            },
          },
        ],
        exclude: /node_modules/,
        sideEffects: true,
      },
    ],
  },
  externalsPresets: { node: true },
  // only bundle the code that you write
  // and not the other external dependencies
  // it will be up to the consume to download them
  externals: [nodeExternals()],
  plugins: [
    new MiniCssExtractPlugin({
      filename: "index.css",
    }),
  ],
};
