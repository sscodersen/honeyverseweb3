pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/SafeERC721.sol";
import "@openzeppelin/contracts/access/Roles.sol";

contract PandaBreeder is SafeERC721 {
    using Roles for address;

    // Define the name and symbol of the token
    string public name = "Mutant Satoshi Club Panda";
    string public symbol = "MSCP";

    // Define the mapping for storing the token URI (metadata)
    mapping(uint256 => string) public tokenURI;

    // Define the mapping for storing the mutant Satoshi Club pandas
    mapping(address => mapping(uint256 => bool)) public mutantSatoshiClubPandas;

    // Define the owner, admin, and pauser addresses
    address public owner;
    address public admin;
    address public pauser;

    // Event for emitting when a new token is minted
    event Mint(address indexed to, uint256 indexed tokenId);

    // Event for emitting when a token is transferred
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    // Event for emitting when two pandas are bred to create a new one
    event Breed(address indexed owner, uint256 parent1Id, uint256 parent2Id, uint256 offspringId);

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
        require (isNotPauser(_admin), "The admin address is a pauser");
admin = _admin;
addRole(_admin, Roles.Admin);
}
// Function to set the pauser address
function setPauser(address _pauser) public onlyOwner {
    pauser = _pauser;
    addRole(_pauser, Roles.Pauser);
}

// Function to mint a new Panda NFT
function mint(address _owner, uint256 _pandaId, string memory _tokenURI) public onlyAdmin whenNotPaused {
    require(!mutantSatoshiClubPandas[_owner][_pandaId], "The caller already owns a Panda with this ID.");
    mutantSatoshiClubPandas[_owner][_pandaId] = true;
    _mint(_owner, _pandaId);
    tokenURI[_pandaId] = _tokenURI;
    emit Mint(_owner, _pandaId);
}

// Function to breed two pandas to create a new one
function breed(uint256 _parent1Id, uint256 _parent2Id) public onlyOwner whenNotPaused {
    require(mutantSatoshiClubPandas[msg.sender][_parent1Id], "Caller does not own parent Panda 1.");
    require(mutantSatoshiClubPandas[msg.sender][_parent2Id], "Caller does not own parent Panda 2.");

    // Generate a new Panda ID
    uint256 newPandaId = keccak256(abi.encodePacked(_parent1Id, _parent2Id, block.timestamp));

    // Mint the new Panda NFT
    mutantSatoshiClubPandas[msg.sender][newPandaId] = true;
    _mint(msg.sender, newPandaId);

    // Emit the Breed event
    emit Breed(msg.sender, _parent1Id, _parent2Id, newPandaId);
}

