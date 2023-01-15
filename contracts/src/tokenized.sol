pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/SafeERC721.sol";

contract ItemNFT is SafeERC721 {
    // Define the name and symbol of the token
    string public name = "Item NFT";
    string public symbol = "ITM";

    // Define the mapping for storing the token URI (metadata)
    mapping(uint256 => string) public tokenURI;

    // Define the mapping for storing the mutant Satoshi Club NFTs
    mapping(address => mapping(uint256 => bool)) public mutantSatoshiClubNFTs;
    
    // Define an address that can upgrade the contract
    address public owner;
    // Define an address that will have the role of admin
    address public admin;
    // Define an address that can pause the contract
    address public pauser;

    // Event for emitting when a new token is minted
    event Mint(address indexed to, uint256 indexed tokenId);

    // Event for emitting when a token is transferred
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    constructor() public {
        owner = msg.sender;
        admin = msg.sender;
        pauser = msg.sender;
    }
    
    modifier onlyOwner(){
        require(msg.sender == owner);
        _;
    }
    
    modifier onlyPauser(){
        require(msg.sender == pauser);
        _;
    }
    
    modifier onlyAdmin(){
        require(msg.sender == admin);
        _;
    }
    
    modifier whenNotPaused(){
        require(!isPaused());
        _;
    }

    function mint(address _owner, uint256 _mutantSatoshiClubNFTId, string memory _tokenURI) public whenNotPaused onlyAdmin {
        require(mutantSatoshiClubNFTs[_owner][_mutantSatoshiClubNFTId], "The caller does not own the mutant Satoshi Club NFT
