import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { AlertTriangle, CheckCircle2, Info, Heart, Zap, Shield } from 'lucide-react';
import { mockAlerts } from '../mock';

const Alerts = () => {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [alertSettings, setAlertSettings] = useState({
    heartRateMax: 120,
    temperatureWarning: 38.5,
    emgHigh: 100,
    skinResistanceLow: 5,
    batteryLow: 15,
    signalLoss: 30,
    soundAlerts: true,
    emailAlerts: false,
    smsAlerts: false
  });
  const [isEditingSettings, setIsEditingSettings] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return <Info className="h-5 w-5 text-slate-600" />;
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-slate-200 bg-slate-50';
    }
  };

  const resolveAlert = (id) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  const handleSaveSettings = async () => {
    try {
      // Save settings to backend
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'default-user',
          alert_settings: alertSettings,
          last_updated: new Date().toISOString()
        })
      });

      if (response.ok) {
        setIsEditingSettings(false);
        setLastSaved(new Date());
        // Show success feedback
        alert('Cài đặt đã được lưu thành công!');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Lỗi khi lưu cài đặt. Vui lòng thử lại.');
    }
  };

  const handleEditSettings = () => {
    setIsEditingSettings(true);
  };

  const handleSettingChange = (key, value) => {
    setAlertSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Cảnh báo & an toàn</h1>
          <p className="text-slate-600">Giám sát tình trạng thiết bị và an toàn người dùng</p>
        </div>
        <div className="flex space-x-2">
          <Badge variant={activeAlerts.length > 0 ? "destructive" : "secondary"}>
            {activeAlerts.length} cảnh báo hoạt động
          </Badge>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tình trạng thiết bị</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Bình thường</div>
            <p className="text-xs text-slate-600">Tất cả cảm biến hoạt động tốt</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điện trở da</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Thấp</div>
            <p className="text-xs text-slate-600">Cần kiểm tra vị trí patch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nhịp tim</CardTitle>
            <Heart className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Bình thường</div>
            <p className="text-xs text-slate-600">72 BPM - Trong giới hạn an toàn</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian hoạt động</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">98.5%</div>
            <p className="text-xs text-slate-600">Uptime trong 24h qua</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Cảnh báo hoạt động ({activeAlerts.length})</TabsTrigger>
          <TabsTrigger value="resolved">Đã xử lý ({resolvedAlerts.length})</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt cảnh báo</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeAlerts.length > 0 ? (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className={`border-l-4 ${getAlertColor(alert.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getAlertIcon(alert.type)}
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900">{alert.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(alert.timestamp).toLocaleString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => resolveAlert(alert.id)}
                        >
                          Đã xử lý
                        </Button>
                        <Button size="sm" variant="ghost">
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">Không có cảnh báo</h3>
                <p className="text-slate-600">Tất cả hệ thống đang hoạt động bình thường</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="space-y-3">
            {resolvedAlerts.map((alert) => (
              <Card key={alert.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-700">{alert.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{alert.message}</p>
                        <p className="text-xs text-slate-400 mt-2">
                          Đã xử lý: {new Date(alert.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Đã xử lý</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Cài đặt ngưỡng cảnh báo</CardTitle>
              <div className="flex items-center space-x-2">
                {lastSaved && (
                  <Badge variant="secondary" className="text-xs">
                    Lưu lúc: {lastSaved.toLocaleTimeString('vi-VN')}
                  </Badge>
                )}
                {!isEditingSettings && (
                  <Button size="sm" variant="outline" onClick={handleEditSettings}>
                    Chỉnh sửa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Cảnh báo sinh lý</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nhịp tim tối đa (BPM)</span>
                      <input 
                        type="number" 
                        value={alertSettings.heartRateMax}
                        onChange={(e) => handleSettingChange('heartRateMax', parseInt(e.target.value))}
                        disabled={!isEditingSettings}
                        className={`w-20 px-2 py-1 border rounded text-sm ${
                          !isEditingSettings ? 'bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Nhiệt độ cảnh báo (°C)</span>
                      <input 
                        type="number" 
                        value={alertSettings.temperatureWarning}
                        onChange={(e) => handleSettingChange('temperatureWarning', parseFloat(e.target.value))}
                        disabled={!isEditingSettings}
                        step="0.1"
                        className={`w-20 px-2 py-1 border rounded text-sm ${
                          !isEditingSettings ? 'bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">EMG cao bất thường (µV)</span>
                      <input 
                        type="number" 
                        value={alertSettings.emgHigh}
                        onChange={(e) => handleSettingChange('emgHigh', parseInt(e.target.value))}
                        disabled={!isEditingSettings}
                        className={`w-20 px-2 py-1 border rounded text-sm ${
                          !isEditingSettings ? 'bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Cảnh báo thiết bị</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Điện trở da thấp (kΩ)</span>
                      <input 
                        type="number" 
                        value={alertSettings.skinResistanceLow}
                        onChange={(e) => handleSettingChange('skinResistanceLow', parseInt(e.target.value))}
                        disabled={!isEditingSettings}
                        className={`w-20 px-2 py-1 border rounded text-sm ${
                          !isEditingSettings ? 'bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Pin yếu (%)</span>
                      <input 
                        type="number" 
                        value={alertSettings.batteryLow}
                        onChange={(e) => handleSettingChange('batteryLow', parseInt(e.target.value))}
                        disabled={!isEditingSettings}
                        className={`w-20 px-2 py-1 border rounded text-sm ${
                          !isEditingSettings ? 'bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Mất tín hiệu (giây)</span>
                      <input 
                        type="number" 
                        value={alertSettings.signalLoss}
                        onChange={(e) => handleSettingChange('signalLoss', parseInt(e.target.value))}
                        disabled={!isEditingSettings}
                        className={`w-20 px-2 py-1 border rounded text-sm ${
                          !isEditingSettings ? 'bg-slate-100 cursor-not-allowed' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {isEditingSettings && (
                <div className="flex space-x-3">
                  <Button onClick={handleSaveSettings}>Lưu cài đặt</Button>
                  <Button variant="outline" onClick={() => setIsEditingSettings(false)}>Hủy</Button>
                </div>
              )}

              {!isEditingSettings && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-800">
                      Cài đặt đã được lưu và áp dụng. Click "Chỉnh sửa" để thay đổi.
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Âm thanh cảnh báo</div>
                  <div className="text-sm text-slate-600">Phát âm thanh khi có cảnh báo mức cao</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertSettings.soundAlerts}
                  onChange={(e) => handleSettingChange('soundAlerts', e.target.checked)}
                  disabled={!isEditingSettings}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Thông báo email</div>
                  <div className="text-sm text-slate-600">Gửi email cho các cảnh báo nghiêm trọng</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertSettings.emailAlerts}
                  onChange={(e) => handleSettingChange('emailAlerts', e.target.checked)}
                  disabled={!isEditingSettings}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Thông báo SMS</div>
                  <div className="text-sm text-slate-600">Gửi SMS khẩn cấp</div>
                </div>
                <input 
                  type="checkbox" 
                  checked={alertSettings.smsAlerts}
                  onChange={(e) => handleSettingChange('smsAlerts', e.target.checked)}
                  disabled={!isEditingSettings}
                  className="rounded"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Alerts;