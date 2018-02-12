const path = require('path');

module.exports = {
    entry: './js/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'web/js')
    },
    module: {
        loaders: [
            {
                test: /.js/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    plugins: [
                        'transform-class-properties',
                    ],
                    presets: ['env', 'react'],
                },
            },
        ]
    },
};
