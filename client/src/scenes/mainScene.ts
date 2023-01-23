import Phaser from 'phaser';
import { CATALOGUE_SCENE, ROOM_SCENE, SETTINGS_SCENE } from './keys';

export class MainGameScreen extends Phaser.Scene {
    private player: Phaser.Physics.Arcade.Sprite;
    private currentRoom: string;
    private catalogueButton: Phaser.GameObjects.Image;
    private roomsButton: Phaser.GameObjects.Image;
    private settingsButton: Phaser.GameObjects.Image;
    private catalog: any;
    private roomList: any;
    private settings: any;

    constructor() {
        super({ key: 'MainGameScreen' });
    }

    preload() {
        // load assets such as player sprites, tilemaps, UI elements, etc.
        this.load.image('catalogueButton', 'assets/catalogue-button.png');
        this.load.image('roomsButton', 'assets/rooms-button.png');
        this.load.image('settingsButton', 'assets/settings-button.png');
    }

    create() {
        //initialise player
        this.player = this.physics.add.sprite(0, 0, 'playerSprite');
        this.player.setSize(15, 22);
        this.player.setCollideWorldBounds(true);

        //load current room
        this.currentRoom = 'lobby';
        this.loadRoom();

        //initialise navigation buttons
        this.catalogueButton = this.add.image(50, 50, 'catalogueButton').setInteractive();
        this.catalogueButton.on('pointerdown', this.transitionToCatalogue, this);
        this.roomsButton = this.add.image(150, 50, 'roomsButton').setInteractive();
        this.roomsButton.on('pointerdown', this.transitionToRooms, this);
        this.settingsButton = this.add.image(250, 50, 'settingsButton').setInteractive();
        this.settingsButton.on('pointerdown', this.transitionToSettings, this);

        //load catalog, room list, and settings data
        this.catalog = this.loadCatalog();
        this.roomList = this.loadRoomList();
        this.settings = this.loadSettings();
    }

    update() {
        // handle user interactions, updates to marketplace items, etc.
    }

    transitionToCatalogue() {
        this.scene.start(CATALOGUE_SCENE, { catalog: this.catalog });
    }

    transitionToRooms() {
        this.scene.start(ROOM_SCENE, { roomList: this.roomList });
    }

    transitionToSettings() {
        this.scene.start(SETTINGS_SCENE, { settings: this.settings });
    }

    loadRoom() {
        // code to load the current room
    }

    loadCatalog() {
        // code to load the catalog data
    }

    loadRoomList() {
        // code to load the list of rooms
    }

    loadSettings() {
        // code to load the settings data