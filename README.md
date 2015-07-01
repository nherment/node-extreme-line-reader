# node-extreme-line-reader

A few of the packages out there would mess up the lines on really big files so I built my own.
Also, these packages usually don't allow to throttle the read stream which kind of defeats the
purpose of such a module...

> There is no support for parallel processing yet.

```
    var StreamLineReader = require('extreme-line-reader')

    var lineReader = new StreamLineReader({stream: stream})

    lineReader.on('line', function(line, ack) {
      // use line here
      ack()
    })
    
    lineReader.on('end', function() {
      assert.equal(fileData.length, 0, JSON.stringify(fileData))
      done()
    })
```
