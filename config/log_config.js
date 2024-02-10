let log4js = require("log4js");
let path = require("path");
let fs = require("fs");
let basePath = path.resolve(__dirname, "../logs");

let errorPath = basePath + "/errors/";
let resPath = basePath + "/info/";

let errorFilename = errorPath + "/error";
let resFilename = resPath + "/info";

/**
 * 确定目录是否存在，如果不存在则创建目录
 */
let confirmPath = function (pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr);
    console.log("createPath: " + pathStr);
  }
};
log4js.configure({
  appenders: {
    console: {
      type: 'console'
    },
    errorLog: {
      type: "dateFile",
      filename: errorFilename,
      alwaysIncludePattern: true,
      pattern: "-yyyy-MM-dd.log",
      backups: 8,
      numBackups: 8,
    },
    // responseLog: {
    //   type: "dateFile",
    //   filename: resFilename,
    //   alwaysIncludePattern: true,
    //   pattern: "-yyyy-MM-dd.log",
    //   backups: 8,
    //   numBackups: 8,
    // }
  },
  categories: {
    // errorLog: { appenders: ['errorLog', 'console'], level: 'trace' },
    debug: { appenders: ['console'], level: 'debug' },
    // errorLog: { appenders: ['errorLog', 'console'], level: 'trace' },
    // responseLog: { appenders: ["responseLog"], level: "info" },
    default: { appenders: ['errorLog', 'console'], level: 'trace' }
  },
  disableClustering: true
});
if (basePath) {
  confirmPath(basePath);
  confirmPath(errorPath);
  confirmPath(resPath);
}

module.exports = log4js;
