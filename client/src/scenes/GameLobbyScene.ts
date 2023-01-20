import Phaser from 'phaser';
import { LAND_SCENE } from './keys';
import { Land } from './land';

export class GameLobbyScene extends Phaser.Scene {
    private lands: Land[];
    private backButton: Phaser.GameObjects.Image;
    private landMenu: Phaser.GameObjects.Container;

    constructor() {
        super({ key: 'GameLobbyScene' });
    }

    preload() {
        // load assets such as button sprites, land menu UI elements, etc.
        this.load.image('backButton', 'assets/back-button.png');
    }

    create() {
        // create back button
        this.backButton = this.add.image(50, 50, 'backButton');
        this.backButton.setInteractive();
        this.backButton.on('pointerdown', this.transitionToMain, this);

        // create land menu container
        this.landMenu = this.add.container(400, 300);

        // retrieve player's lands from smart contract
        // ...

        // add land menu UI elements to container
        for (const land of this.lands) {
            const landButton = this.add.text(0, 0, land.name).setInteractive();
            landButton.on('pointerdown', () => this.transitionToLand(land), this);
            this.landMenu.add(landButton);
        }
    }

    private transitionToLand(land: Land) {
        // transition to the land scene
        this.scene.start(LAND_SCENE, { land });
    }

    private transitionToMain() {
        // transition back to the main scene
        this.scene.start(MAIN_SCENE);
    }
}
