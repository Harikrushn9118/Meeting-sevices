#!/bin/bash

# Utility function to print JSON
function print_json {
  python3 -m json.tool <<< "$1"
}

echo "=== 1. Health ==="
HEALTH_RES=$(curl -s http://localhost:3000/health)
print_json "$HEALTH_RES"

echo "=== 2. Register ==="
REG_RES=$(curl -s -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"username":"testuser2","password":"password123"}')
print_json "$REG_RES"

echo "=== 3. Login ==="
LOGIN_RES=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"testuser2","password":"password123"}')
print_json "$LOGIN_RES"

TOKEN=$(echo $LOGIN_RES | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "=== 4. Create Meeting ==="
MEETING_RES=$(curl -s -X POST http://localhost:3000/api/meetings -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{
  "title": "API Test Meeting",
  "participants": ["Alice", "Bob"],
  "meetingDate": "2026-06-01T10:00:00Z",
  "transcript": [
    {"timestamp": "00:00", "speaker": "Alice", "text": "Lets review the API endpoints"},
    {"timestamp": "00:15", "speaker": "Bob", "text": "Agreed, we need to create an action item to test the webhook"}
  ]
}')
print_json "$MEETING_RES"
MEETING_ID=$(echo $MEETING_RES | grep -o '"id":[^,]*' | grep -o '[0-9]*')

echo "=== 5. Analyze Meeting ==="
ANALYZE_RES=$(curl -s -X POST http://localhost:3000/api/meetings/$MEETING_ID/analyze -H "Authorization: Bearer $TOKEN")
print_json "$ANALYZE_RES"

echo "=== 6. Create Action Item ==="
ACTION_RES=$(curl -s -X POST http://localhost:3000/api/action-items -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{
  "task": "Test the webhook",
  "assignee": "Alice",
  "meetingId": '$MEETING_ID',
  "dueDate": "2026-06-05T00:00:00Z"
}')
print_json "$ACTION_RES"
ACTION_ID=$(echo $ACTION_RES | grep -o '"id":[^,]*' | grep -o '[0-9]*')

echo "=== 7. Update Action Item Status ==="
UPDATE_RES=$(curl -s -X PATCH http://localhost:3000/api/action-items/$ACTION_ID/status -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"status":"IN_PROGRESS"}')
print_json "$UPDATE_RES"

echo "=== 8. Get Overdue Action Items ==="
OVERDUE_RES=$(curl -s http://localhost:3000/api/action-items/overdue -H "Authorization: Bearer $TOKEN")
print_json "$OVERDUE_RES"

