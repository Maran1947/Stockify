const ws = new WebSocket('ws://localhost:5000');

const DataService = {
    "ws": (userId) => {
        ws.onopen = () => {
            console.log("Connected to websocket!!", userId);
            ws.send(JSON.stringify({
                userId: userId
            }));
        }
        ws.onclose = () => {
            console.log("Connection closed!!");
        }
        return ws;
    }
}

export default DataService;
