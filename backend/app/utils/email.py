"""Email utilities"""
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List

from app.core.config import settings


async def send_email(
    to_email: str | List[str],
    subject: str,
    body: str,
    html: bool = False
):
    """Send email using SMTP"""
    message = MIMEMultipart("alternative")
    message["From"] = settings.SMTP_FROM
    message["To"] = to_email if isinstance(to_email, str) else ", ".join(to_email)
    message["Subject"] = subject
    
    # Add body
    if html:
        message.attach(MIMEText(body, "html"))
    else:
        message.attach(MIMEText(body, "plain"))
    
    # Send email
    try:
        await aiosmtplib.send(
            message,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            use_tls=settings.SMTP_TLS
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


async def send_password_reset_email(email: str, reset_token: str):
    """Send password reset email"""
    reset_link = f"https://yourdomain.com/reset-password?token={reset_token}"
    
    subject = "Password Reset Request"
    body = f"""
    Hello,
    
    You requested to reset your password. Click the link below to reset it:
    
    {reset_link}
    
    This link will expire in 1 hour.
    
    If you didn't request this, please ignore this email.
    
    Best regards,
    DocUrgent Team
    """
    
    await send_email(email, subject, body)


async def send_welcome_email(email: str, name: str):
    """Send welcome email to new user"""
    subject = "Welcome to DocUrgent!"
    body = f"""
    Hello {name},
    
    Welcome to DocUrgent! Your account has been successfully created.
    
    You can now log in and start using our platform.
    
    Best regards,
    DocUrgent Team
    """
    
    await send_email(email, subject, body)
