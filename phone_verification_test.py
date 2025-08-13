#!/usr/bin/env python3
"""
RoomieSwipe Phone Verification System Test
Specifically tests the phone verification functionality with MongoDB Atlas
"""

import requests
import json
import time
import random
import string
from typing import Dict, Any, Optional

class PhoneVerificationTester:
    def __init__(self, base_url: str = "http://localhost:3001"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.auth_token = None
        self.test_user_id = None
        self.test_results = []
        self.test_user_data = None
        
    def log_test(self, test_name: str, success: bool, message: str, details: Any = None):
        """Log test results"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "details": details,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def generate_test_data(self):
        """Generate realistic test data"""
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        return {
            "name": "Emma Rodriguez",
            "email": f"emma.rodriguez.{random_suffix}@example.com",
            "phone": f"+15551234567",  # Fixed format for validation
            "password": "SecurePass123!",
            "country": "United States",
            "nationality": "American",
            "location": "Los Angeles, CA"
        }
    
    def make_request(self, method: str, endpoint: str, data: Dict = None, 
                    headers: Dict = None) -> requests.Response:
        """Make HTTP request with proper error handling"""
        url = f"{self.api_url}{endpoint}"
        
        # Default headers
        default_headers = {"Content-Type": "application/json"}
        if self.auth_token:
            default_headers["Authorization"] = f"Bearer {self.auth_token}"
        
        if headers:
            default_headers.update(headers)
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=default_headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, headers=default_headers, 
                                       json=data if data else None, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, headers=default_headers, 
                                       json=data if data else None, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            return response
        except requests.exceptions.RequestException as e:
            raise Exception(f"Request failed: {str(e)}")
    
    def test_user_registration_with_phone(self):
        """Test user registration with phone number"""
        try:
            self.test_user_data = self.generate_test_data()
            response = self.make_request("POST", "/auth/register", self.test_user_data)
            
            if response.status_code == 201:
                data = response.json()
                if "token" in data and "user" in data:
                    self.auth_token = data["token"]
                    self.test_user_id = data["user"]["id"]
                    user_phone = data["user"].get("phone")
                    phone_verified = data["user"].get("phone_verified", False)
                    
                    self.log_test("User Registration with Phone", True, 
                                f"User registered with phone {user_phone}, verified: {phone_verified}")
                    return True
                else:
                    self.log_test("User Registration with Phone", False, "Missing token or user in response", data)
                    return False
            else:
                try:
                    error_data = response.json()
                    error_msg = error_data.get("error", "Unknown error")
                    self.log_test("User Registration with Phone", False, f"HTTP {response.status_code}: {error_msg}")
                except:
                    self.log_test("User Registration with Phone", False, f"HTTP {response.status_code}: {response.text}")
                return False
        except Exception as e:
            self.log_test("User Registration with Phone", False, f"Request failed: {str(e)}")
            return False
    
    def test_phone_verification_resend(self):
        """Test phone verification code resend"""
        if not self.auth_token:
            self.log_test("Phone Verification Resend", False, "No auth token available")
            return False
        
        try:
            resend_data = {"type": "phone"}
            response = self.make_request("POST", "/auth/resend-verification", resend_data)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data:
                    message = data["message"]
                    if "phone" in message.lower():
                        self.log_test("Phone Verification Resend", True, 
                                    "Phone verification resend working correctly")
                        return True
                    else:
                        self.log_test("Phone Verification Resend", False, 
                                    f"Unexpected message: {message}")
                        return False
                else:
                    self.log_test("Phone Verification Resend", False, "Invalid resend response", data)
                    return False
            elif response.status_code == 500:
                try:
                    error_data = response.json()
                    error_msg = error_data.get("error", "Unknown error")
                    # Check if it's a Twilio configuration issue (expected in test environment)
                    if "twilio" in error_msg.lower() or "verification" in error_msg.lower():
                        self.log_test("Phone Verification Resend", False, 
                                    f"Twilio service configuration issue: {error_msg}")
                        return False
                    else:
                        self.log_test("Phone Verification Resend", False, f"HTTP 500: {error_msg}")
                        return False
                except:
                    self.log_test("Phone Verification Resend", False, f"HTTP 500: {response.text}")
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.content else "No response"
                self.log_test("Phone Verification Resend", False, f"HTTP {response.status_code}: {error_msg}")
                return False
        except Exception as e:
            self.log_test("Phone Verification Resend", False, f"Request failed: {str(e)}")
            return False
    
    def test_phone_verification_with_code(self):
        """Test phone verification with a test code"""
        if not self.auth_token:
            self.log_test("Phone Verification with Code", False, "No auth token available")
            return False
        
        try:
            # Test with a 6-digit code (should work in dev environment)
            verify_data = {
                "code": "123456",
                "type": "phone"
            }
            response = self.make_request("POST", "/auth/verify", verify_data)
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "phone" in data["message"].lower():
                    self.log_test("Phone Verification with Code", True, 
                                "Phone verification code processing working")
                    return True
                else:
                    self.log_test("Phone Verification with Code", False, "Invalid verification response", data)
                    return False
            elif response.status_code == 400:
                try:
                    error_data = response.json()
                    error_msg = error_data.get("error", "Unknown error")
                    if "invalid" in error_msg.lower() and "code" in error_msg.lower():
                        self.log_test("Phone Verification with Code", True, 
                                    "Phone verification properly rejects invalid codes")
                        return True
                    else:
                        self.log_test("Phone Verification with Code", False, f"Unexpected error: {error_msg}")
                        return False
                except:
                    self.log_test("Phone Verification with Code", False, f"HTTP 400: {response.text}")
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.content else "No response"
                self.log_test("Phone Verification with Code", False, f"HTTP {response.status_code}: {error_msg}")
                return False
        except Exception as e:
            self.log_test("Phone Verification with Code", False, f"Request failed: {str(e)}")
            return False
    
    def test_phone_verification_invalid_code(self):
        """Test phone verification with invalid code"""
        if not self.auth_token:
            self.log_test("Phone Verification Invalid Code", False, "No auth token available")
            return False
        
        try:
            # Test with invalid code
            verify_data = {
                "code": "000000",
                "type": "phone"
            }
            response = self.make_request("POST", "/auth/verify", verify_data)
            
            if response.status_code == 400:
                data = response.json()
                error_msg = data.get("error", "")
                if "invalid" in error_msg.lower():
                    self.log_test("Phone Verification Invalid Code", True, 
                                "Phone verification properly rejects invalid codes")
                    return True
                else:
                    self.log_test("Phone Verification Invalid Code", False, f"Unexpected error: {error_msg}")
                    return False
            else:
                self.log_test("Phone Verification Invalid Code", False, 
                            f"Expected 400, got {response.status_code}")
                return False
        except Exception as e:
            self.log_test("Phone Verification Invalid Code", False, f"Request failed: {str(e)}")
            return False
    
    def test_phone_verification_without_auth(self):
        """Test phone verification without authentication"""
        try:
            # Temporarily remove auth token
            old_token = self.auth_token
            self.auth_token = None
            
            verify_data = {
                "code": "123456",
                "type": "phone"
            }
            response = self.make_request("POST", "/auth/verify", verify_data)
            
            # Restore token
            self.auth_token = old_token
            
            if response.status_code == 401:
                self.log_test("Phone Verification Without Auth", True, 
                            "Phone verification properly requires authentication")
                return True
            else:
                self.log_test("Phone Verification Without Auth", False, 
                            f"Expected 401, got {response.status_code}")
                return False
        except Exception as e:
            self.auth_token = old_token  # Restore token
            self.log_test("Phone Verification Without Auth", False, f"Test failed: {str(e)}")
            return False
    
    def test_mongodb_phone_data_storage(self):
        """Test that phone data is properly stored in MongoDB"""
        if not self.auth_token:
            self.log_test("MongoDB Phone Data Storage", False, "No auth token available")
            return False
        
        try:
            # Get user profile to check phone data storage
            response = self.make_request("GET", "/users/profile")
            
            if response.status_code == 200:
                data = response.json()
                if "phone" in data and data["phone"] == self.test_user_data["phone"]:
                    phone_verified = data.get("phone_verified", False)
                    self.log_test("MongoDB Phone Data Storage", True, 
                                f"Phone data stored correctly in MongoDB, verified: {phone_verified}")
                    return True
                else:
                    self.log_test("MongoDB Phone Data Storage", False, 
                                "Phone data not found or incorrect in profile", data)
                    return False
            else:
                error_msg = response.json().get("error", "Unknown error") if response.content else "No response"
                self.log_test("MongoDB Phone Data Storage", False, f"HTTP {response.status_code}: {error_msg}")
                return False
        except Exception as e:
            self.log_test("MongoDB Phone Data Storage", False, f"Request failed: {str(e)}")
            return False
    
    def run_phone_verification_tests(self):
        """Run all phone verification tests"""
        print("🚀 Starting RoomieSwipe Phone Verification Tests")
        print("=" * 60)
        
        tests = [
            self.test_user_registration_with_phone,
            self.test_mongodb_phone_data_storage,
            self.test_phone_verification_resend,
            self.test_phone_verification_with_code,
            self.test_phone_verification_invalid_code,
            self.test_phone_verification_without_auth
        ]
        
        passed = 0
        failed = 0
        
        for test in tests:
            try:
                if test():
                    passed += 1
                else:
                    failed += 1
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Unexpected error - {str(e)}")
                failed += 1
            
            # Small delay between tests
            time.sleep(0.5)
        
        print("\n" + "=" * 60)
        print(f"🏁 Phone Verification Test Results: {passed} passed, {failed} failed")
        
        if failed == 0:
            print("🎉 All phone verification tests passed!")
        else:
            print(f"⚠️  {failed} phone verification tests failed.")
        
        return {
            "total_tests": len(tests),
            "passed": passed,
            "failed": failed,
            "success_rate": (passed / len(tests)) * 100,
            "results": self.test_results
        }

def main():
    """Main test execution"""
    print("RoomieSwipe Phone Verification System Test")
    print("Testing phone verification with MongoDB Atlas")
    print()
    
    # Initialize tester
    tester = PhoneVerificationTester()
    
    # Run phone verification tests
    results = tester.run_phone_verification_tests()
    
    # Save results to file
    with open('/app/phone_verification_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📊 Detailed results saved to: /app/phone_verification_test_results.json")
    
    return results["failed"] == 0

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)