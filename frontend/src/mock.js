// Mock data for BioPatch app

export const mockRecoveryData = {
  currentScore: 78,
  dailyImprovement: 15,
  status: "improving", // improving, stable, declining
  lastUpdated: new Date().toISOString()
};

export const mockEMGData = [
  { time: "00:00", value: 45, peak: false },
  { time: "02:00", value: 38, peak: false },
  { time: "04:00", value: 52, peak: true },
  { time: "06:00", value: 41, peak: false },
  { time: "08:00", value: 67, peak: true },
  { time: "10:00", value: 44, peak: false },
  { time: "12:00", value: 58, peak: true },
  { time: "14:00", value: 39, peak: false },
  { time: "16:00", value: 46, peak: false },
  { time: "18:00", value: 51, peak: false },
  { time: "20:00", value: 43, peak: false },
  { time: "22:00", value: 37, peak: false }
];

export const mockTemperatureData = [
  { time: "00:00", value: 36.8, temperature: 36.8, inflammation: "low" },
  { time: "04:00", value: 37.2, temperature: 37.2, inflammation: "medium" },
  { time: "08:00", value: 37.6, temperature: 37.6, inflammation: "high" },
  { time: "12:00", value: 37.4, temperature: 37.4, inflammation: "medium" },
  { time: "16:00", value: 37.1, temperature: 37.1, inflammation: "medium" },
  { time: "20:00", value: 36.9, temperature: 36.9, inflammation: "low" }
];

export const mockActivityData = [
  { time: "00:00", activity: 15, motionLevel: 15, tensActive: false, microcurrentActive: true },
  { time: "02:00", activity: 8, motionLevel: 8, tensActive: false, microcurrentActive: false },
  { time: "04:00", activity: 25, motionLevel: 25, tensActive: true, microcurrentActive: false },
  { time: "06:00", activity: 45, motionLevel: 45, tensActive: false, microcurrentActive: true },
  { time: "08:00", activity: 78, motionLevel: 78, tensActive: true, microcurrentActive: false },
  { time: "10:00", activity: 65, motionLevel: 65, tensActive: false, microcurrentActive: true },
  { time: "12:00", activity: 82, motionLevel: 82, tensActive: true, microcurrentActive: false },
  { time: "14:00", activity: 71, motionLevel: 71, tensActive: false, microcurrentActive: true },
  { time: "16:00", activity: 58, motionLevel: 58, tensActive: false, microcurrentActive: false },
  { time: "18:00", activity: 43, motionLevel: 43, tensActive: false, microcurrentActive: true },
  { time: "20:00", activity: 32, motionLevel: 32, tensActive: false, microcurrentActive: false },
  { time: "22:00", activity: 18, motionLevel: 18, tensActive: false, microcurrentActive: true }
];

export const mockTherapyReport = {
  totalTherapyMinutes: 180,
  tensMinutes: 75,
  microcurrentMinutes: 105,
  averageFrequency: 85, // Hz
  averageIntensity: 65, // %
  averagePulseWidth: 250 // microseconds
};

export const mockRecommendations = [
  {
    type: "therapy",
    title: "Tăng liệu pháp microcurrent",
    description: "Tăng thời gian microcurrent thêm 5 phút vào buổi sáng để cải thiện khả năng phục hồi",
    priority: "high"
  },
  {
    type: "lifestyle",
    title: "Giãn cơ nhẹ buổi sáng",
    description: "Thực hiện bài tập giãn cơ cổ và vai trong 10 phút mỗi sáng",
    priority: "medium"
  },
  {
    type: "exercise",
    title: "Bài tập vật lý trị liệu",
    description: "Thực hiện 3 bài tập cải thiện độ linh hoạt cổ vai",
    videoUrl: "#",
    priority: "medium"
  }
];

export const mockProgressData = {
  weeklyTrend: [
    { week: "Tuần 1", recoveryIndex: 65, painLevel: 7 },
    { week: "Tuần 2", recoveryIndex: 72, painLevel: 6 },
    { week: "Tuần 3", recoveryIndex: 78, painLevel: 5 },
    { week: "Tuần 4", recoveryIndex: 82, painLevel: 4 }
  ],
  painComparison: [
    { date: "01/01", subjective: 7, objective: 6.8 },
    { date: "01/02", subjective: 6, objective: 6.2 },
    { date: "01/03", subjective: 5, objective: 5.9 },
    { date: "01/04", subjective: 4, objective: 4.5 }
  ]
};

export const mockAlerts = [
  {
    id: 1,
    type: "warning",
    title: "Điện trở da bất thường",
    message: "Phát hiện điện trở da thấp hơn bình thường. Kiểm tra vị trí patch.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: 2,
    type: "info",
    title: "Hoàn thành phiên trị liệu",
    message: "Phiên TENS 20 phút đã hoàn tất thành công.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: true
  }
];

export const mockUserProfile = {
  fullName: "Nguyễn Văn An",
  age: 35,
  height: 175, // cm
  weight: 70, // kg
  gender: "Nam",
  therapyProfile: "Đau cổ do stress",
  painLocation: "Vùng cổ và vai",
  painLevel: 6, // VAS scale 0-10
  conditions: ["Căng thẳng cơ", "Đau mãn tính"],
  profileSettings: {
    tens: {
      frequency: 85, // Hz
      intensity: 65, // %
      pulseWidth: 250, // microseconds
      duration: 25 // minutes
    },
    microcurrent: {
      frequency: 0.5, // Hz
      intensity: 500, // µA
      duration: 60 // minutes
    }
  }
};

export const mockVitalSigns = {
  emg: {
    rms: 45.6, // Root Mean Square
    unit: "µV"
  },
  ppg: {
    heartRate: 72,
    hrv: 28.5, // Heart Rate Variability
    unit: "bpm"
  },
  eda: {
    peakCount: 12,
    amplitude: 3.2,
    unit: "µS"
  }
};