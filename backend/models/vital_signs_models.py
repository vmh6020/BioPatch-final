from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class InflammationLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class EMGData(BaseModel):
    rms: float = Field(..., description="Root Mean Square (µV)")
    unit: str = Field(default="µV")
    peak: Optional[bool] = Field(default=False, description="Peak detected")

class PPGData(BaseModel):
    heartRate: float = Field(..., description="Nhịp tim (bpm)")
    hrv: float = Field(..., description="Heart Rate Variability (ms)")
    unit: str = Field(default="bpm")

class EDAData(BaseModel):
    amplitude: float = Field(..., description="Amplitude (µS)")
    peakCount: int = Field(..., description="Number of peaks detected")
    unit: str = Field(default="µS")

class VitalSignsReading(BaseModel):
    id: Optional[str] = None
    userId: str = Field(..., description="User ID")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    emg: EMGData
    ppg: PPGData
    eda: EDAData
    temperature: float = Field(..., description="Temperature (°C)")
    inflammation: InflammationLevel = Field(..., description="Inflammation level")
    batteryLevel: Optional[float] = Field(None, ge=0, le=100, description="Device battery (%)")
    signalQuality: Optional[float] = Field(None, ge=0, le=100, description="Signal quality (%)")

class VitalSignsCreate(BaseModel):
    userId: str
    emg: EMGData
    ppg: PPGData
    eda: EDAData
    temperature: float
    inflammation: InflammationLevel
    batteryLevel: Optional[float] = None
    signalQuality: Optional[float] = None

class VitalSignsResponse(BaseModel):
    readings: list[VitalSignsReading]
    totalCount: int
    page: int
    pageSize: int

class LatestVitalSigns(BaseModel):
    userId: str
    timestamp: datetime
    emg: EMGData
    ppg: PPGData
    eda: EDAData
    temperature: float
    inflammation: InflammationLevel
    batteryLevel: Optional[float] = None
    signalQuality: Optional[float] = None
    
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }