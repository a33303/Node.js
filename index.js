const socket = require('socket.io')
const http = require('http')
const fs = require('fs')
const path = require('path')

//Создание сервера
const server = http
  .createServer(((req, res) => {
    if (req.method === 'GET') {
      const indexPath = path.join(__dirname, 'index.html')
      const readStream = fs.createReadStream(indexPath)
      readStream.pipe(res)
    }  else {
      res.statusCode = 405;
      res.end();
    }
  }))

// переменная сокет
const io = socket(server)
const online = []

io.on('connection', client => {
  let userName = (Math.random() + 1).toString(36).substring(7)
  online.push({userName, client})
  console.log('Присоединился: ', userName)
  // отключение пользователя
  client.on('disconnect', () => {
    console.log('Отключился: ', userName)
  })

  //передача из index.html client-msg
  client.on('client-msg', data => {
    const payload = {
      message: data.message,
      user: userName
    }
    // созданное событие client вызываем в server-msg
    // broadcast сообщает всем, кроме меня
    client.broadcast.emit('server-msg', payload)
    client.emit('server-msg', payload)
    })

    // создание событий подключений
    client.on('connection', () => {
      const statusConnect = {
      message:'Присоединился к чату',
      user: userName
      }
      client.broadcast.emit('server-msg', statusConnect)
    })
    client.on('disconnect', () => {
      const statusDisconnect = {
      message:'Отключился',
      user: userName
      }
      client.broadcast.emit('server-msg', statusDisconnect)
    })
})

server.listen(5555)
