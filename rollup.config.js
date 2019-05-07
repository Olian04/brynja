import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/brynja.ts',
  output: {
    file: './cdn/brynja.js',
    format: 'iife',
    name: 'brynja'
  },
  plugins: [
      typescript()
  ]
}