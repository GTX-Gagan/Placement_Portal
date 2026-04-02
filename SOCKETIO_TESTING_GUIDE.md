# Socket.io Real-Time Testing Guide

## Quick Start Testing

### Setup (2 Windows)

**Window 1 - Admin:**
```
http://localhost:5000/placement-portal.html
Role: Admin
Email: admin@example.com (or your test account)
```

**Window 2 - Student:**
```
http://localhost:5000/placement-portal.html
Role: Student
Email: student@example.com (or another test account)
```

**Keep both windows visible side-by-side for testing**

---

## Test 1: Application Submission (2 minutes)

### Procedure

1. **Student Window:**
   - Click "Explore Jobs" button
   - Click "Apply" on any job
   - Watch for confirmation message

2. **Admin Window:**
   - Look for toast notification at bottom-right
   - It should say: "📨 New Application: [Student Name] applied for [Job Title]"
   - Watch admin dashboard refresh automatically
   - Application count should increase

### Expected Results ✅

- [ ] Green confirmation toast in Student window
- [ ] Toast notification in Admin window (within 200ms)
- [ ] Admin dashboard updates without refresh button
- [ ] Application appears in "Recent Applications" table

---

## Test 2: Status Update (3 minutes)

### Procedure

1. **Admin Window:**
   - Go to admin dashboard
   - Find the application from Test 1
   - Click "Update Status" → Select "Shortlisted"
   - Enter reason: "Great technical skills"
   - Click "Confirm"

2. **Student Window:**
   - Watch for notification at bottom-right
   - Should say: "⭐ Congratulations! You are shortlisted"
   - Check if application status changed in "My Applications"

### Expected Results ✅

- [ ] Green toast in Admin (status updated)
- [ ] Cyan toast in Student (within 100ms of admin update)
- [ ] Student sees new status without refreshing
- [ ] Admin dashboard shows new status in real-time

---

## Test 3: Bulk Status Update (3 minutes)

### Procedure

1. **Admin Window:**
   - Go to admin dashboard
   - Select 2-3 applications (checkboxes)
   - Click "Bulk Update" button
   - Select "Reviewed" as new status
   - Click "Confirm"

2. **Student Windows:**
   - Open multiple student accounts
   - Each should see notification: "📝 Your application status updated"

### Expected Results ✅

- [ ] All selected applications update simultaneously
- [ ] Each affected student gets notification
- [ ] Admin sees confirmation message
- [ ] Dashboard refreshes showing new status for all

---

## Test 4: Interview Scheduling (Optional)

### Procedure

1. **Admin Window:**
   - Find application with "Shortlisted" status
   - Click "Schedule Interview"
   - Set date: April 15, 2026
   - Set time: 10:00 AM
   - Set type: "Technical Round"
   - Click "Confirm"

2. **Student Window:**
   - Wait for notification
   - Should show: "📅 Interview scheduled for April 15, 2026"

### Expected Results ✅

- [ ] Student notified within 200ms
- [ ] Notification includes date and time
- [ ] Interview details appear in student dashboard

---

## Test 5: Connection Reliability (5 minutes)

### Procedure (Testing Reconnection)

1. Open browser console in Admin window (F12)
2. Type: `socketClient.disconnect()`
3. Wait 5 seconds
4. Type: `socketClient.connect()`
5. Have Student apply for job
6. Check if Admin still receives notification

### Expected Results ✅

- [ ] Socket reconnects after disconnect
- [ ] Console shows: `[Socket] Reconnection attempt 1...`
- [ ] After reconnection, console shows: `[Socket] Connected`
- [ ] Real-time updates work after reconnection
- [ ] No data loss during disconnect/reconnect

---

## Test 6: Multiple Concurrent Users (Platform Test)

### Procedure

1. Open 3+ Admin windows
2. Open 3+ Student windows
3. Have multiple students apply simultaneously
4. Watch all admin windows receive notifications
5. Have admins update status from different windows

### Expected Results ✅

- [ ] All admins see notifications simultaneously
- [ ] No message duplication
- [ ] Dashboard consistent across windows
- [ ] No conflicts when multiple admins update same app

---

## Browser Console Debugging

### Check Socket Connection

```javascript
// In browser console (F12 → Console tab)

// Check if connected
socketClient.isSocketConnected()

// Get socket ID
socketClient.getSocketId()

// View all notifications in memory
systemData.notifications

// Listen to specific event
socketClient.on('application:new', (data) => {
  console.log('NEW APP:', data);
});

// Manually emit event
socketClient.emit('application:submit', {
  studentId: 'test-123',
  jobId: 'job-456',
  timestamp: new Date()
});
```

