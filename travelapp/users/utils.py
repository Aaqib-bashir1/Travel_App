import random
import logging
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
from django.conf import settings

# Set up logging for the application
logger = logging.getLogger(__name__)

# Function to generate OTP
def generate_otp():
    """Generate a random 6-digit OTP."""
    return random.randint(100000, 999999)

# Helper function to ensure phone number is in the correct format (E.164 format)
def normalize_phone_number(phone_number, is_whatsapp=False):
    """
    Normalize phone number to E.164 format and add the 'whatsapp:' prefix if needed.
    """
    if not phone_number.startswith('+'):
        phone_number = '+' + phone_number.lstrip('0')  # Add '+' if missing and remove leading zeroes (if any)
    
    # If sending via WhatsApp, add the 'whatsapp:' prefix
    if is_whatsapp:
        phone_number = f"whatsapp:{phone_number}"

    return phone_number

# Function to send OTP via WhatsApp
def send_otp_via_whatsapp(phone_number, otp):
    """Send OTP via WhatsApp using Twilio."""
    try:
        # Initialize Twilio client with credentials from Django settings
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

        # Normalize the phone number to ensure it has the 'whatsapp:' prefix
        phone_number = normalize_phone_number(phone_number, is_whatsapp=True)

        # Send OTP message via WhatsApp
        message = client.messages.create(
            body=f"Your verification OTP is {otp}",
            from_=settings.TWILIO_WHATSAPP_NUMBER,  # Your Twilio WhatsApp sandbox number
            to=phone_number,  # Recipient's WhatsApp number
        )

        # Log the successful message send
        logger.info(f"Message sent successfully via WhatsApp! SID: {message.sid}")
        return message.sid  # Return the SID to track the message

    except TwilioRestException as e:
        # Log error if the message fails to send
        logger.error(f"Error sending WhatsApp message: {e}")
        return None

# Function to send OTP via SMS
def send_otp_via_sms(phone_number, otp):
    """Send OTP via SMS using Twilio."""
    try:
        # Initialize Twilio client with credentials from Django settings
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        
        # Normalize the phone number for SMS (E.164 format without 'whatsapp:' prefix)
        phone_number = normalize_phone_number(phone_number, is_whatsapp=False)

        # Send OTP message via SMS
        message = client.messages.create(
            body=f"Your verification OTP is {otp}",
            from_=settings.TWILIO_PHONE_NUMBER,  # Your Twilio phone number for SMS
            to=phone_number,  # Recipient's phone number
        )

        logger.info(f"Message sent successfully via SMS! SID: {message.sid}")
        return message.sid  # Return the SID to track the message

    except TwilioRestException as e:
        # Log error if the message fails to send
        logger.error(f"Error sending SMS message: {e}")
        return None

