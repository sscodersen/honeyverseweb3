pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/SafeERC721.sol";
import "@openzeppelin/contracts/access/Roles.sol";
import "@openzeppelin/contracts/utils/SafeMath.sol";

contract ItemMarketplace is SafeERC721 {
    using SafeMath for uint256;
    using Roles for address;

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
        bool forSale; // Whether the item is for sale or not
        bool forTrade; // Whether the item is for trade or not
    }

    // Define a mapping for storing item listings
    mapping(uint256 => ItemListing) public listings;

    // Define a mapping for storing the item value history
    mapping(uint256 => mapping(uint256 => uint256)) public itemValueHistory;

    // Define a mapping for storing user balances
    mapping(address => uint256) public userBalances;

    // Define the roles for the contract
    address public owner;
    address public admin;
    address public pauser;
    address public operator;

    // Event for emitting when a new item is listed
    event ItemListed(address indexed owner, uint256 indexed itemId, uint256 price, bool forSale, bool forTrade);

    // Event for emitting when an item is purchased
    event ItemPurchased
// Event for emitting when an item is traded
event ItemTraded(address indexed sender, address indexed receiver, uint256 indexed itemId);

// Event for emitting when the value of an item changes
event ItemValueChanged(uint256 indexed itemId, uint256 value);

// Event for emitting when an user balance is updated
event UserBalanceUpdated(address indexed user, uint256 balance);

constructor() public {
    owner = msg.sender;
    admin = msg.sender;
    pauser = msg.sender;
    operator = msg.sender;

    // assign the admin, pauser and operator roles to the owner
    addRole(msg.sender, Roles.Admin);
    addRole(msg.sender, Roles.Pauser);
    addRole(msg.sender, Roles.Operator);
}

// Function to set the admin address
function setAdmin(address _admin) public onlyOwner {
    require(isNotOperator(_admin), "The admin address is an operator");
    admin = _admin;
    addRole(_admin, Roles.Admin);
}

// Function to set the pauser address
function setPauser(address _pauser) public onlyOwner {
    require(isNotOperator(_pauser), "The pauser address is an operator");
    pauser = _pauser;
    addRole(_pauser, Roles.Pauser);
}

// Function to set the operator address
function setOperator(address _operator) public onlyOwner {
    operator = _operator;
    addRole(_operator, Roles.Operator);
}

// Function to create a new item listing
function listItem(uint256 itemId, uint256 price, bool _forSale, bool _forTrade) public onlyOperator {
    // Make sure the caller is the owner of the item
    require(_isOwner(msg.sender, itemId), "Caller is not the owner of the item.");
    // Make sure the item is not already listed
    require(!listings[itemId].owner, "Item is already listed.");
    // Create a new listing
    listings[itemId] = ItemListing(msg.sender, itemId, price, _forSale, _forTrade);
    // Emit the ItemListed event
emit ItemListed(msg.sender, itemId, price, _forSale, _forTrade);
}

// Function to purchase an item
function purchaseItem(uint256 itemId) public payable {
require(!isPaused(), "The contract is paused");
// Make sure the item is listed
require(listings[itemId].owner, "Item is not listed.");
// Make sure the item is for sale
require(listings[itemId].forSale, "Item is not for sale.");
// Make sure the buyer has enough ether to purchase the item
require(msg.value >= listings[itemId].price, "Insufficient ether to purchase item.");
// Get the item listing
ItemListing storage listing = listings[itemId];
// Transfer ownership of the item to the buyer
_transfer(msg.sender, listing.owner, itemId);
// Update the user balance
userBalances[msg.sender] = userBalances[msg.sender].sub(listing.price);
userBalances[listing.owner] = userBalances[listing.owner].add(listing.price);
emit UserBalanceUpdated(msg.sender, userBalances[msg.sender]);
emit UserBalanceUpdated(listing.owner, userBalances[listing.owner]);
// Emit the ItemPurchased event
emit ItemPurchased(msg.sender, listing.owner, itemId);
}

// Function to trade an item
function tradeItem(uint256 itemId, address _receiver) public {
require(!isPaused(), "The contract is paused");
// Make sure the caller is the owner of the item
require(_isOwner(msg.sender, itemId), "Caller is not the owner of the item.");
// Make sure the item is listed
require(listings[itemId].owner, "Item is not listed.");
// Make sure the item is for trade
require(listings[itemId].forTrade, "Item is not for trade.");
// Make sure the receiver is not the caller
require(msg.sender != _receiver, "Receiver address is the same as caller");
// Transfer ownership of the item to the receiver
_transfer(msg.sender, _receiver, itemId);
// Emit the Item Traded event
emit ItemTraded(msg.sender, _receiver, itemId);
}

// Function to update the value of an item
function updateItemValue(uint256 itemId, uint256 value) public onlyAdmin {
// Make sure the item is listed
require(listings[itemId].owner, "Item is not listed.");
// Make sure the new value is greater than the previous value
require(value > itemValueHistory[itemId][block.timestamp], "New value is not greater than previous value.");
// Update the value in the item value history mapping
itemValueHistory[itemId][block.timestamp] = value;
// Emit the ItemValueChanged event
emit ItemValueChanged(itemId, value);
}

// Function to pause the contract
function pause() public onlyPauser {
pause();
}

// Function to unpause the contract
function unpause() public onlyPauser {
unpause();
}

// Helper function to check if the address is an operator
function isNotOperator(address _address) internal view returns (bool) {
return !isOperator(_address);
}
}