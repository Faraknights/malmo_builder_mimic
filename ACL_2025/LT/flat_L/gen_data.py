import json

def gen_data(sample_file_path):
    """
    {
      "sentence": "Make me a 9 units long tower with purple washer  ",
      "structure": "tower",
      "color": "purple",
      "shape": "washer",
      "length": "9"
    }
    """
    with open(sample_file_path, 'r') as f:
        data = json.load(f)
    sentences = data["generatedSentences"]
    all_data = []
    for item in sentences:
        sentence = item['sentence']
        structure = item['structure']
        color = item['color']
        shape = item['shape']
        length = item['length']
        tokens = sentence.split()
        l_structure = "Make me a " + length + " unit tall and " + length + " unit wide " + "L shape" + " with " + color + " " + shape
        new_item = {
            "sentence": l_structure,
            "structure": "flat_L",
            "color": color,
            "shape": shape,
            "length": str(int(length)*2)
        }
        all_data.append(new_item)
    
    with open('flat_L_data.json', 'w') as f:
        json.dump(all_data, f, indent=4)

if __name__ == "__main__":
    gen_data("towers_generic.json")
