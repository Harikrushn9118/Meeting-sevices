#!/bin/bash

function print_json {
  python3 -m json.tool <<< "$1"
}

RAND=$RANDOM

echo "=== 1. Health ==="
RES1=$(curl -s http://localhost:3000/health)
print_json "$RES1"

echo "=== 2. Evaluation ==="
RES2=$(curl -s http://localhost:3000/api/evaluation)
print_json "$RES2"

echo "=== 3. Register ==="
RES3=$(curl -s -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"username":"testuser_'$RAND'","password":"password123"}')
print_json "$RES3"

echo "=== 4. Login ==="
RES4=$(curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"username":"testuser_'$RAND'","password":"password123"}')
print_json "$RES4"
TOKEN=$(echo $RES4 | grep -o '"token":"[^"]*' | grep -o '[^"]*$')

echo "=== 5. Create Meeting ==="
RES5=$(curl -s -X POST http://localhost:3000/api/meetings -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{
  "title": "Final Test Meeting",
  "participants": ["Dave"],
  "meetingDate": "2026-06-05T10:00:00Z",
  "transcript": [
    {"timestamp": "00:00", "speaker": "Dave", "text": "This is a test transcript."}
  ]
}')
print_json "$RES5"
MEETING_ID=$(echo $RES5 | grep -o '"id":[^,]*' | grep -o '[0-9]*')

echo "=== 6. List Meetings ==="
RES6=$(curl -s http://localhost:3000/api/meetings -H "Authorization: Bearer $TOKEN")
print_json "$RES6"

echo "=== 7. Get Meeting ==="
RES7=$(curl -s http://localhost:3000/api/meetings/$MEETING_ID -H "Authorization: Bearer $TOKEN")
print_json "$RES7"

echo "=== 8. Analyze Meeting ==="
RES8=$(curl -s -X POST http://localhost:3000/api/meetings/$MEETING_ID/analyze -H "Authorization: Bearer $TOKEN")
print_json "$RES8"

echo "=== 9. Get Meeting Analysis ==="
RES9=$(curl -s http://localhost:3000/api/meetings/$MEETING_ID/analysis -H "Authorization: Bearer $TOKEN")
print_json "$RES9"

echo "=== 10. Create Action Item ==="
RES10=$(curl -s -X POST http://localhost:3000/api/action-items -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{
  "task": "Review API endpoints",
  "assignee": "Dave",
  "meetingId": '$MEETING_ID',
  "dueDate": "2026-06-10T00:00:00Z"
}')
print_json "$RES10"
ACTION_ID=$(echo $RES10 | grep -o '"id":[^,]*' | grep -o '[0-9]*')

echo "=== 11. List Action Items ==="
RES11=$(curl -s "http://localhost:3000/api/action-items?assignee=Dave" -H "Authorization: Bearer $TOKEN")
print_json "$RES11"

echo "=== 12. Update Action Item Status ==="
RES12=$(curl -s -X PATCH http://localhost:3000/api/action-items/$ACTION_ID/status -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"status":"COMPLETED"}')
print_json "$RES12"

echo "=== 13. Get Overdue Action Items ==="
RES13=$(curl -s http://localhost:3000/api/action-items/overdue -H "Authorization: Bearer $TOKEN")
print_json "$RES13"

