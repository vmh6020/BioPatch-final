import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Activity, Thermometer, Zap, AlertCircle, RefreshCw } from 'lucide-react';
import { mockEMGData, mockTemperatureData, mockActivityData } from '../mock';
import InteractiveChart from '../components/InteractiveChart';

const Insights = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [emgData, setEmgData] = useState(mockEMGData);
  const [temperatureData, setTemperatureData] = useState(mockTemperatureData);
  const [activityData, setActivityData] = useState(mockActivityData);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsightsData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/insights/default-user`);
      if (response.ok) {
        const data = await response.json();
        
        // Update data if available from API, otherwise use mock data
        if (data.emg_data && data.emg_data.length > 0) {
          setEmgData(data.emg_data);
        }
        if (data.temperature_data && data.temperature_data.length > 0) {
          setTemperatureData(data.temperature_data);
        }
        if (data.activity_data && data.activity_data.length > 0) {
          setActivityData(data.activity_data);
        }
        
        setLastUpdated(new Date(data.last_updated));
      }
    } catch (error) {
      console.error('Error fetching insights data:', error);
      // Keep using mock data if API fails
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch data on component mount
    fetchInsightsData();

    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(fetchInsightsData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const SimpleLineChart = ({ data, dataKey, color, peaks = false }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    const minValue = Math.min(...data.map(item => item[dataKey]));
    const range = maxValue - minValue;

    return (
      <div className="w-full h-48 flex items-end space-x-1">
        {data.map((item, index) => {
          const height = ((item[dataKey] - minValue) / range) * 160 + 20;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className={`w-full ${color} rounded-t-sm relative`}
                style={{ height: `${height}px` }}
              >
                {peaks && item.peak && (
                  <AlertCircle className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-3 w-3 text-red-500" />
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1 rotate-45">
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ActivityChart = ({ data }) => {
    return (
      <div className="space-y-4">
        {/* Motion Level */}
        <div>
          <h4 className="text-sm font-medium mb-2">Mức độ hoạt động</h4>
          <SimpleLineChart 
            data={data} 
            dataKey="motionLevel" 
            color="bg-blue-500" 
          />
        </div>

        {/* Therapy Timeline */}
        <div>
          <h4 className="text-sm font-medium mb-2">Thời gian trị liệu</h4>
          <div className="flex space-x-1 h-8">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col">
                <div className={`h-3 ${item.tensActive ? 'bg-red-400' : 'bg-gray-200'} rounded-t`}></div>
                <div className={`h-3 ${item.microcurrentActive ? 'bg-green-400' : 'bg-gray-200'} rounded-b`}></div>
                <div className="text-xs text-slate-500 text-center mt-1">
                  {item.time}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mt-2">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-xs">TENS</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-xs">Microcurrent</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Phân tích dữ liệu</h1>
          <p className="text-slate-600">
            Chi tiết tín hiệu sinh học và liệu pháp 
            <span className="text-xs text-slate-500 ml-2">
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchInsightsData}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </Button>
          <div className="flex space-x-2">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  selectedTimeRange === range 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Tabs defaultValue="emg" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emg">Tín hiệu EMG</TabsTrigger>
          <TabsTrigger value="temperature">Nhiệt độ vùng đau</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động & Trị liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="emg" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <InteractiveChart
              data={emgData}
              dataKey="value"
              color="bg-blue-500"
              peaks={true}
              title="Biểu đồ EMG - Điện cơ đồ"
              icon={Activity}
              unit=" µV"
              analysis="Phát hiện 3 đỉnh căng cơ trong ngày, tập trung vào các khung giờ 04:00, 08:00 và 12:00. Mức EMG ổn định ở các thời điểm còn lại."
              animated={true}
            />
          </div>
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <InteractiveChart
              data={temperatureData}
              dataKey="temperature"
              color="bg-orange-500"
              peaks={true}
              title="Nhiệt độ vùng đau"
              icon={Thermometer}
              unit="°C"
              analysis="Nhiệt độ đạt đỉnh vào 08:00 (37.6°C) cho thấy viêm cao. Xu hướng giảm dần về cuối ngày là dấu hiệu tích cực."
              animated={true}
            />
          
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle>Mức độ viêm theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-1">
                  {mockTemperatureData.map((item, index) => {
                    const colorMap = {
                      low: 'bg-green-200 hover:bg-green-300',
                      medium: 'bg-yellow-200 hover:bg-yellow-300', 
                      high: 'bg-red-200 hover:bg-red-300'
                    };
                    return (
                      <div key={index} className="flex-1 text-center group cursor-pointer">
                        <div className={`h-8 ${colorMap[item.inflammation]} rounded mb-1 transition-all duration-300 transform group-hover:scale-105`}></div>
                        <div className="text-xs group-hover:font-medium transition-all">{item.time}</div>
                        <div className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.temperature}°C
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-center space-x-6 text-xs">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-200 rounded shadow-sm"></div>
                    <span>Viêm nhẹ</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded shadow-sm"></div>
                    <span>Viêm trung bình</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-200 rounded shadow-sm"></div>
                    <span>Viêm cao</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-purple-600" />
                <span>Hoạt động & Dòng điện trị liệu</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityChart data={activityData} />
              <div className="bg-purple-50 p-3 rounded-lg mt-4">
                <p className="text-sm text-purple-800">
                  <strong>Phân tích:</strong> AI tự động kích hoạt liệu pháp dựa trên mức độ hoạt động. 
                  TENS được sử dụng khi hoạt động cao (giảm đau), Microcurrent khi nghỉ ngơi (phục hồi).
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Insights;