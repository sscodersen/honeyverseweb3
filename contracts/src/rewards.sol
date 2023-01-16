pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Roles.sol";
import "@openzeppelin/contracts/utils/SafeMath.sol";

contract RewardDistribution {
    using Roles for address;
    using SafeMath for uint256;

    // Define the roles for the contract
    address public owner;
    address public admin;
    address public pauser;

    // Define the mapping for storing player rewards
    mapping(address => uint256) public rewards;

    // Event for emitting when a reward is distributed
    event RewardDistributed(address indexed player, uint256 reward);

    // Event for emitting when the contract is paused
    event Pause();

    // Event for emitting when the contract is unpaused
    event Unpause();

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
        addRole(__admin, Roles.Admin);
}
// Function to set the pauser address
function setPauser(address _pauser) public onlyOwner {
    pauser = _pauser;
    addRole(_pauser, Roles.Pauser);
}

// Function to distribute rewards to a player
function distributeReward(address _player, uint256 _reward) public onlyAdmin whenNotPaused {
    rewards[_player] = rewards[_player].add(_reward);
    emit RewardDistributed(_player, _reward);
}

// Function to withdraw rewards
function withdrawReward() public {
    require(rewards[msg.sender] > 0, "You have no rewards to withdraw");
    uint256 reward = rewards[msg.sender];
    rewards[msg.sender] = 0;
    msg.sender.transfer(reward);
}

// Function to pause the contract
function pause() public onlyPauser {
    emit Pause();
}

// Function to unpause the contract
function unpause() public onlyPauser {
    emit Unpause();
}

