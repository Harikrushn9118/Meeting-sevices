#!/bin/bash

BASE="http://localhost:3000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "${GREEN}✓ PASS${NC} - $1"; }
fail() { echo -e "${RED}✗ FAIL${NC} - $1"; }
info() { echo -e "${YELLOW}▶ $1${NC}"; }

echo ""
echo "========================================"
echo "   Meeting Intelligence API Test Suite"
echo "========================================"

# ── 1. Health ──────────────────────────────
info "1. GET /health"
RES=$(curl -s $BASE/health)
echo $RES | grep -q "UP" && pass "Health check" || fail "Health check: $RES"

# ── 2. Evaluation ──────────────────────────
info "2. GET /api/evaluation"
RES=$(curl -s $BASE/api/evaluation)
echo $RES | grep -q "candidateName" && pass "Evaluation endpoint" || fail "Evaluation endpoint: $RES"

TEST_USER="testuser_$RANDOM"

# ── 3. Register ────────────────────────────
info "3. POST /api/register"
RES=$(curl -s -X POST $BASE/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"'"$TEST_USER"'","password":"password123"}')
echo $RES | grep -q "success" && pass "Register user" || fail "Register: $RES"

# ── 4. Register duplicate (should fail) ────
info "4. POST /api/register (duplicate - expect error)"
RES=$(curl -s -X POST $BASE/api/register \
  -H "Content-Type: application/json" \
  -d '{"username":"'"$TEST_USER"'","password":"password123"}')
echo $RES | grep -q '"success":false' && pass "Duplicate register blocked" || fail "Duplicate not blocked: $RES"

# ── 5. Login ───────────────────────────────
info "5. POST /api/login"
RES=$(curl -s -X POST $BASE/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"'"$TEST_USER"'","password":"password123"}')
echo $RES | grep -q "token" && pass "Login success" || fail "Login: $RES"
TOKEN=$(echo $RES | sed 's/.*"token":"\([^"]*\)".*/\1/')
echo "   Token: ${TOKEN:0:40}..."

# ── 6. Login wrong password (should fail) ──
info "6. POST /api/login (wrong password - expect 401)"
RES=$(curl -s -X POST $BASE/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"'"$TEST_USER"'","password":"wrongpass"}')
echo $RES | grep -q '"success":false' && pass "Wrong password rejected" || fail "Wrong password not rejected: $RES"

# ── 7. Create Meeting ──────────────────────
info "7. POST /api/meetings"
RES=$(curl -s -X POST $BASE/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Sprint Planning",
    "participants": ["alice@example.com","bob@example.com"],
    "meetingDate": "2026-05-20T10:00:00Z",
    "transcript": [
      {"timestamp":"00:10","speaker":"John","text":"We should launch next Friday."},
      {"timestamp":"00:20","speaker":"Alice","text":"I will prepare release notes."},
      {"timestamp":"00:30","speaker":"Bob","text":"I can handle the deployment checklist."},
      {"timestamp":"00:40","speaker":"John","text":"Agreed. Lets target Friday the 27th."}
    ]
  }')
echo $RES | grep -q '"success":true' && pass "Create meeting" || fail "Create meeting: $RES"
MEETING_ID=$(echo "$RES" | sed 's/.*"id":"\([^"]*\)".*/\1/' | tr -d '[:cntrl:]')
echo "   Meeting ID: $MEETING_ID"

# ── 8. Create Meeting - no auth (should fail)
info "8. POST /api/meetings (no token - expect 401)"
RES=$(curl -s -X POST $BASE/api/meetings \
  -H "Content-Type: application/json" \
  -d '{"title":"Test"}')
echo $RES | grep -q '"success":false' && pass "No token rejected" || fail "No token not rejected: $RES"

