import express from 'express'
import http from 'http'
import createGame from './public/game.js'
import { Server } from 'socket.io';

const app = express()
const server = http.createServer(app)
const sockets = new Server(server);

app.use(express.static('public'))

const game = createGame()

game.subscribe((command) => sockets.emit(command.type, command))

sockets.on('connection', (socket) => {

    game.addPlayer({playerId:socket.id})

    socket.emit('setup', game.state)

    socket.on('disconnect', () => game.removePlayer({playerId:socket.id}))

    socket.on('move-player', (command) => {
        command.playerId = socket.id
        command.type = 'move-player'
        game.movePlayer(command)
    })
})




server.listen(3000, ()=>{
    console.log('oi eu sou o goku e estou rodando na porta 3000')
})
