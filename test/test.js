
var fs = require('fs')
var assert = require('assert')

var StreamLineReader = require('../StreamLineReader.js')

describe('StreamLineReader', function() {

  it('read lines', function(done) {
    var fileData = fs.readFileSync(__dirname + '/test.js', 'utf8').split('\n')
    var stream = fs.createReadStream(__dirname + '/test.js')

    var lineReader = new StreamLineReader({stream: stream})

    lineReader.on('line', function(line, ack) {
      assert.equal(line, fileData.shift())
      ack()
    })
    
    lineReader.on('end', function() {
      assert.equal(fileData.length, 0, JSON.stringify(fileData))
      done()
    })
  })
  
})
