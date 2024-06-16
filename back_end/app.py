import os
import uvicorn
import jwt

from datetime import datetime
from typing import List
from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from utils.authentication import (
    add_user_to_db,
    send_transaction_to_db,
    add_group_to_db,
    delete_group_from_db,
    get_groups_by_username_from_db,
    get_all_usernames_from_db,
)

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

load_dotenv()
MONGO_USERNAME = os.getenv('MONGO_USERNAME')
MONGO_PASSWORD = os.getenv('MONGO_PASSWORD')
MONGO_CLUSTER_URL = os.getenv('MONGO_CLUSTER_URL')
if not all([MONGO_USERNAME, MONGO_PASSWORD, MONGO_CLUSTER_URL]):
    raise ValueError("MongoDB connection parameters are not fully configured.")
uri = f'mongodb+srv://{MONGO_USERNAME}:{MONGO_PASSWORD}@{MONGO_CLUSTER_URL}/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(uri)
# try:
#     client.admin.command('ping')
#     print("Successfully pinged")
# except Exception as e:
#     print(e)
db = client.expenses

# import secrets
# print(secrets.token_urlsafe(32))
SECRET_KEY = os.getenv('SECRET_KEY')

### verifyCredentials ###
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
    token = jwt.encode({"username": username}, SECRET_KEY, algorithm="HS256")
    return JSONResponse(content={"status": "success", "token": token}, status_code=200)
######

### addUser ###
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
######

### sendTransaction ###
class TransactionInfo(BaseModel):
    username: str
    finalNumber: float
    selectedDate: datetime
    reason: str
    selectedGroup: str
    comments: str
    
@app.post("/sendTransaction")
async def add_user(transactionInfo: TransactionInfo):
    username, amount, date, reason, group, comments = transactionInfo.username, transactionInfo.finalNumber, transactionInfo.selectedDate, transactionInfo.reason, transactionInfo.selectedGroup, transactionInfo.comments
    collection = db.transaction
    send_transaction_to_db(collection, username, amount, date, reason, group, comments)
    return JSONResponse(content={"status": "success"}, status_code=200)
######

### getGroups ###
class AdminInfo(BaseModel):
    username: str
    
@app.post("/getGroups")
async def get_groups(adminInfo: AdminInfo):
    username = adminInfo.username
    collection = db.users
    groups = get_groups_by_username_from_db(collection, username)
    if len(groups) == 1:
        groups = groups[0]
    return JSONResponse(content={"status": "success", "groups": groups}, status_code=200)
######

### getUsers ###
@app.get("/getUsernames")
async def get_usernames():
    collection = db.users
    usernames = get_all_usernames_from_db(collection)
    return JSONResponse(content={"status": "success", "usernames": usernames}, status_code=200)
######

### addGroup ###
class GroupInfoAdd(BaseModel):
    group_name: str
    admin_username: str
    members_usernames: List[str]
    
@app.post("/groups/addGroup")
async def add_group(groupInfo: GroupInfoAdd):
    group_name, admin_username, members_usernames = groupInfo.group_name, groupInfo.admin_username, groupInfo.members_usernames
    groups_collection, users_collection = db.groups, db.users
    add_group_to_db(groups_collection, users_collection, group_name, admin_username, members_usernames)
    return JSONResponse(content={"status": "success"}, status_code=200)
######

### deleteGroup ###
class GroupInfoDelete(BaseModel):
    group_name: str
    admin_username: str
    
@app.post("/groups/deleteGroup")
async def add_group(groupInfo: GroupInfoDelete):
    group_name, admin_username = groupInfo.group_name, groupInfo.admin_username
    groups_collection, users_collection = db.groups, db.users
    result, msg = delete_group_from_db(groups_collection, users_collection, group_name, admin_username)
    if not result:
        return JSONResponse(content={"status": "failed", "msg": msg}, status_code=200)
    return JSONResponse(content={"status": "success", "msg": msg}, status_code=200)
######

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
