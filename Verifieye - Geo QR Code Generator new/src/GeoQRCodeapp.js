// Filename: GeoQRCodeApp.js

import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import QrReader from 'react-qr-reader';

const encodeQRData = (lat, lng, productId) => {
  return JSON.stringify({ lat, lng, productId });
};

const decodeQRData = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371000; // Radius of Earth in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const GeoQRCodeApp = () => {
  const [productId, setProductId] = useState('');
  const [location, setLocation] = useState(null);
  const [qrData, setQRData] = useState('');
  const [scanResult, setScanResult] = useState('');
  const [status, setStatus] = useState('');

  const generateLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setLocation({ lat: latitude, lng: longitude });
      const encoded = encodeQRData(latitude, longitude, productId);
      setQRData(encoded);
    });
  };

  const handleScan = (data) => {
    if (data) {
      setScanResult(data);
      const parsed = decodeQRData(data);
      if (!parsed) {
        setStatus('Invalid QR format');
        return;
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const currentLat = position.coords.latitude;
        const currentLng = position.coords.longitude;
        const distance = getDistance(currentLat, currentLng, parsed.lat, parsed.lng);

        if (distance <= 3) {
          setStatus('✅ Valid QR Code: Within Range');
        } else {
          setStatus('❌ Invalid QR Code: Out of Range');
        }
      });
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>GeoLoc QR Code Generator and Scanner</h2>

      <div>
        <h3>Generate QR</h3>
        <input
          type="text"
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />
        <button onClick={generateLocation}>Generate QR with Location</button>
        {qrData && (
          <div style={{ marginTop: 10 }}>
            <QRCode value={qrData} />
            <p>QR Data: {qrData}</p>
          </div>
        )}
      </div>

      <hr />

      <div>
        <h3>Scan QR</h3>
        <QrReader delay={300} onError={(err) => console.error(err)} onScan={handleScan} />
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Scanned:</strong> {scanResult}</p>
      </div>
    </div>
  );
};

export default GeoQRCodeApp;
