import os
import time
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ASSISTANT_ID = os.getenv("ASSISTANT_ID")

# Initialize OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

def create_thread():
    return client.beta.threads.create()

def add_message(thread_id, user_input):
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=user_input
    )

def run_assistant(thread_id):
    return client.beta.threads.runs.create(
        thread_id=thread_id,
        assistant_id=ASSISTANT_ID
    )

def wait_for_run_completion(thread_id, run_id, timeout=30):
    start_time = time.time()
    while time.time() - start_time < timeout:
        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread_id,
            run_id=run_id
        )
        if run_status.status == "completed":
            return
        elif run_status.status in ["failed", "cancelled", "expired"]:
            raise Exception(f"Run failed with status: {run_status.status}")
        time.sleep(1)
    raise TimeoutError("Run did not complete within the timeout period.")

def get_assistant_response(thread_id):
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    for message in reversed(messages.data):
        if message.role == "assistant":
            return message.content[0].text.value
    return "No response from assistant."

def main():
    print("Welcome to the OpenAI Assistant Chat!")
    print("Type 'exit' to end the conversation.\n")
    thread = create_thread()
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print("Ending the conversation. Goodbye!")
            break
        add_message(thread.id, user_input)
        run = run_assistant(thread.id)
        try:
            wait_for_run_completion(thread.id, run.id)
            response = get_assistant_response(thread.id)
            print(f"Assistant: {response}\n")
        except Exception as e:
            print(f"Error: {e}")
            break

if __name__ == "__main__":
    main()
