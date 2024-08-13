import time
from enum import Enum
import json
import base64

class ServerMessageType(Enum):
    WAIT = 'WAIT'
    MESSAGE = 'MESSAGE'
    RESUME = 'RESUME'
    

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
    'content': 'place red 0 1 0\nplace blue 0 2 0\nplace green 0 3 0'
}

print_message(example_message)


example_message = {
    'type': ServerMessageType.RESUME,
    'content': ''
}
print_message(example_message)