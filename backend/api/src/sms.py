from twilio.rest import Client
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s %(levelname)s %(message)s",
    filename="/tmp/log/feeds.log",
)


class SMS:
    def __init__(self, account_sid: str, auth_token: str) -> None:
        self.account_sid = account_sid
        self.auth_token = auth_token

    def send(self, to: str, message_body: str):
        client = Client(self.account_sid, self.auth_token)
        sms = client.messages.create(from_="+447449469778", to=to, body=message_body)
        logging.info(sms)
