import React from 'react';
import { Button } from './ui/button';
import { X, Play, Clock, Target, Users } from 'lucide-react';

const ExerciseModal = ({ isOpen, onClose, exercise }) => {
  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-900">{exercise.title}</h2>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Exercise Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <div className="text-sm text-blue-800 font-medium">Thời gian</div>
                <div className="text-sm text-blue-600">{exercise.duration || '10-15 phút'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-sm text-green-800 font-medium">Mục tiêu</div>
                <div className="text-sm text-green-600">{exercise.target || 'Giảm đau cổ vai'}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-3 bg-purple-50 rounded-lg">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <div className="text-sm text-purple-800 font-medium">Độ khó</div>
                <div className="text-sm text-purple-600">{exercise.difficulty || 'Dễ - Trung bình'}</div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Mô tả bài tập</h3>
            <p className="text-slate-600 leading-relaxed">
              {exercise.description || 'Bài tập giãn cơ cổ và vai giúp giảm căng thẳng và cải thiện độ linh hoạt. Thực hiện các động tác nhẹ nhàng, không gây đau.'}
            </p>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Các bước thực hiện</h3>
            <div className="space-y-3">
              {(exercise.steps || [
                'Ngồi thẳng lưng, vai thư giãn tự nhiên',
                'Từ từ nghiêng đầu về phía bên phải, giữ 15 giây',
                'Quay lại vị trí ban đầu, sau đó nghiêng về bên trái',
                'Xoay cổ nhẹ nhàng theo chiều kim đồng hồ 5 vòng',
                'Xoay cổ ngược chiều kim đồng hồ 5 vòng',
                'Nghỉ 30 giây và lặp lại 2-3 lần'
              ]).map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <p className="text-slate-600 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Lưu ý an toàn</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Không thực hiện khi cảm thấy đau nhức</li>
              <li>• Thực hiện động tác chậm và nhẹ nhàng</li>
              <li>• Dừng lại nếu cảm thấy khó chịu</li>
              <li>• Tham khảo bác sĩ nếu có triệu chứng bất thường</li>
            </ul>
          </div>

          {/* Video Section */}
          {exercise.videoUrl && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Video hướng dẫn</h3>
              <div className="bg-slate-100 rounded-lg p-8 text-center">
                <Play className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500 mb-4">Video hướng dẫn chi tiết</p>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Play className="h-4 w-4 mr-2" />
                  Xem video
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 bg-gray-50 border-t">
          <div className="text-sm text-slate-500">
            💡 Thực hiện đều đặn để có kết quả tốt nhất
          </div>
          <div className="space-x-3">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Target className="h-4 w-4 mr-2" />
              Bắt đầu tập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseModal;