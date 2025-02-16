import json
import os
import configparser

config_file_path = "/Users/sbhar/Riju/PhDCode/CoCoApp/modularised_coco/config.ini"
config = configparser.ConfigParser()
config.read(config_file_path)
blocked_locations_file        = config.get('file_paths','blocked_locations_file')

def part_exists(gen_coords):
    if not os.path.exists(blocked_locations_file):
        return False
    with open(blocked_locations_file,'r') as file:
        blocked_cords = json.load(file)
    x_new = gen_coords[0]
    y_new = gen_coords[1]    
    z_new = gen_coords[2]

    for coord in blocked_cords:
        x_blocked = coord['x']
        y_blocked = coord['y']
        z_blocked = coord['z']

        if [x_new,y_new,z_new] == [x_blocked,y_blocked,z_blocked]:
            return True
    return False
def construct_structure(start_block,config_dict_path,initial_coord):
    with open(config_dict_path,'r') as file:
        config_dict = json.load(file)
    vertices = len(list(config_dict.keys()))
    adjacency_list = {}
    for key in config_dict:
        vertices     = []
        left_block   = config_dict[key]['left']
        right_block  = config_dict[key]['right']
        top_block    = config_dict[key]['top']
        bottom_block = config_dict[key]['bottom']
        top_right_block = config_dict[key]['top_right']
        top_left_block  = config_dict[key]['top_left']
        bottom_left_block = config_dict[key]['bottom_left']
        bottom_right_block = config_dict[key]['bottom_right']
        
        if left_block != None:
            vertices.append((left_block,'left'))
        if right_block != None:
            vertices.append((right_block,'right'))
        if top_block != None:
            vertices.append((top_block,'top'))
        if bottom_block != None:
            vertices.append((bottom_block,'bottom'))

        if top_left_block != None:
            vertices.append((top_left_block,'top_left'))
        if top_right_block != None:
            vertices.append((top_right_block,'top_right'))
        if bottom_left_block != None:
            vertices.append((bottom_left_block,'bottom_left'))
        if bottom_right_block != None:
            vertices.append((bottom_right_block,'bottom_right'))
        
        adjacency_list[key] = vertices
    
    visited = []
    stack   = []
    stack.append((start_block,'center',initial_coord))
    output_vertices = []
    output_actions  = []
    while len(stack):
        #Pop a vertex from stack and print it
        s = stack[-1]
        #print(s)
        stack.pop(-1)
        #print("The popped element is: ",s)
        if s not in visited:
            """
            adding a special case for bridge
            """
            #print("The popped element is: ",s)
            #print(f"The x  coordinate is: {s[2][0]}")
            #print("The color is: ",s[0].split("_")[0])
            #print("The shape is: ",s[0].split("_")[1])
            if s[0].split("_")[1].lower() == 'vertical':
                shape = 'Vertical_bridge'
                item = {
                "color":s[0].split("_")[0],
                "shape":shape,
                "x":int(s[2][0]),
                "y":int(s[2][1]),
                "z":int(s[2][2])
            }
            elif s[0].split("_")[1].lower() == 'horizontal':
                shape = 'Horizontal_bridge'
                item = {
                "color":s[0].split("_")[0],
                "shape":shape,
                "x":int(s[2][0]),
                "y":int(s[2][1]),
                "z":int(s[2][2])
            }
            else:
                item = {
                    "color":s[0].split("_")[0],
                    "shape":s[0].split("_")[1],
                    "x":int(s[2][0]),
                    "y":int(s[2][1]),
                    "z":int(s[2][2])
                }
            
            output_actions.append(item)
            output_vertices.append(s)
            visited.append(s[0])
        
        #print(f"The visited nodes are:{visited}")
        start_coord = s[2]
        for node in adjacency_list[s[0]]:
            if node[0] not in visited:
                direction = node[1]
                if direction == 'left':
                    x = start_coord[0] - 1
                    y = start_coord[1]
                    z = start_coord[2]
                if direction == 'right':
                    x = start_coord[0] + 1
                    y = start_coord[1]
                    z = start_coord[2]
                if direction == 'top':
                    x = start_coord[0]
                    y = start_coord[1] + 1
                    z = start_coord[2] 
                if direction == 'bottom':
                    x = start_coord[0]
                    y = start_coord[1] - 1
                    z = start_coord[2] 
            
                if direction == 'top_left':
                    x = start_coord[0]-1
                    y = start_coord[1]+1
                    z = start_coord[2]
                
                if direction == 'top_right':
                    x = start_coord[0]+1
                    y = start_coord[1]+1
                    z = start_coord[2]
                
                if direction == 'bottom_left':
                    x = start_coord[0]-1
                    y = start_coord[1]-1
                    z = start_coord[2]
                
                if direction == 'bottom_right':
                    x = start_coord[0]+1
                    y = start_coord[1]-1
                    z = start_coord[2]
                    
                stack.append((node[0],direction,[x,y,z]))
                if (x < 0) or (x > 9) or (y < 0) or (y > 9) or (z < 0) or (z > 9):
                    return False #not possible to construct

                elif part_exists([x,y,z]):
                    return False
                

    return output_actions


def reconstruct(initial_coords,relative_resolved_file):
    with open(relative_resolved_file,'r') as file:
        relative_coordinates = json.load(file)
    for part in relative_coordinates:
        constructed = construct_structure(
            start_block=part,
            config_dict_path=relative_resolved_file,
            initial_coord=initial_coords
        )
        if constructed == False:
            continue
        else:
            #print(f"Possible to construct the shape starting from this part:{part}")
            return constructed

