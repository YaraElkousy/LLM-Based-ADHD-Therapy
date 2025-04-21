from fastapi import FastAPI, Depends
import requests
import json
from fastapi.middleware.cors import CORSMiddleware
from backend.auth import router as auth_router  # Importing the authentication router
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import asyncio
from backend.database import save_message, get_chat_history, get_db, save_task, get_user_tasks
from backend.auth import get_current_user

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow only frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

app.include_router(auth_router)

# Hugging Face API details
API_URL = "https://openrouter.ai/api/v1/chat/completions"
HEADERS = {"Authorization": "Bearer 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", "Content-Type": "application/json"}

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
        - Keep your answers VERY SHORT and simple. Around 5 or 6 sentences max as to not confuse the patient.
        - Use a warm and conversational tone, like a therapist chatting casually.  
        - Offer actionable ADHD strategies in simple terms.  
        - Avoid overwhelming users with too much information at once and give somewhat short answers.  
        - Never provide medical diagnoses or suggest medications—focus on behavioral strategies. 
        - Strategies should align with CBT, mindfulness, and executive function research 
        """
}

@app.get("/")
def read_root():
    return {"message": "ADHD Therapy API is running!"}

@app.get("/chat/")
async def chat_with_llama(user_input: str, style: str = "casual", current_user: str = Depends(get_current_user)):
    """ Chat endpoint for ADHD assistance """
    session_id = f"session_{current_user}"  # Unique session per user
    chat_history = await get_chat_history(session_id)

    system_prompt = styles.get(style, styles["casual"])
    
    history_text = "\n".join([f"{message['role'].capitalize()}: {message['text']}" for message in chat_history])

    messages = [{"role": "system", "content": system_prompt}]
    for message in chat_history:
        messages.append({"role": message["role"], "content": message["text"]})
    messages.append({"role": "user", "content": user_input})

    response = requests.post(API_URL, headers=HEADERS, json={
        "model": "google/gemini-2.5-pro-preview-03-25",  
        "messages": messages,
        "max_tokens": 1000
    })
    
    #google/gemini-2.5-pro-preview-03-25
    #deepseek/deepseek-r1-distill-qwen-14b:free
    #nvidia/llama-3.1-nemotron-nano-8b-v1:free

    try:
        data = response.json()
        bot_response = data["choices"][0]["message"]["content"]
        await save_message(session_id, "user", user_input)
        await save_message(session_id, "assistant", bot_response)
        return {"response": bot_response}
    except Exception as e:
        return {
            "error": "LLM response error",
            "status_code": response.status_code,
            "raw_response": response.text,
            "exception": str(e)
        }


@app.get("/chat_history/")
async def chat_history(current_user: str = Depends(get_current_user)):
    """ Fetch all chat messages for the authenticated user """
    session_id = f"session_{current_user}"  # Unique session per user
    chat_history = await get_chat_history(session_id)
    
    return {"messages": chat_history}


@app.post("/add_task/")
async def add_task(task_name: str, db: dict = Depends(get_db), current_user: str = Depends(get_current_user)):
    """ Endpoint to generate focus methods and rewards for a task """
    prompt = f"You are a supportive and friendly ADHD therapist who gives practical, easy-to-understand advice. Suggest an effective focus method and a motivating reward for completing the task: '{task_name}'."
    
    response = requests.post(API_URL, headers=HEADERS, json={"inputs": prompt})

    if response.status_code == 200:
        generated_text = response.json()
        
        if isinstance(generated_text, list) and generated_text:
            generated_text = generated_text[0].get("generated_text", "")
        clean_text = generated_text.replace(prompt, "").strip()

        task_data = {
            "username": current_user,  # Store task under user
            "task": task_name, 
            "details": clean_text
        }
        
        await save_task(current_user, task_name, clean_text)

        return {"message": f"Task '{task_name}' added!", "suggested_strategy": task_data["details"]}
    else:
        return {"error": response.status_code, "message": response.text}


@app.get("/tasks/")
async def get_tasks(current_user: str = Depends(get_current_user)):
    """Fetch all tasks for the authenticated user"""
    tasks = await get_user_tasks(current_user)
    return {"username": current_user, "tasks": tasks}    




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
