

// import './ManufacturerPanel.css'
// import { useState, useRef } from 'react';
// import { QRCodeCanvas } from 'qrcode.react';

// const ManufacturerPanel = ({ contract, account }) => {
//   const [activeTab, setActiveTab] = useState('register');
//   const [productName, setProductName] = useState('');
//   const [batchId, setBatchId] = useState('');
//   const [lastProductId, setLastProductId] = useState(null);
//   const [qrData, setQrData] = useState('');
//   const [sellerAddress, setSellerAddress] = useState('');
//   const [newSeller, setNewSeller] = useState('');
//   const [statusMsg, setStatusMsg] = useState('');
//   const qrRef = useRef(null);

//   const handleRegisterProduct = async () => {
//     if (!productName || !batchId) {
//       alert("Please fill in all fields.");
//       return;
//     }

//     try {
//       const tx = await contract.addProduct(productName, batchId);
//       await tx.wait();

//       const nextId = await contract.productCounter();
//       const newProductId = Number(nextId) - 1;

//       setLastProductId(newProductId);
//       const qrPayload = JSON.stringify({ productId: newProductId, productName, batchId });
//       setQrData(qrPayload);

//       alert(`✅ Product Registered. ID: ${newProductId}`);
//       setProductName('');
//       setBatchId('');
//     } catch (error) {
//       console.error("Error registering product:", error);
//       alert("❌ Failed to register product.");
//     }
//   };

//   const handleTransferToSeller = async () => {
//     if (!lastProductId || !sellerAddress) {
//       alert("Please provide both Product ID and Seller address.");
//       return;
//     }

//     try {
//       const tx = await contract.transferToSeller(lastProductId, sellerAddress);
//       await tx.wait();
//       setStatusMsg(`✅ Ownership transferred to seller: ${sellerAddress}`);
//       setSellerAddress('');
//     } catch (error) {
//       console.error("Transfer failed:", error);
//       setStatusMsg("❌ Failed to transfer ownership.");
//     }
//   };

//   const handleAddSeller = async () => {
//     if (!newSeller) {
//       alert("Please enter the seller's wallet address.");
//       return;
//     }

//     try {
//       const tx = await contract.addSeller(newSeller);
//       await tx.wait();
//       setStatusMsg(`✅ Seller added: ${newSeller}`);
//       setNewSeller('');
//     } catch (error) {
//       console.error("Error adding seller:", error);
//       setStatusMsg("❌ Failed to add seller.");
//     }
//   };

//   const downloadQRCode = () => {
//     const canvas = document.getElementById('qrCode');
//     const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
//     const link = document.createElement('a');
//     link.href = pngUrl;
//     link.download = `${lastProductId}_QRCode.png`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div>
//       <nav style={{ marginBottom: '1.5rem' }}>
//         <button onClick={() => setActiveTab('register')}>Register Product</button>
//         <button onClick={() => setActiveTab('transfer')}>Transfer to Seller</button>
//         <button onClick={() => setActiveTab('addSeller')}>Add Seller</button>
//       </nav>

//       {activeTab === 'register' && (
//         <div>
//           <h3>Register New Product</h3>
//           <label>Product Name:</label><br />
//           <input value={productName} onChange={(e) => setProductName(e.target.value)} /><br /><br />
//           <label>Batch ID:</label><br />
//           <input value={batchId} onChange={(e) => setBatchId(e.target.value)} /><br /><br />
//           <button onClick={handleRegisterProduct}>Register</button>

//           {qrData && (
//             <div style={{ marginTop: '1rem' }}>
//               <h4>QR Code for Product ID: {lastProductId}</h4>
//               <QRCodeCanvas value={qrData} id="qrCode" />
//               <br /><br />
//               <button onClick={downloadQRCode}>Download QR Code</button>
//             </div>
//           )}
//         </div>
//       )}

//       {activeTab === 'transfer' && (
//         <div>
//           <h3>Transfer Product to Seller</h3>
//           <label>Seller Wallet Address:</label><br />
//           <input value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} /><br /><br />
//           <button onClick={handleTransferToSeller}>Transfer Ownership</button>
//         </div>
//       )}

