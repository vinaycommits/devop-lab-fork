

// import { useState } from 'react';

// const OwnerPanel = ({ contract, account }) => {
//   const [manufacturerAddress, setManufacturerAddress] = useState('');
//   const [status, setStatus] = useState('');

//   const handleAddManufacturer = async () => {
//     if (!manufacturerAddress) {
//       alert("Please enter a wallet address.");
//       return;
//     }

//     try {
//       const tx = await contract.addManufacturer(manufacturerAddress);
//       await tx.wait();
//       setStatus(`✅ Manufacturer added: ${manufacturerAddress}`);
//       setManufacturerAddress('');
//     } catch (error) {
//       console.error("Add manufacturer failed:", error);
//       setStatus('❌ Failed to add manufacturer.');
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <div className="card p-4">
//         <h4 className="mb-3">Owner Panel</h4>

//         <div className="mb-3">
//           <label className="form-label">Manufacturer Wallet Address</label>
//           <input
//             type="text"
//             className="form-control"
//             value={manufacturerAddress}
//             onChange={(e) => setManufacturerAddress(e.target.value)}
//             placeholder="0x..."
//           />
//         </div>

//         <button className="btn btn-primary" onClick={handleAddManufacturer}>
//           Add Manufacturer
//         </button>

//         {status && (
//           <div className="alert alert-info mt-3" role="alert">
//             {status}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OwnerPanel;

import { useState } from 'react';

const OwnerPanel = ({ contract }) => {
  const [manufacturerAddress, setManufacturerAddress] = useState('');
  const [status, setStatus] = useState('');

  const handleAddManufacturer = async () => {
    if (!manufacturerAddress) {
      alert("Please enter a manufacturer address.");
      return;
    }

    try {
      const tx = await contract.addManufacturer(manufacturerAddress);
      await tx.wait();
      setStatus(`✅ Manufacturer added: ${manufacturerAddress}`);
      setManufacturerAddress('');
    } catch (err) {
      console.error("Add manufacturer error:", err);
      setStatus("❌ Failed to add manufacturer.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Manufacturer</h3>
      <input
        className="form-control mb-2"
        placeholder="Wallet Address (0x...)"
        value={manufacturerAddress}
        onChange={(e) => setManufacturerAddress(e.target.value)}
      />
      <button onClick={handleAddManufacturer} className="btn btn-primary">
        Add Manufacturer
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default OwnerPanel;