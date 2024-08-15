#newcode
import os
from openai import OpenAI
import streamlit as st
import requests
from dotenv import load_dotenv
load_dotenv()

st.set_page_config(
    page_title="Document Reader",
    page_icon="📄",
    layout="centered",
    initial_sidebar_state="expanded",
)


st.title("Your reading assistant  📖")

# if "openai_model" not in st.session_state:
#     st.session_state["openai_model"] = "gpt-3.5-turbo"

if "messages" not in st.session_state:
    st.session_state.messages = []


# Initialize session state for theme if not set
if "theme" not in st.session_state:
    st.session_state.theme = "light"  # Default theme


for message in st.session_state.messages:
    if message["role"] == "user":
        with st.chat_message(message["role"], avatar="👤"):
            st.markdown(message["content"])
    else:
        with st.chat_message(message["role"], avatar="📝"):
            st.markdown(message["content"])

if prompt := st.chat_input("What is name of the Document I have?"):
    api_url = "http://localhost:8000/query"  # Replace with your actual API endpoint
    # api_url = st.secrets["API_URL"]
    headers = {"Content-Type": "application/json"}
    data = {"query": prompt,
                "email": st.query_params.get("email", "")}
    
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user", avatar="👤"):
        st.markdown(prompt)
    with st.spinner("Processing..."):

        try:
            response = requests.post(api_url, json=data, headers=headers)
            response.raise_for_status() 
            bot_response = response.json().get("response", "Sorry, I didn't understand that.")
        except requests.exceptions.RequestException as e:
            bot_response = f"Error: {str(e)}"


  

    st.session_state.messages.append({"role": "assistant", "content": bot_response})
    with st.chat_message("assistant", avatar="📝"):
        st.markdown(bot_response)



