import riot from 'rollup-plugin-riot'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/js/bundle.js',
        format: 'iife'
    },
    plugins: [
        riot(),
        nodeResolve(),
        commonjs(),
        copy({
            targets: [
                {
                    src: 'src/index.html',
                    dest: 'dist/'
                },
                {
                    src: 'assets/images/*',
                    dest: 'dist/images'
                }
            ]
        })
    ]
}
