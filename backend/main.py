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
    "scientific": "You are an ADHD expert providing research-backed advice. Ask follow-up questions if needed. Keep it short and simple.",
    "motivational": "You are an encouraging ADHD coach, helping users stay positive.",
    "casual": "You are a friendly assistant providing ADHD tips in short answers."
}

@app.get("/")
def read_root():
    return {"message": "ADHD Therapy API is running!"}

@app.get("/chat/")
def chat_with_llama(user_input: str, style: str = "casual"):
    """ Chat endpoint for ADHD assistance """
    system_prompt = styles.get(style, styles["casual"])
    
    chat_history = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_input}
    ]

    response = requests.post(API_URL, headers=HEADERS, json={"inputs": chat_history[-1]["content"]})
    
    if response.status_code == 200:
        generated_text = response.json()
        return {"response": generated_text[0]["generated_text"]}
    else:
        return {"error": response.status_code, "message": response.text}

@app.post("/add_task/")
def add_task(task_name: str):
    """ Endpoint to generate focus methods and rewards for a task """
    prompt = f"Suggest an effective focus method and a motivating reward for completing the task: '{task_name}'."
    
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

    if response.status_code == 200:
        generated_text = response.json()
        task_data = {"task": task_name, "details": generated_text[0]["generated_text"]}
        
        # Save tasks to a file (simulate a database)
        try:
            with open("tasks.json", "r") as file:
                tasks = json.load(file)
        except FileNotFoundError:
            tasks = []

        tasks.append(task_data)
        with open("tasks.json", "w") as file:
            json.dump(tasks, file)

        return {"message": f"Task '{task_name}' added!", "suggested_strategy": task_data["details"]}
    else:
        return {"error": response.status_code, "message": response.text}

@app.get("/relaxation/")
def ai_generated_exercise(feeling: str):
    """ Endpoint to suggest relaxation exercises based on user mood """
    prompt = f"Suggest a breathing or meditation exercise for someone feeling {feeling}."
    
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

    if response.status_code == 200:
        generated_text = response.json()
        return {"exercise": generated_text[0]["generated_text"]}
    else:
        return {"error": response.status_code, "message": response.text}
