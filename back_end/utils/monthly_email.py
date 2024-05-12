import os
import smtplib

from pymongo.mongo_client import MongoClient
from dotenv import load_dotenv
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from pathlib import Path

env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

username = os.getenv('MONGO_USERNAME')
password = os.getenv('MONGO_PASSWORD')
cluster_url = os.getenv('MONGO_CLUSTER_URL')
if not all([username, password, cluster_url]):
    raise ValueError("MongoDB connection parameters are not fully configured.")
uri = f'mongodb+srv://{username}:{password}@{cluster_url}/?retryWrites=true&w=majority&appName=Cluster0'
client = MongoClient(uri)
# try:
#     client.admin.command('ping')
#     print("Successfully pinged")
# except Exception as e:
#     print(e)
db = client.expenses
collection = db.users

# Email configuration
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 587
EMAIL_ADDRESS = os.getenv('EMAIL_ADDRESS')
EMAIL_PASSWORD = os.getenv('EMAIL_PASSWORD')

def get_all_user_info_from_db(collection):
    users_info = collection.find(
        {},
        {'_id': 0}
    )
    return list(users_info)

def get_name_of_last_month():
    current_date = datetime.now()
    first_day_of_current_month = current_date.replace(day=1)
    last_day_of_previous_month = first_day_of_current_month - timedelta(days=1)
    previous_month_name = last_day_of_previous_month.strftime('%B')
    return previous_month_name
    
def send_emails(recipients):
    try:
        # Set up the server
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.ehlo() # Identify yourself to the SMTP server
        server.starttls() # Secure the SMTP connection
        server.ehlo() # Re-identify after starting TLS
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)

        # Create the email content
        for recipient in recipients:
            msg = MIMEMultipart()
            msg['From'] = EMAIL_ADDRESS
            msg['To'] = recipient['email']
            msg['Subject'] = 'Monthly Report Now Available!'
            
            first_name = recipient['firstName']
            previous_month_name = get_name_of_last_month()
            body = f'''\
                <html>
                    <body>
                        <p>Hello {first_name},<br>Your monthly report is now available on <a href="https://frontend-app-expenses-1f4540fc6af9.herokuapp.com">Expenses</a>. Please login to your account and download your {previous_month_name} report from the Reports section.</p>
                    </body>
                </html>
            '''
            
            msg.attach(MIMEText(body, 'html'))

            # Send the email
            server.sendmail(EMAIL_ADDRESS, recipient['email'], msg.as_string())

        server.quit()
        print(f'Emails sent successfully.')

    except Exception as e:
        print(f'Failed to send email: {e}')

def main():
    recipients = get_all_user_info_from_db(collection)
    if datetime.now().day == 1: # Check if today is the first of the month
        send_emails(recipients)

if __name__ == "__main__":
    main()
