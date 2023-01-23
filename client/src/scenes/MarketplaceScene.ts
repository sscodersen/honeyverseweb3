import Phaser from 'phaser';
import { getContract } from './contracts';

export class MarketplaceScene extends Phaser.Scene {
    private backButton: Phaser.GameObjects.Image;
    private marketplaceContainer: Phaser.GameObjects.Container;
    private itemList: Phaser.GameObjects.Text[];
    private marketplaceContract: any;

    constructor() {
        super({ key: 'MarketplaceScene' });
    }

    preload() {
        // load assets such as button sprites, marketplace UI elements, etc.
        this.load.image('backButton', 'assets/back-button.png');
    }

    create() {
        //create back button
        this.backButton = this.add.image(50, 50, 'backButton');
        this.backButton.setInteractive();
        this.backButton.on('pointerdown', this.transitionToMain, this);

        //create marketplace container
        this.marketplaceContainer = this.add.container(400, 300);

        //initialize the marketplace contract
        this.marketplaceContract = getContract('Marketplace');

        //get the list of items available for purchase
        this.marketplaceContract.getItemList().then((itemList: string[]) => {
            this.itemList = [];
            for (let i = 0; i < itemList.length; i++) {
                //create a new text object for each item and add it to the marketplace container
                const itemText = this.add.text(0, i * 20, itemList[i], { color: 'white' });
                this.itemList.push(itemText);
                this.marketplaceContainer.add(itemText);

                //set the text object as interactive and add a pointerdown listener to handle purchases
                itemText.setInteractive();
                itemText.on('pointerdown', () => {
                    this.handlePurchase(itemList[i]);
                });
            }
        });
    }

    handlePurchase(itemName: string) {
        // code to handle making a purchase of the selected item
        // this will likely involve calling a smart contract function and passing in the item name or ID as an argument
        this.marketplaceContract.purchaseItem(itemName, { value: this.getItemPrice(itemName) })
            .then((transactionReceipt) => {
                console.log(`Successfully purchased ${itemName}. Transaction receipt:`, transactionReceipt);
                this.createTransactionConfirmation(transactionReceipt);
            }).catch((error) => {
                console.error(`Error purchasing ${itemName}:`, error);
                this.createTransactionError(error);
            });
    }

    getItemPrice(itemName: string) {
        //code to retrieve the price of the selected item
        //this will likely involve calling a smart contract function and passing in the item name or ID as an argument
        return this.marketplaceContract.getItemPrice(itemName);
    }

    createTransactionConfirmation(transactionReceipt: any) {
        // code to create a UI element or message to confirm the transaction to the user
    }

    createTransactionError(error: any) {
        // code to create a UI element or message to inform the user of the error
    }

    transitionToMain() {
        this.scene.start('MainScene');
    }

}