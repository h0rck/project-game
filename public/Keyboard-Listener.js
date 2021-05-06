export default function createKeyboardListener(document){
    const state = {observers: [], playerId:[] }

    const registerPlayer = (playerId) => state.playerId = playerId

    const subscribe = (observerFunction) => state.observers.push(observerFunction)

    const notifyAll = (command) => {
        for(const observerFunction of state.observers){ observerFunction(command) }
    }

    document.addEventListener('keydown', (e) => {
        const command = {
            type: 'move-player',
            playerId: state.playerId,
            keyPressed : e.key
        }
        notifyAll(command)
    })

    return {subscribe, registerPlayer}
}