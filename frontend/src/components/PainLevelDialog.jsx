import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Slider } from './ui/slider';

const PainLevelDialog = ({ trigger, onSubmit }) => {
  const [painLevel, setPainLevel] = useState([5]);
  const [isOpen, setIsOpen] = useState(false);

  const painEmojis = [
    { level: 0, emoji: "😊", label: "Không đau", color: "text-green-600" },
    { level: 1, emoji: "🙂", label: "Rất nhẹ", color: "text-green-500" },
    { level: 2, emoji: "😐", label: "Nhẹ", color: "text-yellow-500" },
    { level: 3, emoji: "😕", label: "Khó chịu", color: "text-yellow-600" },
    { level: 4, emoji: "😟", label: "Vừa phải", color: "text-orange-500" },
    { level: 5, emoji: "😣", label: "Đáng lo", color: "text-orange-600" },
    { level: 6, emoji: "😖", label: "Căng thẳng", color: "text-red-500" },
    { level: 7, emoji: "😫", label: "Nghiêm trọng", color: "text-red-600" },
    { level: 8, emoji: "😩", label: "Rất nặng", color: "text-red-700" },
    { level: 9, emoji: "😰", label: "Không chịu được", color: "text-red-800" },
    { level: 10, emoji: "😱", label: "Tồi tệ nhất", color: "text-red-900" }
  ];

  const getCurrentEmoji = () => {
    return painEmojis.find(item => item.level === painLevel[0]) || painEmojis[5];
  };

  const handleSubmit = async () => {
    try {
      // Save pain level to backend API
      const response = await fetch('/api/profile/pain-level', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'default-user', // TODO: Get actual user ID from context/auth
          pain_level: painLevel[0],
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save pain level');
      }

      onSubmit(painLevel[0]);
      setIsOpen(false);
      // Add haptic feedback simulation
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (error) {
      console.error('Error saving pain level:', error);
      // Still call onSubmit to update UI even if API call fails
      onSubmit(painLevel[0]);
      setIsOpen(false);
    }
  };

  const currentEmoji = getCurrentEmoji();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Đánh giá mức độ đau</DialogTitle>
        </DialogHeader>
        <div className="space-y-8 py-4">
          {/* Animated Emoji Display */}
          <div className="text-center">
            <div 
              className={`text-8xl mb-4 transition-all duration-500 transform hover:scale-110 ${currentEmoji.color}`}
              key={painLevel[0]}
              style={{ 
                animation: 'bounce 0.6s ease-in-out',
                textShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              {currentEmoji.emoji}
            </div>
            <div className={`text-2xl font-bold mb-2 transition-colors duration-300 ${currentEmoji.color}`}>
              {painLevel[0]}
            </div>
            <div className={`text-lg font-medium transition-colors duration-300 ${currentEmoji.color}`}>
              {currentEmoji.label}
            </div>
          </div>

          {/* Enhanced Slider */}
          <div className="space-y-4">
            <div className="px-4">
              <Slider
                value={painLevel}
                onValueChange={setPainLevel}
                max={10}
                step={1}
                className="w-full"
                style={{
                  background: `linear-gradient(to right, 
                    #10b981 0%, 
                    #10b981 ${(painLevel[0] * 10)}%, 
                    #ef4444 ${(painLevel[0] * 10)}%, 
                    #ef4444 100%)`
                }}
              />
            </div>
            
            <div className="flex justify-between text-xs text-slate-500 px-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">😊</span>
                <span>Không đau</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">😐</span>
                <span>Vừa phải</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">😱</span>
                <span>Tồi tệ nhất</span>
              </div>
            </div>
          </div>

          {/* Quick Select Buttons */}
          <div className="grid grid-cols-11 gap-1">
            {painEmojis.map((item) => (
              <button
                key={item.level}
                onClick={() => setPainLevel([item.level])}
                className={`p-2 rounded-lg text-xl transition-all duration-200 hover:scale-110 ${
                  painLevel[0] === item.level
                    ? 'bg-slate-900 text-white shadow-lg transform scale-105'
                    : 'bg-slate-100 hover:bg-slate-200'
                }`}
                title={`${item.level} - ${item.label}`}
              >
                {item.emoji}
              </button>
            ))}
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-slate-900 hover:bg-slate-800 transition-all duration-200 transform hover:scale-105"
            size="lg"
          >
            Ghi nhận ({painLevel[0]}/10)
          </Button>
        </div>
      </DialogContent>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translateY(0);
          }
          40%, 43% {
            transform: translateY(-15px);
          }
          70% {
            transform: translateY(-7px);
          }
          90% {
            transform: translateY(-3px);
          }
        }
      `}</style>
    </Dialog>
  );
};

export default PainLevelDialog;