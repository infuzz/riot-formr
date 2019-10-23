import riot from 'rollup-plugin-riot'
import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser';

export default [
	{
		input: 'src/main.js',
		output: {
			file: 'dist/riot-formr.js',
			//format: 'iife',
			format: 'es', //node+script compatible
			sourcemap:true
		},
		plugins: [
			riot(),
			nodeResolve(),// prise en charge des modules depuis node_modules
			commonjs(),// prise en charge de require
			copy({
				targets: [
					{
						src: 'src/index.html',
						dest: 'dist/'
					}
				]
			}),
			terser() // minification
		]
	},
	{
		input: 'src/demo.js',
		output: {
			file: 'dist/demo-riot-formr.js',
			//format: 'iife',
			format: 'es',//node+script compatible
			sourcemap:true
		},
		plugins: [
			riot(),
			nodeResolve(),// prise en charge des modules depuis node_modules
			commonjs(),// prise en charge de require
			copy({
				targets: [
					{
						src: 'src/demo.html',
						dest: 'dist/'
					}
				]
			}),
			terser() // minification
		]
	},
	
]
