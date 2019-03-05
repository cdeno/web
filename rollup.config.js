import resolve from 'rollup-plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import serve from 'rollup-plugin-serve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/build.js',
    sourcemap: 'inline',
    format: 'iife',
    globals: {
      'react': 'React',
      'react-dom': 'ReactDOM',
      'react-router-dom': 'ReactRouterDOM'
    }
  },
  plugins: [
    resolve(),
    commonjs({
      include: ['node_modules/**']
    }),
    globals(),
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      port: 3001,
      contentBase: 'dist',
      historyApiFallback: true
    })
  ],
  external: ['react', 'react-dom', 'react-router-dom']
}
