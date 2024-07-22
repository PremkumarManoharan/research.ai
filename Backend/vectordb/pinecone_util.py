from pinecone import Pinecone
from uuid import uuid4
from embed.jina_util import get_text_vectors
import os
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))
index = pc.Index("pdf")

def connect_and_store_vector(chunks, email, source_filename, source_file_id):
    """
    Connects to Pinecone and stores the vector in the database along with the metadata.

    Parameters:
    chunks: the chunks of text
    email (str): The email associated with the vector.
    source_filename (str): The filename associated with the vector.
    source_file_id (str): The unique identifier for the file.

    Returns:
    bool: True if the vector is successfully stored, False otherwise.
    """
    texts = []
    for chunk in chunks:
        texts.append({"text": chunk.page_content})
    
    data = get_text_vectors(texts)
    vectors = []
    for i, chunk in enumerate(chunks):
        metadata = {
            "email": email,
            "source_filename": source_filename,
            "source_file_id": source_file_id,
            "page": chunk.metadata.get("page"),
            "text": chunk.page_content
        }
        values = data[i].get("embedding")
        
        vectors.append({"id": str(uuid4()), "values": values, "metadata": metadata})
    
    index.upsert(vectors)


