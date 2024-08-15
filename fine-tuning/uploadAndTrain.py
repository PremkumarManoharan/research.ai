from openai import OpenAI

client = OpenAI()



def upoad_data():
    response = client.files.create(
    file=open("./dataset.jsonl", "rb"),
    purpose="fine-tune"
    )
    print(response)

# FileObject(id='file-lr2vtMuZ0Me2Q20AaajwGnP3', bytes=22325, created_at=1723676659, filename='dataset.json', object='file', purpose='fine-tune', status='processed', status_details=None)


def create_fine_tuning_job():
    response = client.fine_tuning.jobs.create(
    training_file="file-ZGisUKeSzyRf87I9jvQ14OKV",  # Replace 'file-abc123' with your actual file ID
    model="gpt-4o-mini-2024-07-18"  # Model type to fine-tune
)
    print(response)

# ftjob-DmyxuYu7SaHGtPvlqCxdm9eq


# upoad_data()
create_fine_tuning_job()

