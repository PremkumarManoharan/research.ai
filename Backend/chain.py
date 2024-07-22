import os
from langchain_community.chat_models import ChatOpenAI
from langchain_community.embeddings import JinaEmbeddings
from langchain_community.vectorstores import Pinecone
from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableLambda
from pinecone import Pinecone as PineconeClient
from langsmith import Client
from dotenv import load_dotenv
load_dotenv()
#LangSmith Client - for tracing
client = Client()

# Keys
PINECONE_API_KEY = os.environ["PINECONE_API_KEY"]
PINECONE_ENVIRONMENT = os.environ["PINECONE_ENVIRONMENT"]
PINECONE_INDEX_NAME = os.environ["PINECONE_INDEX_NAME"]
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
JINA_API_KEY = os.environ["JINA_API_KEY"]


pinecone = PineconeClient(api_key=PINECONE_API_KEY,
                         environment=PINECONE_ENVIRONMENT)

embeddings = JinaEmbeddings(jina_api_key=JINA_API_KEY, model_name='jina-clip-v1')
vectorstore = Pinecone.from_existing_index(index_name=PINECONE_INDEX_NAME,
                                           embedding=embeddings)

retriever = vectorstore.as_retriever()

# RAG prompt
template = """Answer the question based only on the following context:
{context}
Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)

# RAG
model = ChatOpenAI(temperature=0, 
                   model="gpt-3.5-turbo")

chain = (
    RunnableParallel({"context": retriever, "question": RunnablePassthrough()})
    | prompt
    | model
    | StrOutputParser()
)