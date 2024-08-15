from langchain.document_loaders.pdf import PyPDFDirectoryLoader
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
import os


def extract_text_from_pdf(data_file):
    """
    Extracts text from a PDF file and returns an array of text.

    Parameters:
    pdf_file (str): The path to the PDF file.

    Returns:
    list: An array of text extracted from the PDF.
    """

    with open("/tmp/current.pdf", 'wb') as file:
        file.write(data_file)

    # Load the PDF document
    document_loader = PyPDFLoader("/tmp/current.pdf")
    loader = document_loader.load()


    # Split the document into chunks of text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=80,
        length_function=len,
        is_separator_regex=False,
    )
    chunks = text_splitter.split_documents(loader)
    os.remove("/tmp/current.pdf")


    return chunks

    

