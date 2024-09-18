import time
from enum import Enum
import json
import base64
import sys
import requests


class ServerMessageType(Enum):
    WAIT = 'WAIT'
    MESSAGE = 'MESSAGE'

"""
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

"""


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

def call_ollama_agent():
    text = sys.argv[1]
    data = {"text":text}
    response = requests.post("http://localhost:8000/predict",json=data)
    str_response = str(response.json())
    #str_response  = 'place washer yellow 4 1 4\nplace screw green 5 1 5\nplace vertical_bridge blue 5 1 7'
    example_message = {
        'type': ServerMessageType.MESSAGE,
        'content': str_response
    }
    print_message(example_message)






#example_message = {
##    'type': ServerMessageType.MESSAGE,
#  'content': 'place nut red 0 1 0\npick 0 1 0'
#}

#print_message(example_message)














#example_message = {
#    'type': ServerMessageType.RESUME,
#    'content': ''
#}
#print_message(example_message)

if __name__ == "__main__":
    call_ollama_agent()
