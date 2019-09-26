import riot from 'rollup-plugin-riot'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/riot-formr.js',
        format: 'iife',
        sourcemap:true
    },
    plugins: [
        riot(),
        nodeResolve(),
        commonjs(),
	    copy({
			targets: [
				{
					src: 'src/test.html',
					dest: 'dist/'
				}
			]
		})
    ]
}
