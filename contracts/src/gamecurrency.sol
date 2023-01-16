pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/access/Roles.sol";
import "@openzeppelin/contracts/utils/SafeMath.sol";

contract MBTC is SafeERC20 {
    using SafeMath for uint256;
    using Roles for address;

    // Define the name, symbol, and total supply of the token
    string public name = "MBTC";
    string public symbol = "MBTC";
    uint256 public totalSupply;

    // Define the mapping for storing user balances
    mapping(address => uint256) public balanceOf;

    // Define the roles for the contract
    address public owner;
    address public admin;
    address public pauser;
    address public voter;

    // Event for emitting when a new token is minted
    event Mint(address indexed to, uint256 amount);

    // Event for emitting when a token is transferred
    event Transfer(address indexed from, address indexed to, uint256 value);

    // Event for emitting when the contract is paused
    event Pause();

    // Event for emitting when the contract is unpaused
    event Unpause();

    // Event for emitting when a vote is cast
    event Vote(address indexed voter, uint256 proposalId, bool vote);

    constructor() public {
        owner = msg.sender;
        admin = msg.sender;
        pauser = msg.sender;
voter = msg.sender;
    // assign the admin, pauser, and voter roles to the owner
    addRole(msg.sender, Roles.Admin);
    addRole(msg.sender, Roles.Pauser);
    addRole(msg.sender, Roles.Voter);

    // Mint the initial supply of tokens and assign them to the owner
    totalSupply = 1000000000e18;
    balanceOf[owner] = totalSupply;
    emit Mint(owner, totalSupply);
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

// Function to set the voter address
function setVoter(address _voter) public onlyOwner {
    voter = _voter;
    addRole(_voter, Roles.Voter);
}

// Function to mint new tokens
function mint(address _to, uint256 _value) public onlyAdmin whenNotPaused {
    require(balanceOf[_to] + _value > balanceOf[_to], "Overflow detected in token minting");
    balanceOf[_to] = balanceOf[_to].add(_value);
    totalSupply = totalSupply.add(_value);
    emit Mint(_to, _value);
}

// Function to transfer tokens
function transfer(address _to, uint256 _value) public onlyPayee whenNotPaused {
    require(_to != address(0), "Cannot transfer to the zero address");
    require(_value <= balanceOf[msg.sender], "Insufficient balance");

    balanceOf[msg.sender] = balanceOf[msg.sender].sub(_value);
    balanceOf[_to] = balanceOf[_to].add(_value);
    emit Transfer(msg.sender, _to, _value);
}

// Function to vote on proposals
function vote(uint256 _proposalId, bool _vote) public onlyVoter whenNotPaused {
    emit Vote(msg.sender, _proposalId, _vote);
}

// Function to pause the contract
function pause() public onlyPauser {
    emit Pause();
}

// Function to unpause the contract
function unpause() public onlyPauser {
    emit Unpause();
}

