from fastapi import FastAPI, WebSocket
from fastapi.responses import HTMLResponse
import pickle
import json
import base64

app = FastAPI()


# Function to process data using the loaded model
def process_with_model(data):
    # Assuming the model has a predict method
    result = "example builder answer\nplace red -5 1 1\nplace red -5 1 0"
    return result

html = """
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket Example</title>
    <script>
        var socket = new WebSocket("ws://localhost:8001/ws");

        socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            document.getElementById('result').innerText = data.result;
        };

        function processData() {
            const inputData = { input: [1, 2, 3, 4] }; // Replace with actual data
            socket.send(JSON.stringify({ action: 'process', input: inputData }));
        }
    </script>
</head>
<body>
    <h1>Model Result: <span id="result">N/A</span></h1>
    <button onclick="processData()">Process Data</button>
</body>
</html>
"""

@app.get("/")
async def get():
    return HTMLResponse(html)

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        message = json.loads(data)
        if message["action"] == "process":
            result = process_with_model(message["input"])
                        
            message_bytes = result.encode('utf-8')
            base64_bytes = base64.b64encode(message_bytes)
            base64_message = base64_bytes.decode('utf-8')

            await websocket.send_text(json.dumps({"result": result}))
            print(base64_message)

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host='127.0.0.1', port=8001)