# ── 9. List Meetings ───────────────────────
info "9. GET /api/meetings"
RES=$(curl -s "$BASE/api/meetings?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q '"success":true' && pass "List meetings" || fail "List meetings: $RES"

# ── 10. Get Meeting by ID ──────────────────
info "10. GET /api/meetings/$MEETING_ID"
RES=$(curl -s $BASE/api/meetings/$MEETING_ID \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q "Sprint Planning" && pass "Get meeting by ID" || fail "Get meeting: $RES"

# ── 11. Get non-existent meeting ───────────
info "11. GET /api/meetings/99999 (expect 404)"
RES=$(curl -s $BASE/api/meetings/99999 \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q "NOT_FOUND" && pass "Not found returns 404" || fail "404 handling: $RES"

# ── 12. Analyze Meeting (AI) ───────────────
info "12. POST /api/meetings/$MEETING_ID/analyze  (calls Gemini AI - may take a few seconds)"
RES=$(curl -s -X POST $BASE/api/meetings/$MEETING_ID/analyze \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q '"success":true' && pass "AI analysis" || fail "AI analysis: $RES"
echo "   Response preview: ${RES:0:200}..."

# ── 13. Get saved Analysis ─────────────────
info "13. GET /api/meetings/$MEETING_ID/analysis"
RES=$(curl -s $BASE/api/meetings/$MEETING_ID/analysis \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q "summary" && pass "Get analysis" || fail "Get analysis: $RES"

# ── 14. Create Action Item ─────────────────
info "14. POST /api/action-items"
RES=$(curl -s -X POST $BASE/api/action-items \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "task": "Prepare release notes",
    "assignee": "Alice",
    "meetingId": "'"$MEETING_ID"'",
    "dueDate": "2025-01-01T00:00:00Z"
  }')
echo $RES | grep -q '"success":true' && pass "Create action item" || fail "Create action item: $RES"
ITEM_ID=$(echo "$RES" | sed 's/.*"id":"\([^"]*\)".*/\1/' | tr -d '[:cntrl:]')
echo "   Action Item ID: $ITEM_ID"

# ── 15. List Action Items ──────────────────
info "15. GET /api/action-items"
RES=$(curl -s $BASE/api/action-items \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q '"success":true' && pass "List action items" || fail "List action items: $RES"

# ── 16. Filter by status ───────────────────
info "16. GET /api/action-items?status=PENDING"
RES=$(curl -s "$BASE/api/action-items?status=PENDING" \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q '"success":true' && pass "Filter by status" || fail "Filter by status: $RES"

# ── 17. Filter by assignee ─────────────────
info "17. GET /api/action-items?assignee=Alice"
RES=$(curl -s "$BASE/api/action-items?assignee=Alice" \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q '"success":true' && pass "Filter by assignee" || fail "Filter by assignee: $RES"

# ── 18. Filter by meetingId ────────────────
info "18. GET /api/action-items?meetingId=$MEETING_ID"
RES=$(curl -s "$BASE/api/action-items?meetingId=$MEETING_ID" \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q '"success":true' && pass "Filter by meetingId" || fail "Filter by meetingId: $RES"

# ── 19. Update Status → IN_PROGRESS ────────
info "19. PATCH /api/action-items/$ITEM_ID/status (IN_PROGRESS)"
RES=$(curl -s -X PATCH $BASE/api/action-items/$ITEM_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"IN_PROGRESS"}')
echo $RES | grep -q '"success":true' && pass "Update status IN_PROGRESS" || fail "Update status: $RES"

# ── 20. Update Status → COMPLETED ──────────
info "20. PATCH /api/action-items/$ITEM_ID/status (COMPLETED)"
RES=$(curl -s -X PATCH $BASE/api/action-items/$ITEM_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"COMPLETED"}')
echo $RES | grep -q '"success":true' && pass "Update status COMPLETED" || fail "Update status: $RES"

# ── 21. Invalid status (should fail) ───────
info "21. PATCH status with invalid value (expect 400)"
RES=$(curl -s -X PATCH $BASE/api/action-items/$ITEM_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"status":"INVALID_STATUS"}')
echo $RES | grep -q '"success":false' && pass "Invalid status rejected" || fail "Invalid status not rejected: $RES"

# ── 22. Get Overdue Items ──────────────────
info "22. GET /api/action-items/overdue"
RES=$(curl -s $BASE/api/action-items/overdue \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q '"success":true' && pass "Get overdue items" || fail "Get overdue: $RES"
COUNT=$(echo $RES | grep -o '"count":[0-9]*' | grep -o '[0-9]*')
echo "   Overdue count: $COUNT"

# ── 23. Validation - missing title ─────────
info "23. POST /api/meetings missing title (expect 400)"
RES=$(curl -s -X POST $BASE/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"participants":["a@b.com"],"meetingDate":"2026-01-01T00:00:00Z","transcript":[]}')
echo $RES | grep -q "VALIDATION_ERROR" && pass "Missing title validation" || fail "Missing title not caught: $RES"

# ── 24. Validation - bad date ──────────────
info "24. POST /api/meetings bad meetingDate (expect 400)"
RES=$(curl -s -X POST $BASE/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title":"Test","participants":["a"],"meetingDate":"not-a-date","transcript":[{"timestamp":"00:00","speaker":"A","text":"hi"}]}')
echo $RES | grep -q "VALIDATION_ERROR" && pass "Bad date validation" || fail "Bad date not caught: $RES"

# ── 25. TraceId in response ─────────────────
info "25. Checking traceId present in responses"
RES=$(curl -s $BASE/health)
# traceId not required on /health per spec, check on API endpoint
RES=$(curl -s $BASE/api/action-items/overdue \
  -H "Authorization: Bearer $TOKEN")
echo $RES | grep -q "traceId" && pass "traceId present in response" || fail "traceId missing: $RES"

echo ""
echo "========================================"
echo "           All tests complete"
echo "========================================"
