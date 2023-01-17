import CatalogueItem from "./CatalogueItem";
import { ethers } from 'ethers';

export default class CataloguePage {
id: number;
layout: string;
imageHeadline: string;
imageTeaser: string;
textHeader: string;
textDetails: string;
textMisc: string;
textMisc2: string;
items: CatalogueItem[];
contract: ethers.Contract;
player: Player;
constructor(id: number, layout: string, imageHeadline: string, imageTeaser: string, textHeader: string, textDetails: string, textMisc: string, textMisc2: string, items: CatalogueItem[], contract: ethers.Contract, player: Player) {
    this.id = id;
    this.layout = layout;
    this.imageHeadline = imageHeadline;
    this.imageTeaser = imageTeaser;
    this.textHeader = textHeader;
    this.textDetails = textDetails;
    this.textMisc = textMisc;
    this.textMisc2 = textMisc2;
    this.items = items;
    this.contract = contract;
    this.player = player;
}

async buyItem(itemId: number) {
    try {
        // Get the price of the item
        const price = await this.contract.functions.getPrice(itemId);

        // Check if the player has enough currency
        if (this.player.currency >= price) {
            // Buy the item
            await this.contract.functions.buy(itemId, { value: price });

            // Add the item to the player's inventory
            this.player.inventory.push(itemId);

            // Update the player's currency and inventory text
            this.player.currency -= price;
            this.player.updateInventory();
        } else {
            alert('You do not have enough currency to buy this item.');
        }
    } catch (error) {
        console.error(error);
    }
}
}

class Player {
inventory: number[];
currency: number;
updateInventory: Function;constructor() {
    this.inventory = [];
    this.currency = 0;
}

setUpdateInventory(callback: Function) {
    this.updateInventory = callback;
}
constructor() {
    this.inventory = [];
    this.currency = 0;
}

setUpdateInventory(callback: Function) {
    this.updateInventory = callback;
}
}