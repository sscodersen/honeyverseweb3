import { ItemType } from "../imagers/furniture/FurniImager";
import BobbaEnvironment from "../BobbaEnvironment";
import BaseItem from "../items/BaseItem";
import { ethers } from 'ethers';

export default class CatalogueItem {
    itemId: number;
    itemName: string;
    cost: number;
    itemType: ItemType;
    baseId: number;
    baseItem: BaseItem | null;
    amount: number;
    nftContract: ethers.Contract;

    constructor(itemId: number, itemName: string, cost: number, itemType: ItemType, baseId: number, amount: number, contractAddress: string) {
        this.itemId = itemId;
        this.itemName = itemName;
        this.cost = cost;
        this.itemType = itemType;
        this.baseId = baseId;
        this.amount = amount;
        this.baseItem = null;
        // Connect to the NFT contract
        const provider = new ethers.providers.Web3Provider(web3.currentProvider);
        this.nftContract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    }

    async requestPurchase(player: Player) {
        try {
            // Check if the player has enough currency
            if (player.currency >= this.cost) {
                // Buy the item
                await this.nftContract.functions.buy(this.itemId, { value: this.cost });

                // Add the item to the player's inventory
                player.inventory.push(this.itemId);

                // Update the player's currency and inventory text
                player.currency -= this.cost;
                player.updateInventory();
            } else {
                alert('You do not have enough currency to buy this item.');
            }
        } catch (error) {
            console.error(error);
        }
    }

    loadBase(): Promise<BaseItem> {
        return BobbaEnvironment.getGame().baseItemManager.getItem(this.itemType, this.baseId).then(baseItem => {
            this.baseItem = baseItem;
            return baseItem;
        });
    }
}
