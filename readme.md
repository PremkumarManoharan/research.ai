# Submission Info

## Team members

- Varun Bharathi Jayakumar (002752810)

  LinkedIn: https://www.linkedin.com/in/varun-bharathi-j/
  Github: https://github.com/varun-jayakumar
  jayakumar.va@northeastern.edu

- Prem Kumar Raghava Manoharan (002726784)

  Linkedin: https://www.linkedin.com/in/premkumar-rm/
  Github: https://github.com/PremkumarManoharan
  raghavamanoharan.p@northeastern.edu

- Aditya Mehta (002775464)

  Linkedin: https://www.linkedin.com/in/aditya-mehta98/
  Github:https://github.com/adityamehta35
  mehta.adit@northeastern.edu

## Demonstration video link

https://www.loom.com/share/d099c707fb7042e59c1109a07405fed3?sid=96b996d4-7596-4231-9b55-7121180e1e77

## Project deployment URL (try it out)

- our team is actively working on making it better and bring it to market
  https://research-ai-pi.vercel.app/

## Pdf submission

https://github.com/varun-jayakumar/research.ai/blob/main/final_project_pdf.pdf

Download to view it

# Research AI project

Research.AI is an innovative platform designed to enhance the research process by leveraging advanced AI capabilities. The platform allows users to upload documents, which are then automatically split, indexed, and stored in a vector database. This enables powerful similarity searches, facilitating the use of Retrieval-Augmented Generation (RAG) models by large language models (LLMs) to efficiently answer user queries.

Users can seamlessly upload various files, which are then made fully accessible for reading and annotation. As users engage with the content, they can create notes, highlight key sections, and ask questions in real-time. Whether it's locating a specific part of the document, understanding a complex term, or delving deeper into a topic, Research.AI provides precise and contextually relevant responses, making it an invaluable tool for researchers, students, and professionals alike.

Access our product here: https://research-ai-pi.vercel.app/

## Installation and Start-up

1.  **Clone the repository:**

```bash
git clone https://github.com/varun-jayakumar/research.ai.git
```

### Frontend

```
cd frontend/ research.ai/
npm install
npm run dev
```

The frontend will be served at http://localhost:3000

### Backend

- Make sure you have python 3.1x installed in your system

```
cd Backend
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The frontend will be served at http://localhost:8000

### Streamlit

- Make sure you have python 3.1x installed in your system

```
cd streamlit
python3 -m venv venv
source ./venv/bin/activate
pip install -r requirements.txt
streamlit run chat_app.py
```

Streamlit is served at http://localhost:8501

### .env

For the backend to use required services we need to setup a .env file

```
cd Backend
touch .env
vi .env

# MONGO_URI=""
# JINA_API_KEY=""
# JINA_API_ENDPOINT=""
# PINECONE_API_KEY=""
# PINECONE_ENVIRONMENT = ""
# PINECONE_INDEX_NAME = ""
# JINA_API_KEY = ""
# OPENAI_API_KEY=""
# LANGCHAIN_TRACING_V2=""
# LANGCHAIN_PROJECT=""
# LANGCHAIN_ENDPOINT=""
# LANGCHAIN_API_KEY=""
```

# Documentation on fine-tuning:

The LLM model used by the chat-app is a fine-tuned version of chat-gpt-4o-mini

The process of fine tuning is outlined in the following google colab doc:
https://colab.research.google.com/drive/1QIkKdJDgMeh-jjMSxghfrzFuqF48oqbX?usp=sharing

The guidelines above is followed to finetune our model:

the data and code used can be found inside `fine-tuning` folder

# Feature of the Application

| Feature                                                                                      | status |
| -------------------------------------------------------------------------------------------- | ------ |
| Upload a PDF and index on pinecone on the fly                                                | Done   |
| Ability to Read The PDF by selecting from file drawer                                        | Done   |
| Ability to make Notes on a rich text editor Across all PDF that can be retrieved at any time | Done   |
| Ability to ask questions on the uploaded pdf and and be the users are isolated               | Done   |

## Work in Progress

| Feature                                                                                                                | status     |
| ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| Ability to show definition when a user highlight and press a shortcut for show the meaning on a tooltip                | Inprogress |
| When asked a question the response has the answer and also a source link (the page of the file the answer was found at | Inprogress |

## Future Work

| Feature                                                                                      | Status      |
| -------------------------------------------------------------------------------------------- | ----------- |
| Ability for the user to provide links and read the webpage and also questions on the webpage | Not Started |

We are looking for feature requests and feedback let us!

you can contact contributos of the project at:

## The Team

- Varun Jayakumar - jayakumar.va@northeastern.edu
- Prem Kumar - raghavamanoharan.p@northeastern.edu
- Aditya Mehta - mehta.adit@northeastern.edu
