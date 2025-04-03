from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = MONGO_URI = "mongodb+srv://elkousyyyyara:U73L3qQdL1oPsZyp@cluster0.pre1c1b.mongodb.net/ADHDchatbot?retryWrites=true&w=majority"


client = AsyncIOMotorClient(MONGO_URI)
db = client.get_database("ADHDchatbot")  
chat_collection = db.get_collection("chat")  

from datetime import datetime

def get_db():
    return db

async def save_message(session_id: str, role: str, message: str):
    """Store a message (user or chatbot) in MongoDB"""
    await chat_collection.update_one(
        {"session_id": session_id},  # Find the document by session_id
        {
            "$push": {  # Push new message to the 'messages' array
                "messages": {
                    "role": role,  # 'user' or 'assistant' (chatbot)
                    "text": message, 
                    "timestamp": datetime.utcnow(),  
                }
            }
        },
        upsert=True  # If the session doesn't exist, create it
    )

async def get_chat_history(session_id: str):
    """Fetch the conversation history from MongoDB"""
    chat = await chat_collection.find_one({"session_id": session_id}) 
    return chat["messages"] if chat else []  
