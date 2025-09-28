import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Clock, Zap, Activity, BarChart3, RefreshCw } from 'lucide-react';
import { mockTherapyReport } from '../mock';

const TherapyReport = () => {
  const [reportData, setReportData] = useState(mockTherapyReport);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const tensPercentage = (reportData.tensMinutes / reportData.totalTherapyMinutes) * 100;
  const microcurrentPercentage = (reportData.microcurrentMinutes / reportData.totalTherapyMinutes) * 100;

  const fetchTherapyReport = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/analytics/default-user');
      if (response.ok) {
        const data = await response.json();
        
        // Calculate therapy statistics from sessions
        let totalTherapyMinutes = 0;
        let tensMinutes = 0;
        let microcurrentMinutes = 0;
        let totalEffectiveness = 0;
        let sessionCount = 0;

        if (data.recent_sessions) {
          data.recent_sessions.forEach(session => {
            if (session.duration) {
              totalTherapyMinutes += session.duration;
              if (session.session_type === 'TENS') {
                tensMinutes += session.duration;
              } else if (session.session_type === 'Microcurrent') {
                microcurrentMinutes += session.duration;
              }
              
              if (session.effectiveness) {
                totalEffectiveness += session.effectiveness;
                sessionCount++;
              }
            }
          });
        }

        // Update report data with real values if available
        if (totalTherapyMinutes > 0) {
          setReportData({
            ...reportData,
            totalTherapyMinutes,
            tensMinutes,
            microcurrentMinutes,
            averageEffectiveness: sessionCount > 0 ? Math.round(totalEffectiveness / sessionCount) : reportData.averageEffectiveness,
            lastUpdated: data.last_updated
          });
        }
        
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Error fetching therapy report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTherapyReport();
    
    // Set up polling for updates every 2 minutes
    const interval = setInterval(fetchTherapyReport, 120000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Báo cáo liệu pháp</h1>
          <p className="text-slate-600">
            Tổng hợp thời gian và thông số trị liệu hôm nay
            <span className="text-xs text-slate-500 ml-2">
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchTherapyReport}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Cập nhật</span>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng thời gian</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.totalTherapyMinutes} phút</div>
            <p className="text-xs text-slate-600">Trong ngày hôm nay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TENS</CardTitle>
            <Activity className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.tensMinutes} phút</div>
            <p className="text-xs text-slate-600">{tensPercentage.toFixed(1)}% tổng thời gian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Microcurrent</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.microcurrentMinutes} phút</div>
            <p className="text-xs text-slate-600">{microcurrentPercentage.toFixed(1)}% tổng thời gian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hiệu quả</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reportData.averageEffectiveness || 92}%</div>
            <Badge variant="secondary" className="text-xs">
              {(reportData.averageEffectiveness || 92) >= 85 ? 'Rất tốt' : 
               (reportData.averageEffectiveness || 92) >= 70 ? 'Tốt' : 'Cần cải thiện'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Therapy Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Phân bố thời gian liệu pháp</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 text-red-600 mr-2" />
                  TENS (Giảm đau)
                </span>
                <span className="text-sm text-slate-600">{reportData.tensMinutes} phút</span>
              </div>
              <Progress value={tensPercentage} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium flex items-center">
                  <Zap className="h-4 w-4 text-green-600 mr-2" />
                  Microcurrent (Phục hồi)
                </span>
                <span className="text-sm text-slate-600">{reportData.microcurrentMinutes} phút</span>
              </div>
              <Progress value={microcurrentPercentage} className="h-3" />
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Phân tích thời gian</h4>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>• TENS chiếm {tensPercentage.toFixed(1)}% - chủ yếu vào giờ cao điểm đau</li>
                <li>• Microcurrent chiếm {microcurrentPercentage.toFixed(1)}% - tập trung vào phục hồi</li>
                <li>• Tỷ lệ phù hợp với giai đoạn điều trị</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông số trung bình</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">{reportData.averageFrequency || mockTherapyReport.averageFrequency}</div>
                <div className="text-sm text-blue-600">Hz</div>
                <div className="text-xs text-slate-600 mt-1">Tần số trung bình</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-700">{reportData.averageIntensity || mockTherapyReport.averageIntensity}</div>
                <div className="text-sm text-orange-600">%</div>
                <div className="text-xs text-slate-600 mt-1">Cường độ trung bình</div>
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{reportData.averagePulseWidth || mockTherapyReport.averagePulseWidth}</div>
              <div className="text-sm text-green-600">µs</div>
              <div className="text-xs text-slate-600 mt-1">Độ rộng xung trung bình</div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Nhận xét thông số</h4>
              <ul className="text-sm space-y-1 text-slate-600">
                <li>• Tần số 85Hz phù hợp với giảm đau</li>
                <li>• Cường độ 65% ở mức an toàn</li>
                <li>• Độ rộng xung tối ưu cho kích thích cơ</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Dòng thời gian trị liệu hôm nay</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="space-y-4 max-h-96 overflow-y-auto pr-2"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9'
            }}
          >
            <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="font-medium">08:00 - 08:20</div>
                <div className="text-sm text-slate-600">TENS 20 phút - Cường độ 70% - Tần số 100Hz</div>
                <div className="text-xs text-slate-500 mt-1">Hiệu quả: 85% - Giảm đau tốt</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg transition-all duration-200 hover:shadow-md">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="font-medium">10:30 - 11:00</div>
                <div className="text-sm text-slate-600">Microcurrent 30 phút - Cường độ 45% - Tần số 80Hz</div>
                <div className="text-xs text-slate-500 mt-1">Hiệu quả: 78% - Phục hồi ổn định</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="font-medium">14:15 - 14:40</div>
                <div className="text-sm text-slate-600">TENS 25 phút - Cường độ 65% - Tần số 90Hz</div>
                <div className="text-xs text-slate-500 mt-1">Hiệu quả: 88% - Rất hiệu quả</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg transition-all duration-200 hover:shadow-md">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="font-medium">16:00 - 17:15</div>
                <div className="text-sm text-slate-600">Microcurrent 75 phút - Cường độ 50% - Tần số 75Hz</div>
                <div className="text-xs text-slate-500 mt-1">Hiệu quả: 82% - Phục hồi tốt</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg transition-all duration-200 hover:shadow-md">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="font-medium">19:30 - 20:00</div>
                <div className="text-sm text-slate-600">TENS 30 phút - Cường độ 60% - Tần số 85Hz</div>
                <div className="text-xs text-slate-500 mt-1">Hiệu quả: 90% - Xuất sắc</div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Hoàn thành</Badge>
            </div>

            <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg transition-all duration-200 hover:shadow-md border-2 border-blue-200 border-dashed">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="flex-1">
                <div className="font-medium text-blue-700">21:00 - Dự kiến</div>
                <div className="text-sm text-blue-600">Microcurrent 45 phút - Phiên phục hồi tối</div>
                <div className="text-xs text-blue-500 mt-1">Được khuyến nghị bởi AI</div>
              </div>
              <Badge variant="outline" className="border-blue-300 text-blue-700">Đang chờ</Badge>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="flex justify-center mt-4">
            <div className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              Cuộn để xem thêm ↕
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TherapyReport;