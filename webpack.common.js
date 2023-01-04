import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
import path from 'path';
import { resolve as _resolve } from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import Dotenv from 'dotenv-webpack';

export const entry = './src/index.ts';
export const target = 'node';
export const mode = 'development';
export const devtool = 'source-map';
export const optimization = {
  usedExports: true,
};
export const output = {
  filename: 'index.js',
  path: _resolve(__dirname, 'dist'),
};

export const module = {
  rules: [
    {
      test: /\.ts?$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    },
  ],
};
export const resolve = {
  extensions: ['.ts', '.js'],
  modules: [path.join(__dirname, 'node_modules')],
  mainFields: ['module', 'main'],
};
export const plugins = [
  new CleanWebpackPlugin(),
  new ForkTsCheckerWebpackPlugin(),
  new ESLintPlugin({
    extensions: ['.ts', '.js'],
    exclude: 'node_modules',
  }),
  new Dotenv(),
];
