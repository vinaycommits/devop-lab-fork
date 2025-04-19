import React, { useEffect, useState } from 'react';
import jsQR from 'jsqr';
import { ethers } from 'ethers';
import contractABI from '../abi/VerifiEyeABI.json';
import './CustomerPanel.css'; // Optional CSS for timeline

const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

const CustomerPanel = () => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [productId, setProductId] = useState('');
  const [status, setStatus] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [scanCount, setScanCount] = useState(0);
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const verifiEye = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
        setContract(verifiEye);
        setAccount(accounts[0]);
      } else {
        alert("Please install MetaMask.");
      }
    };

    init();
  }, []);

  const handleQRUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            const parsed = JSON.parse(code.data);
            const id = parsed.productId;
            setProductId(id);

            const tx = await contract.recordQRScan(id);
            await tx.wait();

            const p = await contract.getProduct(id);
            const valid = await contract.isQRCodeValid(id);
            const count = await contract.qrScanCount(id);

            setProductDetails({
              name: p[0],
              batchId: p[1],
              manufacturer: p[2],
              currentOwner: p[3],
              history: p[4],
            });

            setScanCount(Number(count));
            setIsValid(valid);
            setStatus("✅ Product verified.");
          } catch (err) {
            console.error(err);
            setStatus("❌ Failed to verify product.");
            setProductDetails(null);
          }
        } else {
          setStatus("❌ Invalid or unreadable QR code.");
        }
      };
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Product Verification</h2>

      <div className="card p-4 shadow-sm">
        <div className="mb-3">
          <label className="form-label">Upload QR Code</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleQRUpload} />
        </div>

        {productId && (
          <div className="mb-3">
            <label>Product Serial Number:</label>
            <input type="text" className="form-control" value={productId} disabled />
          </div>
        )}

        {status && (
          <div className="alert alert-info mt-3">
            <strong>Status:</strong> {status}
          </div>
        )}

        {productDetails && (
          <div className="mt-4">
            <h5>Product Details</h5>
            <p><strong>Name:</strong> {productDetails.name}</p>
            <p><strong>Batch ID:</strong> {productDetails.batchId}</p>
            <p><strong>Manufacturer:</strong> {productDetails.manufacturer}</p>
            <p><strong>Current Owner:</strong> {productDetails.currentOwner}</p>
            <p><strong>Scan Count:</strong> {scanCount} / 3</p>
            <p>
              <strong>Authenticity:</strong>{" "}
              {isValid ? (
                <span className="text-success">✅ Genuine</span>
              ) : (
                <span className="text-danger">❌ QR Code Reused or Expired</span>
              )}
            </p>

            <h5 className="mt-4">Ownership Timeline</h5>
            <div className="timeline">
              {productDetails.history.map((addr, idx) => (
                <div key={idx} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <p>{addr}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer className="text-center mt-4 text-muted">
        <small>Connected Wallet: {account}</small>
      </footer>
    </div>
  );
};

export default CustomerPanel;
