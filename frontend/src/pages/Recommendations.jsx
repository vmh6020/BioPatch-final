import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Lightbulb, Heart, Dumbbell, Clock, ExternalLink, CheckCircle2, Play, BookOpen, Link, X } from 'lucide-react';
import { mockRecommendations } from '../mock';
import ExerciseModal from '../components/ExerciseModal';

const Recommendations = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completedRecommendations, setCompletedRecommendations] = useState([]);
  const [guideContent, setGuideContent] = useState(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);

  // Enhanced mock recommendations with interactive content
  const enhancedRecommendations = [
    {
      id: 1,
      type: "therapy",
      title: "Tăng liệu pháp microcurrent",
      description: "Tăng thời gian microcurrent thêm 5 phút vào buổi sáng để cải thiện khả năng phục hồi",
      priority: "high",
      actionType: "therapy_setting",
      actionText: "Cập nhật cài đặt"
    },
    {
      id: 2,
      type: "lifestyle",
      title: "Giãn cơ nhẹ buổi sáng",
      description: "Thực hiện bài tập giãn cơ cổ và vai trong 10 phút mỗi sáng",
      priority: "medium",
      actionType: "article",
      actionText: "Xem hướng dẫn",
      content: {
        title: "5 bài tập giãn cơ cổ vai hiệu quả",
        description: "Hướng dẫn chi tiết các bài tập giãn cơ giúp giảm căng thẳng và cải thiện độ linh hoạt",
        tips: [
          "Thực hiện vào buổi sáng sau khi thức dậy",
          "Mỗi động tác giữ 15-30 giây",
          "Thở đều và thư giãn trong lúc tập",
          "Không thực hiện khi cảm thấy đau"
        ]
      }
    },
    {
      id: 3,
      type: "exercise",
      title: "Bài tập vật lý trị liệu cổ vai",
      description: "Thực hiện 3 bài tập cải thiện độ linh hoạt cổ vai",
      priority: "medium",
      actionType: "exercise",
      actionText: "Xem video hướng dẫn",
      videoUrl: "#",
      exercise: {
        title: "Bài tập giãn cơ cổ vai cơ bản",
        duration: "10-15 phút",
        target: "Giảm đau cổ vai, tăng độ linh hoạt",
        difficulty: "Dễ",
        description: "Bộ bài tập đơn giản giúp giảm căng thẳng cơ cổ và vai, phù hợp thực hiện hàng ngày.",
        steps: [
          "Ngồi thẳng lưng, vai thư giãn tự nhiên",
          "Từ từ nghiêng đầu về phía bên phải, giữ 15 giây",
          "Quay lại vị trí ban đầu, sau đó nghiêng về bên trái",
          "Xoay cổ nhẹ nhàng theo chiều kim đồng hồ 5 vòng",
          "Xoay cổ ngược chiều kim đồng hồ 5 vòng",
          "Nâng vai lên và hạ xuống 10 lần",
          "Xoay vai về phía trước và sau 5 lần mỗi hướng"
        ]
      }
    },
    {
      id: 4,
      type: "lifestyle",
      title: "Cải thiện tư thế ngồi làm việc",
      description: "Điều chỉnh môi trường làm việc để giảm căng thẳng cổ vai",
      priority: "medium",
      actionType: "guide",
      actionText: "Đọc hướng dẫn",
      content: {
        title: "Thiết lập không gian làm việc ergonomic",
        description: "Hướng dẫn cách bố trí bàn làm việc để giảm thiểu đau nhức cổ vai",
        tips: [
          "Màn hình máy tính ngang tầm mắt",
          "Lưng tựa vào ghế, vai thẳng",
          "Cánh tay tạo góc 90 độ khi đánh máy",
          "Nghỉ giải lao 5 phút mỗi giờ"
        ]
      }
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getPriorityIcon = (type) => {
    switch (type) {
      case 'therapy':
        return <Heart className="h-5 w-5 text-red-600" />;
      case 'lifestyle':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'exercise':
        return <Dumbbell className="h-5 w-5 text-green-600" />;
      default:
        return <Lightbulb className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'therapy':
        return 'Liệu pháp';
      case 'lifestyle':
        return 'Lối sống';
      case 'exercise':
        return 'Bài tập';
      default:
        return 'Tổng quát';
    }
  };

  const handleActionClick = (recommendation) => {
    switch (recommendation.actionType) {
      case 'exercise':
        setSelectedExercise(recommendation.exercise);
        setIsModalOpen(true);
        break;
      case 'article':
      case 'guide':
        // Open content modal in page-in-page style
        setGuideContent(recommendation.content);
        setIsGuideModalOpen(true);
        break;
      case 'therapy_setting':
        // Navigate to therapy settings in Profile page
        window.location.href = '/profile';
        break;
      default:
        if (recommendation.videoUrl) {
          alert('Đang mở video hướng dẫn...');
        }
    }
  };

  const markAsCompleted = (id) => {
    setCompletedRecommendations(prev => [...prev, id]);
  };

  const isCompleted = (id) => completedRecommendations.includes(id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gợi ý & lời khuyên</h1>
        <p className="text-slate-600">Khuyến nghị được cá nhân hóa dựa trên dữ liệu của bạn</p>
      </div>

      {/* AI Insights Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <span>Phân tích AI hôm nay</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-slate-700">
              Dựa trên dữ liệu EMG và nhiệt độ, AI phát hiện cơ cổ của bạn đang có xu hướng cải thiện. 
              Tuy nhiên, vẫn có 3 đỉnh căng cơ cần chú ý.
            </p>
            <div className="flex space-x-2">
              <Badge className="bg-green-100 text-green-800">Phục hồi tốt</Badge>
              <Badge className="bg-yellow-100 text-yellow-800">Cần theo dõi căng cơ</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Khuyến nghị cho bạn</h2>
        
        {enhancedRecommendations.map((rec, index) => (
          <Card 
            key={rec.id} 
            className={`hover:shadow-lg transition-all duration-300 ${
              isCompleted(rec.id) ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getPriorityIcon(rec.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <h3 className={`font-semibold ${
                          isCompleted(rec.id) ? 'text-green-800 line-through' : 'text-slate-900'
                        }`}>
                          {rec.title}
                        </h3>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {rec.priority === 'high' ? 'Ưu tiên cao' : 
                           rec.priority === 'medium' ? 'Ưu tiên trung bình' : 'Ưu tiên thấp'}
                        </Badge>
                        <Badge variant="outline">
                          {getTypeLabel(rec.type)}
                        </Badge>
                        {isCompleted(rec.id) && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Hoàn thành
                          </Badge>
                        )}
                      </div>
                      <p className={`${
                        isCompleted(rec.id) ? 'text-green-600' : 'text-slate-600'
                      }`}>
                        {rec.description}
                      </p>
                      
                      {/* Interactive Action Buttons */}
                      {!isCompleted(rec.id) && (
                        <div className="flex space-x-3">
                          <Button 
                            onClick={() => handleActionClick(rec)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
                            size="sm"
                          >
                            {rec.actionType === 'exercise' && <Play className="h-4 w-4 mr-1" />}
                            {rec.actionType === 'article' && <BookOpen className="h-4 w-4 mr-1" />}
                            {rec.actionType === 'guide' && <BookOpen className="h-4 w-4 mr-1" />}
                            {rec.actionType === 'therapy_setting' && <Heart className="h-4 w-4 mr-1" />}
                            {rec.actionText}
                          </Button>
                          
                          {rec.videoUrl && (
                            <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                              <Play className="h-4 w-4 mr-1" />
                              Video hướng dẫn
                            </Button>
                          )}
                          
                          {rec.content && (
                            <Button variant="ghost" size="sm" className="text-blue-600">
                              <Link className="h-4 w-4 mr-1" />
                              Chi tiết
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {/* Mark as Completed Button */}
                    <div className="flex space-x-2">
                      {!isCompleted(rec.id) && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => markAsCompleted(rec.id)}
                          className="hover:bg-green-50 hover:border-green-300"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Hoàn thành
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Exercise Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dumbbell className="h-5 w-5 text-green-600" />
            <span>Chương trình bài tập phục hồi</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Bài tập giãn cơ cổ</h4>
              <p className="text-sm text-slate-600 mb-3">
                5 động tác giãn cơ cổ và vai, mỗi động tác giữ 15 giây
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Thời gian: 10 phút</span>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Tăng cường cơ sâu</h4>
              <p className="text-sm text-slate-600 mb-3">
                Bài tập tăng cường cơ sâu cổ để cải thiện tư thế
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Thời gian: 15 phút</span>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Yoga trị liệu</h4>
              <p className="text-sm text-slate-600 mb-3">
                Chuỗi động tác yoga nhẹ nhàng cho vùng cổ vai
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Thời gian: 20 phút</span>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </Button>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Massage tự thực hiện</h4>
              <p className="text-sm text-slate-600 mb-3">
                Kỹ thuật massage điểm kích hoạt để giảm căng cơ
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-500">Thời gian: 8 phút</span>
                <Button size="sm" variant="outline">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lifestyle Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Lời khuyên lối sống</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Tư thế làm việc</h4>
              <p className="text-sm text-blue-800">
                Điều chỉnh màn hình máy tính ngang tầm mắt và nghỉ 5 phút mỗi 30 phút
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Giấc ngủ</h4>
              <p className="text-sm text-green-800">
                Sử dụng gối hỗ trợ cổ và duy trì tư thế ngủ nghiêng hoặc ngửa
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">Quản lý stress</h4>
              <p className="text-sm text-purple-800">
                Thực hành hít thở sâu 5 phút mỗi ngày để giảm căng thẳng cơ
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Modal */}
      <ExerciseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        exercise={selectedExercise}
      />

      {/* Guide Content Modal - Page in Page Style */}
      <Dialog open={isGuideModalOpen} onOpenChange={setIsGuideModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-slate-900">
                {guideContent?.title}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsGuideModalOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          
          <div className="overflow-y-auto max-h-[70vh] pr-4">
            {guideContent && (
              <div className="space-y-6">
                {/* Description */}
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <p className="text-blue-800">{guideContent.description}</p>
                </div>

                {/* Tips Section */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Hướng dẫn chi tiết
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {guideContent.tips?.map((tip, index) => (
                      <div 
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Guide Placeholder */}
                <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border-2 border-dashed border-slate-300">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-slate-700 mb-2">
                      Hình ảnh minh họa
                    </h4>
                    <p className="text-slate-600 text-sm">
                      Các hình ảnh và video hướng dẫn sẽ được hiển thị tại đây
                    </p>
                  </div>
                </div>

                {/* Additional Resources */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-3">Tài liệu tham khảo</h4>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Video hướng dẫn chi tiết
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Tài liệu PDF
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4 border-t">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setIsGuideModalOpen(false);
                      // Mark as completed if needed
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Đã đọc
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Link className="h-4 w-4 mr-2" />
                    Chia sẻ
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recommendations;