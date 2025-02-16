import os
import json
import configparser
from reconstruction_modules import reconstruct

config_file_path = "/Users/sbhar/Riju/PhDCode/CoCoApp/coreli-exps/abstractions/code/abstract1/code/config.ini"
config = configparser.ConfigParser()
config.read(config_file_path)
blocked_locations_file        = config.get('file_paths','blocked_locations_file')
parent_dir = config.get('file_paths','concept_folder_path')

if os.path.exists(blocked_locations_file):
    with open(blocked_locations_file,'r') as file:
        blocked_locations = json.load(file)
else:
        blocked_locations = []

def call_module(concept_name,initial_coord):
    """
    Inorder to implement the module we can do the following,
    construct the resolved object path (assuming that it always exist)
    """
    concept_folder_path = os.path.join(parent_dir,concept_name)
    resovled_file_path  = concept_folder_path + '/resolved_'+concept_name+'.json'
    relative_coord_path = concept_folder_path + '/reconstruct_'+concept_name+'.json' 
    #new_blocked = []
    if os.path.exists(resovled_file_path):
        success = reconstruct(
            initial_coords=initial_coord,
            relative_resolved_file=resovled_file_path,
        )
        all_actions = ""
        if not success:
            #print("Not able to recreate the module")
            return ""
        else:
            ##print("Dumping the output actions for proper execution !!")
            with open(relative_coord_path,'w') as file:
                json.dump(success,file,indent=4)
            for action in success:
                action_name = 'place'
                part_name   = action['shape'].lower().strip()
                color       = action['color'].lower().strip()
                x_cord      = action['x']
                y_cord      = action['y']
                z_cord      = action['z']

                print(f"The coordinates are:{x_cord,y_cord,z_cord}")
                blocked_locations.append({
                    'x':int(x_cord),
                    'y':int(y_cord),
                    'z':int(z_cord)
                })
                new_instruction = action_name+" "+part_name+" "+color+" "+str(x_cord)+" "+str(int(y_cord)+1)+" "+str(z_cord)
                all_actions = all_actions + '\n' + new_instruction
            
            print("The previous blocked Locations are: ",blocked_locations)
            #with open(blocked_locations_file,'w') as file:
            #    json.dump(blocked_locations,file)
            
            
            #print("The blocked locations are: ",new_blocked)
            print(all_actions)
            return all_actions.strip(),blocked_locations
    else:
        print("File doesn't exist")

def test_reconstruction_module(concept_name,initial_coord):
    """
    Inorder to implement the module we can do the following,
    construct the resolved object path (assuming that it always exist)
    """
    concept_folder_path = os.path.join(parent_dir,concept_name)
    resovled_file_path  = concept_folder_path + '/resolved_'+concept_name+'.json'
    relative_coord_path = concept_folder_path + '/reconstruct_'+concept_name+'.json' 
    new_blocked = []
    all_places  = []

    if os.path.exists(resovled_file_path):
        success = reconstruct(
            initial_coords=initial_coord,
            relative_resolved_file=resovled_file_path,
        )
        all_actions = ""
        if not success:
            #print("Not able to recreate the module")
            return ""
        else:
            ##print("Dumping the output actions for proper execution !!")
            with open(relative_coord_path,'w') as file:
                json.dump(success,file,indent=4)
            for action in success:
                action_name  = 'place'
                part_name    = action['shape'].lower().strip()
                color        = action['color'].lower().strip()
                x_cord       = action['x']
                y_cord       = action['y']
                z_cord       = action['z']
                
                all_places.append({
                    'shape': part_name,
                    'color': color,
                    'x':int(x_cord),
                    'y':int(y_cord)+1,
                    'z':int(z_cord)
                })
                #new_blocked.append({
                #    'x':int(x_cord),
                #    'y':int(y_cord),
                #    'z':int(z_cord)
                #})
                new_instruction = action_name+" "+part_name+" "+color+" "+str(x_cord)+" "+str(y_cord)+" "+str(z_cord)
                all_actions = all_actions + '\n' + new_instruction
            
            #with open(blocked_locations_file,'a') as file:
            #    json.dump(new_blocked,file,indent=4)
            
            #with open('/Users/sbhar/Riju/PhDCode/CoCoApp/faircopy/modularised/datastores/concepts/ladder_nut/ladder_nut.json','w') as file:
            #    json.dump(all_places,file)
            print(f"The actions are:{all_actions}")
            return all_actions.strip()
    else:
        print("File doesn't exist")


"""

if __name__ == "__main__":
    all_actions = test_reconstruction_module(
        concept_name='ladder_nut',
        initial_coord=[4,0,0]
    )
    print(all_actions)
"""