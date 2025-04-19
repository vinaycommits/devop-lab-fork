// src/App.js
import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in km
};

function App() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [currentLat, setCurrentLat] = useState(null);
  const [currentLon, setCurrentLon] = useState(null);
  const [isValid, setIsValid] = useState(null);
  const [qrValue, setQrValue] = useState('');

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLat(position.coords.latitude);
        setCurrentLon(position.coords.longitude);
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  }, []);

  // Check distance when coordinates change
  useEffect(() => {
    if (
      latitude &&
      longitude &&
      currentLat != null &&
      currentLon != null
    ) {
      const distance = haversineDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        currentLat,
        currentLon
      );
      setIsValid(distance <= 5); // valid if within 5km
    }
  }, [latitude, longitude, currentLat, currentLon]);

  const handleGenerateQR = () => {
    if (!latitude || !longitude) return;
    const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
    setQrValue(locationURL);
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>GeoLock QR Generator - VerifyMe</h1>

      <label>Latitude: </label>
      <input
        type="text"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <br /><br />

      <label>Longitude: </label>
      <input
        type="text"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />
      <br /><br />

      <button onClick={handleGenerateQR}>Generate QR Code</button>
      <br /><br />

      {qrValue && (
        <div>
          <QRCodeSVG value={qrValue} size={256} />
          <p><b>QR Encoded Location:</b><br />{qrValue}</p>
        </div>
      )}

      {isValid != null && (
        <h2 style={{ color: isValid ? 'green' : 'red' }}>
          QR Status: {isValid ? 'Valid (within 5km)' : 'Invalid (outside 5km)'}
        </h2>
      )}

      {currentLat && currentLon && (
        <p>
          <b>Your current location:</b><br />
          Latitude: {currentLat}<br />
          Longitude: {currentLon}
        </p>
      )}
    </div>
  );
}

export default App;
