from fastapi import FastAPI
import requests
import json
from fastapi.middleware.cors import CORSMiddleware


# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow only frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
# Hugging Face API details
API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct"
HEADERS = {"Authorization": "Bearer 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"}

# Define different assistant styles
styles = {
    "scientific": """You are an ADHD therapist providing only research-backed advice. 
        - Do NOT make up facts. 
        - Offer actionable ADHD strategies in simple terms.  
        - If you don’t know something, say 'I am not sure, but I can provide general guidance.'
        - Keep responses short and direct.
        - Cite sources where possible.
        """,
    "motivational": """You are an ADHD therapist focused on positivity.
        - Do NOT make up facts. 
        - Offer encouragement and mindset shifts.
        - Offer actionable ADHD strategies in simple terms.  
        """,
    "casual": """You are a supportive and friendly ADHD therapist who gives practical, easy-to-understand advice. 
        - Do NOT make up facts. 
        - Use a warm and conversational tone, like a therapist chatting casually.  
        - Offer actionable ADHD strategies in simple terms.  
        - Avoid overwhelming users with too much information at once and give somewhat short answers.  
        - If unsure, say, ‘I can’t say for sure, but here’s a common strategy that works for many people.’  
        - Never provide medical diagnoses or suggest medications—focus on behavioral strategies.  
        """
}

@app.get("/")
def read_root():
    return {"message": "ADHD Therapy API is running!"}

@app.get("/chat/")
def chat_with_llama(user_input: str, style: str = "casual"):
    """ Chat endpoint for ADHD assistance """
    system_prompt = styles.get(style, styles["casual"])
    
    chat_text = f"{system_prompt}\nUser: {user_input}\nAssistant:"

    response = requests.post(API_URL, headers=HEADERS, json={"inputs": chat_text})
    
    if response.status_code == 200:
        generated_text = response.json()[0]["generated_text"]  #then remove everything before "Assistant:
        bot_response = generated_text.split("Assistant:", 1)[-1].strip()
        return {"response": bot_response}
    else:
        return {"error": response.status_code, "message": response.text}

@app.post("/add_task/")
def add_task(task_name: str):
    """ Endpoint to generate focus methods and rewards for a task """
    prompt = f"You are a supportive and friendly ADHD therapist who gives practical, easy-to-understand advice. Suggest an effective focus method and a motivating reward for completing the task: '{task_name}'."
    
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

    if response.status_code == 200:
        generated_text = response.json()
        
        if isinstance(generated_text, list) and generated_text:
            generated_text = generated_text[0].get("generated_text", "")
        clean_text = generated_text.replace(prompt, "").strip()

        task_data = {"task": task_name, "details": clean_text}
        
        # Save tasks to a file (simulate a database)
        try:
            with open("tasks.json", "r") as file:
                tasks = json.load(file)
        except FileNotFoundError:
            tasks = []

        tasks.append(task_data)
        with open("tasks.json", "w") as file:
            json.dump(tasks, file)

        print(task_data["details"] )
        return {"message": f"Task '{task_name}' added!", "suggested_strategy": task_data["details"]}
    else:
        return {"error": response.status_code, "message": response.text}

@app.get("/relaxation/")
def ai_generated_exercise(feeling: str):
    """ Endpoint to suggest relaxation exercises based on user mood """
    prompt = f"You are a supportive and friendly ADHD therapist who gives practical, easy-to-understand advice. Suggest a breathing or meditation exercise for someone feeling {feeling}."
    
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

    if response.status_code == 200:
       generated_text = response.json()[0]["generated_text"]
       exercise_text = generated_text.replace(prompt, "").strip()
       return {"exercise": exercise_text}
    else:
        return {"error": response.status_code, "message": response.text}
