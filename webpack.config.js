var path = require('path')

module.exports = {
  entry: './app/index.js',
  output: {
    filename: 'all.js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'cheap-eval-source-map',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(png|svg|jpg|gif)$/, use: ['file-loader?name=[name].[ext]?[hash]'] },
      { test: /\.(woff|woff2|eot|ttf|otf)$/, use: ['file-loader?name=[name].[ext]?[hash]'] }
    ]
  }
}
