export default function createGame(){
    const state = {
        players:{},
        fruits :{},
        screen :{
            width: 10,
            height: 10
        }
    }

    const observers = []

    const subscribe = (observerFunction) => observers.push(observerFunction)

    const notifyAll = (command) => {
        for(const observerFunction of observers){
            observerFunction(command)
        }
    }

    const setState = (newState) => Object.assign(state, newState)

    function addPlayer(command){

        state.players[command.playerId] = {
            x: 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width),
            y: 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)
        }
        notifyAll({
            type:'add-player',
            playerId: command.playerId,
            playerX: state.players[command.playerId].x,
            playerY: state.players[command.playerId].y,
        })
    }

    function removePlayer(command){
        delete state.players[command.playerId]
        notifyAll({
            type: 'remove-player',
            playerId: command.playerId
        })
    }

    function addFruit(command){
        state.fruits[command.FruitId] = {
            x: 'FruitX' in command ? command.FruitX : Math.floor(Math.random() * state.screen.width),
            y: 'FruitY' in command ? command.FruitY : Math.floor(Math.random() * state.screen.height)
        }
        notifyAll({
            type:'add-fruit',
            FruitId: command.FruitId,
            FruitX: state.players[command.FruitId].x,
            FruitY: state.players[command.FruitId].y,
        })
    }

    function removeFruit(command){
        delete state.fruits[command.fruitId]
    }

    function movePlayer(command){
        notifyAll(command)

        const acceptedMoves = {
            ArrowUp : () => player.y = Math.max(player.y -1, 0),
            ArrowRight : () => player.x = Math.min(player.x + 1, state.screen.width - 1),
            ArrowDown: () => player.y = Math.min(player.y + 1, state.screen.height - 1),
            ArrowLeft: () =>player.x = Math.max(player.x - 1, 0),
        }

        const player = state.players[command.playerId]
        const moveFunction = acceptedMoves[command.keyPressed]
        if(player && moveFunction){
            moveFunction()
            checkForFruitCollision(command.playerId)
        }
    }
    function checkForFruitCollision(playerId){
        const player = state.players[playerId]

        for(const fruitId in state.fruits){
            const fruit = state.fruits[fruitId]

            if(player.x === fruit.x && player.y === fruit.y){
                removeFruit({fruitId: fruitId})
            }
        }
    }


    return {
        subscribe,
        setState,
        addPlayer,
        removePlayer,
        addFruit,
        removeFruit,
        movePlayer,
        state
    }
}