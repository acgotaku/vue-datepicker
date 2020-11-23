'use strict';
const path = require('path');
const ICON_PATH = path.resolve(__dirname, 'src/assets/icons');

module.exports = {
  publicPath: process.env.ASSETS_PATH,
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    port: 3300
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(ICON_PATH)
      .end();
  },
  configureWebpack: () => {
    return {
      module: {
        unknownContextCritical: false,
        rules: [
          {
            test: /\.(gif|png|jpe?g|svg)$/i,
            exclude: [ICON_PATH],
            use: [
              {
                loader: 'image-webpack-loader',
                options: {
                  mozjpeg: {
                    progressive: true,
                    quality: 65
                  },
                  // optipng.enabled: false will disable optipng
                  optipng: {
                    enabled: false
                  },
                  pngquant: {
                    quality: '65-90',
                    speed: 4
                  },
                  gifsicle: {
                    interlaced: false
                  },
                  svgo: {
                    plugins: [
                      {
                        cleanupIDs: false
                      }
                    ]
                  }
                }
              }
            ]
          },
          {
            test: /\.svg$/i,
            include: [ICON_PATH],
            use: [
              {
                loader: 'svg-sprite-loader',
                options: {
                  symbolId: 'icon-[name]'
                }
              },
              {
                loader: 'image-webpack-loader',
                options: {
                  svgo: {
                    plugins: [
                      {
                        cleanupIDs: false
                      }
                    ]
                  }
                }
              }
            ]
          }
        ]
      }
    };
  }
};
