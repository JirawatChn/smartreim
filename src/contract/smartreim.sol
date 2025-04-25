// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TrainingReimbursement {
    enum Status {
        Pending,
        Approved,
        Rejected
    }

    enum Role {
        None,
        User,
        Admin
    }

    struct Request {
        address requester;
        string courseName;
        uint256 amount; // unit = wei
        Status status;
        string note;
    }

    mapping(address => Role) public roles;
    mapping(uint256 => Request) public requests;
    mapping(address => uint256[]) public userRequests;

    uint256 public requestCount;

    constructor() {
        roles[msg.sender] = Role.Admin;
    }

    modifier onlyAdmin() {
        require(roles[msg.sender] == Role.Admin, "Only admin can perform this action");
        _;
    }

    receive() external payable {}

    function setRole(Role role) external {
        roles[msg.sender] = role;
    }

    function submitRequest(string calldata courseName, uint256 amount) external {
        if (roles[msg.sender] == Role.None) {
            roles[msg.sender] = Role.User;
        }

        require(roles[msg.sender] == Role.User, "You must be a user to submit");
        require(amount > 0, "Amount must be greater than 0");

        requests[requestCount] = Request({
            requester: msg.sender,
            courseName: courseName,
            amount: amount,
            status: Status.Pending,
            note: ""
        });

        userRequests[msg.sender].push(requestCount);
        requestCount++;
    }

    function getMyRequests() external view returns (uint256[] memory) {
        return userRequests[msg.sender];
    }

    function getRequest(uint256 requestId) external view returns (Request memory) {
        return requests[requestId];
    }

    function approveRequest(uint256 requestId, string calldata note) external onlyAdmin {
        Request storage req = requests[requestId];
        require(req.status == Status.Pending, "Already processed");
        require(address(this).balance >= req.amount, "Not enough balance in contract");

        req.status = Status.Approved;
        req.note = note;

        payable(req.requester).transfer(req.amount);
    }

    function rejectRequest(uint256 requestId, string calldata note) external onlyAdmin {
        Request storage req = requests[requestId];
        require(req.status == Status.Pending, "Already processed");

        req.status = Status.Rejected;
        req.note = note;
    }

    function getAllRequests() external view onlyAdmin returns (Request[] memory) {
        Request[] memory all = new Request[](requestCount);
        for (uint256 i = 0; i < requestCount; i++) {
            all[i] = requests[i];
        }
        return all;
    }
}
