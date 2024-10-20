import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  
  const TransactionRecord = await ethers.getContractFactory("TransactionRecord");
  console.log("Deploying TransactionRecord...");
  const transactionRecord = await TransactionRecord.deploy();
  
  if (transactionRecord.deploymentTransaction()) {
    console.log("Transaction hash:", transactionRecord.deploymentTransaction()!.hash);
  }
  await transactionRecord.waitForDeployment();
  console.log("TransactionRecord deployed to:", await transactionRecord.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