//       {activeTab === 'addSeller' && (
//         <div>
//           <h3>Add New Seller</h3>
//           <label>Seller Wallet Address:</label><br />
//           <input value={newSeller} onChange={(e) => setNewSeller(e.target.value)} /><br /><br />
//           <button onClick={handleAddSeller}>Add Seller</button>
//         </div>
//       )}

//       {statusMsg && <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>{statusMsg}</p>}
//     </div>
//   );
// };

// export default ManufacturerPanel;

import './ManufacturerPanel.css'; 
import { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const ManufacturerPanel = ({ contract, account }) => {
  const [activeTab, setActiveTab] = useState('register');
  const [productName, setProductName] = useState('');
  const [batchId, setBatchId] = useState('');
  const [lastProductId, setLastProductId] = useState(null);
  const [qrData, setQrData] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [newSeller, setNewSeller] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const qrRef = useRef(null);

  const handleRegisterProduct = async () => {
    if (!productName || !batchId) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const tx = await contract.addProduct(productName, batchId);
      await tx.wait();
      const nextId = await contract.productCounter();
      const newProductId = Number(nextId) - 1;
      setLastProductId(newProductId);
      setQrData(JSON.stringify({ productId: newProductId, productName, batchId }));
      alert(`✅ Product Registered. ID: ${newProductId}`);
      setProductName('');
      setBatchId('');
    } catch (error) {
      console.error("Error registering product:", error);
      alert("❌ Failed to register product.");
    }
  };

  const handleTransferToSeller = async () => {
    if (!lastProductId || !sellerAddress) {
      alert("Please provide both Product ID and Seller address.");
      return;
    }

    try {
      const tx = await contract.transferToSeller(lastProductId, sellerAddress);
      await tx.wait();
      setStatusMsg(`✅ Ownership transferred to seller: ${sellerAddress}`);
      setSellerAddress('');
    } catch (error) {
      console.error("Transfer failed:", error);
      setStatusMsg("❌ Failed to transfer ownership.");
    }
  };

  const handleAddSeller = async () => {
    if (!newSeller) {
      alert("Please enter the seller's wallet address.");
      return;
    }

    try {
      const tx = await contract.addSeller(newSeller);
      await tx.wait();
      setStatusMsg(`✅ Seller added: ${newSeller}`);
      setNewSeller('');
    } catch (error) {
      console.error("Error adding seller:", error);
      setStatusMsg("❌ Failed to add seller.");
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qrCode');
    const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
    const link = document.createElement('a');
    link.href = pngUrl;
    link.download = `${lastProductId}_QRCode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="panel-container">
      <div className="navbar">
        <button onClick={() => setActiveTab('register')}>Register Product</button>
        <button onClick={() => setActiveTab('transfer')}>Transfer to Seller</button>
        <button onClick={() => setActiveTab('addSeller')}>Add Seller</button>
      </div>

      {activeTab === 'register' && (
        <div className="section">
          <h3>Register New Product</h3>
          <label>Product Name:</label>
          <input value={productName} onChange={(e) => setProductName(e.target.value)} />
          <label>Batch ID:</label>
          <input value={batchId} onChange={(e) => setBatchId(e.target.value)} />
          <button onClick={handleRegisterProduct}>Register</button>

          {qrData && (
            <div className="qr-block">
              <h4>QR Code for Product ID: {lastProductId}</h4>
              <QRCodeCanvas value={qrData} id="qrCode" />
              <br /><br />
              <button onClick={downloadQRCode}>Download QR Code</button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'transfer' && (
        <div className="section">
          <h3>Transfer Product to Seller</h3>
          <label>Seller Wallet Address:</label>
          <input value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} />
          <button onClick={handleTransferToSeller}>Transfer Ownership</button>
        </div>
      )}

      {activeTab === 'addSeller' && (
        <div className="section">
          <h3>Add New Seller</h3>
          <label>Seller Wallet Address:</label>
          <input value={newSeller} onChange={(e) => setNewSeller(e.target.value)} />
          <button onClick={handleAddSeller}>Add Seller</button>
        </div>
      )}

      {statusMsg && <p className="status-message">{statusMsg}</p>}
    </div>
  );
};

export default ManufacturerPanel;
