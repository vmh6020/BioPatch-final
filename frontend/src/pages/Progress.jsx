import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { TrendingUp, TrendingDown, Calendar, BarChart3, RefreshCw, User } from 'lucide-react';
import { mockProgressData } from '../mock';

const Progress = () => {
  const [progressData, setProgressData] = useState(mockProgressData);
  const [currentPainLevel, setCurrentPainLevel] = useState(4);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const fetchProgressData = async () => {
    setIsLoading(true);
    try {
      // Fetch profile data to get current pain level
      const profileResponse = await fetch('/api/profile/default-user');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setCurrentPainLevel(profileData.pain_level || 4);
        
        // Update the latest week with current pain level
        const updatedWeeklyTrend = [...progressData.weeklyTrend];
        if (updatedWeeklyTrend.length > 0) {
          updatedWeeklyTrend[updatedWeeklyTrend.length - 1].painLevel = profileData.pain_level || 4;
        }
        
        setProgressData({
          ...progressData,
          weeklyTrend: updatedWeeklyTrend
        });
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgressData();
  }, []);
  const SimpleBarChart = ({ data, dataKey, color, label }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-700">{label}</h4>
        <div className="flex items-end space-x-2 h-32 bg-slate-50 rounded-lg p-3">
          {data.map((item, index) => {
            const height = (item[dataKey] / maxValue) * 80;
            const isImprovement = index > 0 && item[dataKey] > data[index - 1][dataKey];
            return (
              <div key={index} className="flex-1 flex flex-col items-center group cursor-pointer">
                <div 
                  className={`w-full ${color} rounded-t transition-all duration-300 transform group-hover:scale-105 shadow-sm`}
                  style={{ 
                    height: `${height + 10}px`,
                    background: isImprovement 
                      ? `linear-gradient(to top, ${color.replace('bg-', '#')}, #10b981)`
                      : `linear-gradient(to top, ${color.replace('bg-', '#')}, ${color.replace('bg-', '#').replace('500', '300')})`
                  }}
                >
                  {isImprovement && (
                    <div className="w-full h-1 bg-green-400 rounded-t animate-pulse"></div>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-1 text-center transition-all group-hover:text-slate-700 group-hover:font-medium">
                  {item.week}
                </div>
                <div className="text-xs font-medium text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item[dataKey]}
                  {isImprovement && <span className="text-green-600 ml-1">↗</span>}
                </div>
              </div>
            );
          })}
        </div>
        {/* Color Legend */}
        <div className="flex items-center justify-center space-x-4 text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <div className={`w-3 h-3 ${color} rounded`}></div>
            <span>Bình thường</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Cải thiện</span>
          </div>
        </div>
      </div>
    );
  };

  const ComparisonChart = ({ data }) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Đau chủ quan (tự báo cáo)</span>
          </span>
          <span className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Đau khách quan (cảm biến)</span>
          </span>
        </div>
        <div className="flex items-end space-x-2 h-32">
          {data.map((item, index) => {
            return (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                <div className="flex space-x-1 items-end h-24">
                  <div 
                    className="w-3 bg-blue-500 rounded-t"
                    style={{ height: `${(item.subjective / 10) * 100}%` }}
                  ></div>
                  <div 
                    className="w-3 bg-red-500 rounded-t"
                    style={{ height: `${(item.objective / 10) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-slate-500 text-center">{item.date}</div>
                <div className="text-xs text-center">
                  <div className="text-blue-600">{item.subjective}</div>
                  <div className="text-red-600">{item.objective}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const latestWeek = progressData.weeklyTrend[progressData.weeklyTrend.length - 1];
  const previousWeek = progressData.weeklyTrend[progressData.weeklyTrend.length - 2];
  
  const recoveryTrend = latestWeek.recoveryIndex - previousWeek.recoveryIndex;
  const painTrend = previousWeek.painLevel - latestWeek.painLevel; // Inverted because lower pain is better

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Lịch sử & tiến triển</h1>
          <p className="text-slate-600">
            Theo dõi xu hướng phục hồi theo thời gian
            <span className="text-xs text-slate-500 ml-2">
              Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
            </span>
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchProgressData}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Cập nhật</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.href = '/profile'}
            className="flex items-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span>Cập nhật hồ sơ</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Điểm phục hồi hiện tại</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latestWeek.recoveryIndex}</div>
            <div className="flex items-center space-x-1 text-xs">
              {recoveryTrend > 0 ? (
                <TrendingUp className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500" />
              )}
              <span className={recoveryTrend > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(recoveryTrend)} điểm so với tuần trước
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mức đau hiện tại</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentPainLevel}/10</div>
            <div className="flex items-center space-x-1 text-xs">
              {painTrend > 0 ? (
                <TrendingDown className="h-3 w-3 text-green-500" />
              ) : (
                <TrendingUp className="h-3 w-3 text-red-500" />
              )}
              <span className={painTrend > 0 ? 'text-green-600' : 'text-red-600'}>
                {painTrend > 0 ? 'Giảm' : 'Tăng'} {Math.abs(painTrend)} điểm
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Xu hướng tổng thể</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Tích cực</div>
            <Badge variant="secondary" className="text-xs">
              Cải thiện liên tục
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số ngày điều trị</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-slate-600">Tuần thứ 4</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trends">Xu hướng theo tuần</TabsTrigger>
          <TabsTrigger value="comparison">So sánh đau chủ quan vs khách quan</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recovery Index theo thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={progressData.weeklyTrend}
                  dataKey="recoveryIndex"
                  color="bg-blue-500"
                  label="Điểm phục hồi"
                />
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Phân tích:</strong> Recovery Index tăng đều từ 65 lên 82 điểm, 
                    cho thấy xu hướng phục hồi tích cực và liên tục.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Mức độ đau theo thời gian</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart 
                  data={progressData.weeklyTrend}
                  dataKey="painLevel"
                  color="bg-red-500"
                  label="Mức đau (0-10)"
                />
                <div className="mt-4 p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-red-800">
                    <strong>Phân tích:</strong> Mức đau giảm từ 7 xuống 4 điểm, 
                    giảm 43% so với tuần đầu điều trị.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Tóm tắt tiến triển từng tuần</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progressData.weeklyTrend.map((week, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium">{week.week}</div>
                      <div className="text-sm text-slate-600">
                        Recovery: {week.recoveryIndex} | Đau: {week.painLevel}/10
                      </div>
                    </div>
                    <div className="text-right">
                      {index > 0 && (
                        <div className="text-sm">
                          {progressData.weeklyTrend[index].recoveryIndex > 
                           progressData.weeklyTrend[index-1].recoveryIndex ? (
                            <Badge className="bg-green-100 text-green-800">Cải thiện</Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800">Ổn định</Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>So sánh đau chủ quan vs khách quan</CardTitle>
              <p className="text-sm text-slate-600">
                So sánh giữa mức đau tự báo cáo và dữ liệu từ cảm biến
              </p>
            </CardHeader>
            <CardContent>
              <ComparisonChart data={progressData.painComparison} />
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Đau chủ quan (Tự báo cáo)</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Dựa trên cảm nhận của bạn</li>
                    <li>• Thang đo VAS 0-10</li>
                    <li>• Phản ánh trải nghiệm tổng thể</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Đau khách quan (Cảm biến)</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    <li>• Dựa trên dữ liệu EMG, nhiệt độ</li>
                    <li>• Tính toán bằng AI</li>
                    <li>• Phản ánh tình trạng sinh lý</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium mb-2">Đánh giá độ tin cậy</h4>
                <p className="text-sm text-slate-700">
                  Sự tương quan tốt giữa đau chủ quan và khách quan (r = 0.89) cho thấy 
                  việc báo cáo của bạn rất đáng tin cậy. Cảm biến xác nhận xu hướng cải thiện.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Progress;