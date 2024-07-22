from fastapi import FastAPI, Request, HTTPException, Header, Query
from pydantic import BaseModel
from common import get_mongo_client, upload_pdf, retrieve_pdf, get_pdfs_by_email
from typing import Required
import io
from fastapi.responses import RedirectResponse
from fastapi.responses import StreamingResponse
from bson.objectid import ObjectId
from vectordb.pdf_splitter import extract_text_from_pdf
from vectordb.pinecone_util import connect_and_store_vector
from langserve import add_routes
from chain import chain as research_langChain_chain
app = FastAPI()

client = get_mongo_client()


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



@app.get("/pdf/retrieve/{file_id}")
async def get_pdf(file_id: str):
    file_id = ObjectId(str(file_id))
    file = retrieve_pdf(file_id)
    return StreamingResponse(io.BytesIO(file), media_type="application/pdf")

@app.get("/langServe/docs")
async def redirect_root_to_docs():
    return RedirectResponse("/docs")


# Edit this to add the chain you want to add
add_routes(app, research_langChain_chain, path="/query")


@app.get("/getFiles")
async def get_files_by_email(email: str = Query(...)):
    print(email)
    pdfs = get_pdfs_by_email(email)
    
    if not pdfs:
        raise HTTPException(status_code=404, detail="No PDFs found for the given email")
    
    return pdfs