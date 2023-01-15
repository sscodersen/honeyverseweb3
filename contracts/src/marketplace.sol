pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/SafeERC721.sol";

contract ItemMarketplace is SafeERC721 {
    // Define the name and symbol of the token
    string public name = "Item Marketplace";
    string public symbol = "ITM";

    // Define the mapping for storing the token URI (metadata)
    mapping(uint256 => string) public tokenURI;

    // Define a struct for storing item listings
    struct ItemListing {
        address owner; // The address of the item owner
        uint256 itemId; // The ID of the item
        uint256 price; // The price of the item in wei
    }

    // Define a mapping for storing item listings
    mapping(uint256 => ItemListing) public listings;

    // Event for emitting when a new item is listed
    event ItemListed(address indexed owner, uint256 indexed itemId, uint256 price);

    // Event for emitting when an item is purchased
    event ItemPurchased(address indexed buyer, address indexed seller, uint256 indexed itemId);

    // Function to create a new item listing
    function listItem(uint256 itemId, uint256 price) public {
        // Make sure the caller is the owner of the item
        require(_isOwner(msg.sender, itemId), "Caller is not the owner of the item.");
        // Make sure the item is not already listed
        require(!listings[itemId].owner, "Item is already listed.");
        // Create a new listing
        listings[itemId] = ItemListing(msg.sender, itemId, price);
        // Emit the ItemListed event
        emit ItemListed(msg.sender, itemId, price);
    }

    // Function to purchase an item
    function purchaseItem(uint256 itemId) public payable {
        // Make sure the item is listed
        require(listings[itemId].owner, "Item is not listed.");
        // Make sure the buyer has enough ether to purchase the item
        require(msg.value >= listings[itemId].price, "Insufficient ether to purchase
