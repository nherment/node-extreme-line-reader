
var util = require('util')
var EventEmitter = require('events').EventEmitter

function StreamLineReader(options) {
  this._stream = options.stream
  EventEmitter.call(this)

  var line = null
  var pendingCallbacks = 0
  var self = this
  
  this._stream.on('data', function(chunk) {
    processChunk(chunk)
  })

  function processChunk(chunk) {
    if(!chunk) {
      return
    }
    if(line === null) {
      line = ''
    }
    //console.log(chunk.toString('utf8'))
    var splittedChunkStr = chunk.toString('utf8').split('\n')
    if(splittedChunkStr.length > 1) {
      self._stream.pause()
      line += splittedChunkStr.shift()
      pendingCallbacks ++
      self.emit('line', line, ackLineProcessedCallback)
      // do not process the last split because we don't know if it is a full line yet
      while(splittedChunkStr.length > 1) {
        pendingCallbacks ++
        var str = splittedChunkStr.shift()
        self.emit('line', str, ackLineProcessedCallback)
      }
      line = splittedChunkStr.shift()
    } else {
      line += splittedChunkStr.shift()
    }
    
  }
  
  this._stream.on('end', function(chunk) {
    processChunk(chunk)
    flush()
    self.emit('end')
  })

  function flush() {
    if(line !== null) {
      // ack is a no-op here because flush is the last line we send so we
      // don't care about an ack
      self.emit('line', line, function() {})
      line = null;
    }
  }

  function ackLineProcessedCallback() {
    pendingCallbacks --
    if(pendingCallbacks === 0) {
      self._stream.resume()
    }
  }
}

util.inherits(StreamLineReader, EventEmitter)

module.exports = StreamLineReader
