from fastapi import FastAPI, Request, HTTPException, Header
from pydantic import BaseModel
from common import get_mongo_client, upload_pdf, retrieve_pdf
from typing import Required
import io
from fastapi.responses import StreamingResponse
from bson.objectid import ObjectId
from vectordb.pdf_splitter import extract_text_from_pdf
from vectordb.pinecone_util import connect_and_store_vector

app = FastAPI()

client = get_mongo_client()

# Schemas
class Item(BaseModel):
    text: str = None
    is_done: bool = False


items = []

# test method
@app.get("/")
def test():
    return {"message": "Hi the app is working"}


@app.post("/pdf/upload")
async def post_pdf(request: Request, email: str, filename: str = Header()):
    if not email or not filename:
        raise HTTPException(status_code=400, detail="Email is required")
    
    if not request.body():
        raise HTTPException(status_code=400, detail="No file attached in body")
    
    # split pdf to chunks and index as pdfs
    
    file_content = await request.body()
    chunks = extract_text_from_pdf(file_content)
    file_id = upload_pdf(file_content, filename, {"email": email})
    connect_and_store_vector(chunks, email, filename, str(file_id))
    
    return {"file_id": str(file_id)}



@app.get("/pdf/retrieve")
async def get_pdf(file_id: str):
    file_id = ObjectId(str(file_id))
    file = retrieve_pdf(file_id)
    return StreamingResponse(io.BytesIO(file), media_type="application/pdf")


