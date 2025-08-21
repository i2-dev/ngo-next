'use client';

import { useEffect, useRef, useState } from 'react';

const GoogleMap = ({ 
  address, 
  latitude, 
  longitude, 
  zoom = 15, 
  height = '300px',
  className = '' 
}) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 檢查是否已經載入 Google Maps API
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // 載入 Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    script.onerror = () => {
      setError('無法載入 Google Maps');
    };

    document.head.appendChild(script);

    return () => {
      // 清理腳本（可選）
      const existingScript = document.querySelector(`script[src*="maps.googleapis.com"]`);
      if (existingScript && existingScript === script) {
        document.head.removeChild(script);
      }
    };
  }, [address, latitude, longitude]);

  const initializeMap = async () => {
    try {
      if (!mapRef.current) return;

      let mapCenter;
      let marker;

      // 如果提供了經緯度，直接使用
      if (latitude && longitude) {
        mapCenter = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      } 
      // 否則使用地址進行地理編碼
      else if (address) {
        const geocoder = new window.google.maps.Geocoder();
        const results = await new Promise((resolve, reject) => {
          geocoder.geocode({ address }, (results, status) => {
            if (status === 'OK') {
              resolve(results);
            } else {
              reject(new Error(`地理編碼失敗: ${status}`));
            }
          });
        });
        
        if (results && results[0]) {
          mapCenter = results[0].geometry.location.toJSON();
        } else {
          throw new Error('找不到地址對應的位置');
        }
      } else {
        // 預設位置（香港中環）
        mapCenter = { lat: 22.2818, lng: 114.1557 };
      }

      // 創建地圖
      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: zoom,
        styles: [
          // 可選：自定義地圖樣式
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      // 添加標記
      marker = new window.google.maps.Marker({
        position: mapCenter,
        map: map,
        title: address || '我們的位置',
        animation: window.google.maps.Animation.DROP
      });

      // 添加信息窗口
      if (address) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 5px 0; font-size: 16px; font-weight: bold;">我們的位置</h3>
              <p style="margin: 0; font-size: 14px; color: #666;">${address}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });
      }

      setIsLoaded(true);
    } catch (err) {
      console.error('Google Maps 初始化錯誤:', err);
      setError(err.message);
    }
  };

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ height }}>
        <div className="text-center text-gray-600">
          <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm">地圖載入失敗</p>
          <p className="text-xs text-gray-500 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg border border-gray-200 ${className}`}>
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center z-10"
          style={{ height }}
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">載入地圖中...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={mapRef} 
        style={{ height }}
        className="w-full"
      />
      
      {/* 在新視窗開啟 Google Maps 的連結 */}
      {address && (
        <div className="absolute top-2 right-2 z-20">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/90 hover:bg-white shadow-md rounded-lg p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            title="在 Google Maps 中開啟"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
