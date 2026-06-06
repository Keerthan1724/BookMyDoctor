from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from email.mime.image import MIMEImage
import os
import threading
import logging

logger = logging.getLogger(__name__)


def _send_email_async(email):
    try:
        email.send()
    except Exception:
        logger.exception("Failed to send email")


def send_html_email(subject, template, context, to_email):
    html_content = render_to_string(template, context)

    email = EmailMultiAlternatives(
        subject,
        "",
        settings.EMAIL_HOST_USER,
        [to_email],
    )

    email.attach_alternative(html_content, "text/html")

    # Attach logo as CID image (read now so thread doesn't need file I/O)
    try:
        logo_path = os.path.join(settings.BASE_DIR, "static", "logo.png")
        with open(logo_path, "rb") as f:
            logo = MIMEImage(f.read())
            logo.add_header("Content-ID", "<logo_image>")
            logo.add_header("Content-Disposition", "inline", filename="logo.png")
            email.attach(logo)
    except Exception:
        logger.exception("Failed to attach logo to email")

    # Send email in background thread to avoid blocking request-response cycle
    thread = threading.Thread(target=_send_email_async, args=(email,), daemon=True)
    thread.start()