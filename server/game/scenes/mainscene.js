class MainScene extends Phaser.Scene {
    channel;
    player;
    initialPos;
    marketplaceButton;
    
    constructor() {
        super({ key: 'MainScene' });
    }

    init({ channel, initialPos }) {
        this.channel = channel;
        this.initialPos = initialPos;
    }

    preload() {
        // load assets such as player sprites, tilemaps, etc.
        this.load.image('marketplaceButton', 'assets/marketplace-button.png');
    }

    create() {
        //initialise player
        this.player = this.physics.add.sprite(this.initialPos[0], this.initialPos[1], '');
        this.player.setSize(15, 22);
        this.player.setCollideWorldBounds(true);

        //initialise tilemap
        const map = this.make.tilemap({
            key: 'dungeon-tilemap'
        });
        const walls = map.createLayer('walls', '', 0, 0);

        //set collision
        walls.setCollisionByProperty({ collides: true });
        this.physics.add.collider(this.player, walls);

        //initialise marketplace button
        this.marketplaceButton = this.add.image(50, 50, 'marketplaceButton');
        this.marketplaceButton.setInteractive();
        this.marketplaceButton.on('pointerdown', this.transitionToMarketplace, this);
    }

    update() {
        // handle player movement, collision, etc.
    }

    transitionToMarketplace() {
        // transition to the marketplace scene
        this.scene.start(MARKETPLACE_SCENE);
    }
}
