"""Notification dispatch via SNS (SMS) and SES (email)."""
import logging

import boto3

from config import settings

logger = logging.getLogger(__name__)

_sns = boto3.client("sns", region_name=settings.AWS_REGION)
_ses = boto3.client("ses", region_name=settings.AWS_REGION)


def send_sms(phone: str, message: str) -> bool:
    if not phone:
        return False
    try:
        _sns.publish(PhoneNumber=phone, Message=message)
        return True
    except Exception as exc:
        logger.warning("SMS send failed: %s", exc)
        return False


def send_email(to: str, subject: str, body_html: str, body_text: str | None = None) -> bool:
    if not to:
        return False
    try:
        _ses.send_email(
            Source=settings.SES_FROM_EMAIL,
            Destination={"ToAddresses": [to]},
            Message={
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {
                    "Html": {"Data": body_html, "Charset": "UTF-8"},
                    "Text": {"Data": body_text or body_html, "Charset": "UTF-8"},
                },
            },
        )
        return True
    except Exception as exc:
        logger.warning("Email send failed: %s", exc)
        return False
