import ollama
import sys

def test_llama3():
    text = sys.argv[1]
    response = ollama.chat(model='llama3', messages=[
        {
            'role':'system',
            'content': 'You are a helpful language assistant.Please answer in Pirate Toungue.',
            'role': 'user',
            'content': text,
        },
    ])
    #return response['message']['content']
    print(response['message']['content'])
if __name__ == "__main__":
    test_llama3()

