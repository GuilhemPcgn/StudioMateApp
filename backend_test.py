#!/usr/bin/env python3
"""
StudioMate Backend API Testing Suite
Tests all backend APIs comprehensively for the SaaS recording studio application.
"""

import requests
import json
import time
import uuid
from datetime import datetime, timedelta

# Configuration
BASE_URL = "https://4241007d-c4b5-4561-b535-0ad4d454dd48.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

# Test data storage
test_data = {
    "project_id": None,
    "session_id": None,
    "audio_file_id": None,
    "comment_id": None,
    "message_id": None,
    "invoice_id": None
}

def log_test(test_name, success, details=""):
    """Log test results with timestamp"""
    status = "✅ PASS" if success else "❌ FAIL"
    timestamp = datetime.now().strftime("%H:%M:%S")
    print(f"[{timestamp}] {status} {test_name}")
    if details:
        print(f"    Details: {details}")
    if not success:
        print(f"    ⚠️  Critical failure in {test_name}")

def test_mongodb_connection():
    """Test MongoDB connection and database setup"""
    print("\n🔍 Testing MongoDB Connection and Database Setup...")
    
    try:
        # Test basic connectivity by trying to fetch projects (should return empty array initially)
        response = requests.get(f"{BASE_URL}/projects", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list):
                log_test("MongoDB Connection", True, "Database connected and responding")
                return True
            else:
                log_test("MongoDB Connection", False, f"Unexpected response format: {data}")
                return False
        else:
            log_test("MongoDB Connection", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except requests.exceptions.RequestException as e:
        log_test("MongoDB Connection", False, f"Connection error: {str(e)}")
        return False
    except Exception as e:
        log_test("MongoDB Connection", False, f"Unexpected error: {str(e)}")
        return False

def test_projects_crud():
    """Test Projects CRUD operations"""
    print("\n🔍 Testing Projects CRUD API...")
    
    # Test CREATE project
    try:
        project_data = {
            "name": "Epic Album Recording",
            "description": "Recording sessions for the new album with multiple artists",
            "client": "Harmony Records",
            "status": "active",
            "budget": 15000,
            "deadline": "2024-06-30"
        }
        
        response = requests.post(f"{BASE_URL}/projects", json=project_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data", {}).get("id"):
                test_data["project_id"] = data["data"]["id"]
                log_test("Create Project", True, f"Project created with ID: {test_data['project_id']}")
            else:
                log_test("Create Project", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Project", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Project", False, f"Error: {str(e)}")
        return False
    
    # Test READ projects (list)
    try:
        response = requests.get(f"{BASE_URL}/projects", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list) and len(data["data"]) > 0:
                log_test("List Projects", True, f"Found {len(data['data'])} projects")
            else:
                log_test("List Projects", False, f"No projects found or invalid format: {data}")
                return False
        else:
            log_test("List Projects", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Projects", False, f"Error: {str(e)}")
        return False
    
    # Test READ single project
    if test_data["project_id"]:
        try:
            response = requests.get(f"{BASE_URL}/projects/{test_data['project_id']}", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("data", {}).get("id") == test_data["project_id"]:
                    log_test("Get Single Project", True, f"Retrieved project: {data['data']['name']}")
                else:
                    log_test("Get Single Project", False, f"Invalid response: {data}")
                    return False
            else:
                log_test("Get Single Project", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            log_test("Get Single Project", False, f"Error: {str(e)}")
            return False
    
    # Test UPDATE project
    if test_data["project_id"]:
        try:
            update_data = {
                "name": "Epic Album Recording - Updated",
                "status": "in_progress",
                "budget": 18000
            }
            
            response = requests.put(f"{BASE_URL}/projects/{test_data['project_id']}", json=update_data, headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    log_test("Update Project", True, "Project updated successfully")
                else:
                    log_test("Update Project", False, f"Update failed: {data}")
                    return False
            else:
                log_test("Update Project", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            log_test("Update Project", False, f"Error: {str(e)}")
            return False
    
    return True

def test_sessions_management():
    """Test Sessions Management API"""
    print("\n🔍 Testing Sessions Management API...")
    
    # Test CREATE session
    try:
        session_data = {
            "title": "Vocal Recording Session",
            "projectId": test_data.get("project_id"),
            "date": "2024-03-15",
            "startTime": "14:00",
            "endTime": "18:00",
            "studio": "Studio A",
            "engineer": "Alex Johnson",
            "artist": "Sarah Williams",
            "notes": "Recording lead vocals for track 3 and 7",
            "status": "scheduled"
        }
        
        response = requests.post(f"{BASE_URL}/sessions", json=session_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data", {}).get("id"):
                test_data["session_id"] = data["data"]["id"]
                log_test("Create Session", True, f"Session created with ID: {test_data['session_id']}")
            else:
                log_test("Create Session", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Session", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Session", False, f"Error: {str(e)}")
        return False
    
    # Test READ sessions
    try:
        response = requests.get(f"{BASE_URL}/sessions", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list):
                log_test("List Sessions", True, f"Found {len(data['data'])} sessions")
            else:
                log_test("List Sessions", False, f"Invalid response: {data}")
                return False
        else:
            log_test("List Sessions", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Sessions", False, f"Error: {str(e)}")
        return False
    
    # Test UPDATE session
    if test_data["session_id"]:
        try:
            update_data = {
                "status": "completed",
                "notes": "Session completed successfully. Great vocal takes recorded."
            }
            
            response = requests.put(f"{BASE_URL}/sessions/{test_data['session_id']}", json=update_data, headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    log_test("Update Session", True, "Session updated successfully")
                else:
                    log_test("Update Session", False, f"Update failed: {data}")
                    return False
            else:
                log_test("Update Session", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            log_test("Update Session", False, f"Error: {str(e)}")
            return False
    
    return True

def test_audio_files_upload():
    """Test Audio Files Upload and Management API"""
    print("\n🔍 Testing Audio Files Upload and Management API...")
    
    # Test chunked file upload simulation
    try:
        file_name = "vocal_track_lead.wav"
        total_chunks = 3
        project_id = test_data.get("project_id")
        
        # Simulate uploading chunks
        for chunk_index in range(total_chunks):
            chunk_data = {
                "fileName": file_name,
                "chunk": f"fake_chunk_data_{chunk_index}",
                "totalChunks": total_chunks,
                "chunkIndex": chunk_index,
                "projectId": project_id
            }
            
            response = requests.post(f"{BASE_URL}/upload", json=chunk_data, headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    if chunk_index == total_chunks - 1:  # Last chunk
                        if data.get("completed") and data.get("data", {}).get("id"):
                            test_data["audio_file_id"] = data["data"]["id"]
                            log_test("Chunked File Upload", True, f"File uploaded successfully: {test_data['audio_file_id']}")
                        else:
                            log_test("Chunked File Upload", False, f"Upload not completed properly: {data}")
                            return False
                    else:
                        progress = data.get("progress", 0)
                        print(f"    Chunk {chunk_index + 1}/{total_chunks} uploaded ({progress:.1f}%)")
                else:
                    log_test("Chunked File Upload", False, f"Chunk {chunk_index} failed: {data}")
                    return False
            else:
                log_test("Chunked File Upload", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
    except Exception as e:
        log_test("Chunked File Upload", False, f"Error: {str(e)}")
        return False
    
    # Test direct audio file creation
    try:
        audio_file_data = {
            "name": "background_vocals.wav",
            "projectId": test_data.get("project_id"),
            "size": 25600000,
            "uploadedBy": "Producer Mike",
            "version": "v2",
            "type": "overdub"
        }
        
        response = requests.post(f"{BASE_URL}/audio-files", json=audio_file_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data", {}).get("id"):
                log_test("Create Audio File", True, f"Audio file created: {data['data']['name']}")
            else:
                log_test("Create Audio File", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Audio File", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Audio File", False, f"Error: {str(e)}")
        return False
    
    # Test READ audio files
    try:
        # Test with project filter
        response = requests.get(f"{BASE_URL}/audio-files?projectId={test_data.get('project_id')}", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list):
                log_test("List Audio Files", True, f"Found {len(data['data'])} audio files for project")
            else:
                log_test("List Audio Files", False, f"Invalid response: {data}")
                return False
        else:
            log_test("List Audio Files", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Audio Files", False, f"Error: {str(e)}")
        return False
    
    return True

def test_comments_system():
    """Test Comments and Timestamped Feedback API"""
    print("\n🔍 Testing Comments and Timestamped Feedback API...")
    
    # Test CREATE comment
    try:
        comment_data = {
            "projectId": test_data.get("project_id"),
            "fileId": test_data.get("audio_file_id"),
            "timestamp": 45.5,
            "text": "The vocal harmony at this point needs to be adjusted. Consider lowering the pitch slightly.",
            "author": "Producer Mike",
            "type": "feedback"
        }
        
        response = requests.post(f"{BASE_URL}/comments", json=comment_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data", {}).get("id"):
                test_data["comment_id"] = data["data"]["id"]
                log_test("Create Comment", True, f"Comment created at timestamp {comment_data['timestamp']}s")
            else:
                log_test("Create Comment", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Comment", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Comment", False, f"Error: {str(e)}")
        return False
    
    # Test CREATE another comment
    try:
        comment_data2 = {
            "projectId": test_data.get("project_id"),
            "fileId": test_data.get("audio_file_id"),
            "timestamp": 120.8,
            "text": "Great take! This section sounds perfect.",
            "author": "Artist Sarah",
            "type": "approval"
        }
        
        response = requests.post(f"{BASE_URL}/comments", json=comment_data2, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Create Second Comment", True, f"Second comment created at {comment_data2['timestamp']}s")
            else:
                log_test("Create Second Comment", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Second Comment", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Second Comment", False, f"Error: {str(e)}")
        return False
    
    # Test READ comments by project
    try:
        response = requests.get(f"{BASE_URL}/comments?projectId={test_data.get('project_id')}", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list):
                log_test("List Comments by Project", True, f"Found {len(data['data'])} comments for project")
            else:
                log_test("List Comments by Project", False, f"Invalid response: {data}")
                return False
        else:
            log_test("List Comments by Project", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Comments by Project", False, f"Error: {str(e)}")
        return False
    
    # Test READ comments by file
    try:
        response = requests.get(f"{BASE_URL}/comments?fileId={test_data.get('audio_file_id')}", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list):
                log_test("List Comments by File", True, f"Found {len(data['data'])} comments for audio file")
            else:
                log_test("List Comments by File", False, f"Invalid response: {data}")
                return False
        else:
            log_test("List Comments by File", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Comments by File", False, f"Error: {str(e)}")
        return False
    
    return True

def test_project_chat():
    """Test Project Chat and Messages API"""
    print("\n🔍 Testing Project Chat and Messages API...")
    
    # Test CREATE message
    try:
        message_data = {
            "projectId": test_data.get("project_id"),
            "text": "Hey team! The vocal recordings are sounding amazing. Ready to move on to the guitar overdubs?",
            "sender": "Producer Mike",
            "type": "text"
        }
        
        response = requests.post(f"{BASE_URL}/messages", json=message_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data", {}).get("id"):
                test_data["message_id"] = data["data"]["id"]
                log_test("Create Message", True, f"Message created: {message_data['text'][:50]}...")
            else:
                log_test("Create Message", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Message", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Message", False, f"Error: {str(e)}")
        return False
    
    # Test CREATE reply message
    try:
        reply_data = {
            "projectId": test_data.get("project_id"),
            "text": "Absolutely! I'm ready when you are. The guitar setup is already prepared.",
            "sender": "Engineer Alex",
            "type": "text"
        }
        
        response = requests.post(f"{BASE_URL}/messages", json=reply_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Create Reply Message", True, "Reply message sent successfully")
            else:
                log_test("Create Reply Message", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Reply Message", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Reply Message", False, f"Error: {str(e)}")
        return False
    
    # Test READ messages
    try:
        response = requests.get(f"{BASE_URL}/messages?projectId={test_data.get('project_id')}", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list):
                log_test("List Messages", True, f"Found {len(data['data'])} messages in project chat")
            else:
                log_test("List Messages", False, f"Invalid response: {data}")
                return False
        else:
            log_test("List Messages", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Messages", False, f"Error: {str(e)}")
        return False
    
    return True

def test_billing_invoices():
    """Test Billing and Invoices API"""
    print("\n🔍 Testing Billing and Invoices API...")
    
    # Test CREATE invoice
    try:
        invoice_data = {
            "projectId": test_data.get("project_id"),
            "clientName": "Harmony Records",
            "clientEmail": "billing@harmonyrecords.com",
            "amount": 2500.00,
            "description": "Recording session fees for Epic Album project",
            "dueDate": "2024-04-15",
            "items": [
                {"description": "Studio time (4 hours)", "quantity": 4, "rate": 150, "amount": 600},
                {"description": "Engineer services", "quantity": 1, "rate": 800, "amount": 800},
                {"description": "Equipment rental", "quantity": 1, "rate": 300, "amount": 300},
                {"description": "Mixing services", "quantity": 1, "rate": 800, "amount": 800}
            ]
        }
        
        response = requests.post(f"{BASE_URL}/invoices", json=invoice_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data", {}).get("id"):
                test_data["invoice_id"] = data["data"]["id"]
                log_test("Create Invoice", True, f"Invoice created for ${invoice_data['amount']}")
            else:
                log_test("Create Invoice", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Create Invoice", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Create Invoice", False, f"Error: {str(e)}")
        return False
    
    # Test READ invoices
    try:
        response = requests.get(f"{BASE_URL}/invoices", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and isinstance(data.get("data"), list):
                log_test("List Invoices", True, f"Found {len(data['data'])} invoices")
            else:
                log_test("List Invoices", False, f"Invalid response: {data}")
                return False
        else:
            log_test("List Invoices", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("List Invoices", False, f"Error: {str(e)}")
        return False
    
    return True

def test_stripe_payment():
    """Test Stripe Payment Integration (Fake)"""
    print("\n🔍 Testing Stripe Payment Integration...")
    
    # Test CREATE payment intent
    try:
        payment_data = {
            "amount": 250000,  # $2500.00 in cents
            "currency": "usd"
        }
        
        response = requests.post(f"{BASE_URL}/stripe/create-payment-intent", json=payment_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data", {}).get("id"):
                payment_intent_id = data["data"]["id"]
                log_test("Stripe Create Payment Intent", True, f"Payment intent created: {payment_intent_id}")
            else:
                log_test("Stripe Create Payment Intent", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Stripe Create Payment Intent", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Stripe Create Payment Intent", False, f"Error: {str(e)}")
        return False
    
    # Test CONFIRM payment
    try:
        confirm_data = {
            "paymentIntentId": payment_intent_id
        }
        
        response = requests.post(f"{BASE_URL}/stripe/confirm-payment", json=confirm_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Stripe Confirm Payment", True, "Payment confirmed successfully")
            else:
                log_test("Stripe Confirm Payment", False, f"Payment confirmation failed: {data}")
                return False
        else:
            log_test("Stripe Confirm Payment", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Stripe Confirm Payment", False, f"Error: {str(e)}")
        return False
    
    return True

def test_paypal_payment():
    """Test PayPal Payment Integration (Fake)"""
    print("\n🔍 Testing PayPal Payment Integration...")
    
    # Test CREATE PayPal order
    try:
        order_data = {
            "amount": 2500.00,
            "invoiceId": test_data.get("invoice_id")
        }
        
        response = requests.post(f"{BASE_URL}/paypal/create-order", json=order_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("orderId"):
                order_id = data["orderId"]
                log_test("PayPal Create Order", True, f"PayPal order created: {order_id}")
            else:
                log_test("PayPal Create Order", False, f"Invalid response: {data}")
                return False
        else:
            log_test("PayPal Create Order", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("PayPal Create Order", False, f"Error: {str(e)}")
        return False
    
    # Test CAPTURE PayPal order
    try:
        capture_data = {
            "orderId": order_id,
            "invoiceId": test_data.get("invoice_id")
        }
        
        response = requests.post(f"{BASE_URL}/paypal/capture-order", json=capture_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("PayPal Capture Order", True, "PayPal payment captured successfully")
            else:
                log_test("PayPal Capture Order", False, f"Payment capture failed: {data}")
                return False
        else:
            log_test("PayPal Capture Order", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("PayPal Capture Order", False, f"Error: {str(e)}")
        return False
    
    return True

def test_email_notifications():
    """Test Email Notifications (SendGrid Fake)"""
    print("\n🔍 Testing Email Notifications...")
    
    # Test send email notification
    try:
        email_data = {
            "to": "client@harmonyrecords.com",
            "subject": "Recording Session Confirmation",
            "type": "session_confirmation",
            "data": {
                "sessionTitle": "Vocal Recording Session",
                "date": "2024-03-15",
                "time": "14:00-18:00",
                "studio": "Studio A"
            }
        }
        
        response = requests.post(f"{BASE_URL}/send-email", json=email_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Send Email Notification", True, f"Email sent to {email_data['to']}")
            else:
                log_test("Send Email Notification", False, f"Email sending failed: {data}")
                return False
        else:
            log_test("Send Email Notification", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Send Email Notification", False, f"Error: {str(e)}")
        return False
    
    # Test send invoice email
    try:
        invoice_email_data = {
            "to": "billing@harmonyrecords.com",
            "subject": "Invoice #INV-001 - Recording Services",
            "type": "invoice",
            "data": {
                "invoiceId": test_data.get("invoice_id"),
                "amount": 2500.00,
                "dueDate": "2024-04-15"
            }
        }
        
        response = requests.post(f"{BASE_URL}/send-email", json=invoice_email_data, headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success"):
                log_test("Send Invoice Email", True, "Invoice email sent successfully")
            else:
                log_test("Send Invoice Email", False, f"Invoice email failed: {data}")
                return False
        else:
            log_test("Send Invoice Email", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Send Invoice Email", False, f"Error: {str(e)}")
        return False
    
    return True

def test_dashboard_stats():
    """Test Dashboard Statistics API"""
    print("\n🔍 Testing Dashboard Statistics...")
    
    try:
        response = requests.get(f"{BASE_URL}/dashboard-stats", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("success") and data.get("data"):
                stats = data["data"]
                required_fields = ["activeProjects", "weekSessions", "monthRevenue", "filesProcessed"]
                
                if all(field in stats for field in required_fields):
                    log_test("Dashboard Statistics", True, f"Stats: {stats['activeProjects']} projects, ${stats['monthRevenue']} revenue")
                else:
                    log_test("Dashboard Statistics", False, f"Missing required fields in stats: {stats}")
                    return False
            else:
                log_test("Dashboard Statistics", False, f"Invalid response: {data}")
                return False
        else:
            log_test("Dashboard Statistics", False, f"HTTP {response.status_code}: {response.text}")
            return False
            
    except Exception as e:
        log_test("Dashboard Statistics", False, f"Error: {str(e)}")
        return False
    
    return True

def test_delete_operations():
    """Test DELETE operations for cleanup"""
    print("\n🔍 Testing DELETE Operations...")
    
    # Test DELETE audio file
    if test_data.get("audio_file_id"):
        try:
            response = requests.delete(f"{BASE_URL}/audio-files/{test_data['audio_file_id']}", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    log_test("Delete Audio File", True, "Audio file deleted successfully")
                else:
                    log_test("Delete Audio File", False, f"Delete failed: {data}")
            else:
                log_test("Delete Audio File", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            log_test("Delete Audio File", False, f"Error: {str(e)}")
    
    # Test DELETE session
    if test_data.get("session_id"):
        try:
            response = requests.delete(f"{BASE_URL}/sessions/{test_data['session_id']}", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    log_test("Delete Session", True, "Session deleted successfully")
                else:
                    log_test("Delete Session", False, f"Delete failed: {data}")
            else:
                log_test("Delete Session", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            log_test("Delete Session", False, f"Error: {str(e)}")
    
    # Test DELETE project (should cascade delete related data)
    if test_data.get("project_id"):
        try:
            response = requests.delete(f"{BASE_URL}/projects/{test_data['project_id']}", headers=HEADERS, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    log_test("Delete Project (Cascade)", True, "Project and related data deleted successfully")
                    return True
                else:
                    log_test("Delete Project (Cascade)", False, f"Delete failed: {data}")
                    return False
            else:
                log_test("Delete Project (Cascade)", False, f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            log_test("Delete Project (Cascade)", False, f"Error: {str(e)}")
            return False
    
    return True

def run_comprehensive_tests():
    """Run all backend tests in priority order"""
    print("🚀 Starting StudioMate Backend API Comprehensive Testing")
    print("=" * 70)
    
    test_results = {}
    
    # High Priority Tests
    print("\n📋 HIGH PRIORITY TESTS")
    print("-" * 30)
    
    test_results["mongodb_connection"] = test_mongodb_connection()
    test_results["projects_crud"] = test_projects_crud()
    test_results["sessions_management"] = test_sessions_management()
    test_results["audio_files_upload"] = test_audio_files_upload()
    test_results["comments_system"] = test_comments_system()
    
    # Medium Priority Tests
    print("\n📋 MEDIUM PRIORITY TESTS")
    print("-" * 30)
    
    test_results["project_chat"] = test_project_chat()
    test_results["billing_invoices"] = test_billing_invoices()
    test_results["stripe_payment"] = test_stripe_payment()
    test_results["paypal_payment"] = test_paypal_payment()
    
    # Low Priority Tests
    print("\n📋 LOW PRIORITY TESTS")
    print("-" * 30)
    
    test_results["email_notifications"] = test_email_notifications()
    test_results["dashboard_stats"] = test_dashboard_stats()
    
    # Cleanup Tests
    print("\n📋 CLEANUP TESTS")
    print("-" * 30)
    
    test_results["delete_operations"] = test_delete_operations()
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for result in test_results.values() if result)
    total = len(test_results)
    
    print(f"\n✅ PASSED: {passed}/{total} tests")
    print(f"❌ FAILED: {total - passed}/{total} tests")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! StudioMate backend is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
        print("\nFailed tests:")
        for test_name, result in test_results.items():
            if not result:
                print(f"  ❌ {test_name}")
    
    print(f"\n📝 Test Data Created:")
    for key, value in test_data.items():
        if value:
            print(f"  {key}: {value}")
    
    return test_results

if __name__ == "__main__":
    run_comprehensive_tests()