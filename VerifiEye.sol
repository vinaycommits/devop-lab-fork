// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VerifiEye {

    address public owner;
    uint public productCounter = 1;
    uint8 public constant MAX_QR_SCANS = 3;

    enum Role { None, Manufacturer, Seller, Consumer }
    
    struct Product {
        uint productId;
        string name;
        string batchId;
        address manufacturer;
        address currentOwner;
        address[] ownershipHistory;
        bool exists;
    }

    mapping(address => Role) public roles;
    mapping(uint => Product) public products;
    mapping(uint => uint8) public qrScanCount;

    event ProductAdded(uint indexed productId, address indexed manufacturer);
    event SellerAdded(address indexed seller);
    event OwnershipTransferred(uint indexed productId, address indexed from, address indexed to);
    event QRScanned(uint indexed productId, address indexed scanner, uint scanCount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyManufacturer() {
        require(roles[msg.sender] == Role.Manufacturer, "Not a manufacturer");
        _;
    }

    modifier onlySeller() {
        require(roles[msg.sender] == Role.Seller, "Not a seller");
        _;
    }

    constructor() {
        owner = msg.sender;
        roles[msg.sender] = Role.Manufacturer; // Contract deployer is default manufacturer
    }

    // Role Management
    function addManufacturer(address _manufacturer) external onlyOwner {
        roles[_manufacturer] = Role.Manufacturer;
    }

    function addSeller(address _seller) external onlyManufacturer {
        roles[_seller] = Role.Seller;
        emit SellerAdded(_seller);
    }

    // Product Registration by Manufacturer
    function addProduct(string memory _name, string memory _batchId) external onlyManufacturer {
        uint productId = productCounter++;
        Product storage p = products[productId];

        p.productId = productId;
        p.name = _name;
        p.batchId = _batchId;
        p.manufacturer = msg.sender;
        p.currentOwner = msg.sender;
        p.ownershipHistory.push(msg.sender);
        p.exists = true;

        emit ProductAdded(productId, msg.sender);
    }

    // Transfer Ownership to Seller
    function transferToSeller(uint productId, address _seller) external onlyManufacturer {
        require(products[productId].exists, "Invalid product");
        require(roles[_seller] == Role.Seller, "Address is not a seller");

        Product storage p = products[productId];
        require(msg.sender == p.currentOwner, "Unauthorized transfer");

        p.currentOwner = _seller;
        p.ownershipHistory.push(_seller);

        emit OwnershipTransferred(productId, msg.sender, _seller);
    }

    // Scan QR Code (by any role)
    function recordQRScan(uint productId) external {
        require(products[productId].exists, "Product not found");
        require(qrScanCount[productId] < MAX_QR_SCANS, "QR scan limit reached");

        qrScanCount[productId]++;

        emit QRScanned(productId, msg.sender, qrScanCount[productId]);
    }

    // Validate QR Code
    function isQRCodeValid(uint productId) external view returns (bool) {
        return products[productId].exists && qrScanCount[productId] < MAX_QR_SCANS;
    }

    // View Product Details
    function getProduct(uint productId) external view returns (
        string memory name,
        string memory batchId,
        address manufacturer,
        address currentOwner,
        address[] memory ownershipHistory,
        uint8 scanCount
    ) {
        require(products[productId].exists, "Product not found");
        Product storage p = products[productId];
        return (p.name, p.batchId, p.manufacturer, p.currentOwner, p.ownershipHistory, qrScanCount[productId]);
    }
}