import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  Play, 
  Pause, 
  Square, 
  Heart, 
  Activity, 
  Thermometer, 
  Zap,
  Timer,
  Settings,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { mockVitalSigns, mockUserProfile } from '../mock';
import AnimatedCounter from '../components/AnimatedCounter';

const TherapySession = () => {
  const { sessionType } = useParams(); // "tens" or "microcurrent"
  const navigate = useNavigate();
  
  const [sessionState, setSessionState] = useState('idle'); // idle, running, paused, completed
  const [sessionData, setSessionData] = useState({
    startTime: null,
    duration: 0, // seconds elapsed
    targetDuration: sessionType === 'tens' ? 1500 : 3600, // 25min vs 60min
    settings: sessionType === 'tens' ? mockUserProfile.profileSettings.tens : mockUserProfile.profileSettings.microcurrent,
    vitalSigns: {
      heartRate: 72,
      emgRms: 45.6,
      temperature: 37.2,
      eda: 3.2,
      batteryLevel: 85
    }
  });

  const [realTimeData, setRealTimeData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Simulate real-time data updates
  useEffect(() => {
    let interval;
    if (sessionState === 'running') {
      interval = setInterval(() => {
        setSessionData(prev => ({
          ...prev,
          duration: prev.duration + 1,
          vitalSigns: {
            heartRate: 72 + Math.sin(Date.now() / 1000) * 5,
            emgRms: 45.6 + Math.random() * 10 - 5,
            temperature: 37.2 + Math.random() * 0.8 - 0.4,
            eda: 3.2 + Math.random() * 1 - 0.5,
            batteryLevel: Math.max(0, prev.vitalSigns.batteryLevel - 0.01)
          }
        }));

        // Add to real-time data chart
        setRealTimeData(prev => {
          const newData = {
            time: new Date().toLocaleTimeString(),
            emg: 45.6 + Math.random() * 10 - 5,
            heartRate: 72 + Math.sin(Date.now() / 1000) * 5,
            temperature: 37.2 + Math.random() * 0.8 - 0.4
          };
          return [...prev.slice(-19), newData]; // Keep last 20 data points
        });

        // Generate occasional alerts
        if (Math.random() < 0.1) {
          const alertTypes = ['High HR', 'EMG Spike', 'Low Battery'];
          const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
          
          setAlerts(prev => [{
            id: Date.now(),
            message: randomAlert,
            type: 'warning',
            timestamp: new Date()
          }, ...prev.slice(0, 4)]);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [sessionState]);

  // Auto-stop when target duration reached
  useEffect(() => {
    if (sessionData.duration >= sessionData.targetDuration && sessionState === 'running') {
      handleStopSession();
    }
  }, [sessionData.duration, sessionData.targetDuration, sessionState]);

  const handleStartSession = () => {
    setSessionState('running');
    setSessionData(prev => ({
      ...prev,
      startTime: new Date()
    }));
  };

  const handlePauseSession = () => {
    setSessionState(sessionState === 'running' ? 'paused' : 'running');
  };

  const handleStopSession = () => {
    setSessionState('completed');
    // Here you would save session data to backend
    console.log('Session completed:', {
      type: sessionType,
      duration: sessionData.duration,
      settings: sessionData.settings,
      startTime: sessionData.startTime,
      endTime: new Date(),
      averageVitals: calculateAverageVitals()
    });
  };

  const calculateAverageVitals = () => {
    if (realTimeData.length === 0) return {};
    
    return {
      avgHeartRate: realTimeData.reduce((sum, d) => sum + d.heartRate, 0) / realTimeData.length,
      avgEmg: realTimeData.reduce((sum, d) => sum + d.emg, 0) / realTimeData.length,
      avgTemperature: realTimeData.reduce((sum, d) => sum + d.temperature, 0) / realTimeData.length
    };
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (sessionData.duration / sessionData.targetDuration) * 100;
  const remainingTime = sessionData.targetDuration - sessionData.duration;

  if (sessionState === 'completed') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card className="text-center animate-slide-up">
          <CardContent className="p-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Phiên hoàn tất!</h2>
            <p className="text-slate-600 mb-6">
              Phiên {sessionType.toUpperCase()} đã hoàn thành sau {formatTime(sessionData.duration)}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-bold text-lg">{formatTime(sessionData.duration)}</div>
                <div className="text-sm text-slate-600">Thời gian</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-bold text-lg">{sessionData.settings.intensity}%</div>
                <div className="text-sm text-slate-600">Cường độ trung bình</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="font-bold text-lg">92%</div>
                <div className="text-sm text-slate-600">Hiệu quả</div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/therapy')} 
                className="w-full"
              >
                Xem báo cáo chi tiết
              </Button>
              <Button 
                onClick={() => navigate('/')} 
                variant="outline"
                className="w-full"
              >
                Về trang chủ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 capitalize">
            Phiên {sessionType === 'tens' ? 'TENS' : 'Microcurrent'}
          </h1>
          <p className="text-slate-600">
            {sessionState === 'idle' && 'Sẵn sàng bắt đầu phiên trị liệu'}
            {sessionState === 'running' && 'Phiên đang chạy...'}
            {sessionState === 'paused' && 'Phiên đã tạm dừng'}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
        >
          ← Quay lại
        </Button>
      </div>

      {/* Session Timer & Progress */}
      <Card className="animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Timer className="h-5 w-5" />
              <span>Tiến độ phiên</span>
            </span>
            <Badge variant={sessionState === 'running' ? 'default' : 'secondary'}>
              {sessionState === 'running' ? 'Đang chạy' : 
               sessionState === 'paused' ? 'Tạm dừng' : 'Chờ'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Main Timer Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 mb-2">
                <AnimatedCounter 
                  target={Math.floor(sessionData.duration / 60)}
                  suffix={`:${(sessionData.duration % 60).toString().padStart(2, '0')}`}
                />
              </div>
              <div className="text-lg text-slate-600">
                Còn lại: {formatTime(Math.max(0, remainingTime))}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={Math.min(100, progressPercentage)} className="h-4" />
              <div className="flex justify-between text-sm text-slate-600">
                <span>0:00</span>
                <span>{Math.min(100, progressPercentage).toFixed(1)}%</span>
                <span>{formatTime(sessionData.targetDuration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {sessionState === 'idle' && (
                <Button onClick={handleStartSession} size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Bắt đầu phiên
                </Button>
              )}
              
              {(sessionState === 'running' || sessionState === 'paused') && (
                <>
                  <Button onClick={handlePauseSession} variant="outline" size="lg">
                    {sessionState === 'running' ? (
                      <>
                        <Pause className="h-5 w-5 mr-2" />
                        Tạm dừng
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 mr-2" />
                        Tiếp tục
                      </>
                    )}
                  </Button>
                  <Button onClick={handleStopSession} variant="destructive" size="lg">
                    <Square className="h-5 w-5 mr-2" />
                    Kết thúc
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Vital Signs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animate-slide-up" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhịp tim</CardTitle>
            <Heart className="h-4 w-4 text-red-600 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={Math.round(sessionData.vitalSigns.heartRate)} />
              <span className="text-sm font-normal text-slate-500"> bpm</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span>Bình thường</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EMG RMS</CardTitle>
            <Activity className="h-4 w-4 text-blue-600 animate-pulse-slow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={sessionData.vitalSigns.emgRms} />
              <span className="text-sm font-normal text-slate-500"> µV</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-blue-600">
              <Activity className="h-3 w-3" />
              <span>Ổn định</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{animationDelay: '0.3s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhiệt độ</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-600 animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={sessionData.vitalSigns.temperature} />
              <span className="text-sm font-normal text-slate-500">°C</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-orange-600">
              <Thermometer className="h-3 w-3" />
              <span>Viêm nhẹ</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{animationDelay: '0.4s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EDA</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600 animate-bounce-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={sessionData.vitalSigns.eda} />
              <span className="text-sm font-normal text-slate-500"> µS</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-yellow-600">
              <Zap className="h-3 w-3" />
              <span>Thư giãn</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Settings & Real-time Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Settings */}
        <Card className="animate-slide-up" style={{animationDelay: '0.5s'}}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Cài đặt phiên</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-blue-700">{sessionData.settings.frequency}</div>
                  <div className="text-sm text-blue-600">
                    {sessionType === 'tens' ? 'Hz' : 'Hz'}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Tần số</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-bold text-orange-700">{sessionData.settings.intensity}</div>
                  <div className="text-sm text-orange-600">
                    {sessionType === 'tens' ? '%' : 'µA'}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">Cường độ</div>
                </div>
              </div>
              
              {sessionType === 'tens' && (
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-bold text-green-700">{sessionData.settings.pulseWidth}</div>
                  <div className="text-sm text-green-600">µs</div>
                  <div className="text-xs text-slate-600 mt-1">Độ rộng xung</div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-600">Pin thiết bị:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          sessionData.vitalSigns.batteryLevel > 50 ? 'bg-green-500' :
                          sessionData.vitalSigns.batteryLevel > 20 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${sessionData.vitalSigns.batteryLevel}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(sessionData.vitalSigns.batteryLevel)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Alerts & Mini Chart */}
        <Card className="animate-slide-up" style={{animationDelay: '0.6s'}}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span>Giám sát thời gian thực</span>
              </span>
              {alerts.length > 0 && (
                <Badge variant="destructive">
                  {alerts.length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alerts.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <span className="flex-1">{alert.message}</span>
                    <span className="text-xs text-slate-500">
                      {alert.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-600">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm">Tất cả tín hiệu bình thường</p>
              </div>
            )}

            {/* Mini Real-time Chart */}
            {realTimeData.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-xs text-slate-600 mb-2">EMG theo thời gian gần đây</div>
                <div className="flex items-end space-x-1 h-16">
                  {realTimeData.slice(-10).map((data, index) => {
                    const height = Math.max(10, (data.emg / 60) * 50);
                    return (
                      <div
                        key={index}
                        className="flex-1 bg-blue-500 rounded-t transition-all duration-300"
                        style={{ height: `${height}px` }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TherapySession;