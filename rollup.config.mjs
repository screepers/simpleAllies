import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import clear from 'rollup-plugin-clear';

export default [
    {
        input: {
            simpleAllies: './src/simpleAllies.ts',
            exampleBot: './src/exampleBot.ts',
        },
        output: [
            {
                dir: './dist',
                format: 'cjs',
            },
        ],
        plugins: [
            clear({ targets: ['./dist'] }),
            resolve({ rootDir: './src' }),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' }),
        ],
        external: [/node_modules/],
    },
];
