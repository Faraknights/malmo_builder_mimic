# message.py

import sys

def main():
    if len(sys.argv) < 2:
        print("Please provide a message to print.")
        return
    
    message = sys.argv[1]
    print(message+' is processed !!')

if __name__ == "__main__":
    main()