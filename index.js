const throttleBucketFactory = function({ bucketSize, bucketRefreshDelay } = { bucketSize: 3, bucketRefreshDelay: 10000 }) { // default: 3 tokens available, pause for 10 seconds after using last token
  let bucket = bucketSize
  let bucketRefreshTimeout
  const queue = []

  function bucketRefresh() {
    bucket = bucketSize

    while (bucket > 0 && queue.length > 0 && bucket-queue[0].tokensNeeded >= 0) {
      bucket -= queue[0].tokensNeeded
      queue.shift().resolve()
    }

    bucketRefreshTimeout = (queue.length > 0 || bucket == 0) ? setTimeout(bucketRefresh, bucketRefreshDelay) : undefined
  }

  return function throttleBucket(tokensNeeded = 1) {
    if (tokensNeeded > bucketSize) {
      throw Error('apiThrottle called with tokensNeeded larger than bucketSize')
    }

    if (bucketRefreshTimeout) {
      return new Promise(function (resolve) {
        queue.push({ tokensNeeded, resolve })
      })
    }

    if (bucket-tokensNeeded > 0) {
      bucket -= tokensNeeded
      return Promise.resolve()
    }

    if (bucket-tokensNeeded == 0) {
      bucketRefreshTimeout = setTimeout(bucketRefresh, bucketRefreshDelay)
      bucket -= tokensNeeded
      return Promise.resolve()
    }

    bucketRefreshTimeout = setTimeout(bucketRefresh, bucketRefreshDelay)

  }
}

module.exports = throttleBucketFactory
