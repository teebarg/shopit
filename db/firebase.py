# db/firebase.py

import firebase_admin
from firebase_admin import credentials, firestore
from core.config import settings

# Function to initialize the Firebase Admin SDK and Firestore client
def initialize_firestore():

    # Initialize Firebase app
    if not firebase_admin._apps:  # Check if the app is not already initialized
        cred = credentials.Certificate(settings.FIREBASE_CRED_PATH)
        firebase_admin.initialize_app(cred)
        return firestore.client()
