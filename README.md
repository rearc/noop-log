# noop-log
JS logging library for Noop components following Noop standard JSON format. The
library is very simple and allows mixed types to be output easily (strings,
objects, and Errors). This library is hosted publicly on NPM.

## Quickstart
```
const log = require('noop-log')
log.info('something happened', 'over here', {id: 42}, new Error('damn'))
```

This outputs a single line JSON object with all the arguments above like:
```
{"level":"info","date":"2018-03-16T19:20:13.951Z","id":42,"inner":{"message":"damn","stack":"Error: damn\n    at repl:1:55\n    at sigintHandlersWrap (vm.js:22:35)\n    at sigintHandlersWrap (vm.js:73:12)\n    at ContextifyScript.Scr
ipt.runInThisContext (vm.js:21:12)\n    at REPLServer.defaultEval (repl.js:340:29)\n    at bound (domain.js:280:14)\n    at REPLServer.runBound [as eval] (domain.js:293:12)\n    at REPLServer.<anonymous> (repl.js:538:10)\n    at emit
One (events.js:101:20)\n    at REPLServer.emit (events.js:188:7)"},"msg":"something happened over here"}
```

## Log Levels
The log output level defaults to `info` but can be configured through the
`LOG_LEVEL` environment variable. The available levels in order of severity are:
- `log.debug()`
- `log.info()`
- `log.warn()`
- `log.error()`
- `log.fatal()`

## Argument Types
All logging functions accept unlimited arguments of the `string`, `object`, and
`Error` types.
- `string` all strings provided as arguments will be concatenated (in the order
  provided) into the `msg` property of the output event
- `object` all object types provided as arguments result in their properties
  being added to the output event. `log.info({id: 42, name: 'foo'})` will result
  in the output event having the `id` and `name` properties applied. This also
  includes deep objects.
- `Error` all JS Error object types will be have their details added to the
  `inner` property of the output event. This fits the common case of recording
  the details of a lower level error along with your own message.
