const glob = require("glob");
const path = require("path");
const PAGE_PATH = path.resolve(__dirname, "../src/renderer/pages");
const HtmlWebpackPlugin = require("html-webpack-plugin");

exports.entries = function () {
  /*用于匹配 pages 下一级文件夹中的 index.js 文件 */
  let entryFiles = glob.sync(PAGE_PATH + "/*/main.js");
  let map = {};
  entryFiles.forEach((filePath) => {
    /* 下述两句代码用于取出 pages 下一级文件夹的名称 */
    let entryPath = path.dirname(filePath);
    let filename = entryPath.substring(entryPath.lastIndexOf("/") + 1);
    /* 生成对应的键值对 */
    map[filename] = filePath;
  });
  return map;
};

exports.htmlPlugin = function () {
  let entryHtml = glob.sync(PAGE_PATH + "/*/index.ejs");
  let arr = [];
  entryHtml.forEach((filePath) => {
    let entryPath = path.dirname(filePath);
    let filename = entryPath.substring(entryPath.lastIndexOf("/") + 1);
    let conf = {
      template: filePath,
      filename: filename + `/index.html`,
      chunks: ["manifest", "vendor", filename],
      inject: true,
      nodeModules: path.resolve(__dirname, "../node_modules"),
      templateParameters(compilation, assets, options) {
        return {
          // compilation: compilation,
          // webpack: compilation.getStats().toJson(),
          // webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            files: assets,
            options: options,
          },
          process,
        };
      },
    };
    if (process.env.NODE_ENV === "production") {
      let productionConfig = {
        minify: {
          removeComments: true, // 移除注释
          collapseWhitespace: true, // 删除空白符和换行符
          removeAttributeQuotes: true, // 移除属性引号
        },
        chunksSortMode: "dependency", // 对引入的chunk模块进行排序
      };
      conf = { ...conf, ...productionConfig }; //合并基础配置和生产环境专属配置
    }
    arr.push(new HtmlWebpackPlugin(conf));
  });
  return arr;
};
