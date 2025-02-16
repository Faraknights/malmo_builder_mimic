import json

def gen_data(sample_file_path):
    with open(sample_file_path,'r') as f:
        data = json.load(f)
    all_data = []
    for item in data:
        length = str(int(int(item['length']) / 2))
        sentence = "Make me a " + length + " unit tall and " + length + " unit wide T shape with " + item['color'] + " " + item['shape']
        new_item = {
            "sentence":sentence,
            "structure":"flat_T",
            "color":item['color'],
            "shape":item['shape'],
            "length":item['length']
        }
        all_data.append(new_item)
    
    with open('flat_T_data.json', 'w') as f:
        json.dump(all_data, f, indent=4)

if __name__ == "__main__":
    gen_data("sample.json")