import os
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Optional
from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage

# Load environment variables
load_dotenv()

class AIRecommendationService:
    def __init__(self):
        self.gemini_api_key = os.getenv('GEMINI_API_KEY')
        if not self.gemini_api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
            
    async def generate_recommendations(self, user_data: Dict) -> List[Dict]:
        """
        Generate AI recommendations based on user vital signs and therapy data
        """
        try:
            # Create chat instance with Gemini
            chat = LlmChat(
                api_key=self.gemini_api_key,
                session_id=f"biopatch-{user_data.get('user_id', 'default')}-{datetime.now().strftime('%Y%m%d')}",
                system_message="""You are a medical AI assistant specialized in pain management and physiotherapy for the BioPatch smart pain monitoring system. 

Analyze the provided patient data and generate 3-4 personalized recommendations in Vietnamese. Focus on:
1. Therapy adjustments (TENS/Microcurrent settings)
2. Lifestyle modifications  
3. Exercise recommendations
4. Safety alerts if needed

Return JSON format with this exact structure:
{
  "recommendations": [
    {
      "id": 1,
      "type": "therapy|lifestyle|exercise|safety",
      "priority": "high|medium|low", 
      "title": "Vietnamese title",
      "description": "Vietnamese description",
      "actionType": "therapy_setting|exercise|guide|article",
      "actionText": "Vietnamese action button text",
      "rationale": "Why this recommendation is important"
    }
  ],
  "summary": "Overall health assessment in Vietnamese",
  "alerts": ["Any safety concerns in Vietnamese"]
}

Base recommendations on EMG levels, heart rate variability, temperature readings, and previous therapy effectiveness."""
            ).with_model("gemini", "gemini-2.5-pro")
            
            # Prepare user data message
            user_message_text = f"""
Phân tích dữ liệu bệnh nhân BioPatch:

THÔNG TIN BỆNH NHÂN:
- Tuổi: {user_data.get('age', 35)}
- Giới tính: {user_data.get('gender', 'Nam')}
- Vùng đau: {user_data.get('pain_location', 'Cổ và vai')}
- Mức độ đau chủ quan: {user_data.get('pain_level', 6)}/10

DỮ LIỆU SINH LÝ HIỆN TẠI:
- EMG RMS: {user_data.get('emg_rms', 45.6)} µV
- Nhịp tim: {user_data.get('heart_rate', 72)} bpm
- HRV: {user_data.get('hrv', 28.5)} ms
- EDA peaks: {user_data.get('eda_peaks', 12)} peaks
- Nhiệt độ vùng đau: {user_data.get('temperature', 37.2)}°C
- Tình trạng viêm: {user_data.get('inflammation', 'Nhẹ')}

LỊCH SỬ LIỆU PHÁP (7 NGÀY QUA):
- Tổng thời gian TENS: {user_data.get('tens_minutes', 150)} phút
- Tổng thời gian Microcurrent: {user_data.get('microcurrent_minutes', 210)} phút
- Tần số trung bình: {user_data.get('avg_frequency', 85)} Hz
- Cường độ trung bình: {user_data.get('avg_intensity', 65)}%
- Điểm phục hồi hiện tại: {user_data.get('recovery_score', 78)}/100

XU HƯỚNG:
- Xu hướng đau: {user_data.get('pain_trend', 'Cải thiện')}
- Hiệu quả trị liệu: {user_data.get('therapy_effectiveness', 'Tốt')}
- Căng cơ cao điểm: {user_data.get('muscle_tension_peaks', 3)} lần/ngày

Vui lòng tạo khuyến nghị cá nhân hóa để cải thiện tình trạng phục hồi.
"""
            
            user_message = UserMessage(text=user_message_text)
            response = await chat.send_message(user_message)
            
            # Parse AI response
            try:
                # Clean the response to extract JSON
                response_text = response.strip()
                if response_text.startswith('```json'):
                    response_text = response_text[7:]
                if response_text.endswith('```'):
                    response_text = response_text[:-3]
                
                ai_recommendations = json.loads(response_text.strip())
                return ai_recommendations
                
            except json.JSONDecodeError:
                # Fallback to manual parsing or default recommendations
                return self._get_fallback_recommendations(user_data)
                
        except Exception as e:
            print(f"AI recommendation error: {str(e)}")
            return self._get_fallback_recommendations(user_data)
    
    def _get_fallback_recommendations(self, user_data: Dict) -> Dict:
        """
        Fallback recommendations based on rule-based logic
        """
        recommendations = []
        alerts = []
        
        # Analyze EMG levels
        emg_rms = user_data.get('emg_rms', 45)
        if emg_rms > 60:
            recommendations.append({
                "id": len(recommendations) + 1,
                "type": "therapy",
                "priority": "high",
                "title": "Tăng cường liệu pháp microcurrent",
                "description": "EMG cao cho thấy căng cơ tăng. Tăng thời gian microcurrent 10 phút/phiên.",
                "actionType": "therapy_setting",
                "actionText": "Cập nhật cài đặt",
                "rationale": "Microcurrent giúp giảm căng cơ hiệu quả"
            })
        
        # Analyze temperature
        temperature = user_data.get('temperature', 37.0)
        if temperature > 37.5:
            recommendations.append({
                "id": len(recommendations) + 1,
                "type": "safety",
                "priority": "high", 
                "title": "Giám sát tình trạng viêm",
                "description": "Nhiệt độ vùng đau cao. Theo dõi sát và nghỉ ngơi.",
                "actionType": "guide",
                "actionText": "Xem hướng dẫn",
                "rationale": "Nhiệt độ cao có thể chỉ ra viêm cấp tính"
            })
            alerts.append("Nhiệt độ vùng đau cao hơn bình thường")
        
        # Heart rate analysis
        heart_rate = user_data.get('heart_rate', 72)
        if heart_rate > 90:
            recommendations.append({
                "id": len(recommendations) + 1,
                "type": "lifestyle",
                "priority": "medium",
                "title": "Kỹ thuật thư giãn và hít thở",
                "description": "Nhịp tim hơi cao. Thực hiện bài tập hít thở sâu 10 phút/ngày.",
                "actionType": "exercise",
                "actionText": "Học kỹ thuật",
                "rationale": "Hít thở sâu giúp giảm stress và nhịp tim"
            })
        
        # Default exercise recommendation
        recommendations.append({
            "id": len(recommendations) + 1,
            "type": "exercise",
            "priority": "medium",
            "title": "Bài tập giãn cơ cổ vai",
            "description": "Thực hiện bài tập giãn cơ 15 phút mỗi sáng để cải thiện độ linh hoạt.",
            "actionType": "exercise", 
            "actionText": "Xem video hướng dẫn",
            "rationale": "Giãn cơ đều đặn giúp ngăn ngừa căng cơ"
        })
        
        return {
            "recommendations": recommendations,
            "summary": f"Phân tích tổng thể: Điểm phục hồi {user_data.get('recovery_score', 78)}/100 cho thấy tiến triển tích cực. Cần chú ý theo dõi và điều chỉnh liệu pháp phù hợp.",
            "alerts": alerts
        }

# Create global AI service instance
ai_service = AIRecommendationService()