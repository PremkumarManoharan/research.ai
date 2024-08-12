from fastapi import FastAPI, Request, HTTPException, Header, Query, status
from pydantic import BaseModel
from common import get_mongo_client, upload_pdf, retrieve_pdf, get_pdfs_by_email, insert_notes, get_notes_by_email, delete_pdf, create_user
from typing import Required
import io
from fastapi.responses import RedirectResponse
from fastapi.responses import StreamingResponse
from bson.objectid import ObjectId
from vectordb.pdf_splitter import extract_text_from_pdf
from vectordb.pinecone_util import connect_and_store_vector, delete_vecots_by_file_id
from langserve import add_routes
from chain import chain as research_langChain_chain
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import json


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
# add_routes(app, research_langChain_chain, path="/query")

@app.post("/query")
async def run_query(request: Request):
    body = await request.body()
    body = body.decode("utf-8")
    body = json.loads(body)
    if not body["email"] or not body["query"]:
        raise HTTPException(status_code=400, detail="Missing query or email")
    input_dict = {
            "email": body["email"],
        "query": body["query"]
    }


    result = research_langChain_chain.invoke(input_dict)         


    return {"response": result}


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


@app.delete("/pdf/delete/{file_id}")
async def delete_pdf_method(file_id: str):
    isMongoDeleted =  delete_pdf(file_id)
    isPineconeDeleted = delete_vecots_by_file_id(file_id)
    if not isMongoDeleted or not isPineconeDeleted:
        raise HTTPException(status_code=400, detail="Error deleting PDF")
    return {"message": "PDF deleted successfully"}


@app.post("/user")
async def post_user(request: Request, response: Response):
    user = await request.body()
    user_str = user.decode("utf-8")
    user_json = json.loads(user_str)
    if not user_json["email"] or not user_json["name"]:
        raise HTTPException(status_code=400, detail="Missing email or name")
    result = create_user(user_json["email"], user_json["name"])

    if result:
        response.status_code = status.HTTP_201_CREATED
        return {"message": "User Created Successfully"}
    else:
        return {"message": "User already exists"}
