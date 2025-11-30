"""Background tasks"""
from app.workers.celery_app import celery_app
from app.utils.email import send_email


@celery_app.task(name="send_email_task")
def send_email_task(to_email: str, subject: str, body: str, html: bool = False):
    """Send email as background task"""
    # Note: This needs to be synchronous for Celery
    import asyncio
    asyncio.run(send_email(to_email, subject, body, html))
    return {"status": "sent", "to": to_email}


@celery_app.task(name="generate_report")
def generate_report_task(report_type: str, tenant_id: int):
    """Generate report as background task"""
    # Placeholder for report generation
    return {"status": "generated", "report_type": report_type, "tenant_id": tenant_id}


@celery_app.task(name="send_bulk_notifications")
def send_bulk_notifications_task(user_ids: list, message: str):
    """Send bulk notifications as background task"""
    # Placeholder for bulk notification sending
    return {"status": "sent", "count": len(user_ids)}
