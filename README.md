#  throttle-bucket
This simple utility uses Promises to implement a bucket-type rate limiter to be respectful of api rate limits. After using up the tokens in the bucket, it queues any additional calls and resolves them when the bucket is refilled.

Use it either with the Promise api, or – more conveniently – with `await` (only works in `async`functions, not on the top-level).


## Usage with Promise api
```javascript
const rateLimit = require('throttle-bucket')({ bucketSize: 3, bucketRefreshDelay: 10000 })

rateLimit().then(() => { console.log('Request 1') })
// executed immediately

rateLimit().then(() => { console.log('Request 2') })
// executed immediately

rateLimit().then(() => { console.log('Request 3') })
// executed immediately, starts countdown for refilling the bucket after 10 seconds

rateLimit().then(() => { console.log('Request 4') })
// executed when the bucket is refilled

rateLimit(3).then(() => { console.log('Request 5') })
// you can set a higher numbers of tokens if you plan to make multiple api calls. This call will set a timeout for refilling the bucket and will execute only after the bucket is refilled.

rateLimit().then(() => { console.log('Request 6') })
// This call does not jump ahead of Request 5 in the queue due to the naive implementation. It will execute after the bucket is refilled again.
```



## Usage with async / await
```javascript
const rateLimit = require('throttle-bucket')({ bucketSize: 3, bucketRefreshDelay: 10000 })

async function apiRequests() {
  await rateLimit() // before each api call, *await* a rateLimit call.
  console.log('Request 1') // executed immediately

  await rateLimit(2) // set a higher number of tokens if you plan to make multiple api calls (or use a more costly api method). As this uses the last two tokens in the bucket, a countdown for the refilling is set.
  console.log('Request 2') // executed immediately, 
  console.log('Request 3') // executed immediately, 

  await rateLimit()
  console.log('Request 4') // executed after the bucket is refilled
}
```

# Licence
MIT License

Copyright (c) 2020 Simon Ruf

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
