import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Configuration for eslint for TypeScript
 */
export default tseslint.config(
    {
        ignores: [
            'node_modules/',
            'dist/', // exclude specific folder
            '**/*.js', // exclude all JavaScript files
        ],
    },
    {
        files: ['**/*.ts'],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.recommended,
        ],
    },
);