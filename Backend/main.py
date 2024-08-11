from fastapi import FastAPI, Request, HTTPException, Header, Query
from pydantic import BaseModel
from common import get_mongo_client, upload_pdf, retrieve_pdf, get_pdfs_by_email, insert_notes, get_notes_by_email
from typing import Required
import io
from fastapi.responses import RedirectResponse
from fastapi.responses import StreamingResponse
from bson.objectid import ObjectId
from vectordb.pdf_splitter import extract_text_from_pdf
from vectordb.pinecone_util import connect_and_store_vector
from langserve import add_routes
from chain import chain as research_langChain_chain
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # Allow all origins
    allow_credentials=True,         # Allow cookies and credentials to be sent
    allow_methods=["*"],            # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],            # Allow all headers, including custom headers
)


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
    if(file_content):
        chunks = extract_text_from_pdf(file_content)
        file_id = upload_pdf(file_content, filename, {"email": email})
        connect_and_store_vector(chunks, email, filename, str(file_id))
    else:
        raise HTTPException(status_code=400, detail="file is empty")

    
    return {"file_id": str(file_id)}



@app.get("/pdf/retrieve/{file_id}")
async def get_pdf(file_id: str):
    file_id = ObjectId(str(file_id))
    file = retrieve_pdf(file_id)
    return Response(content=file, media_type="application/pdf")

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





@app.post("/notes")
async def post_notes(request: Request, email: str):

    note = await request.body()
    note_str = note.decode("utf-8")

    result = insert_notes(note_str, email)

    return {"note_id": str(result)}


@app.get("/notes")
async def get_notes(email: str):
    notes = get_notes_by_email(email)
    
    if not notes:
        raise HTTPException(status_code=404, detail="No notes found for the given email")
    responseBody = {**notes, '_id' : str(notes['_id'])}
    return responseBody