const worker_threads = require('worker_threads')

const genPassword = (data) => {  // в дата будут приходить биты
  return new Promise(((res, rej) =>{
    const worker = new worker_threads.Worker('./worker.js', {
      workerData: size,
    })
      worker.on('message', res)
      worker.on('error', rej)
    }))
}

(async () => {
  const passwordBytesSize = 10
  try {
      const result = await genPassword(passwordBytesSize)
      console.log(result)
  } catch (e) {
      console.log(e)
  }
})()
