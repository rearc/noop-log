let logLevel = process.env.LOG_LEVEL || 'info'

exports.setLevel = (level) => { logLevel = level }

exports.debug = (...args) => {
  if (!isLevelEnabled(['debug'])) return false
  if (logLevel !== 'debug') return false
  args.unshift('debug')
  log.apply(null, args)
}

exports.info = (...args) => {
  if (!isLevelEnabled(['debug', 'info'])) return false
  args.unshift('info')
  log.apply(null, args)
}

exports.warn = (...args) => {
  if (!isLevelEnabled(['debug', 'info', 'warn'])) return false
  args.unshift('warn')
  log.apply(null, args)
}

exports.error = (...args) => {
  if (!isLevelEnabled(['debug', 'info', 'warn', 'error'])) return false
  args.unshift('error')
  log.apply(null, args)
}

exports.fatal = (...args) => {
  if (!isLevelEnabled(['debug', 'info', 'warn', 'error', 'fatal'])) return false
  args.unshift('fatal')
  log.apply(null, args)
}

function isLevelEnabled (allowedList) {
  return (allowedList.indexOf(logLevel) !== -1)
}

function log (...args) {
  const level = args.shift()
  let message = ''
  const event = {
    level: level,
    date: new Date()
  }
  args.forEach((arg) => {
    if (typeof arg === 'string') {
      if (message.length) message += ' '
      message += arg
    } else if (arg instanceof Error) {
      event.inner = {
        message: arg.message,
        stack: arg.stack
      }
    } else if (typeof arg === 'object') {
      Object.keys(arg).forEach((key) => {
        if (key === 'level') return false
        if (key === 'date') return false
        if (key === 'msg') return false
        event[key] = arg[key]
      })
    }
  })
  event.msg = message
  console.log(JSON.stringify(event))
}

exports.requestLogger = function (req, res, next) {
  req.startTime = new Date()

  res.on('finish', () => {
    const event = {
      method: req.method,
      url: req.url,
      duration: new Date().getTime() - req.startTime.getTime(),
      status: res.statusCode
    }
    let level = 'info'
    if (res.statusCode >= 400) level = 'warn'
    if (res.statusCode >= 500) level = 'error'
    exports[level]('request', event)
  })
  next()
}
