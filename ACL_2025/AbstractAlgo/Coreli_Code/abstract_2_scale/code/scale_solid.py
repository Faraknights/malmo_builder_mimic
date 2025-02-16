import numpy as np
import json

"""
Enviroment Variables to initialize the grid dimensions
"""
grid_x = 16
grid_y = 16
grid_z = 16
game_log_path = '/Users/sbhar/Riju/PhDCode/CoCoApp/Coreli_Code/abstract_2_scale/data/scale_test.json' #input what ever shape you want to scale
target_file_path = '/Users/sbhar/Riju/PhDCode/CoCoApp/Coreli_Code/abstract_2_scale/data/scale_test_output.json' #input the path to save the scaled shape

class MyObject:
        def __init__(self,color,value,shape) -> None:
            self.color = color
            self.value = value
            self.shape = shape

def store_concept(raw_actions):
    matrix = np.empty((grid_x,grid_y,grid_z),dtype=object)
    matrix.fill(None)
    for action in raw_actions:
        x = action['position']['x']
        y = action['position']['y']
        z = action['position']['z']
        color  = action['color']
        shape  = action['shape']
        matrix[int(x),int(y),int(z)] = MyObject(color=color,value=1,shape=shape)
    
    return matrix

def shape_matrix(game_log):
    with open(game_log, 'r') as f:
        data = json.load(f)
    world_states = data['worldStates']
    final_state = world_states[-1]
    final_state_blocks = final_state['blocksInGrid']
    matrix = store_concept(final_state_blocks)
    return matrix

def take_screenshot(full_matrix):
    filled_positions = np.argwhere(full_matrix != None)
    print(full_matrix.shape)
    full_parts = []
    for i in range(full_matrix.shape[0]):
        for j in range(full_matrix.shape[1]):
            for k in range(full_matrix.shape[2]):
                if full_matrix[i,j,k] is not None:
                    full_parts.append(full_matrix[i,j,k])
    min_x, min_y, min_z = filled_positions.min(axis=0)
    max_x, max_y, max_z = filled_positions.max(axis=0)
    extracted_shape = full_matrix[min_x:max_x+1, min_y:max_y+1, min_z:max_z+1]
    for i in range(extracted_shape.shape[0]):
        for j in range(extracted_shape.shape[1]):
            for k in range(extracted_shape.shape[2]):
                if extracted_shape[i,j,k] is None:
                    extracted_shape[i,j,k] = MyObject(color='blank',shape='blank',value=0)
                
    
    return extracted_shape


def nearest_neighbour(extracted_shape,target_x=None,target_y=None,target_z=None):
    """
    The target_x,target_y,target_z are the dimensions of the larger target grid, where the extracted shape will be upscaled to.
    If the target_x,target_y,target_z are not provided, then the extracted shape is returned as is.
    """
    ext_x,ext_y,ext_z = extracted_shape.shape
    if target_x is None:
        target_x = ext_x
    if target_y is None:
        target_y = ext_y
    if target_z is None:
        target_z = ext_z
    
    up_scaled_matrix = np.empty((target_x+1,target_y+1,target_z+1),dtype=object)
    up_scaled_matrix.fill(None)

    scale_x = ext_x / target_x
    scale_y = ext_y / target_y
    scale_z = ext_z / target_z

    print(f"The scale factors are {scale_x}, {scale_y}, {scale_z}")
    for i in range(1,target_x+1):
        for j in range(1,target_y+1):
            for k in range(1,target_z+1):

                # Map to source coordinates using floor division and scale factors
                original_x = int((i) * scale_x)
                original_y = int((j) * scale_y)
                original_z = int((k) * scale_z)
                
                original_x = min(original_x, int(ext_x) - 1)
                original_y = min(original_y, int(ext_y) - 1)
                original_z = min(original_z, int(ext_z) - 1)

                
                if extracted_shape[original_x,original_y,original_z].value == 1:
                    if up_scaled_matrix[i,j,k] is None: #if that position is not already filled
                        up_scaled_matrix[i,j,k] = extracted_shape[original_x,original_y,original_z]
    
    non_none_count = 0
    for i in range(target_x):
        for j in range(target_y):
            for k in range(target_z):
                if up_scaled_matrix[i,j,k] is not None:
                    non_none_count += 1
    
    return up_scaled_matrix


def generate_place_actions(generated_shape):
    x,y,z = generated_shape.shape
    json_matrix = []
    for i in range(x):
        for j in range(y):
            for k in range(z):
                if generated_shape[i,j,k] is not None:
                    
                    json_matrix.append(
                        {
                            'color':generated_shape[i,j,k].color,
                            'position':{
                                'x':i,
                                'y':j,
                                'z':k
                            },
                            'shape':generated_shape[i,j,k].shape
                        }
                    )
    #data = generated_shape
    new_actions = []
    for item in json_matrix:
        new_actions.append(
                {
                'color':item['color'],
                'position':{
                    'x':item['position']['x'],
                    'y':item['position']['y'],
                    'z':item['position']['z']
                },
                'shape':item['shape']
            }
        )
    if target_file_path is not None:
        with open(target_file_path, 'w') as f:
            json.dump(new_actions, f,indent=4)
    print("Place actions generated...")
    
    return new_actions

if __name__ == '__main__':
    """
    Input the target co-ordinates of the larger grid, where the extracted shape will be upscaled to.
    The target dimensions are 6x4x4 in this case.
    """

    target_x = 6 #sample co-ordinates
    target_y = 4
    target_z = 4
    
    shape_matrix = shape_matrix(game_log_path)
    extracted_shape = take_screenshot(shape_matrix)
    
    #nearest_neighbour(extracted_shape,target_x=target_x,target_y=target_y,target_z=target_z)
    
    generated_shape = nearest_neighbour(extracted_shape,target_x=target_x,target_y=target_y,target_z=target_z)
    generate_place_actions(generated_shape)
