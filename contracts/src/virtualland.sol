pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/SafeERC721.sol";
import "@openzeppelin/contracts/access/Roles.sol";

contract VirtualRealEstate is SafeERC721 {
    using Roles for address;

    // Define the name and symbol of the token
    string public name = "Virtual Real Estate";
    string public symbol = "VRE";

    // Define the mapping for storing the token URI (metadata)
    mapping(uint256 => string) public tokenURI;

    // Define the mapping for storing the virtual real estate properties
    mapping(address => mapping(uint256 => bool)) public properties;

    // Define the owner, admin, and pauser addresses
    address public owner;
    address public admin;
    address public pauser;

    // Event for emitting when a new token is minted
    event Mint(address indexed to, uint256 indexed tokenId);

    // Event for emitting when a token is transferred
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    // Event for emitting when a property is rented
    event Rent(address indexed renter, uint256 indexed tokenId, uint256 rentPrice, uint256 rentDuration);

    constructor() public {
        owner = msg.sender;
        admin = msg.sender;
        pauser = msg.sender;

        // assign the admin and pauser roles to the owner
        addRole(msg.sender, Roles.Admin);
        addRole(msg.sender, Roles.Pauser);
    }

    // Function to set the admin address
    function setAdmin(address _admin) public onlyOwner {
        require(isNotPauser(_admin), "The admin address is a pauser");
        admin = _admin;
        addRole(_admin, Roles.Admin);
    }

    // Function to set the pauser address
    function setPauser(address _pauser) public onlyOwner {
        pauser = _pauser;
        addRole(_pauser, Roles.Pauser);
    }

    // Function to mint a new virtual real estate property
    function mint(address _owner, uint256 _propertyId, string memory _tokenURI) public onlyAdmin whenNotPaused {
        require(!properties[_owner][_propertyId], "The caller already owns a property with this ID.");
        properties[_owner][_propertyId] = true;
        _mint(_owner, _propertyId);
        tokenURI[_propertyId] = _tokenURI;
        emit Mint(_owner, _propertyId);
    }

    // Function to rent a property
    function rent(uint256 _propertyId, uint256 _rentPrice, uint256 _rentDuration) public payable whenNotPaused {
        require(properties[msg.sender][_propertyId], "The caller does not own the property.");
require(msg.value >= _rentPrice, "The provided rent price is insufficient.");
require(_rentDuration > 0, "The provided rent duration is not valid.");
    // Get the current time
    uint256 currentTime = now;
    // Set the rent expiration time
    uint256 rentExpiration = currentTime.add(_rentDuration);

    // Create a mapping to store the rent information
    mapping(uint256 => mapping(address => mapping(string => uint256))) public rentInfo;
    rentInfo[_propertyId][msg.sender]["rentPrice"] = _rentPrice;
    rentInfo[_propertyId][msg.sender]["rentDuration"] = _rentDuration;
    rentInfo[_propertyId][msg.sender]["rentExpiration"] = rentExpiration;

    // Transfer the rent price to the property owner
    msg.sender.transfer(_rentPrice);

    // Emit the Rent event
    emit Rent(msg.sender, _propertyId, _rentPrice, _rentDuration);
}

// Function to check if a property is currently being rented
function isRented(uint256 _propertyId) public view returns (bool) {
    mapping(uint256 => mapping(address => mapping(string => uint256))) public rentInfo;
    return rentInfo[_propertyId][msg.sender]["rentExpiration"] > now;
}

