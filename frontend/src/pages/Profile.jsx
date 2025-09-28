import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, MapPin, Activity, Clock, Save } from 'lucide-react';
import { mockUserProfile } from '../mock';

const Profile = () => {
  const [profile, setProfile] = useState(mockUserProfile);
  const [painLevel, setPainLevel] = useState([profile.painLevel]);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setProfile({ ...profile, painLevel: painLevel[0] });
    setIsEditing(false);
    console.log('Profile saved:', profile);
  };

  const therapyProfiles = [
    "Đau cổ do stress",
    "Đau lưng mãn tính", 
    "Đau vai do tư thế",
    "Đau cơ sau tập luyện",
    "Viêm khớp",
    "Tùy chỉnh"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hồ sơ người dùng</h1>
          <p className="text-slate-600">Quản lý thông tin cá nhân và cài đặt liệu pháp</p>
        </div>
        <Button 
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "default"}
        >
          {isEditing ? "Hủy" : "Chỉnh sửa"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="therapy">Cài đặt liệu pháp</TabsTrigger>
          <TabsTrigger value="history">Lịch sử điều trị</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Thông tin cơ bản</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  {isEditing ? (
                    <Input 
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                    />
                  ) : (
                    <div className="text-lg font-medium">{profile.fullName}</div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Tuổi</Label>
                    {isEditing ? (
                      <Input 
                        id="age"
                        type="number"
                        value={profile.age}
                        onChange={(e) => setProfile({...profile, age: parseInt(e.target.value)})}
                      />
                    ) : (
                      <div className="text-lg font-medium">{profile.age} tuổi</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Giới tính</Label>
                    {isEditing ? (
                      <Select 
                        value={profile.gender}
                        onValueChange={(value) => setProfile({...profile, gender: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="text-lg font-medium">{profile.gender}</div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Chiều cao (cm)</Label>
                    {isEditing ? (
                      <Input 
                        id="height"
                        type="number"
                        value={profile.height}
                        onChange={(e) => setProfile({...profile, height: parseInt(e.target.value)})}
                      />
                    ) : (
                      <div className="text-lg font-medium">{profile.height} cm</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Cân nặng (kg)</Label>
                    {isEditing ? (
                      <Input 
                        id="weight"
                        type="number"
                        value={profile.weight}
                        onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value)})}
                      />
                    ) : (
                      <div className="text-lg font-medium">{profile.weight} kg</div>
                    )}
                  </div>
                </div>

                {/* BMI Calculation */}
                {profile.height && profile.weight && (
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-700 mb-1">Chỉ số BMI</div>
                    <div className="text-lg font-bold text-blue-900">
                      {(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}
                    </div>
                    <div className="text-xs text-blue-600">
                      {(() => {
                        const bmi = profile.weight / Math.pow(profile.height / 100, 2);
                        if (bmi < 18.5) return 'Thiếu cân';
                        if (bmi < 25) return 'Bình thường';
                        if (bmi < 30) return 'Thừa cân';
                        return 'Béo phì';
                      })()}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Tình trạng sức khỏe</Label>
                  {isEditing ? (
                    <Textarea 
                      value={profile.conditions.join(', ')}
                      onChange={(e) => setProfile({
                        ...profile, 
                        conditions: e.target.value.split(', ')
                      })}
                      placeholder="Nhập các tình trạng sức khỏe, ngăn cách bởi dấu phẩy"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.conditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">
                          {condition}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <Button onClick={handleSave} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Lưu thông tin
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-red-600" />
                  <span>Vị trí và mức độ đau</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Vị trí đau</Label>
                  {isEditing ? (
                    <Input 
                      value={profile.painLocation}
                      onChange={(e) => setProfile({...profile, painLocation: e.target.value})}
                      placeholder="Mô tả vị trí đau"
                    />
                  ) : (
                    <div className="text-lg font-medium">{profile.painLocation}</div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>Mức độ đau hiện tại</Label>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-900 mb-2">
                      {isEditing ? painLevel[0] : profile.painLevel}
                    </div>
                    {isEditing ? (
                      <div className="space-y-3">
                        <Slider
                          value={painLevel}
                          onValueChange={setPainLevel}
                          max={10}
                          step={1}
                          className="w-full"
                        />
                        {/* Real-time progress bar */}
                        <div className="w-full bg-slate-200 h-3 rounded">
                          <div 
                            className="bg-red-500 h-3 rounded transition-all duration-300"
                            style={{ width: `${(painLevel[0] / 10) * 100}%` }}
                          />
                        </div>
                        {/* Progress indicator */}
                        <div className="text-sm text-slate-600">
                          Tiến triển: {painLevel[0] !== profile.painLevel && (
                            <span className={`font-medium ${painLevel[0] < profile.painLevel ? 'text-green-600' : 'text-red-600'}`}>
                              {painLevel[0] < profile.painLevel ? '↓' : '↑'} 
                              {Math.abs(painLevel[0] - profile.painLevel)} điểm
                            </span>
                          )}
                          {painLevel[0] === profile.painLevel && (
                            <span className="text-slate-500">Không thay đổi</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full bg-slate-200 h-3 rounded">
                        <div 
                          className="bg-red-500 h-3 rounded transition-all duration-300"
                          style={{ width: `${(profile.painLevel / 10) * 100}%` }}
                        />
                      </div>
                    )}
                    
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Không đau</span>
                      <span>Đau không chịu được</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="therapy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span>Hồ sơ liệu pháp</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Loại hồ sơ liệu pháp</Label>
                {isEditing ? (
                  <Select 
                    value={profile.therapyProfile}
                    onValueChange={(value) => setProfile({...profile, therapyProfile: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {therapyProfiles.map((therapyType) => (
                        <SelectItem key={therapyType} value={therapyType}>
                          {therapyType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="text-lg font-medium">{profile.therapyProfile}</div>
                )}
              </div>

              {/* TENS Settings */}
              <Card className="border-red-200">
                <CardHeader className="bg-red-50">
                  <CardTitle className="text-red-900 text-lg">Cài đặt TENS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Tần số (Hz)</Label>
                        <span className="text-sm font-medium text-red-700">
                          {isEditing ? profile.profileSettings?.tens?.frequency || 85 : mockUserProfile.profileSettings.tens.frequency} Hz
                        </span>
                      </div>
                      {isEditing ? (
                        <Slider
                          value={[profile.profileSettings?.tens?.frequency || 85]}
                          onValueChange={([value]) => setProfile({
                            ...profile,
                            profileSettings: {
                              ...profile.profileSettings,
                              tens: { ...profile.profileSettings?.tens, frequency: value }
                            }
                          })}
                          max={150}
                          min={50}
                          step={5}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-red-200 h-2 rounded">
                          <div 
                            className="bg-red-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${(mockUserProfile.profileSettings.tens.frequency / 150) * 100}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>50 Hz</span>
                        <span>150 Hz</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Cường độ (%)</Label>
                        <span className="text-sm font-medium text-red-700">
                          {isEditing ? profile.profileSettings?.tens?.intensity || 65 : mockUserProfile.profileSettings.tens.intensity}%
                        </span>
                      </div>
                      {isEditing ? (
                        <Slider
                          value={[profile.profileSettings?.tens?.intensity || 65]}
                          onValueChange={([value]) => setProfile({
                            ...profile,
                            profileSettings: {
                              ...profile.profileSettings,
                              tens: { ...profile.profileSettings?.tens, intensity: value }
                            }
                          })}
                          max={100}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-red-200 h-2 rounded">
                          <div 
                            className="bg-red-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${mockUserProfile.profileSettings.tens.intensity}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>10%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Độ rộng xung (µs)</Label>
                        <span className="text-sm font-medium text-red-700">
                          {isEditing ? profile.profileSettings?.tens?.pulseWidth || 250 : mockUserProfile.profileSettings.tens.pulseWidth} µs
                        </span>
                      </div>
                      {isEditing ? (
                        <Slider
                          value={[profile.profileSettings?.tens?.pulseWidth || 250]}
                          onValueChange={([value]) => setProfile({
                            ...profile,
                            profileSettings: {
                              ...profile.profileSettings,
                              tens: { ...profile.profileSettings?.tens, pulseWidth: value }
                            }
                          })}
                          max={500}
                          min={100}
                          step={25}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-red-200 h-2 rounded">
                          <div 
                            className="bg-red-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${(mockUserProfile.profileSettings.tens.pulseWidth / 500) * 100}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>100 µs</span>
                        <span>500 µs</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Thời gian (phút)</Label>
                        <span className="text-sm font-medium text-red-700">
                          {isEditing ? profile.profileSettings?.tens?.duration || 25 : mockUserProfile.profileSettings.tens.duration} phút
                        </span>
                      </div>
                      {isEditing ? (
                        <Slider
                          value={[profile.profileSettings?.tens?.duration || 25]}
                          onValueChange={([value]) => setProfile({
                            ...profile,
                            profileSettings: {
                              ...profile.profileSettings,
                              tens: { ...profile.profileSettings?.tens, duration: value }
                            }
                          })}
                          max={60}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-red-200 h-2 rounded">
                          <div 
                            className="bg-red-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${(mockUserProfile.profileSettings.tens.duration / 60) * 100}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>10 phút</span>
                        <span>60 phút</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Microcurrent Settings */}
              <Card className="border-green-200">
                <CardHeader className="bg-green-50">
                  <CardTitle className="text-green-900 text-lg">Cài đặt Microcurrent</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Tần số (Hz)</Label>
                        <span className="text-sm font-medium text-green-700">
                          {isEditing ? profile.profileSettings?.microcurrent?.frequency || 0.5 : mockUserProfile.profileSettings.microcurrent.frequency} Hz
                        </span>
                      </div>
                      {isEditing ? (
                        <Slider
                          value={[profile.profileSettings?.microcurrent?.frequency || 0.5]}
                          onValueChange={([value]) => setProfile({
                            ...profile,
                            profileSettings: {
                              ...profile.profileSettings,
                              microcurrent: { ...profile.profileSettings?.microcurrent, frequency: value }
                            }
                          })}
                          max={100}
                          min={0.1}
                          step={0.1}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-green-200 h-2 rounded">
                          <div 
                            className="bg-green-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${(mockUserProfile.profileSettings.microcurrent.frequency / 100) * 100}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>0.1 Hz</span>
                        <span>100 Hz</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Cường độ (µA)</Label>
                        <span className="text-sm font-medium text-green-700">
                          {isEditing ? profile.profileSettings?.microcurrent?.intensity || 500 : mockUserProfile.profileSettings.microcurrent.intensity} µA
                        </span>
                      </div>
                      {isEditing ? (
                        <Slider
                          value={[profile.profileSettings?.microcurrent?.intensity || 500]}
                          onValueChange={([value]) => setProfile({
                            ...profile,
                            profileSettings: {
                              ...profile.profileSettings,
                              microcurrent: { ...profile.profileSettings?.microcurrent, intensity: value }
                            }
                          })}
                          max={1000}
                          min={100}
                          step={50}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-green-200 h-2 rounded">
                          <div 
                            className="bg-green-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${(mockUserProfile.profileSettings.microcurrent.intensity / 1000) * 100}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>100 µA</span>
                        <span>1000 µA</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label>Thời gian (phút)</Label>
                        <span className="text-sm font-medium text-green-700">
                          {isEditing ? profile.profileSettings?.microcurrent?.duration || 60 : mockUserProfile.profileSettings.microcurrent.duration} phút
                        </span>
                      </div>
                      {isEditing ? (
                        <Slider
                          value={[profile.profileSettings?.microcurrent?.duration || 60]}
                          onValueChange={([value]) => setProfile({
                            ...profile,
                            profileSettings: {
                              ...profile.profileSettings,
                              microcurrent: { ...profile.profileSettings?.microcurrent, duration: value }
                            }
                          })}
                          max={120}
                          min={30}
                          step={10}
                          className="w-full"
                        />
                      ) : (
                        <div className="w-full bg-green-200 h-2 rounded">
                          <div 
                            className="bg-green-500 h-2 rounded transition-all duration-500"
                            style={{ width: `${(mockUserProfile.profileSettings.microcurrent.duration / 120) * 100}%` }}
                          />
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-slate-500 mt-1">
                        <span>30 phút</span>
                        <span>120 phút</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Mô tả hồ sơ liệu pháp</h4>
                <p className="text-sm text-blue-800">
                  <strong>{profile.therapyProfile}:</strong> Liệu pháp kết hợp TENS và microcurrent 
                  được thiết kế đặc biệt cho tình trạng căng thẳng cơ cổ. TENS sử dụng để giảm đau nhanh 
                  trong các giai đoạn cấp tính, microcurrent giúp phục hồi và giảm viêm lâu dài.
                </p>
              </div>

              {isEditing && (
                <Button onClick={handleSave} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt liệu pháp
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <span>Lịch sử điều trị</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-2xl font-bold text-blue-700">28</div>
                    <div className="text-sm text-blue-600">Ngày điều trị</div>
                    <div className="text-xs text-blue-500 mt-1">
                      Cập nhật: {new Date().toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="text-2xl font-bold text-green-700">180</div>
                    <div className="text-sm text-green-600">Giờ liệu pháp</div>
                    <div className="text-xs text-green-500 mt-1">
                      Hôm nay: 3.5 giờ
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="text-2xl font-bold text-purple-700">43%</div>
                    <div className="text-sm text-purple-600">Cải thiện đau</div>
                    <div className="text-xs text-purple-500 mt-1">
                      So với tuần trước
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Mốc thời gian quan trọng</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Tuần 1: Bắt đầu điều trị</div>
                        <div className="text-sm text-slate-600">
                          Mức đau ban đầu: 7/10 - Thiết lập hồ sơ liệu pháp
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">4 tuần trước</span>
                    </div>

                    <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Tuần 2: Điều chỉnh thông số</div>
                        <div className="text-sm text-slate-600">
                          Tăng thời gian microcurrent, giảm mức đau xuống 6/10
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">3 tuần trước</span>
                    </div>

                    <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Tuần 3: Cải thiện rõ rệt</div>
                        <div className="text-sm text-slate-600">
                          Recovery Score tăng lên 78, mức đau giảm còn 5/10
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">2 tuần trước</span>
                    </div>

                    <div className="flex items-center space-x-4 p-3 bg-purple-50 rounded-lg">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium">Tuần 4: Ổn định tiến triển</div>
                        <div className="text-sm text-slate-600">
                          Recovery Score 82, mức đau ổn định ở 4/10
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">1 tuần trước</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;