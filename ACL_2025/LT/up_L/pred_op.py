import ollama
import json
from tqdm import tqdm

up_L_prompt_modified_gravity = """
**System Information**
You are an expert at interpreting natural language instructions and translating them into specific actions for placing objects within a 3D grid.

**Environment Details**
The environment is a Cartesian 3D grid of dimensions 16x16x16, represented by three axes: X, Y, and Z. The grid is organized as follows:
- The X-axis (width) and Y-axis (length) where objects can be placed range from 1 to 16.
- The Z-axis (height) where objects can be placed ranges from 1 to 16.

Objects must follow the rule: Any object placed must have support underneath it, meaning if it is the first element of the structure, it will be placed on the floor (Z=1), if any element is placed on a Z-axis value greater than 1, then an object must be present directly below it.

Each object in the grid is defined by:
1. Position: (x, y, z) coordinates within the grid.
2. Type: The type of object.
3. Color: The color of the object.

**Available Functions**
You must use only the following functions to interact with the 3D environment:
- place("type", "color", x, y, z): Places an object of the specified type and color at the given (x, y, z) coordinates.
- remove("type", "color", x, y, z): Removes the object of the specified type and color from the given (x, y, z) coordinates.

**Task Information**
Your task is to interpret each natural language Instruction and generate the corresponding Python code under the label Output. For each instruction:
1. Respond only with code. No additional text or explanations should be provided.
2. Do not use loops, comments, or unnecessary complexity. Keep the solution as simple and clear as possible.
3. Adhere to the given format (Instruction → Output).

**Example 1**
If the user says, "Make me a 4 units long L and 4 units wide L shape with blue washer", the output should be:
place("washer", "blue", 3, 4, 1)
place("washer", "blue", 4, 4, 1)
place("washer", "blue", 5, 4, 1)
place("washer", "blue", 6, 4, 1)
place("washer", "blue", 3, 4, 2)
place("washer", "blue", 3, 4, 3)
place("washer", "blue", 3, 4, 4)

In this example, the type is washer and the color is blue. Each washer is placed one at a time to build a 4-unit tall and 4 units wide L shape.

**Example 2**
If the user says, "Make me a 5 units long L and 5 units wide L shape with orange screw", the output should be:
place("screw", "orange", 3, 4, 1)
place("screw", "orange", 4, 4, 1)
place("screw", "orange", 5, 4, 1)
place("screw", "orange", 6, 4, 1)
place("screw", "orange", 7, 4, 1)
place("screw", "orange", 3, 4, 2)
place("screw", "orange", 3, 4, 3)
place("screw", "orange", 3, 4, 4)
place("screw", "orange", 3, 4, 5)

In this example, the type is screw and the color is orange. Each screw is placed one at a time to build a 5-unit tall and 5 units wide L shape.

**Example 3**
If the user says, "Make me a 6 units long L and 6 units wide L shape with green screw", the output should be:
place("screw", "green", 3, 4, 1)
place("screw", "green", 4, 4, 1)
place("screw", "green", 5, 4, 1)
place("screw", "green", 6, 4, 1)
place("screw", "green", 7, 4, 1)
place("screw", "green", 8, 4, 1)
place("screw", "green", 3, 4, 2)
place("screw", "green", 3, 4, 3)
place("screw", "green", 3, 4, 4)
place("screw", "green", 3, 4, 5)
place("screw", "green", 3, 4, 6)

In this example, the type is screw and the color is green. Each screw is placed one at a time to build a 6-unit tall and 6 units wide L shape.

**Example 4**
If the user says, "Make me a 7 units long L and 7 units wide L shape with blue washer", the output should be:
place("washer", "blue", 3, 4, 1)
place("washer", "blue", 4, 4, 1)
place("washer", "blue", 5, 4, 1)
place("washer", "blue", 6, 4, 1)
place("washer", "blue", 7, 4, 1)
place("washer", "blue", 8, 4, 1)
place("washer", "blue", 9, 4, 1)
place("washer", "blue", 3, 4, 2)
place("washer", "blue", 3, 4, 3)
place("washer", "blue", 3, 4, 4)
place("washer", "blue", 3, 4, 5)
place("washer", "blue", 3, 4, 6)
place("washer", "blue", 3, 4, 7)

In this example, the type is washer and the color is blue. Each washer is placed one at a time to build a 7-unit tall and 7 units wide L shape.

**Additional Information**
The different possible colors are: blue, orange, red, green, yellow, purple, black, white, brown, magenta
The different possible types are: washer, nut, screw, bolt, v_bridge, h_bridge, gasket, hex_nut, square_nut
The different possible lengths for structures are: 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15 units long

**Additional Notes**
- Do not generate instructions on your own.
- Ensure the placement rule for Z values is followed (the objects should always be on top of other objects or be on the ground).
- The objects should always start from the ground which means Z=1.
- The Z should always be 1 for the first object in the structure.

Let’s begin.
"""

def pred_op(input_instruction):
    messages = [
        {
            'role':'system',
            'content':up_L_prompt_modified_gravity
        },
        {
            'role':'user',
            'content':input_instruction.strip()
        }
    ]
    response = ollama.chat(model='llama3.1:8b',messages=messages,options={'temperature':0.0,'seed':12345})
    raw_output = response['message']['content']
    return raw_output

def test_prompt():
    #input_instruction = 'Make me a 4 unit long row with green screws at the center of the grid and make a 4 unit long tower with blue washers starting from the left most screw of the row'
    #input_instruction = 'Make me a 5 unit \'L\' shape with red screws'
    input_instruction = 'Make me a 3 unit tall and 3 unit wide \'L\' shape with blue screws'
    #output = generate_output_composition(input_instruction)
    output = pred_op(input_instruction)
    print(output)

def get_llama_output(input_file_path,output_file_path=""):
    with open(input_file_path,'r') as f:
        data = json.load(f)
    predictions = {}
    #all_sentences = data['generatedSentences']
    all_sentences = data
    test_sentences = []
    sliced_sentences = all_sentences[:200]
    for i,sentence in enumerate(tqdm(sliced_sentences)):
        test_sentences.append(sentence)
    
    print(f"The number of sentences we are processing is {len(test_sentences)}")
    #print(test_sentences[0])
    for i,sentence in enumerate(tqdm(test_sentences)):
        output = pred_op(sentence['sentence'])
        predictions[i] = {
            'sentence':sentence['sentence'],
            'structure':sentence['structure'],
            'length':sentence['length'],
            'shape':sentence['shape'],
            'color':sentence['color'],
            'output':output
        }
    
    with open(output_file_path,'w') as f:
        json.dump(predictions,f,indent=4)
if __name__ == "__main__":
    get_llama_output("up_L_data.json","up_L_pred.json")