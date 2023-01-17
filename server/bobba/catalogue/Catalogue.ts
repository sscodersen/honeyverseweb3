import CataloguePage from "./CataloguePage";
import BobbaEnvironment from "../BobbaEnvironment";
import RequestCataloguePage from "../communication/outgoing/catalogue/RequestCataloguePage";
import RequestCataloguePurchase from "../communication/outgoing/catalogue/RequestCataloguePurchase";
import { ethers } from 'ethers';

export type CatalogueIndex = {
    id: number;
    name: string;
    iconId: number;
    color: number;
    visible: boolean,
    children: CatalogueIndex[];
};

export default class Catalogue {
    catalogueIndex: CatalogueIndex[];
    pages: { [id: number]: CataloguePage };
    nftContract: ethers.Contract;
    player: Player;

    constructor() {
        this.catalogueIndex = [];
        this.pages = {};
    }

    setIndex(index: CatalogueIndex[], contractAddress: string) {
        this.catalogueIndex = index;
        BobbaEnvironment.getGame().uiManager.onLoadCatalogueIndex(index);
        if (index.length > 0) {
            this.requestPage(index[0].id);
        }
        // Connect to the NFT contract
        const provider = new ethers.providers.Web3Provider(web3.currentProvider);
        this.nftContract = new ethers.Contract(contractAddress, abi, provider.getSigner());
    }
    setPlayer(player: Player){
        this.player = player;
    }

    setCataloguePage(page: CataloguePage) {
        this.pages[page.id] = page;
        BobbaEnvironment.getGame().uiManager.onLoadCataloguePage(page);
    }

    getPage(pageId: number) {
        return this.pages[pageId];
    }

    requestPage(pageId: number) {
        const cachedPage = this.getPage(pageId);
        if (cachedPage == null) {
            BobbaEnvironment.getGame().communicationManager.sendMessage(new RequestCataloguePage(pageId));
        } else {
            BobbaEnvironment.getGame().uiManager.onLoadCataloguePage(cachedPage);
        }
    }

    async requestPurchase(itemId: number) {
        try {
            // Get the price of the item
            const price = await this.nftContract.functions.getPrice(itemId);

            // Check if the player has enough currency
            if (this.player.currency >= price) {
                // Buy the item
                await this.nftContract.functions.buy(itemId, { value: price });

                // Add the item to the player's inventory
                this.player.inventory.push(itemId);

                // Update the player's currency and inventory text
                this.player.currency -= price;
                this.player.updateInventory();
            } else {
                alert('You do not have enough currency to buy this item.');
            }
        }catch (error) {
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
        }
