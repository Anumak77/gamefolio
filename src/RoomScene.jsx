import { useEffect } from 'react';
import * as Phaser from 'phaser';
import spriteSheet from './assets/sprite_sheet.png';


// import mapRoom from './assets/map/map_room.json';

const RoomScene = () => {
    useEffect(() => {
        const config = {
            backgroundColor: '#202020',
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'room-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scene: {
                preload,
                create,
                update
            }
        };

        let player;
        let cursors;
        let spaceKey;
        let interactables = [];

        const game = new Phaser.Game(config);

        function preload() {
            this.load.tilemapTiledJSON('map_room', '/assets/map/map_room.json');
            this.load.image('furniture', './assets/tilesets/House_FurnitureState2.png');
            this.load.image('small_furniture', './assets/tilesets/House_SmallItems.png');
            this.load.image('floor', './assets/tilesets/House_FloorsAndWalls.png');
            this.load.image('door', './assets/tilesets/House_DoorsAndWindows.png');
            this.load.spritesheet('anu', spriteSheet, { frameWidth: 48, frameHeight: 98 });
        }

        function create() {

            this.anims.create({
                key: 'down',
                frames: this.anims.generateFrameNumbers('anu', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('anu', { start: 12, end: 14 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('anu', { start: 24, end: 26 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'up',
                frames: this.anims.generateFrameNumbers('anu', { start: 36, end: 38 }),
                frameRate: 10,
                repeat: -1
            });

            const map = this.make.tilemap({ key: 'map_room' });

            console.log("Loaded layers:", map.layers.map(l => l.name));


            const floorTiles = map.addTilesetImage('House_FloorsAndWalls', 'floor');
            const furnitureTiles = map.addTilesetImage('House_FurnitureState2', 'furniture');
            const smallFurnitureTiles = map.addTilesetImage('House_SmallItems', 'small_furniture');
            const doorTiles = map.addTilesetImage('House_DoorsAndWindows', 'door');


            map.createLayer('floor', floorTiles);
            map.createLayer('floor2', floorTiles);
            map.createLayer('furniture', furnitureTiles);
            map.createLayer('furniture1', furnitureTiles);
            map.createLayer('furniture2', furnitureTiles);
            map.createLayer('furniture3', smallFurnitureTiles);
            map.createLayer('interactables', doorTiles);


            const objectsLayer = map.getObjectLayer('interactables');
            objectsLayer.objects.forEach(obj => {
                const rect = this.add.rectangle(obj.x + obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height);
                this.physics.add.existing(rect, true);
                rect.name = obj.name;
                interactables.push(rect);
            });

            player = this.physics.add.sprite(400, 400, 'anu').setScale(0.7);
            cursors = this.input.keyboard.createCursorKeys();
            spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            this.cameras.main.startFollow(player, true, 0.1, 0.1);
            this.cameras.main.setZoom(7);
            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            player.setCollideWorldBounds(true);
        }

        function update() {
            player.setVelocity(0);
            if (cursors.left.isDown) {
                player.setVelocityX(-160);
                player.anims.play('left', true);
            } else if (cursors.right.isDown) {
                player.setVelocityX(160);
                player.anims.play('right', true);
            } else if (cursors.up.isDown) {
                player.setVelocityY(-160);
                player.anims.play('up', true);
            } else if (cursors.down.isDown) {
                player.setVelocityY(160);
                player.anims.play('down', true);
            } else {
                player.anims.stop();
            }

            interactables.forEach(obj => {
                const distance = Phaser.Math.Distance.Between(player.x, player.y, obj.x, obj.y);
                if (distance < 80) {
                    obj.setStrokeStyle(2, 0xffff00);
                    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                        console.log(`Interacted with: ${obj.name}`);
                    }
                } else {
                    obj.setStrokeStyle();
                }
            });
        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="room-container" className="w-full h-full" />;
};

export default RoomScene;
