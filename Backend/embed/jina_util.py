from typing import List
import os
import requests

# write a util method that will take a attay of text and return an list of corresponding vectors
def get_text_vectors(texts: List[str]) -> List[object]:
    """
    Returns a list of corresponding vectors for the given list of texts.

    @param texts: A list of texts.
    @return: A list of corresponding vectors.
    """

    data_object: List[object] =  get_jina_response(texts)
    
    return data_object


# write a method to make api Call to Jina and get the response back
def get_jina_response(text: str) -> List[object]:
    """
    Makes an API call to Jina and returns the response.

    @param text: The text to be sent to Jina.
    @return: The response from Jina.
    """
    url = os.environ.get("JINA_API_ENDPOINT")
    api_key = os.environ.get("JINA_API_KEY")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    data = {
        "model": "jina-clip-v1",
        "embedding_type": "float",
        "input": text
    }

    response = requests.post(url, headers=headers, json=data)
    return response.json().get("data")


