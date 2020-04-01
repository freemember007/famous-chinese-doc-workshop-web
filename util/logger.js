/*
 * 自定义logger库
 */
const colors = require('colors')
const logger = require('tracer').colorConsole({
  format: '<{{file}}:{{line}}> {{message}}\n\r',
  filters: {
    // log   : colors.blue,
    trace : colors.magenta,
    debug : colors.blue,
    info  : colors.green,
    warn  : colors.yellow,
    error : [colors.red, colors.bold],
  },
})

module.exports = logger
