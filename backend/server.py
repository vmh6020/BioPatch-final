from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import uuid
from datetime import datetime
from ai_service import ai_service


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class UserVitalSigns(BaseModel):
    user_id: str
    emg_rms: float
    heart_rate: int
    hrv: float
    eda_peaks: int
    temperature: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class TherapySession(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_type: str  # "TENS" | "Microcurrent"
    start_time: datetime
    end_time: Optional[datetime] = None
    duration: Optional[int] = None  # minutes
    settings: Dict
    effectiveness: Optional[int] = None  # 0-100
    completed: bool = False

class AIRecommendationRequest(BaseModel):
    user_id: str
    age: Optional[int] = 35
    gender: Optional[str] = "Nam"
    pain_location: Optional[str] = "Cổ và vai"
    pain_level: Optional[int] = 6
    emg_rms: Optional[float] = 45.6
    heart_rate: Optional[int] = 72
    hrv: Optional[float] = 28.5
    eda_peaks: Optional[int] = 12
    temperature: Optional[float] = 37.2
    inflammation: Optional[str] = "Nhẹ"
    recovery_score: Optional[int] = 78

class UserProfile(BaseModel):
    user_id: str
    full_name: str
    age: int
    gender: str
    height: int
    weight: int
    conditions: List[str]
    pain_location: str
    pain_level: int
    therapy_profile: str
    profile_settings: Dict
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class UpdatePainLevelRequest(BaseModel):
    user_id: str
    pain_level: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# BioPatch specific endpoints

@api_router.post("/vitals")
async def record_vital_signs(vitals: UserVitalSigns):
    """Record vital signs data from BioPatch device"""
    try:
        vitals_dict = vitals.dict()
        result = await db.vital_signs.insert_one(vitals_dict)
        return {"message": "Vital signs recorded successfully", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to record vital signs: {str(e)}")

@api_router.get("/vitals/latest/{user_id}")
async def get_latest_vitals(user_id: str):
    """Get latest vital signs for a user"""
    try:
        latest_vitals = await db.vital_signs.find_one(
            {"user_id": user_id},
            sort=[("timestamp", -1)]
        )
        if not latest_vitals:
            return {"message": "No vital signs found"}
        
        # Convert ObjectId to string for JSON serialization
        latest_vitals["_id"] = str(latest_vitals["_id"])
        return latest_vitals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get vital signs: {str(e)}")

@api_router.post("/sessions")
async def create_therapy_session(session: TherapySession):
    """Create a new therapy session"""
    try:
        session_dict = session.dict()
        result = await db.therapy_sessions.insert_one(session_dict)
        return {"message": "Therapy session created", "id": str(result.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@api_router.get("/sessions/{user_id}")
async def get_user_sessions(user_id: str):
    """Get therapy sessions for a user"""
    try:
        sessions = await db.therapy_sessions.find({"user_id": user_id}).to_list(100)
        # Convert ObjectIds to strings
        for session in sessions:
            session["_id"] = str(session["_id"])
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")

@api_router.post("/recommendations/{user_id}")
async def get_ai_recommendations(user_id: str, request: AIRecommendationRequest):
    """Generate AI-powered recommendations based on user data"""
    try:
        # Prepare user data for AI analysis
        user_data = request.dict()
        user_data['user_id'] = user_id
        
        # Get AI recommendations
        recommendations = await ai_service.generate_recommendations(user_data)
        
        # Store recommendations in database for tracking
        recommendation_record = {
            "user_id": user_id,
            "timestamp": datetime.utcnow(),
            "recommendations": recommendations,
            "user_data_snapshot": user_data
        }
        await db.ai_recommendations.insert_one(recommendation_record)
        
        return recommendations
    except Exception as e:
        logger.error(f"Failed to generate AI recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate recommendations: {str(e)}")

@api_router.get("/analytics/{user_id}")
async def get_user_analytics(user_id: str):
    """Get analytics data for dashboard"""
    try:
        # Get recent vital signs (last 24 hours)
        recent_vitals = await db.vital_signs.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(24).to_list(24)
        
        # Get recent sessions
        recent_sessions = await db.therapy_sessions.find(
            {"user_id": user_id}
        ).sort("start_time", -1).limit(10).to_list(10)
        
        # Calculate recovery metrics
        recovery_data = {
            "current_score": 78,  # Placeholder - calculate based on real data
            "daily_improvement": 15,
            "status": "improving"
        }
        
        # Convert ObjectIds to strings
        for vital in recent_vitals:
            vital["_id"] = str(vital["_id"])
        for session in recent_sessions:
            session["_id"] = str(session["_id"])
            
        return {
            "recovery_data": recovery_data,
            "recent_vitals": recent_vitals,
            "recent_sessions": recent_sessions,
            "last_updated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get analytics: {str(e)}")

# User Profile endpoints
@api_router.get("/profile/{user_id}")
async def get_user_profile(user_id: str):
    """Get user profile"""
    try:
        profile = await db.user_profiles.find_one({"user_id": user_id})
        if not profile:
            # Return default profile if not found
            default_profile = {
                "user_id": user_id,
                "full_name": "Người dùng BioPatch",
                "age": 35,
                "gender": "Nam",
                "height": 170,
                "weight": 70,
                "conditions": ["Đau cổ mãn tính"],
                "pain_location": "Cổ và vai",
                "pain_level": 5,
                "therapy_profile": "Đau cổ do stress",
                "profile_settings": {
                    "tens": {
                        "frequency": 85,
                        "intensity": 65,
                        "pulse_width": 250,
                        "duration": 25
                    },
                    "microcurrent": {
                        "frequency": 0.5,
                        "intensity": 500,
                        "duration": 60
                    }
                },
                "last_updated": datetime.utcnow().isoformat()
            }
            return default_profile
        
        profile["_id"] = str(profile["_id"])
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {str(e)}")

@api_router.post("/profile")
async def create_or_update_profile(profile: UserProfile):
    """Create or update user profile"""
    try:
        profile_dict = profile.dict()
        result = await db.user_profiles.update_one(
            {"user_id": profile.user_id},
            {"$set": profile_dict},
            upsert=True
        )
        return {"message": "Profile updated successfully", "modified_count": result.modified_count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@api_router.post("/profile/pain-level")
async def update_pain_level(request: UpdatePainLevelRequest):
    """Update user pain level"""
    try:
        # Update profile pain level
        profile_result = await db.user_profiles.update_one(
            {"user_id": request.user_id},
            {
                "$set": {
                    "pain_level": request.pain_level,
                    "last_updated": request.timestamp
                }
            },
            upsert=True
        )
        
        # Also record as pain history
        pain_record = {
            "user_id": request.user_id,
            "pain_level": request.pain_level,
            "timestamp": request.timestamp,
            "type": "manual_input"
        }
        await db.pain_history.insert_one(pain_record)
        
        return {
            "message": "Pain level updated successfully",
            "pain_level": request.pain_level,
            "timestamp": request.timestamp.isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update pain level: {str(e)}")

@api_router.post("/sessions/{session_id}/complete")
async def complete_therapy_session(session_id: str, effectiveness: Optional[int] = None):
    """Complete a therapy session and update analytics data"""
    try:
        # Update session completion
        update_data = {
            "completed": True,
            "end_time": datetime.utcnow(),
            "effectiveness": effectiveness
        }
        
        session_result = await db.therapy_sessions.update_one(
            {"id": session_id},
            {"$set": update_data}
        )
        
        if session_result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Session not found")
        
        # Get the session details to update user data
        session = await db.therapy_sessions.find_one({"id": session_id})
        if session:
            # Calculate duration
            if session.get("end_time") and session.get("start_time"):
                duration = (session["end_time"] - session["start_time"]).total_seconds() / 60
                await db.therapy_sessions.update_one(
                    {"id": session_id},
                    {"$set": {"duration": int(duration)}}
                )
            
            # Update analytics data (trigger real-time chart updates)
            await _update_real_time_analytics(session["user_id"], session)
        
        return {
            "message": "Therapy session completed successfully",
            "session_id": session_id,
            "effectiveness": effectiveness
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to complete session: {str(e)}")

async def _update_real_time_analytics(user_id: str, session: dict):
    """Update real-time analytics after therapy completion"""
    # This would typically update EMG, temperature data based on session
    # For now, we'll create sample updates
    
    # Add new data points to EMG and temperature collections
    current_time = datetime.utcnow()
    
    # Sample EMG update (reduced values after therapy)
    emg_update = {
        "user_id": user_id,
        "time": current_time.strftime("%H:%M"),
        "value": 35.2,  # Lower value after therapy
        "peak": False,
        "session_id": session["id"],
        "timestamp": current_time
    }
    await db.emg_data.insert_one(emg_update)
    
    # Sample temperature update (reduced inflammation)
    temp_update = {
        "user_id": user_id,
        "time": current_time.strftime("%H:%M"),
        "temperature": 36.8,  # Reduced temperature
        "inflammation": "low",
        "session_id": session["id"],
        "timestamp": current_time
    }
    await db.temperature_data.insert_one(temp_update)

@api_router.get("/insights/{user_id}")
async def get_insights_data(user_id: str):
    """Get updated insights data including EMG, temperature, and activity"""
    try:
        # Get EMG data (last 24 hours or latest 20 points)
        emg_data = await db.emg_data.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(20).to_list(20)
        
        # Get temperature data
        temp_data = await db.temperature_data.find(
            {"user_id": user_id}
        ).sort("timestamp", -1).limit(20).to_list(20)
        
        # Get activity data
        activity_data = await db.therapy_sessions.find(
            {"user_id": user_id}
        ).sort("start_time", -1).limit(20).to_list(20)
        
        # Convert ObjectIds to strings and reverse for chronological order
        for item in emg_data:
            item["_id"] = str(item["_id"])
        for item in temp_data:
            item["_id"] = str(item["_id"])
        for item in activity_data:
            item["_id"] = str(item["_id"])
        
        return {
            "emg_data": list(reversed(emg_data)),
            "temperature_data": list(reversed(temp_data)),
            "activity_data": list(reversed(activity_data)),
            "last_updated": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get insights data: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
