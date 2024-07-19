# FastAPI Project

This project is a web API built with FastAPI. FastAPI is a modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/varun-jayakumar/research.ai.git
    ```

2. **Create and activate a virtual environment:**

    ```bash
    python3 -m venv env
    source env/bin/activate   # On Windows, use `env\Scripts\activate`
    ```

3. **Install the dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

## Running the App

1. **Start the FastAPI server:**

    ```bash
    uvicorn main:app --reload
    ```

    - `main` is the name of your Python file (e.g., `main.py`).
    - `app` is the name of the FastAPI instance in your Python file.
    - `--reload` makes the server restart after code changes. Use this only in development.
