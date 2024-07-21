from dotenv import load_dotenv
import gridfs
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from bson.objectid import ObjectId

load_dotenv()
def get_mongo_client():
    uri = os.getenv("MONGO_URI")
    client = MongoClient(uri, server_api=ServerApi('1'))
    return client

def upload_pdf(file,filename, metadata):
    client = get_mongo_client()
    print(client)
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

    
