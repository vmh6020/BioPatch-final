# BioPatch API Contracts & Integration Guide

## Overview
Contract định nghĩa API endpoints, data models và integration plan cho BioPatch - hệ thống giám sát y sinh thông minh.

---

## 🔄 Data Models

### User Profile
```javascript
{
  id: ObjectId,
  age: Number,
  therapyProfile: String, // "Đau cổ do stress", etc.
  painLocation: String,
  painLevel: Number, // 0-10 VAS scale
  conditions: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Vital Signs Reading
```javascript
{
  id: ObjectId,
  userId: ObjectId,
  timestamp: Date,
  emg: {
    rms: Number,
    unit: "µV"
  },
  ppg: {
    heartRate: Number,
    hrv: Number,
    unit: "bpm"
  },
  eda: {
    peakCount: Number,
    amplitude: Number,
    unit: "µS"
  },
  temperature: Number,
  inflammation: String // "low", "medium", "high"
}
```

### Recovery Data
```javascript
{
  id: ObjectId,
  userId: ObjectId,
  date: Date,
  recoveryScore: Number, // 0-100
  dailyImprovement: Number, // percentage
  status: String, // "improving", "stable", "declining"
  painLevel: Number, // 0-10
  painType: String // "subjective" | "objective"
}
```

### Therapy Session
```javascript
{
  id: ObjectId,
  userId: ObjectId,
  sessionType: String, // "TENS" | "Microcurrent"
  startTime: Date,
  endTime: Date,
  duration: Number, // minutes
  settings: {
    frequency: Number, // Hz
    intensity: Number, // percentage
    pulseWidth: Number // microseconds
  },
  effectiveness: Number, // 0-100
  completed: Boolean
}
```

### Alert
```javascript
{
  id: ObjectId,
  userId: ObjectId,
  type: String, // "warning", "error", "info", "success"
  title: String,
  message: String,
  timestamp: Date,
  resolved: Boolean,
  priority: String, // "high", "medium", "low"
  metadata: Object // additional data
}
```

---

## 🔌 API Endpoints

### Authentication & User Management
```
POST /api/auth/login - User login
POST /api/auth/register - User registration  
GET /api/auth/profile - Get user profile
PUT /api/auth/profile - Update user profile
```

### Vital Signs & Monitoring
```
POST /api/vitals - Record vital signs reading
GET /api/vitals - Get vital signs history
GET /api/vitals/latest - Get latest vital signs
GET /api/vitals/emg - Get EMG data with peaks
GET /api/vitals/temperature - Get temperature & inflammation data
```

### Recovery & Progress Tracking
```
GET /api/recovery/current - Current recovery score
GET /api/recovery/trend - Recovery trend data
POST /api/recovery/pain-report - Submit pain level
GET /api/recovery/comparison - Subjective vs objective pain data
```

### Therapy Management
```
GET /api/therapy/sessions - Get therapy sessions
POST /api/therapy/sessions - Start therapy session
PUT /api/therapy/sessions/:id - Update/end session
GET /api/therapy/report - Daily therapy report
GET /api/therapy/recommendations - AI recommendations
```

### Alerts & Safety
```
GET /api/alerts - Get alerts (with filters)
POST /api/alerts - Create new alert
PUT /api/alerts/:id/resolve - Resolve alert
DELETE /api/alerts/:id - Delete alert
GET /api/alerts/settings - Get alert thresholds
PUT /api/alerts/settings - Update alert settings
```

### Analytics & Insights
```
GET /api/insights/emg - EMG analysis data
GET /api/insights/activity - Activity & therapy timeline
GET /api/insights/progress - Progress analytics
GET /api/insights/ai-summary - AI-generated insights
```

---

## 📦 Mock Data Migration Plan

### Current Mock Data in `/frontend/src/mock.js`:
1. **mockRecoveryData** → `/api/recovery/current`
2. **mockEMGData** → `/api/insights/emg`
3. **mockTemperatureData** → `/api/vitals/temperature`
4. **mockActivityData** → `/api/insights/activity`
5. **mockTherapyReport** → `/api/therapy/report`
6. **mockRecommendations** → `/api/therapy/recommendations`
7. **mockProgressData** → `/api/insights/progress`
8. **mockAlerts** → `/api/alerts`
9. **mockUserProfile** → `/api/auth/profile`
10. **mockVitalSigns** → `/api/vitals/latest`

### Frontend Integration Steps:
1. Replace mock data imports with API calls
2. Add loading states for async operations
3. Implement error handling for API failures
4. Add real-time updates via WebSocket/SSE
5. Cache frequently accessed data

---

## 🎯 Priority Implementation Order

### Phase 1: Core Data & Authentication
1. User authentication & profile management
2. Basic vital signs recording & retrieval
3. Current recovery score calculation

### Phase 2: Historical Data & Analytics
1. EMG data with peak detection
2. Temperature & inflammation tracking
3. Therapy session management
4. Progress trend calculation

### Phase 3: Advanced Features
1. Alert system with real-time notifications
2. AI recommendation engine
3. Real-time data streaming
4. Advanced analytics & insights

### Phase 4: Optimization & Enhancement
1. Data caching & performance optimization
2. Advanced UI animations sync with real data
3. Push notifications
4. Export/import functionality

---

## 🔧 Technical Implementation Notes

### Database Schema (MongoDB):
- Collections: users, vitalSigns, recoveryData, therapySessions, alerts
- Indexing on userId, timestamp for efficient queries
- TTL indexes for old data cleanup

### Real-time Updates:
- WebSocket connection for live vital signs
- Server-sent events for alerts
- Optimistic UI updates for better UX

### AI/ML Integration:
- Pain prediction models
- Therapy effectiveness analysis
- Anomaly detection for safety alerts
- Personalized recommendation engine

### Security & Privacy:
- JWT authentication
- Data encryption at rest
- HIPAA compliance considerations
- Rate limiting for API endpoints

---

## 🚀 Frontend-Backend Integration Checklist

- [ ] Replace mock data with axios API calls
- [ ] Add proper error boundaries
- [ ] Implement loading states
- [ ] Add optimistic updates
- [ ] Setup real-time data streams
- [ ] Add offline support
- [ ] Implement data caching
- [ ] Add retry logic for failed requests
- [ ] Setup proper TypeScript interfaces
- [ ] Add API response validation

---

*This contract serves as the integration guide between BioPatch frontend and backend development.*