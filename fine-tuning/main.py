import json
import tiktoken  # for token counting
import numpy as np
from collections import defaultdict

# Step 1:
# Data loading
data_path = "./dataset.jsonl"

# Load the dataset
with open(data_path, 'r', encoding='utf-8') as f:
    dataset = [json.loads(line) for line in f]

# Initial dataset stats
print("Num examples:", len(dataset))
print("First example:")
for message in dataset[0]["messages"]:
    print(message)


# Step 2: Format Validation
format_errors = defaultdict(int)

for ex in dataset:
    if not isinstance(ex, dict):
        format_errors["data_type"] += 1
    messages = ex.get("messages", None)
    if messages is None:
        format_errors["missing_messages_list"] += 1
    else:
        for message in messages:
            if "role" not in message or "content" not in message:
                format_errors["message_missing_key"] += 1
            if any(k not in ("role", "content", "name", "function_call", "weight") for k in message):
                format_errors["message_unrecognized_key"] += 1
            if message.get("role") not in ("system", "user", "assistant"):
                format_errors["unrecognized_role"] += 1
            if not isinstance(message.get("content", ''), str):
                format_errors["missing_content"] += 1
        if not any(message.get("role") == "assistant" for message in messages):
            format_errors["example_missing_assistant_message"] += 1

if format_errors:
    print("Found errors:")
    for k, v in format_errors.items():
        print(f"{k}: {v}")
else:
    print("No errors found")

# Step 3: Token Counting
encoding = tiktoken.get_encoding("cl100k_base")

def num_tokens_from_messages(messages):
    num_tokens = 0
    for message in messages:
        num_tokens += len(encoding.encode(message['content']))
    return num_tokens

def print_distribution(values, name):
    print(f"\n#### Distribution of {name}:")
    print(f"min / max: {min(values)}, {max(values)}")
    print(f"mean / median: {np.mean(values)}, {np.median(values)}")
    print(f"p5 / p95: {np.quantile(values, 0.05)}, {np.quantile(values, 0.95)}")

n_missing_system = 0
n_missing_user = 0
n_messages = []
convo_lens = []
assistant_message_lens = []

for ex in dataset:
    messages = ex["messages"]
    system_present = any(m["role"] == "system" for m in messages)
    user_present = any(m["role"] == "user" for m in messages)
    n_missing_system += not system_present
    n_missing_user += not user_present
    n_messages.append(len(messages))
    convo_lens.append(num_tokens_from_messages(messages))
    assistant_message_lens.append(num_tokens_from_messages([m for m in messages if m["role"] == "assistant"]))

print("Num examples missing system message:", n_missing_system)
print("Num examples missing user message:", n_missing_user)
print_distribution(n_messages, "num_messages_per_example")
print_distribution(convo_lens, "num_total_tokens_per_example")
print_distribution(assistant_message_lens, "num_assistant_tokens_per_example")


# # Step 4: Cost Estimation
n_epochs = 3  # typically a good starting point
n_train_examples = len(dataset)
n_billing_tokens_in_dataset = sum(min(138, l) for l in convo_lens)

print(f"Dataset has ~{n_billing_tokens_in_dataset} tokens that will be charged for during training")
print(f"By default, you'll train for {n_epochs} epochs on this dataset")
print(f"By default, you'll be charged for ~{n_epochs * n_billing_tokens_in_dataset} tokens")

