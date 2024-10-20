// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransactionRecord {
    struct Transaction {
        address user;
        uint256 amount;
        string currency;
        uint256 timestamp;
    }

    Transaction[] public transactions;
    mapping(address => uint256[]) public userTransactions;

    event TransactionRecorded(address indexed user, uint256 amount, string currency, uint256 timestamp);

    function recordTransaction(uint256 _amount, string memory _currency) public {
        uint256 transactionId = transactions.length;
        transactions.push(Transaction(msg.sender, _amount, _currency, block.timestamp));
        userTransactions[msg.sender].push(transactionId);
        emit TransactionRecorded(msg.sender, _amount, _currency, block.timestamp);
    }

    function getUserTransactionCount(address _user) public view returns (uint256) {
        return userTransactions[_user].length;
    }

    function getUserTransaction(address _user, uint256 _index) public view returns (uint256, string memory, uint256) {
        require(_index < userTransactions[_user].length, "Transaction index out of bounds");
        uint256 transactionId = userTransactions[_user][_index];
        Transaction memory txn = transactions[transactionId];
        return (txn.amount, txn.currency, txn.timestamp);
    }
}
