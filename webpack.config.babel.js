import { join } from "path";

const include = join(__dirname, "src");

export default {
  entry: "./src/index",
  output: {
    path: join(__dirname, "dist"),
    filename: 'fauna.js',
    // globalObject: 'this',
    libraryTarget: "umd",
    library: "fauna"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader'
      }
    ]
  }
};
