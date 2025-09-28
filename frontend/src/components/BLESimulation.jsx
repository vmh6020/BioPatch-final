import React, { useState, useEffect } from 'react';
import { Bluetooth, BluetoothConnected, Activity, Zap, Heart, Thermometer } from 'lucide-react';

const BLESimulation = ({ onDataUpdate, isActive = false }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState('disconnected'); // 'disconnected', 'connecting', 'connected', 'error'
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [signalStrength, setSignalStrength] = useState(4);
  const [currentData, setCurrentData] = useState({
    emg: { rms: 0, unit: 'µV' },
    ppg: { heartRate: 0, hrv: 0, unit: 'bpm' },
    eda: { peakCount: 0, amplitude: 0, unit: 'µS' },
    temperature: 36.5
  });

  // Simulate realistic EMG, PPG, EDA, and temperature data
  const generateRealisticData = () => {
    const baseTime = Date.now();
    const timeVariation = (baseTime % 60000) / 1000; // 0-60 second cycle
    
    // EMG simulation (muscle activity)
    const emgBase = isActive ? 60 : 35;
    const emgNoise = (Math.random() - 0.5) * 15;
    const emgActivity = Math.sin(timeVariation * 0.3) * 20;
    const emgRms = Math.max(10, emgBase + emgNoise + emgActivity);

    // PPG simulation (heart rate with natural variation)
    const hrBase = isActive ? 85 : 72;
    const hrVariation = Math.sin(timeVariation * 0.1) * 8;
    const hrNoise = (Math.random() - 0.5) * 4;
    const heartRate = Math.round(hrBase + hrVariation + hrNoise);
    
    // HRV calculation (realistic range)
    const hrvBase = isActive ? 25 : 35;
    const hrv = hrvBase + (Math.random() - 0.5) * 10;

    // EDA simulation (emotional arousal)
    const edaBase = isActive ? 8 : 3;
    const edaPeaks = Math.round(edaBase + Math.random() * 5);
    const edaAmplitude = 2.5 + Math.random() * 2;

    // Temperature simulation (slight variation)
    const tempBase = 36.5;
    const tempVariation = (Math.random() - 0.5) * 0.4;
    const temperature = Math.round((tempBase + tempVariation) * 10) / 10;

    return {
      emg: { rms: Math.round(emgRms * 10) / 10, unit: 'µV' },
      ppg: { heartRate, hrv: Math.round(hrv * 10) / 10, unit: 'bpm' },
      eda: { peakCount: edaPeaks, amplitude: Math.round(edaAmplitude * 10) / 10, unit: 'µS' },
      temperature
    };
  };

  // Simulate BLE connection process
  const simulateConnection = async () => {
    setIsConnecting(true);
    setDeviceStatus('connecting');
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
    
    // Simulate occasional connection failures (10% chance)
    if (Math.random() < 0.1) {
      setDeviceStatus('error');
      setIsConnecting(false);
      return;
    }

    setIsConnected(true);
    setIsConnecting(false);
    setDeviceStatus('connected');
    setSignalStrength(3 + Math.round(Math.random() * 2)); // 3-5 signal bars
  };

  const disconnectDevice = () => {
    setIsConnected(false);
    setDeviceStatus('disconnected');
    setCurrentData({
      emg: { rms: 0, unit: 'µV' },
      ppg: { heartRate: 0, hrv: 0, unit: 'bpm' },
      eda: { peakCount: 0, amplitude: 0, unit: 'µS' },
      temperature: 0
    });
  };

  // Real-time data simulation when connected
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      const newData = generateRealisticData();
      setCurrentData(newData);
      
      if (onDataUpdate) {
        onDataUpdate(newData);
      }

      // Simulate battery drain (very slowly)
      setBatteryLevel(prev => Math.max(10, prev - 0.001));
      
      // Simulate signal fluctuation
      setSignalStrength(prev => {
        const change = (Math.random() - 0.5) * 0.3;
        return Math.max(1, Math.min(5, prev + change));
      });
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [isConnected, isActive, onDataUpdate]);

  const getStatusColor = () => {
    switch (deviceStatus) {
      case 'connected': return 'text-green-500';
      case 'connecting': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusText = () => {
    switch (deviceStatus) {
      case 'connected': return 'BioPatch Đã kết nối';
      case 'connecting': return 'Đang kết nối...';
      case 'error': return 'Lỗi kết nối';
      default: return 'BioPatch Chưa kết nối';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      {/* Header with connection status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {isConnecting ? (
            <Bluetooth className="w-5 h-5 text-yellow-500 animate-pulse" />
          ) : isConnected ? (
            <BluetoothConnected className={`w-5 h-5 ${getStatusColor()}`} />
          ) : (
            <Bluetooth className={`w-5 h-5 ${getStatusColor()}`} />
          )}
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        {isConnected && (
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>📶 {Math.round(signalStrength)}/5</span>
            <span>🔋 {Math.round(batteryLevel)}%</span>
          </div>
        )}
      </div>

      {/* Connection button */}
      <div className="mb-4">
        {!isConnected && !isConnecting && (
          <button
            onClick={simulateConnection}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Kết nối BioPatch
          </button>
        )}
        
        {isConnecting && (
          <button
            disabled
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-medium opacity-75"
          >
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Đang kết nối...</span>
            </div>
          </button>
        )}

        {isConnected && (
          <button
            onClick={disconnectDevice}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Ngắt kết nối
          </button>
        )}

        {deviceStatus === 'error' && (
          <button
            onClick={simulateConnection}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Thử lại kết nối
          </button>
        )}
      </div>

      {/* Real-time data display */}
      {isConnected && (
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <Activity className="w-3 h-3 text-blue-600" />
              <span className="font-medium text-blue-800">EMG</span>
            </div>
            <div className="text-lg font-bold text-blue-600">
              {currentData.emg.rms}
              <span className="text-xs ml-1 font-normal">{currentData.emg.unit}</span>
            </div>
          </div>

          <div className="bg-red-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <Heart className="w-3 h-3 text-red-600" />
              <span className="font-medium text-red-800">HR</span>
            </div>
            <div className="text-lg font-bold text-red-600">
              {currentData.ppg.heartRate}
              <span className="text-xs ml-1 font-normal">{currentData.ppg.unit}</span>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <Zap className="w-3 h-3 text-green-600" />
              <span className="font-medium text-green-800">EDA</span>
            </div>
            <div className="text-lg font-bold text-green-600">
              {currentData.eda.peakCount}
              <span className="text-xs ml-1 font-normal">peaks</span>
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-1">
              <Thermometer className="w-3 h-3 text-orange-600" />
              <span className="font-medium text-orange-800">Temp</span>
            </div>
            <div className="text-lg font-bold text-orange-600">
              {currentData.temperature}°C
            </div>
          </div>
        </div>
      )}

      {/* Status messages */}
      {deviceStatus === 'error' && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
          ⚠️ Không thể kết nối với BioPatch. Kiểm tra Bluetooth và thử lại.
        </div>
      )}
    </div>
  );
};

export default BLESimulation;