const assert = require('chai').assert
const sinon = require('sinon')
process.env.LOG_LEVEL = 'debug'
const log = require('../index')

/* global describe, it */
describe('noop-log', () => {
  describe('#debug()', () => {
    it('should concatenate multiple strings', () => {
      let stub = sinon.stub(console, 'log')
      log.debug('foo', 'bar')
      stub.restore()
      const event = JSON.parse(stub.getCall(0).args[0])
      assert.equal(event.level, 'debug')
      assert.equal(event.msg, 'foo bar')
    })

    it('should apply object argument properties', () => {
      let stub = sinon.stub(console, 'log')
      log.debug({foo: 'bar'})
      stub.restore()
      const event = JSON.parse(stub.getCall(0).args[0])
      assert.equal(event.level, 'debug')
      assert.equal(event.foo, 'bar')
    })

    it('should apply inner error properies for Error arguments', () => {
      let stub = sinon.stub(console, 'log')
      log.debug(new Error('shit'))
      stub.restore()
      const event = JSON.parse(stub.getCall(0).args[0])
      assert.equal(event.level, 'debug')
      assert.exists(event.inner.stack)
      assert.equal(event.inner.message, 'shit')
    })

    it('should handle various argument types', () => {
      let stub = sinon.stub(console, 'log')
      log.debug('uh', 'oh', new Error('shit'), {id: 42})
      stub.restore()
      const event = JSON.parse(stub.getCall(0).args[0])
      assert.equal(event.level, 'debug')
      assert.exists(event.inner.stack)
      assert.equal(event.inner.message, 'shit')
      assert.equal(event.msg, 'uh oh')
      assert.equal(event.id, 42)
    })
  })
})
