import time
from enum import Enum
import json
import base64

class ServerMessageType(Enum):
    WAIT = 'WAIT'
    MESSAGE = 'MESSAGE'
    

def print_message(message: dict) -> None:
    message_type = message['type'].value  # Access the string value of the enum
    content = message['content']
         
    jsonContent = {
        "type": str(message_type), 
        "content": str(content)
    }
    message_bytes = json.dumps(jsonContent).encode('utf-8')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode('utf-8')
    
    print(f"{base64_message}")










example_message = {
    'type': ServerMessageType.WAIT,
    'content': 'Please Wait...'
}

print_message(example_message)















time.sleep(2)










example_message = {
    'type': ServerMessageType.MESSAGE,
    'content': 'place yellow -3 1 -4\nplace yellow -3 1 -3\nplace yellow -3 1 -2\nplace yellow -3 1 -1\nplace red 0 1 -4\nplace red 2 1 -4\nplace red -1 1 -3\nplace red -0 1 -3\nplace red 1 1 -3\nplace red 2 1 -3\nplace red 3 1 -3\nplace red 0 1 -2\nplace red 1 1 -2\nplace red 2 1 -2\nplace red 1 1 -1\nplace orange -4 1 3\nplace orange -4 1 4\nplace orange -4 1 1\nplace orange -2 1 4\nplace orange -2 1 3\nplace orange -1 1 2\nplace orange 1 1 3\nplace orange 1 1 4\nplace orange 1 1 1\nplace orange 3 1 1\nplace orange 3 1 2\nplace orange 3 1 3\nplace orange 3 1 4\nplace orange 4 1 2'
}

print_message(example_message)














example_message = {
    'type': ServerMessageType.RESUME,
    'content': ''
}
print_message(example_message)