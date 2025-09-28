from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class GenderEnum(str, Enum):
    MALE = "Nam"
    FEMALE = "Nữ"
    OTHER = "Khác"

class TherapyProfileEnum(str, Enum):
    NECK_STRESS = "Đau cổ do stress"
    CHRONIC_BACK = "Đau lưng mãn tính"
    SHOULDER_POSTURE = "Đau vai do tư thế"
    POST_WORKOUT = "Đau cơ sau tập luyện"
    ARTHRITIS = "Viêm khớp"
    CUSTOM = "Tùy chỉnh"

class TherapySettings(BaseModel):
    frequency: float = Field(..., description="Tần số (Hz)")
    intensity: float = Field(..., description="Cường độ")
    pulseWidth: Optional[float] = Field(None, description="Độ rộng xung (µs)")
    duration: int = Field(..., description="Thời gian (phút)")

class ProfileSettings(BaseModel):
    tens: TherapySettings
    microcurrent: TherapySettings

class UserProfile(BaseModel):
    id: Optional[str] = None
    fullName: str = Field(..., description="Họ và tên")
    age: int = Field(..., ge=1, le=120, description="Tuổi")
    gender: GenderEnum = Field(..., description="Giới tính")
    height: float = Field(..., gt=0, description="Chiều cao (cm)")
    weight: float = Field(..., gt=0, description="Cân nặng (kg)")
    therapyProfile: TherapyProfileEnum = Field(..., description="Hồ sơ liệu pháp")
    painLocation: str = Field(..., description="Vị trí đau")
    painLevel: int = Field(..., ge=0, le=10, description="Mức độ đau (VAS 0-10)")
    conditions: List[str] = Field(default=[], description="Tình trạng sức khỏe")
    profileSettings: ProfileSettings = Field(..., description="Cài đặt liệu pháp")
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class UserProfileCreate(BaseModel):
    fullName: str
    age: int
    gender: GenderEnum
    height: float
    weight: float
    therapyProfile: TherapyProfileEnum
    painLocation: str
    painLevel: int
    conditions: List[str] = []
    profileSettings: ProfileSettings

class UserProfileUpdate(BaseModel):
    fullName: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[GenderEnum] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    therapyProfile: Optional[TherapyProfileEnum] = None
    painLocation: Optional[str] = None
    painLevel: Optional[int] = None
    conditions: Optional[List[str]] = None
    profileSettings: Optional[ProfileSettings] = None