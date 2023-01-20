import Phaser from 'phaser';
import { LAND_SCENE } from './keys';

class LandScene extends Phaser.Scene {
    private signer: any;
    private landContract: any;
    private landId: number;
    private backButton: Phaser.GameObjects.Image;
    private landContainer: Phaser.GameObjects.Container;
    private landInfo: Phaser.GameObjects.Text;

    constructor() {
        super({ key: LAND_SCENE });
    }

    init({ signer, landId }: { signer: any; landId: number }) {
        this.signer = signer;
        this.landId = landId;
    }

    preload() {
        // load assets such as button sprites, land UI elements, etc.
        this.load.image('backButton', 'assets/back-button.png');
    }

    create() {
        //create back button
        this.backButton = this.add.image(50, 50, 'backButton');
        this.backButton.setInteractive();
        this.backButton.on('pointerdown', this.transitionToLobby, this);

        //create land container
        this.landContainer = this.add.container(400, 300);

        //add land UI elements to container
        this.landInfo = this.add.text(0, 0, 'Loading land info...');
        this.landContainer.add(this.landInfo);

        //load land information
        this.loadLandInfo();
    }

    async loadLandInfo() {
        //load land contract
        this.landContract = new this.signer.contract(LAND_ABI, LAND_ADDRESS);

        //get land information
        const land = await this.landContract.functions.lands(this.landId);
        this.landInfo.setText(`Name: ${land.name}\nOwner: ${land.owner}\nPrice: ${land.price} wei`);

        //add other land UI elements
        //...
    }

    transitionToLobby() {
        // transition back to the lobby scene
        this.scene.start(LOBBY_SCENE, { signer: this.signer });
    }
}
