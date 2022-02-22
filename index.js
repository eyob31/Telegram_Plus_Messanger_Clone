const express = require('express')
const http = require('http')
const app = express()
const port = process.env.PORT || 5000
const server = http.createServer(app)
const io = require('socket.io')(server)

// middleware
app.use(express.json())
let clients = {}
const routes = require('./routes')
app.use('/routes', routes)

io.on('connection', (socket) => {
  console.log('Connected')
  console.log(socket.id, 'hasjoined')
  socket.on('signin', (id) => {
    console.log(id)
    clients[id] = socket
    console.log(clients)
  })
  socket.on('message', (msg) => {
    console.log(msg)
    const targetId = msg.targetId
    if (clients[targetId]) {
      clients[targetId].emit('message', msg)
    }
  })
})

app.route('/check').get((req, res) => {
  return res.json('Your App is Working fine')
})

server.listen(port, '0.0.0.0', () => {
  console.log('Server is started')
})
