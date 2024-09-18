import time
from enum import Enum
import json
import base64
import sys
import requests

url  = "http://localhost:8000/predict"

class ServerMessageType(Enum):
    WAIT = 'WAIT'
    MESSAGE = 'MESSAGE'

def call_ollama_agent():
    text = sys.argv[1]
    data = {"text":text}
    response = requests.post(url,json=data)
    str_response = str(response.json())
    example_message = {
        'type': ServerMessageType.MESSAGE,
        'content': str_response
    }


example_message = {
    'type': ServerMessageType.MESSAGE,
    'content': 'place nut red 0 1 0\npick 0 1 0'
}
