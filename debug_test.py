#!/usr/bin/env python3
"""
Debug test for MongoDB Atlas registration
"""

import requests
import json

def test_registration():
    url = "http://localhost:3001/api/auth/register"
    
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "phone": "+15551234567",
        "password": "SecurePass123!",
        "country": "United States",
        "nationality": "American",
        "location": "New York, NY"
    }
    
    try:
        response = requests.post(url, json=user_data, timeout=30)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"Success! User ID: {data.get('user', {}).get('id')}")
        else:
            print("Registration failed")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_registration()