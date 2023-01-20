import Phaser from 'phaser';
import { MARKETPLACE_SCENE, MAIN_SCENE } from './keys';

export class TransactionScene extends Phaser.Scene {
    private signer: ethers.Signer;
    private backButton: Phaser.GameObjects.Image;
    private transactionContainer: Phaser.GameObjects.Container;
    private item: any;
    private price: any;

    constructor() {
        super({ key: 'TransactionScene' });
    }

    init({ item, price }: { item: any; price: any }) {
        this.item = item;
        this.price = price;
    }

    preload() {
        // load assets such as button sprites, transaction UI elements, etc.
        this.load.image('backButton', 'assets/back-button.png');
    }

    create() {
        // get signer instance from the registry
        this.signer = this.registry.get(SIGNER);

        //create back button
        this.backButton = this.add.image(50, 50, 'backButton');
        this.backButton.setInteractive();
        this.backButton.on('pointerdown', this.transitionToMarketplace, this);

        //create transaction container
        this.transactionContainer = this.add.container(400, 300);

        //add transaction UI elements to container, such as item name, price, and image
        //...

        //add purchase button and event listener
        const purchaseButton = this.add.image(400, 400, 'purchaseButton');
        purchaseButton.setInteractive();
        purchaseButton.on('pointerdown', this.handlePurchase, this);
    }

    handlePurchase() {
        // use the signer instance to interact with the smart contract and make the purchase
        // update the player's inventory once the transaction is successful
        // ...
    }

    transitionToMarketplace() {
        // transition back to the marketplace scene
        this.scene.start(MARKETPLACE_SCENE);
    }
}