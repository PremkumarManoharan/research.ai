import streamlit as st
import requests

# Initialize chat history
if 'chat_history' not in st.session_state:
    st.session_state['chat_history'] = []

# Title of the app
st.title("Streamlit Chat")

# Display chat history
for chat in st.session_state['chat_history']:
    st.write(f"**{chat['role']}**: {chat['text']}")

# Input for user message
user_input = st.text_input("You: ", key="input", placeholder="Type your message here...")

# Handle user input
if st.button("Send"):
    if user_input:
        # Add user message to chat history
        st.session_state['chat_history'].append({"role": "User", "text": user_input})

        # Make an API call with the user's input
        api_url = "http://127.0.0.1:8000/query/"  # Replace with your actual API endpoint
        headers = {"Content-Type": "application/json"}
        data = {"query": user_input,
                "email": st.query_params.get("email", "")}

        try:
            response = requests.post(api_url, json=data, headers=headers)
            response.raise_for_status() 
            bot_response = response.json().get("response", "Sorry, I didn't understand that.")
            print("bot_response", bot_response)
        except requests.exceptions.RequestException as e:
            bot_response = f"Error: {str(e)}"

        # Add the bot's response to the chat history
        st.session_state['chat_history'].append({"role": "Bot", "text": bot_response})

        # Clear the input box after sending
        # st.session_state['input'] = ""

