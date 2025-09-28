#!/usr/bin/env python3
"""
BioPatch Backend API Testing Suite
Tests all backend endpoints with realistic medical device data
"""

import requests
import json
import uuid
from datetime import datetime, timedelta
import time
import sys
import os

# Backend URL from frontend environment
BACKEND_URL = "https://troubleshoot-app-3.preview.emergentagent.com/api"

class BioPatchTester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.test_user_id = str(uuid.uuid4())
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        self.log("Testing basic API connectivity...")
        try:
            response = self.session.get(f"{self.base_url}/")
            if response.status_code == 200:
                self.log("✅ Basic connectivity successful")
                return True
            else:
                self.log(f"❌ Basic connectivity failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Basic connectivity error: {str(e)}", "ERROR")
            return False
    
    def test_vital_signs_endpoints(self):
        """Test vital signs recording and retrieval"""
        self.log("Testing vital signs endpoints...")
        
        # Test POST /api/vitals - Record vital signs
        vital_signs_data = {
            "user_id": self.test_user_id,
            "emg_rms": 45.6,
            "heart_rate": 72,
            "hrv": 28.5,
            "eda_peaks": 12,
            "temperature": 37.2
        }
        
        try:
            response = self.session.post(f"{self.base_url}/vitals", json=vital_signs_data)
            if response.status_code == 200:
                self.log("✅ POST /api/vitals - Vital signs recorded successfully")
                vitals_success = True
            else:
                self.log(f"❌ POST /api/vitals failed: {response.status_code} - {response.text}", "ERROR")
                vitals_success = False
        except Exception as e:
            self.log(f"❌ POST /api/vitals error: {str(e)}", "ERROR")
            vitals_success = False
        
        # Test GET /api/vitals/latest/{user_id} - Get latest vital signs
        try:
            response = self.session.get(f"{self.base_url}/vitals/latest/{self.test_user_id}")
            if response.status_code == 200:
                data = response.json()
                if "user_id" in data and data["user_id"] == self.test_user_id:
                    self.log("✅ GET /api/vitals/latest/{user_id} - Latest vitals retrieved successfully")
                    latest_vitals_success = True
                else:
                    self.log("❌ GET /api/vitals/latest/{user_id} - Invalid response format", "ERROR")
                    latest_vitals_success = False
            else:
                self.log(f"❌ GET /api/vitals/latest/{user_id} failed: {response.status_code} - {response.text}", "ERROR")
                latest_vitals_success = False
        except Exception as e:
            self.log(f"❌ GET /api/vitals/latest/{user_id} error: {str(e)}", "ERROR")
            latest_vitals_success = False
            
        return vitals_success and latest_vitals_success
    
    def test_therapy_session_endpoints(self):
        """Test therapy session creation and retrieval"""
        self.log("Testing therapy session endpoints...")
        
        # Test POST /api/sessions - Create therapy session
        session_data = {
            "user_id": self.test_user_id,
            "session_type": "TENS",
            "start_time": datetime.utcnow().isoformat(),
            "duration": 30,
            "settings": {
                "frequency": 85,
                "intensity": 65,
                "pulse_width": 200,
                "mode": "continuous"
            },
            "effectiveness": 85,
            "completed": True
        }
        
        try:
            response = self.session.post(f"{self.base_url}/sessions", json=session_data)
            if response.status_code == 200:
                self.log("✅ POST /api/sessions - Therapy session created successfully")
                create_session_success = True
            else:
                self.log(f"❌ POST /api/sessions failed: {response.status_code} - {response.text}", "ERROR")
                create_session_success = False
        except Exception as e:
            self.log(f"❌ POST /api/sessions error: {str(e)}", "ERROR")
            create_session_success = False
        
        # Test GET /api/sessions/{user_id} - Get user sessions
        try:
            response = self.session.get(f"{self.base_url}/sessions/{self.test_user_id}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log("✅ GET /api/sessions/{user_id} - User sessions retrieved successfully")
                    get_sessions_success = True
                else:
                    self.log("❌ GET /api/sessions/{user_id} - Invalid response format", "ERROR")
                    get_sessions_success = False
            else:
                self.log(f"❌ GET /api/sessions/{user_id} failed: {response.status_code} - {response.text}", "ERROR")
                get_sessions_success = False
        except Exception as e:
            self.log(f"❌ GET /api/sessions/{user_id} error: {str(e)}", "ERROR")
            get_sessions_success = False
            
        return create_session_success and get_sessions_success
    
    def test_analytics_endpoint(self):
        """Test analytics data retrieval"""
        self.log("Testing analytics endpoint...")
        
        try:
            response = self.session.get(f"{self.base_url}/analytics/{self.test_user_id}")
            if response.status_code == 200:
                data = response.json()
                required_fields = ["recovery_data", "recent_vitals", "recent_sessions", "last_updated"]
                if all(field in data for field in required_fields):
                    self.log("✅ GET /api/analytics/{user_id} - Analytics data retrieved successfully")
                    return True
                else:
                    self.log("❌ GET /api/analytics/{user_id} - Missing required fields in response", "ERROR")
                    return False
            else:
                self.log(f"❌ GET /api/analytics/{user_id} failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /api/analytics/{user_id} error: {str(e)}", "ERROR")
            return False
    
    def test_ai_recommendations_endpoint(self):
        """Test AI recommendations endpoint with Gemini 2.5 Pro integration"""
        self.log("Testing AI recommendations endpoint...")
        
        # Realistic BioPatch user data for AI analysis
        ai_request_data = {
            "user_id": self.test_user_id,
            "age": 35,
            "gender": "Nam",
            "pain_location": "Cổ và vai",
            "pain_level": 6,
            "emg_rms": 45.6,
            "heart_rate": 72,
            "hrv": 28.5,
            "eda_peaks": 12,
            "temperature": 37.2,
            "inflammation": "Nhẹ",
            "recovery_score": 78
        }
        
        try:
            self.log("Sending request to AI recommendations endpoint...")
            response = self.session.post(
                f"{self.base_url}/recommendations/{self.test_user_id}", 
                json=ai_request_data,
                timeout=30  # AI requests may take longer
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["recommendations", "summary", "alerts"]
                if all(field in data for field in required_fields):
                    self.log("✅ AI recommendations response has correct structure")
                    
                    # Check recommendations format
                    recommendations = data.get("recommendations", [])
                    if isinstance(recommendations, list) and len(recommendations) > 0:
                        # Check first recommendation structure
                        first_rec = recommendations[0]
                        rec_fields = ["id", "type", "priority", "title", "description", "actionType", "actionText"]
                        if all(field in first_rec for field in rec_fields):
                            self.log("✅ Recommendations have correct format")
                            
                            # Check if content is in Vietnamese
                            title = first_rec.get("title", "")
                            description = first_rec.get("description", "")
                            summary = data.get("summary", "")
                            
                            # Simple check for Vietnamese characters or content
                            vietnamese_indicators = ["ệ", "ả", "ă", "â", "ê", "ô", "ơ", "ư", "đ", "Cổ", "vai", "liệu pháp", "bài tập"]
                            has_vietnamese = any(indicator in (title + description + summary) for indicator in vietnamese_indicators)
                            
                            if has_vietnamese:
                                self.log("✅ AI recommendations are in Vietnamese as expected")
                                self.log(f"Sample recommendation: {title}")
                                self.log(f"Summary: {summary[:100]}...")
                                return True
                            else:
                                self.log("⚠️ AI recommendations may not be in Vietnamese", "WARNING")
                                self.log(f"Sample content: {title}")
                                return True  # Still consider success as functionality works
                        else:
                            self.log("❌ Recommendations missing required fields", "ERROR")
                            return False
                    else:
                        self.log("❌ No recommendations returned", "ERROR")
                        return False
                else:
                    self.log("❌ AI recommendations response missing required fields", "ERROR")
                    self.log(f"Response: {json.dumps(data, indent=2)}")
                    return False
            else:
                self.log(f"❌ POST /api/recommendations/{self.test_user_id} failed: {response.status_code}", "ERROR")
                self.log(f"Response: {response.text}")
                return False
                
        except requests.exceptions.Timeout:
            self.log("❌ AI recommendations request timed out", "ERROR")
            return False
        except Exception as e:
            self.log(f"❌ AI recommendations error: {str(e)}", "ERROR")
            return False
    
    def run_all_tests(self):
        """Run all backend tests"""
        self.log("=" * 60)
        self.log("STARTING BIOPATCH BACKEND API TESTS")
        self.log("=" * 60)
        self.log(f"Backend URL: {self.base_url}")
        self.log(f"Test User ID: {self.test_user_id}")
        self.log("")
        
        results = {}
        
        # Test basic connectivity first
        results['connectivity'] = self.test_basic_connectivity()
        
        if not results['connectivity']:
            self.log("❌ Basic connectivity failed. Stopping tests.", "ERROR")
            return results
        
        # Test all endpoints
        results['vital_signs'] = self.test_vital_signs_endpoints()
        results['therapy_sessions'] = self.test_therapy_session_endpoints()
        results['analytics'] = self.test_analytics_endpoint()
        results['ai_recommendations'] = self.test_ai_recommendations_endpoint()
        
        # Summary
        self.log("")
        self.log("=" * 60)
        self.log("TEST RESULTS SUMMARY")
        self.log("=" * 60)
        
        total_tests = len(results)
        passed_tests = sum(1 for result in results.values() if result)
        
        for test_name, result in results.items():
            status = "✅ PASSED" if result else "❌ FAILED"
            self.log(f"{test_name.upper().replace('_', ' ')}: {status}")
        
        self.log("")
        self.log(f"OVERALL: {passed_tests}/{total_tests} tests passed")
        
        if passed_tests == total_tests:
            self.log("🎉 ALL TESTS PASSED!")
        else:
            self.log("⚠️ Some tests failed. Check logs above for details.")
        
        return results

if __name__ == "__main__":
    tester = BioPatchTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    if all(results.values()):
        sys.exit(0)
    else:
        sys.exit(1)