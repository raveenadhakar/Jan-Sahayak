# 🔄 Real-Time Complaint Sync Test Guide

## ✅ How to Test the Sync Between Main App and Admin Dashboard

### **Step 1: Open Both Applications**
1. **Main App**: Open your main application (localhost:5173 or your dev server)
2. **Admin Dashboard**: Open `admin.html` in a new tab/window
3. **Login to Admin**: Use credentials `admin` / `admin123`

### **Step 2: Test New Complaint Registration**

**In Main App:**
1. Login as a user
2. Go to "शिकायतें" (Complaints) tab
3. Click "नई शिकायत" (New Complaint)
4. Fill out the form:
   - Title: "Test Sync Complaint"
   - Description: "Testing real-time sync between app and admin"
   - Category: Any category
   - Priority: Any priority
5. Submit the complaint

**Expected Result:**
- ✅ New complaint should appear in Admin Dashboard **immediately**
- ✅ Complaint should have a unique ID (like CMP1234567890ABC)
- ✅ Status should be "submitted"

### **Step 3: Test Status Updates from Admin**

**In Admin Dashboard:**
1. Find the complaint you just created
2. Click the 💬 (message) icon to update status
3. Change status to "under_review"
4. Add a note: "Admin is reviewing this complaint"
5. Click "अपडेट करें" (Update)

**Expected Result:**
- ✅ Status should update in Admin Dashboard immediately
- ✅ Go back to Main App → Complaints tab
- ✅ The same complaint should now show "under_review" status
- ✅ Status history should include the admin's note

### **Step 4: Test Multiple Status Updates**

**Continue in Admin Dashboard:**
1. Update the same complaint to "in_progress"
2. Add note: "Work has started on this issue"
3. Update again to "resolved"
4. Add note: "Issue has been resolved successfully"

**Expected Result:**
- ✅ Each status change should reflect in Main App **immediately**
- ✅ Status history should show all updates with timestamps
- ✅ User should see the progression: submitted → under_review → in_progress → resolved

### **Step 5: Test Multiple Complaints**

**Create more complaints in Main App:**
1. Create 2-3 more complaints with different categories
2. Check if all appear in Admin Dashboard
3. Update different complaints to different statuses
4. Verify all changes sync properly

### **Step 6: Test Cross-Tab Sync**

**Open Multiple Tabs:**
1. Open Main App in 2 different tabs
2. Open Admin Dashboard in 2 different tabs
3. Make changes in one tab
4. Verify changes appear in all other tabs **immediately**

---

## 🔧 Technical Details

### **How the Sync Works:**

1. **Shared Storage**: Both apps use `localStorage` with key `samudayikAwaazComplaints`
2. **Real-time Updates**: Uses `storage` event listener to detect changes
3. **Automatic Refresh**: Components automatically reload data when storage changes
4. **Cross-tab Communication**: Works across multiple browser tabs/windows

### **Storage Structure:**
```json
{
  "samudayikAwaazComplaints": [
    {
      "id": "CMP1234567890ABC",
      "title": "Test Complaint",
      "description": "Test description",
      "category": "infrastructure",
      "priority": "high",
      "status": "submitted",
      "userId": "user123",
      "createdAt": "2024-01-01T10:00:00.000Z",
      "location": "Test Location",
      "contactNumber": "+91-9876543210",
      "assignedDepartment": "लोक निर्माण विभाग",
      "statusHistory": [
        {
          "status": "submitted",
          "timestamp": "2024-01-01T10:00:00.000Z",
          "note": "शिकायत सफलतापूर्वक दर्ज की गई है।"
        }
      ]
    }
  ]
}
```

---

## 🚨 Troubleshooting

### **If Sync Doesn't Work:**

1. **Check Browser Console**: Look for JavaScript errors
2. **Check localStorage**: Open DevTools → Application → Local Storage
3. **Refresh Both Apps**: Sometimes a hard refresh helps
4. **Clear Storage**: Clear localStorage and try again
5. **Check Network**: Ensure both apps are running properly

### **Common Issues:**

- **Complaint not appearing**: Check if user is logged in
- **Status not updating**: Verify admin credentials are correct
- **Cross-tab not working**: Check if storage events are firing
- **Data not persisting**: Check localStorage permissions

---

## 🎯 Success Criteria

✅ **Real-time Sync Working If:**
- New complaints appear in admin dashboard immediately
- Status updates from admin reflect in main app instantly
- Multiple tabs stay synchronized
- Data persists across browser sessions
- No JavaScript errors in console

This system provides **true real-time synchronization** between citizen complaints and government admin dashboard! 🏛️✨