import { ethers } from 'ethers';

const contractABI = [
  "function recordTransaction(uint256 _amount, string memory _currency) public",
  "function getUserTransactionCount(address _user) public view returns (uint256)",
  "function getUserTransaction(address _user, uint256 _index) public view returns (uint256, string memory, uint256)"
];

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export async function recordTransactionOnChain(amount: number, currency: string) {
  try {
    if (typeof window.ethereum !== 'undefined') {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.recordTransaction(amount, currency);
      await tx.wait();
      console.log('Transaction recorded on the blockchain');
    } else {
      console.log('Please install MetaMask!');
    }
  } catch (error) {
    console.error('Error recording transaction:', error);
  }
}

export async function getUserTransactions(userAddress: string) {
  try {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);

      const count = await contract.getUserTransactionCount(userAddress);
      const transactions = [];

      for (let i = 0; i < count; i++) {
        const [amount, currency, timestamp] = await contract.getUserTransaction(userAddress, i);
        transactions.push({ amount, currency, timestamp: new Date(timestamp.toNumber() * 1000) });
      }

      return transactions;
    } else {
      console.log('Please install MetaMask!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    return [];
  }
}