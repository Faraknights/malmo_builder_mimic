import requests
import sys
import base64

url  = "http://localhost:8000/predict"
def get_output():
    text = sys.argv[1]
    data = {"text":text}
    print("Please wait for response...")
    response = requests.post(url,json=data)

    str_response = str(response.json())
    message_bytes = str_response.encode('utf-8')
    base64_bytes = base64.b64encode(message_bytes)
    base64_message = base64_bytes.decode('utf-8')

    print(base64_message)
    #print(str(response.json()))
    

if __name__ == "__main__":
    get_output() 