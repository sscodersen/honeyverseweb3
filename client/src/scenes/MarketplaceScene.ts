import Phaser from 'phaser';
import { MAIN_SCENE } from './keys';
import { Item } from './models/item';
import { Signer } from 'ethers';

export class MarketplaceScene extends Phaser.Scene {
    private backButton: Phaser.GameObjects.Image;
    private marketplaceContainer: Phaser.GameObjects.Container;
    private signer: Signer;
    private items: Item[] = [];

    constructor() {
        super({ key: 'MarketplaceScene' });
    }

    init(data: any) {
        this.signer = data.signer;
        this.items = data.items;
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

        //add marketplace UI elements to container
        this.createMarketplace();
    }

    createMarketplace() {
        //create marketplace UI elements
        this.items.forEach((item) => {
            const itemContainer = this.add.container(0, 0);
            // create item name text
            const itemName = this.add.text(0, 0, item.name, { font: '24px Arial' });
            // create item price text
            const itemPrice = this.add.text(0, 50, `Price: ${item.price} ETH`, { font: '24px Arial' });
            // create item image
            const itemImage = this.add.image(200, 0, item.image);
            //create buy button
            const buyButton = this.add.text(200, 150, 'Buy', { font: '24px Arial' });
            buyButton.setInteractive();
            buyButton.on('pointerdown', async () => {
                try {
                    // interact with smart contract to purchase item
                    const contract = new this.signer.provider.eth.Contract(item.abi, item.address);
                    const tx = await contract.functions.purchase(item.id, { value: item.price });
                    const receipt = await tx.wait();
                    // add item to player's inventory
                    // ...
                } catch (e) {
                    console.error(e);
                }
            });
            itemContainer.add([itemName, itemPrice, itemImage, buyButton]);
            this.marketplaceContainer.add(itemContainer);
        });
    }

    update() {
        // handle user interactions, updates to marketplace items, etc.
    }

    transitionToMain() {
        // transition back to the main scene
        this.scene.start(MAIN_SCENE);
    }
}