### Monitor Socket Events

Open browser DevTools, go to Network → WS (WebSocket) tab:
- You should see a connection to `localhost:5000/socket.io`
- Messages appear in real-time as events are emitted
- Each event shows timestamp and data size

---

## Performance Observations

| Action | Expected Time |
|--------|---|
| Student applies | 50-100ms to see toast |
| Admin notified | 100-200ms total |
| Dashboard refreshes | 200-500ms |
| Status update to student | 150-250ms |
| After disconnect/reconnect | 500-2000ms |

---

## Common Issues & Fixes

### No Toast Notifications

**Check:**
1. Browser console for errors (F12)
2. Backend running? `npm run dev` in /backend
3. Is user authenticated? Check localStorage.authToken
4. Socket connected? `socketClient.isSocketConnected()`

**Fix:**
```javascript
// Try reconnecting
socketClient.disconnect();
setTimeout(() => socketClient.connect(), 1000);
```

### Slow Notifications (>2 seconds)

**Check:**
1. Network latency (use DevTools → Network)
2. Server load (check backend logs)
3. Database responsiveness

**Fix:**
- Restart backend: Stop and run `npm run dev` again
- Clear browser cache: Ctrl+Shift+Delete
- Check MongoDB connection: See backend console logs

### Socket Not Connecting

**Check:**
1. CORS enabled in server.js? ✅ Already done
2. Port 5000 available? `netstat -ano | findstr :5000`
3. Firewall blocking Socket.io? Check firewall settings

**Fix:**
```powershell
# Kill process on port 5000
Get-Process | Where {$_.Port -eq 5000} | Stop-Process -Force

# Or use different port
$env:PORT=5001; npm run dev
```

---

## Testing Checklist

### Pre-Test
- [ ] Backend running: `npm run dev`
- [ ] MongoDB connected (check console output)
- [ ] No browser errors (F12 console clean)
- [ ] Two browsers/windows open
- [ ] Both logged in with different roles

### During Test
- [ ] Monitor console for errors
- [ ] Check toast notifications appear immediately
- [ ] Verify no data duplication
- [ ] Confirm dashboard updates without refresh

### Post-Test
- [ ] All tests passed ✅
- [ ] Note any timing delays
- [ ] Check for any console warnings
- [ ] Verify all users logged out properly

---

## Test Data Needed

Make sure you have test data:

**Test Students:**
- `student1@example.com` / password
- `student2@example.com` / password
- At least 3 students with:
  - Name filled
  - Email verified
  - CGPA set (3.0+)
  - At least 2 skills

**Test Jobs:**
- At least 5 active jobs
- Each with:
  - Title
  - Company name
  - Required skills
  - Salary
  - Application deadline (future date)

**Test Admins:**
- `admin@example.com` / password
- Role: "admin"

---

## Success Criteria

Your implementation is working correctly when:

✅ Toast notifications appear within 200ms of action
✅ Admin dashboard updates without manual refresh
✅ Students receive notifications for status changes
✅ Multiple concurrent users don't interfere with each other
✅ Connection recovers after browser disconnect
✅ No console errors or warnings
✅ All data is accurate (no duplicates or missing info)
✅ Notifications persist in-memory (can view via console)

---

## What's Working Right Now

### Real-Time Events Implemented

✅ **Application Submission** - Student applies → Instant admin notification
✅ **Status Updates** - Admin changes status → Instant student notification
✅ **Dashboard Updates** - Live application count and table refresh
✅ **Toast Notifications** - Visual feedback at bottom-right
✅ **Automatic Reconnection** - Recovers from disconnects
✅ **Role-Based Rooms** - Admins only see appropriate data
✅ **User Presence** - Track who's connected and active

### Next Steps (Optional)

🔲 Email notifications for important updates
🔲 Interview scheduling notifications
🔲 Application deadline reminders
🔲 Bulk notification exports
🔲 Notification history dashboard
🔲 User preference management

---

## Questions?

Check these files:
- `/backend/socket/socketHandlers.js` - Event definitions
- `/socketClient.js` - Frontend Socket.io handling
- `/backend/routes/jobRoutes.js` - API integration
- `/placement-portal.html` - UI and notifications
- `SOCKETIO_REALTIME_GUIDE.md` - Full documentation

---

**Last Updated:** March 31, 2026  
**Ready to Test:** YES ✅
