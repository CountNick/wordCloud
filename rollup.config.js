import babel from 'rollup-plugin-babel';
import injectEnv from 'rollup-plugin-inject-env';

export default {
    input: 'js/index.js',
    output: {
        file: './build/bundle.min.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        injectEnv({
            envFilePath: '.env'
        })

    ]
}