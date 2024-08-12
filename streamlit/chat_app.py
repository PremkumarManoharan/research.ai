import streamlit as st

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

        # Here, you could process the input and generate a response
        # For this example, we'll just echo the user's input as the bot's response
        bot_response = f"You said: {user_input}"
        st.session_state['chat_history'].append({"role": "Bot", "text": bot_response})

        # Clear the input box after sending
        st.session_state['input'] = ""

