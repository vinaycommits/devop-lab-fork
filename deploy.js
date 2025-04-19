const hre = require("hardhat");

async function main() {
  const VerifiEye = await hre.ethers.getContractFactory("VerifiEye");
  const contract = await VerifiEye.deploy();
  await contract.waitForDeployment();

  console.log("✅ VerifiEye deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
