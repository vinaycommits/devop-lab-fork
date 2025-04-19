// import React, { useState } from 'react';
// import jsQR from 'jsqr';

// const SellerPanel = ({ contract, account }) => {
//   const [productId, setProductId] = useState('');
//   const [status, setStatus] = useState('');
//   const [productDetails, setProductDetails] = useState(null);

//   const handleQRUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
  
//     const reader = new FileReader();
//     reader.onload = async () => {
//       const img = new Image();
//       img.src = reader.result;
//       img.onload = async () => {
//         const canvas = document.createElement('canvas');
//         const ctx = canvas.getContext('2d');
//         canvas.width = img.width;
//         canvas.height = img.height;
//         ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
//         const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//         const code = jsQR(imageData.data, imageData.width, imageData.height);
      
//         if (code) {
//           try {
//             const parsed = JSON.parse(code.data);
//             const id = parsed.productId;
      
//             const blockchainProduct = await contract.products(id); // ✅ now valid
//             if (!blockchainProduct.exists) {
//               setProductId('');
//               setProductDetails(null);
//               setStatus('❌ Product not found on blockchain.');
//               return;
//             }
      
//             setProductId(id);
//             setProductDetails({
//               name: parsed.productName,
//               batch: parsed.batchId,
//             });
//             setStatus(`✅ Product verified on-chain.`);
//           } catch (error) {
//             console.error("QR scan parse error:", error);
//             setStatus('❌ Invalid QR Code or corrupted data.');
//           }
//         } else {
//           setStatus('❌ Failed to read QR code.');
//         }
//       };
      
//     };
//     reader.readAsDataURL(file);
//   };
  



//   return (
//     <div style={{ marginTop: '2rem' }}>
//       <h3>Seller Panel</h3>

//       <div>
//         <label>Upload QR Code Image:</label><br />
//         <input type="file" accept="image/*" onChange={handleQRUpload} />
//       </div>

      
//       {productId && productDetails && (
//   <>
//     <p><strong>Product ID:</strong> {productId}</p>
//     <p><strong>Name:</strong> {productDetails.name}</p>
//     <p><strong>Batch:</strong> {productDetails.batch}</p>
//   </>
// )}


//       {status && <p>{status}</p>}
//     </div>
//   );
// };

// export default SellerPanel;

import React, { useState } from 'react';
import jsQR from 'jsqr';

const SellerPanel = ({ contract, account }) => {
  const [productId, setProductId] = useState('');
  const [status, setStatus] = useState('');
  const [productDetails, setProductDetails] = useState(null);

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
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            const parsed = JSON.parse(code.data);
            const id = parsed.productId;

            const blockchainProduct = await contract.products(id);
            if (!blockchainProduct.exists) {
              setProductId('');
              setProductDetails(null);
              setStatus('❌ Product not found on blockchain.');
              return;
            }

            // Call recordQRScan and enforce scan limit
            try {
              const tx = await contract.recordQRScan(id);
              await tx.wait();
              setStatus(`✅ QR scan recorded for product ID ${id}`);
            } catch (scanError) {
              console.error("Scan limit error:", scanError);
              setStatus('❌ QR scan limit reached or scan rejected.');
              return;
            }

            setProductId(id);
            setProductDetails({
              name: parsed.productName,
              batch: parsed.batchId,
            });

          } catch (error) {
            console.error("QR scan parse error:", error);
            setStatus('❌ Invalid QR Code or corrupted data.');
          }
        } else {
          setStatus('❌ Failed to read QR code.');
        }
      };
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="container mt-4">
      <div className="card p-4">
        <h4 className="mb-3">Consumer Panel</h4>

        <div className="mb-3">
          <label className="form-label">Upload QR Code Image:</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleQRUpload}
          />
        </div>

        {productId && productDetails && (
          <div className="mt-4">
            <h6>Product Details</h6>
            <p><strong>Product ID:</strong> {productId}</p>
            <p><strong>Name:</strong> {productDetails.name}</p>
            <p><strong>Batch:</strong> {productDetails.batch}</p>
          </div>
        )}

        {status && (
          <div className="alert alert-info mt-4" role="alert">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerPanel;
