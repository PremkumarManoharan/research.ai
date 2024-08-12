from dotenv import load_dotenv
import gridfs
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId
import certifi
ca = certifi.where()



load_dotenv()
def get_mongo_client():
    uri = os.getenv("MONGO_URI")
    client = MongoClient(uri, server_api=ServerApi('1'),tlsCAFile=ca)
    return client

def upload_pdf(file,filename, metadata):
    client = get_mongo_client()
    db = client['researchai']
    fs = gridfs.GridFS(db)
    
    file_id = fs.put(file, filename=filename, **metadata)
    
    client.close()
    return file_id

def retrieve_pdf(file_id):
    client = get_mongo_client()
    db = client['researchai']
    fs = gridfs.GridFS(db)
    file = fs.get(ObjectId(file_id)).read()
    client.close()
    
    return file

    

def get_pdfs_by_email(email: str):
    client = get_mongo_client()
    db = client['researchai']
    fs = gridfs.GridFS(db)
    print(f"fs PDFs for email: {fs}")
    cursor = db.fs.files.find({"email": email}, {"_id": 1, "filename": 1})
    pdfs = [{"id": str(doc["_id"]), "name": doc["filename"]} for doc in cursor if doc["filename"].endswith(".pdf")]
    client.close()
    
    return pdfs

def insert_notes(note: str, email: str):
    client = get_mongo_client()
    db = client["researchai"]
    collection = db["notes"]
    collection.replace_one({"email": email}, {"content": note, "email": email}, upsert=True)
    document = collection.find_one({"email": email}, {"_id": 1})
    client.close()
    
    return document.get("_id")


def get_notes_by_email(email: str):
    client = get_mongo_client()
    db = client["researchai"]
    collection = db["notes"]
    document = collection.find_one({"email": email})
    client.close()
    
    return document

def delete_pdf(file_id: str):
    client = get_mongo_client()
    db = client["researchai"]
    fs = gridfs.GridFS(db)
    result = fs.delete(ObjectId(file_id))
    
    client.close()
    
    return True