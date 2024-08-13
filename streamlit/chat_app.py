#newcode
import os
from openai import OpenAI
import streamlit as st
import requests
from dotenv import load_dotenv
load_dotenv()

st.title("Document Reader")

if "openai_model" not in st.session_state:
    st.session_state["openai_model"] = "gpt-3.5-turbo"

if "messages" not in st.session_state:
    st.session_state.messages = []

# Initialize session state for theme if not set
if "theme" not in st.session_state:
    st.session_state.theme = "light"  # Default theme

# Theme toggle button
if st.button("Toggle Dark/Light Mode"):
    # Switch between light and dark theme
    st.session_state.theme = "dark" if st.session_state.theme == "light" else "light"

# Apply the theme dynamically
if st.session_state.theme == "light":
    st.markdown(
        """
        <style>
        body {
            background-color: #F0F2F6;
            color: #000000;
        }
        .css-1v0mbdj {
            color: #000000;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )
else:
    st.markdown(
        """
        <style>
        body {
            background-color: #1E1E1E;
            color: #FFFFFF;
        }
        .css-1v0mbdj {
            color: #FFFFFF;
        }
        </style>
        """,
        unsafe_allow_html=True,
    )
    
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

if prompt := st.chat_input("What is up?"):
    # api_url = "https://backend-mu-topaz.vercel.app/query/"  # Replace with your actual API endpoint
    api_url = st.secrets["api_urls"]["API_URL"]
    headers = {"Content-Type": "application/json"}
    data = {"query": prompt,
                "email": st.query_params.get("email", "")}
    print(data)

    try:
        response = requests.post(api_url, json=data, headers=headers)
        response.raise_for_status() 
        bot_response = response.json().get("response", "Sorry, I didn't understand that.")
        print("bot_response", bot_response)
    except requests.exceptions.RequestException as e:
        bot_response = f"Error: {str(e)}"


    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    st.session_state.messages.append({"role": "assistant", "content": bot_response})
    with st.chat_message("assistant"):
        st.markdown(bot_response)



