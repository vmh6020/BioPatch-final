import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Heart, Activity, Thermometer, Zap, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { mockRecoveryData, mockVitalSigns, mockAlerts } from '../mock';
import AnimatedCounter from '../components/AnimatedCounter';
import PainLevelDialog from '../components/PainLevelDialog';
import EnhancedAlertCard from '../components/EnhancedAlertCard';
import BLESimulation from '../components/BLESimulation';

const Home = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(mockAlerts);
  const [realTimeData, setRealTimeData] = useState(mockVitalSigns);
  const [isTherapyActive, setIsTherapyActive] = useState(false);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-500" />;
      default:
        return <Minus className="h-5 w-5 text-yellow-500" />;
    }
  };

  const handlePainSubmit = (level) => {
    console.log('Pain level submitted:', level);
    // In real app, this would send data to backend
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const handleBLEDataUpdate = (newData) => {
    setRealTimeData(newData);
  };

  const unreadAlerts = alerts.filter(alert => !alert.resolved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Bảng điều khiển</h1>
          <p className="text-slate-600">Giám sát tình trạng phục hồi của bạn</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Cập nhật lần cuối</p>
          <p className="text-sm font-medium">
            {new Date(mockRecoveryData.lastUpdated).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>

      {/* Recovery Score Card */}
      <Card className="bg-gradient-to-r from-slate-50 via-blue-50 to-slate-100 animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Điểm phục hồi hôm nay</span>
            <div className="animate-bounce-soft">
              {getStatusIcon(mockRecoveryData.status)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <div className={`text-6xl font-bold ${getScoreColor(mockRecoveryData.currentScore)} recovery-score-glow ${mockRecoveryData.status}`}>
                <AnimatedCounter 
                  target={mockRecoveryData.currentScore} 
                  duration={2500}
                />
              </div>
              <div className="text-sm text-slate-600 mt-2 animate-slide-up">
                Cải thiện <AnimatedCounter target={mockRecoveryData.dailyImprovement} suffix="%" duration={1500} /> so với hôm qua
              </div>
              <Progress 
                value={mockRecoveryData.currentScore} 
                className="mt-4 h-3 transition-all duration-1000"
                style={{
                  background: `linear-gradient(to right, 
                    #10b981 0%, 
                    #10b981 ${mockRecoveryData.currentScore}%, 
                    #e2e8f0 ${mockRecoveryData.currentScore}%, 
                    #e2e8f0 100%)`
                }}
              />
            </div>
            <PainLevelDialog
              trigger={
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 transition-bounce animate-pulse-slow">
                  Cảm thấy thế nào?
                </Button>
              }
              onSubmit={handlePainSubmit}
            />
          </div>
        </CardContent>
      </Card>

      {/* BLE Device Connection */}
      <div className="mb-6">
        <BLESimulation 
          onDataUpdate={handleBLEDataUpdate}
          isActive={isTherapyActive}
        />
      </div>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-smooth animate-slide-up" style={{animationDelay: '0.1s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">EMG (RMS)</CardTitle>
            <Activity className="h-4 w-4 text-blue-600 animate-pulse-slow" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={realTimeData.emg.rms || 0} duration={1800} /> 
              <span className="text-sm font-normal text-slate-500"> {realTimeData.emg.unit}</span>
            </div>
            <p className="text-xs text-slate-600">Mức độ co cơ</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-smooth animate-slide-up" style={{animationDelay: '0.2s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhịp tim</CardTitle>
            <Heart className="h-4 w-4 text-red-600 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={realTimeData.ppg.heartRate || 0} duration={2000} />
              <span className="text-sm font-normal text-slate-500"> {realTimeData.ppg.unit}</span>
            </div>
            <p className="text-xs text-slate-600">HRV: {realTimeData.ppg.hrv || 0}ms</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-smooth animate-slide-up" style={{animationDelay: '0.3s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phản ứng da (EDA)</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600 animate-bounce-soft" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={realTimeData.eda.amplitude || 0} duration={1600} />
              <span className="text-sm font-normal text-slate-500"> {realTimeData.eda.unit}</span>
            </div>
            <p className="text-xs text-slate-600">Peak: {realTimeData.eda.peakCount || 0}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-smooth animate-slide-up" style={{animationDelay: '0.4s'}}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhiệt độ vùng đau</CardTitle>
            <Thermometer className="h-4 w-4 text-orange-600 animate-float" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <AnimatedCounter target={realTimeData.temperature || 0} duration={1500} />°C
            </div>
            <Badge variant="secondary" className="text-xs animate-pulse-slow">
              {realTimeData.temperature > 37.5 ? 'Viêm cao' : realTimeData.temperature > 37 ? 'Viêm nhẹ' : 'Bình thường'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thao tác nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-red-50 hover:border-red-300 transition-colors"
              onClick={() => navigate('/therapy-session/tens')}
            >
              <Activity className="mr-2 h-4 w-4" />
              Bắt đầu phiên TENS
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start hover:bg-green-50 hover:border-green-300 transition-colors"
              onClick={() => navigate('/therapy-session/microcurrent')}
            >
              <Zap className="mr-2 h-4 w-4" />
              Kích hoạt Microcurrent
            </Button>
          </CardContent>
        </Card>

        <Card className="animate-slide-up" style={{animationDelay: '0.6s'}}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Cảnh báo gần đây</CardTitle>
            {unreadAlerts.length > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {unreadAlerts.length} mới
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {unreadAlerts.length > 0 ? (
              <div className="space-y-3">
                {unreadAlerts.slice(0, 2).map((alert) => (
                  <EnhancedAlertCard
                    key={alert.id}
                    alert={alert}
                    onResolve={handleResolveAlert}
                  />
                ))}
                <Button 
                  variant="link" 
                  className="text-sm p-0 hover:text-slate-900 transition-colors"
                  onClick={() => navigate('/alerts')}
                >
                  Xem tất cả cảnh báo →
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <p className="text-sm text-slate-600">Không có cảnh báo mới</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Home;