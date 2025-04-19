
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import contractABI from './abi/VerifiEyeABI.json';
import ManufacturerPanel from './components/ManufacturerPanel';
import SellerPanel from './components/SellerPanel'; // Make sure this component is created
import OwnerPanel from './components/OwnerPanel';
import 'bootstrap/dist/css/bootstrap.min.css';



const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; // Replace with actual deployed address

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [connectedRole, setConnectedRole] = useState('');

  

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send('eth_requestAccounts', []);
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
  
          setAccount(address);
  
          const verifiEye = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
          setContract(verifiEye);
  
          const ownerAddress = await verifiEye.owner();
          if (address.toLowerCase() === ownerAddress.toLowerCase()) {
            setConnectedRole("Owner");
          } else {
            const roleId = await verifiEye.roles(address);
            switch (roleId.toString()) {
              case "1":
                setConnectedRole("Manufacturer");
                break;
              case "2":
                setConnectedRole("Seller");
                break;
              case "3":
                setConnectedRole("Consumer");
                break;
              default:
                setConnectedRole("None");
            }
          }
  
          window.ethereum.on('accountsChanged', async (accounts) => {
            window.location.reload();
          });
  
          console.log("✅ Contract initialized:", verifiEye);
        } catch (err) {
          console.error("Error initializing contract:", err);
        }
      } else {
        alert("Please install MetaMask.");
      }
    };
  
    init();
  }, []); 
  

  return (
    
    <div style={{ padding: '2rem' }}>
      <h2>VerifiEye DApp</h2>
      

      {connectedRole && <p>Authenticated as: <strong>{connectedRole}</strong></p>}

      {connectedRole === "Manufacturer" && (
        <ManufacturerPanel contract={contract} account={account} />
      )}

      {connectedRole === "Seller" && (
        <SellerPanel contract={contract} account={account} />
      )}
      {connectedRole === "Owner" && (
  <OwnerPanel contract={contract} account={account} />
)}


    <p><strong>Connected Wallet:</strong> {account}</p>

    </div>

  );
}

export default App;
