import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

export default {
  input: './src/brynja.ts',
  output: {
    file: './cdn/brynja.js',
    format: 'iife',
    name: 'brynja'
  },
  plugins: [
      typescript(),
      resolve(),
      commonjs(),
      minify({
        comments: false,
      }),
  ]
}