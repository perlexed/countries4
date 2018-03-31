const path = require('path');

module.exports = {
    entry: [
        './js/index.js'
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'web/js')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    devServer: {
        contentBase: './web/js',
    },
};
