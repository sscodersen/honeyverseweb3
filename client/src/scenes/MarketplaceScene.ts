import Phaser from 'phaser';
import { MAIN_SCENE } from './keys';

export class MarketplaceScene extends Phaser.Scene {
    private backButton: Phaser.GameObjects.Image;
    private marketplaceContainer: Phaser.GameObjects.Container;

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

        //add marketplace UI elements to container
        //...
    }

    update() {
        // handle user interactions, updates to marketplace items, etc.
    }

    transitionToMain() {
        // transition back to the main scene
        this.scene.start(MAIN_SCENE);
    }
}