import torch
import json
from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
from datasets import load_dataset
from peft import LoraConfig, PeftModel


def formatting_prompts_func(example):
     output_texts = []
     for i in range(len(example['dial_with_actions'])):
         text = f"<|begin_of_text|>Predict the action sequence (AS) for the Minecraft excerpt:\n {example['dial_with_actions'][i]}\n ### AS:"
         output_texts.append(text)
     return output_texts

def llama3_nebula():
    #llama3-8B-Instruct-hf
    device_map  = "mps"
    """
    model = AutoModelForCausalLM.from_pretrained(
        "/Users/sbhar/Riju/PhDCode/RAG_LLama/nebula-rag-code/llama3-8B-hf",
        return_dict=True,
        torch_dtype=torch.float16,
        device_map=device_map,  
    )
    """
    model = AutoModelForCausalLM.from_pretrained(
        "/Users/sbhar/Riju/PhDCode/RAG_LLama/nebula-rag-code/llama3-8B-Instruct-hf",
        return_dict=True,       
        torch_dtype=torch.float16,
        device_map=device_map,  
    )
    print("BaseLine Model Loaded !!")
    print("-------------------------------------")
    model = PeftModel.from_pretrained(model, "/Users/sbhar/Riju/PhDCode/RAG_LLama/nebula-rag-code/nebula-adapter-model/NeBuLa-org", device_map=device_map)
    model = model.merge_and_unload()
    tokenizer = AutoTokenizer.from_pretrained("/Users/sbhar/Riju/PhDCode/RAG_LLama/nebula-rag-code/llama3-8B-hf", trust_remote_code=True)
    tokenizer.pad_token_id = 18610
    print("Fine tuned Model and tokenizer Loaded Locally !!")
    print("-------------------------------------")
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        model_kwargs={"torch_dtype": torch.bfloat16}
    )
    
    val_dataset = load_dataset("csv", data_files={'val':'/Users/sbhar/Riju/PhDCode/RAG_LLama/nebula-rag-code/nebula-adapter-model/data/actseq-val-new.csv'})["val"]
    val_texts = formatting_prompts_func(val_dataset)
    messages = [
        {"role":"system","content":"You are equipped to handle tasks involving a 3D grid. When the user input involves coordinates and objects to be placed in a 3D grid, follow these steps:"},
        {"role":"user","content":"Place a red block at (2, 3)"},
        {"role":"user","content":"{\"object\": \"red block\", \"coordinates\": [2, 3]}"},
        {"role":"user","content":"Place a red block at 5th row and 4th column."},
        {"role":"user","content":"{\"object\": \"red block\", \"coordinates\": [5, 4}"},
        {"role":"user","content":"Place a blue screw at 5th row and 3rd column"},
    ]
        

    
    """
    messages = [
        {"role": "user", "content": "<Architect> Place a red block at position (2,3,1)"},
        {"role": "user","content":"place red 2 3 1"},
        {"role": "user", "content": "<Architect> Place a blue block on the right of the red block"},
        {"role":"user","content":"place blue 1 3 1"},
        {"role":"user","content":"<ARCHITECT> Place a green block on top of the blue block on the z axis"}

    ]
    """

    terminators = [
        pipe.tokenizer.eos_token_id,
        pipe.tokenizer.convert_tokens_to_ids("<|eot_id|>")
    ]
    """
    outputs = pipe(
        messages,
        max_new_tokens=100,
        eos_token_id=terminators,
        do_sample=True,
        temperature=0.6,
        top_p=0.9,
    )
    """
    outputs = pipe(
        messages,
        max_length=200,
        eos_token_id=terminators,
        truncation=True,
        do_sample=False,
    )
    assistant_response = outputs[0]["generated_text"][-1]["content"]
    print(assistant_response)

def llama3_instruct():
    device_map  = "mps"
    model = AutoModelForCausalLM.from_pretrained(
        "/Users/sbhar/Riju/PhDCode/RAG_LLama/nebula-rag-code/llama3-8B-Instruct-hf",
        return_dict=True,
        torch_dtype=torch.float16,
        device_map=device_map,  
    )
    print("BaseLine Model Loaded !!")
    tokenizer = AutoTokenizer.from_pretrained("/Users/sbhar/Riju/PhDCode/RAG_LLama/nebula-rag-code/llama3-8B-hf", trust_remote_code=True)
    tokenizer.pad_token_id = 18610
    pipe = pipeline(
        "text-generation",
        model=model,
        tokenizer=tokenizer,
        model_kwargs={"torch_dtype": torch.bfloat16}
    )
    messages = [
        {"role": "system", "content": "You are a helpful language assistant who answers all the questions asked to you respectfully.\nIt would be nice if you respond in PIRATE SONG "},
        {"role": "user", "content": "Who was black beard ?"},
    ]
    terminators = [
        pipe.tokenizer.eos_token_id,
        pipe.tokenizer.convert_tokens_to_ids("<|eot_id|>")
    ]
    outputs = pipe(
        messages,
        max_new_tokens=300,
        eos_token_id=terminators,
        do_sample=True,
        temperature=0.6,
        top_p=0.9,
    )
    assistant_response = outputs[0]["generated_text"][-1]["content"]
    print(assistant_response)


if __name__ == "__main__":
    llama3_instruct()
    #llama3_nebula()
    

    




