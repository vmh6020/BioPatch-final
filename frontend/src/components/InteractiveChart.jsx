import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ZoomIn, ZoomOut, RotateCcw, AlertCircle } from 'lucide-react';

const InteractiveChart = ({ 
  data, 
  dataKey, 
  color, 
  peaks = false, 
  title, 
  icon: Icon,
  unit = "",
  analysis = "",
  animated = true 
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [highlightPeaks, setHighlightPeaks] = useState(peaks);
  const [animatedHeights, setAnimatedHeights] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const chartRef = useRef(null);

  const maxValue = Math.max(...data.map(item => item[dataKey]));
  const minValue = Math.min(...data.map(item => item[dataKey]));
  const range = maxValue - minValue;

  const visibleData = data.slice(0, Math.floor(data.length / zoomLevel));

  // Initialize animated heights
  useEffect(() => {
    if (!animated) return;
    
    const targetHeights = visibleData.map(item => 
      ((item[dataKey] - minValue) / range) * 200 + 20
    );
    
    if (!isInitialized) {
      // Initial load animation
      setAnimatedHeights(new Array(targetHeights.length).fill(20));
      setIsInitialized(true);
      
      setTimeout(() => {
        setAnimatedHeights(targetHeights);
      }, 100);
    } else {
      // Update animation
      setAnimatedHeights(targetHeights);
    }
  }, [data, zoomLevel, dataKey, minValue, range, animated, isInitialized, visibleData]);

  // Auto-scroll for real-time data
  useEffect(() => {
    if (chartRef.current && animated) {
      const shouldScroll = data.length > 12; // Auto-scroll when more than 12 data points
      if (shouldScroll) {
        chartRef.current.scrollLeft = chartRef.current.scrollWidth;
      }
    }
  }, [data, animated]);

  const handleZoomIn = () => {
    if (zoomLevel < 4) setZoomLevel(zoomLevel * 2);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 1) setZoomLevel(zoomLevel / 2);
  };

  const handleReset = () => {
    setZoomLevel(1);
    setSelectedDataPoint(null);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {Icon && <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />}
            <span>{title}</span>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            {peaks && (
              <Button
                size="sm"
                variant={highlightPeaks ? "default" : "outline"}
                onClick={() => setHighlightPeaks(!highlightPeaks)}
                className="text-xs"
              >
                <AlertCircle className="h-3 w-3 mr-1" />
                Highlight Peaks
              </Button>
            )}
            
            <div className="flex items-center space-x-1">
              <Button size="sm" variant="outline" onClick={handleZoomOut} disabled={zoomLevel <= 1}>
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleZoomIn} disabled={zoomLevel >= 4}>
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                <RotateCcw className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {zoomLevel > 1 && (
          <Badge variant="secondary" className="w-fit">
            Zoom: {zoomLevel}x
          </Badge>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Interactive Chart */}
          <div 
            ref={chartRef}
            className="w-full h-64 flex items-end space-x-1 bg-slate-50 p-4 rounded-lg relative overflow-x-auto overflow-y-hidden scroll-smooth"
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              scrollbarWidth: 'thin'
            }}
          >
            {visibleData.map((item, index) => {
              const targetHeight = ((item[dataKey] - minValue) / range) * 200 + 20;
              const animatedHeight = animated && animatedHeights[index] !== undefined 
                ? animatedHeights[index] 
                : targetHeight;
              const isPeak = peaks && item.peak && highlightPeaks;
              const isSelected = selectedDataPoint === index;
              
              return (
                <div 
                  key={`${item.time}-${index}`}
                  className="flex-shrink-0 w-8 flex flex-col items-center cursor-pointer group"
                  onClick={() => setSelectedDataPoint(selectedDataPoint === index ? null : index)}
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                >
                  {/* Data Bar */}
                  <div 
                    className={`
                      w-full rounded-t-sm relative transition-all duration-700 ease-out transform origin-bottom
                      ${isSelected ? 'ring-2 ring-slate-900 shadow-lg scale-110 z-10' : 'hover:scale-105'}
                      ${isPeak ? 'animate-pulse shadow-red-200 shadow-lg' : ''}
                    `}
                    style={{ 
                      height: `${animatedHeight}px`,
                      background: isPeak 
                        ? `linear-gradient(to top, ${color.includes('bg-') ? color.replace('bg-', '#') : color}, #ef4444, #fca5a5)`
                        : `linear-gradient(to top, ${color.includes('bg-') ? color.replace('bg-', '#') : color}, ${color.includes('bg-') ? color.replace('bg-', '#').replace('500', '300') : color})`,
                      transition: animated ? 'height 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease' : 'transform 0.3s ease',
                      boxShadow: isSelected ? '0 8px 25px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
                    }}
                  >
                    {/* Peak Indicator */}
                    {isPeak && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
                        <div className="relative">
                          <AlertCircle className="h-5 w-5 text-red-500 animate-bounce drop-shadow-lg" />
                          <div className="absolute inset-0 h-5 w-5 bg-red-400 rounded-full animate-ping opacity-30"></div>
                        </div>
                      </div>
                    )}
                    
                    {/* Shimmer effect for active data */}
                    {animated && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 animate-shimmer"></div>
                    )}
                    
                    {/* Value Tooltip on Hover */}
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-slate-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap z-30 shadow-lg">
                      <div className="font-medium">{item[dataKey]}{unit}</div>
                      <div className="text-xs opacity-75">{item.time}</div>
                      {/* Tooltip arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                  
                  {/* Time Label */}
                  <div className={`text-xs mt-2 transition-all duration-200 text-center ${
                    isSelected 
                      ? 'text-slate-900 font-bold scale-110' 
                      : 'text-slate-500 group-hover:text-slate-700'
                  }`}>
                    {item.time}
                  </div>
                </div>
              );
            })}
            
            {/* Real-time indicator for latest data point */}
            {animated && visibleData.length > 0 && (
              <div className="flex items-end">
                <div className="w-1 h-full bg-gradient-to-t from-green-500 to-transparent animate-pulse rounded-full opacity-60 ml-2"></div>
              </div>
            )}
          </div>

          {/* Selected Data Point Details */}
          {selectedDataPoint !== null && visibleData[selectedDataPoint] && (
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-medium text-blue-900 mb-2">Chi tiết dữ liệu</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Thời gian:</span>
                  <span className="font-medium ml-2">{visibleData[selectedDataPoint].time}</span>
                </div>
                <div>
                  <span className="text-blue-700">Giá trị:</span>
                  <span className="font-medium ml-2">
                    {visibleData[selectedDataPoint][dataKey]}{unit}
                  </span>
                </div>
                {peaks && visibleData[selectedDataPoint].peak && (
                  <div className="col-span-2">
                    <Badge className="bg-red-100 text-red-800">
                      Đỉnh căng cơ phát hiện
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Analysis Section */}
          {analysis && (
            <div className={`p-4 rounded-lg ${color.replace('bg-', 'bg-').replace('-500', '-50')}`}>
              <p className={`text-sm ${color.replace('bg-', 'text-').replace('-500', '-800')}`}>
                <strong>Phân tích:</strong> {analysis}
              </p>
            </div>
          )}

          {/* Chart Statistics */}
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="font-bold text-slate-900">{maxValue}{unit}</div>
              <div className="text-slate-600">Giá trị cao nhất</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="font-bold text-slate-900">{minValue}{unit}</div>
              <div className="text-slate-600">Giá trị thấp nhất</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="font-bold text-slate-900">
                {((maxValue + minValue) / 2).toFixed(1)}{unit}
              </div>
              <div className="text-slate-600">Trung bình</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractiveChart;