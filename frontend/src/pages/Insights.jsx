import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Activity, Thermometer, Zap, AlertCircle } from 'lucide-react';
import { mockEMGData, mockTemperatureData, mockActivityData } from '../mock';
import InteractiveChart from '../components/InteractiveChart';

const Insights = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');

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
          <p className="text-slate-600">Chi tiết tín hiệu sinh học và liệu pháp</p>
        </div>
        <div className="flex space-x-2">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded text-sm ${
                selectedTimeRange === range 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="emg" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="emg">Tín hiệu EMG</TabsTrigger>
          <TabsTrigger value="temperature">Nhiệt độ vùng đau</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động & Trị liệu</TabsTrigger>
        </TabsList>

        <TabsContent value="emg" className="space-y-4">
          <InteractiveChart
            data={mockEMGData}
            dataKey="value"
            color="bg-blue-500"
            peaks={true}
            title="Biểu đồ EMG - Điện cơ đồ"
            icon={Activity}
            unit=" µV"
            analysis="Phát hiện 3 đỉnh căng cơ trong ngày, tập trung vào các khung giờ 04:00, 08:00 và 12:00. Mức EMG ổn định ở các thời điểm còn lại."
          />
        </TabsContent>

        <TabsContent value="temperature" className="space-y-4">
          <InteractiveChart
            data={mockTemperatureData}
            dataKey="temperature"
            color="bg-orange-500"
            title="Nhiệt độ vùng đau"
            icon={Thermometer}
            unit="°C"
            analysis="Nhiệt độ đạt đỉnh vào 08:00 (37.6°C) cho thấy viêm cao. Xu hướng giảm dần về cuối ngày là dấu hiệu tích cực."
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
              <ActivityChart data={mockActivityData} />
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