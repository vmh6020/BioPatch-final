import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, CheckCircle2, Info, X, Volume2 } from 'lucide-react';

const EnhancedAlertCard = ({ alert, onResolve, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    // Play alert sound for high priority alerts
    if (alert.type === 'warning' || alert.type === 'error') {
      // Simple beep sound using Web Audio API
      if (soundEnabled && typeof AudioContext !== 'undefined') {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }
    }
  }, [alert.id, soundEnabled]);

  const getAlertConfig = (type) => {
    const configs = {
      warning: {
        icon: AlertTriangle,
        bgColor: 'bg-gradient-to-r from-yellow-50 to-orange-50',
        borderColor: 'border-l-yellow-500',
        iconColor: 'text-yellow-600',
        badgeColor: 'bg-yellow-100 text-yellow-800',
        shadowColor: 'shadow-yellow-100',
        label: 'Cảnh báo'
      },
      error: {
        icon: AlertTriangle,
        bgColor: 'bg-gradient-to-r from-red-50 to-red-100',
        borderColor: 'border-l-red-500',
        iconColor: 'text-red-600',
        badgeColor: 'bg-red-100 text-red-800',
        shadowColor: 'shadow-red-100',
        label: 'Lỗi'
      },
      info: {
        icon: Info,
        bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
        borderColor: 'border-l-blue-500',
        iconColor: 'text-blue-600',
        badgeColor: 'bg-blue-100 text-blue-800',
        shadowColor: 'shadow-blue-100',
        label: 'Thông tin'
      },
      success: {
        icon: CheckCircle2,
        bgColor: 'bg-gradient-to-r from-green-50 to-green-100',
        borderColor: 'border-l-green-500',
        iconColor: 'text-green-600',
        badgeColor: 'bg-green-100 text-green-800',
        shadowColor: 'shadow-green-100',
        label: 'Thành công'
      }
    };
    return configs[type] || configs.info;
  };

  const config = getAlertConfig(alert.type);
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <Card 
      className={`
        ${config.bgColor} ${config.borderColor} ${config.shadowColor}
        border-l-4 shadow-md hover:shadow-lg 
        transition-all duration-300 transform hover:scale-[1.02]
        animate-in slide-in-from-left-4 duration-500
      `}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Animated Icon */}
            <div className={`
              ${config.iconColor} p-2 rounded-full bg-white shadow-sm
              animate-pulse
            `}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-slate-900 truncate">
                  {alert.title}
                </h4>
                <Badge className={`${config.badgeColor} text-xs animate-pulse`}>
                  {config.label}
                </Badge>
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                {alert.message}
              </p>
              
              <div className="flex items-center space-x-4 text-xs text-slate-500">
                <span>
                  {new Date(alert.timestamp).toLocaleString('vi-VN')}
                </span>
                <button 
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`flex items-center space-x-1 hover:text-slate-700 transition-colors ${
                    soundEnabled ? 'text-blue-600' : ''
                  }`}
                >
                  <Volume2 className="h-3 w-3" />
                  <span>{soundEnabled ? 'Tắt âm' : 'Bật âm'}</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-start space-x-2 ml-4">
            {alert.type !== 'success' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onResolve(alert.id);
                  setIsVisible(false);
                }}
                className="hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-colors"
              >
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Xử lý
              </Button>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                onDismiss && onDismiss(alert.id);
                setIsVisible(false);
              }}
              className="hover:bg-slate-100 text-slate-500 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Alert Priority Indicator */}
        {(alert.type === 'warning' || alert.type === 'error') && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full animate-ping ${
                alert.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
              <span className="text-xs font-medium text-slate-600">
                {alert.type === 'error' ? 'Cần xử lý ngay lập tức' : 'Cần chú ý'}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedAlertCard;