import React, { useState, useRef, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const GeoQRCodeGenerator = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [qrValue, setQrValue] = useState('');
  const [error, setError] = useState('');
  const qrRef = useRef();

  useEffect(() => {
    document.title = "VerifyMe";
  }, []);

  const handleGenerateQRCode = () => {
    if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
      setError('Please enter valid numeric values for latitude and longitude.');
      return;
    }

    setError('');
    const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;
    setQrValue(locationURL);
  };

  const isValidCoordinate = (val) => /^-?\d+(\.\d+)?$/.test(val);

  const handleDownloadQRCode = () => {
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    const size = 256;
    canvas.width = size;
    canvas.height = size;

    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const png = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = png;
      link.download = 'geo-qr-code.png';
      link.click();
    };

    img.src = url;
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>Verifieye - Geo QR Code Generator</h1>
      <input
        type="text"
        placeholder="Enter latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
        style={{ margin: '5px', padding: '5px' }}
      />
      <input
        type="text"
        placeholder="Enter longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
        style={{ margin: '5px', padding: '5px' }}
      />
      <br />
      <button onClick={handleGenerateQRCode} style={{ margin: '10px', padding: '10px' }}>
        Generate QR Code
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {qrValue && (
        <div>
          <QRCodeSVG
            value={qrValue}
            size={256}
            level="H"
            includeMargin={true}
            ref={qrRef}
          />
          <br />
          <button onClick={handleDownloadQRCode} style={{ marginTop: '10px', padding: '10px' }}>
            Download QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default GeoQRCodeGenerator;
