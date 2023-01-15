pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/UpgradeabilityProxy.sol";
import "./ItemMarketplace.sol";

contract ItemMarketplaceProxy is UpgradeabilityProxy {
    constructor(address _implementation)
        UpgradeabilityProxy(_implementation)
    {}
}
