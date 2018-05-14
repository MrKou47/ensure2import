const chalk = require('chalk').default;

exports.error = function error(error) {
  console.log(chalk.red(`[ERROR]: ${error}`));
}

exports.success = function success(info) {
  console.log(chalk.green(info));
}

exports.warn = function warn(warn) {
  console.log(chalk.yellow(`[WARNING]: ${warn}`));
}