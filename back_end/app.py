import os
import uvicorn

from datetime import datetime
from pymongo.mongo_client import MongoClient
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from utils.authentication import add_user_to_db, send_transaction_to_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*", # '*' for all origins
        "http://localhost:3000",  # Local frontend address
        "https://frontend-app-expenses-1f4540fc6af9.herokuapp.com/"  # Production frontend address
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from dotenv import load_dotenv
load_dotenv()
username = os.getenv('MONGO_USERNAME')
password = os.getenv('MONGO_PASSWORD')
cluster_url = os.getenv('MONGO_CLUSTER_URL')
if not all([username, password, cluster_url]):
    raise ValueError("MongoDB connection parameters are not fully configured.")
uri = f'mongodb+srv://{username}:{password}@{cluster_url}/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(uri)
# try:
#     client.admin.command('ping')
#     print("Successfully pinged")
# except Exception as e:
#     print(e)
db = client.expenses


class Credentials(BaseModel):
    username: str
    password: str

@app.post("/verifyCredentials")
async def verify_credentials(credentials: Credentials):
    username, password = credentials.username, credentials.password
    collection = db.users
    is_verfied = collection.count_documents({"username": username, "password": password}) == 1
    if not is_verfied:
        raise HTTPException(detail="Invalid credentials", status_code=400)
    return JSONResponse(content={"status": "success"}, status_code=200)


class UserInfo(BaseModel):
    firstName: str
    lastName: str
    email: str
    username: str
    password: str

@app.post("/addUser")
async def add_user(userInfo: UserInfo):
    firstName, lastName, email, username, password = userInfo.firstName, userInfo.lastName, userInfo.email, userInfo.username, userInfo.password
    collection = db.users
    username_already_exists = collection.count_documents({"username": username}) > 0
    if username_already_exists:
        raise HTTPException(detail="Username already exists", status_code=400)
    add_user_to_db(collection, firstName, lastName, email, username, password)
    return JSONResponse(content={"status": "success"}, status_code=200)


class TransactionInfo(BaseModel):
    globalUsername: str
    finalNumber: float
    selectedDate: datetime
    reason: str
    comments: str
    
@app.post("/sendTransaction")
async def add_user(transactionInfo: TransactionInfo):
    username, amount, date, reason, comments = transactionInfo.globalUsername, transactionInfo.finalNumber, transactionInfo.selectedDate, transactionInfo.reason, transactionInfo.comments
    collection = db.transaction
    send_transaction_to_db(collection, username, amount, date, reason, comments)
    return JSONResponse(content={"status": "success"}, status_code=200)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
