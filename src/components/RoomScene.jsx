import { useEffect } from 'react';
import * as Phaser from 'phaser';
import spriteSheet from './../assets/sprite_sheet.png'
import { setupAnuAnimations } from './hooks/useAnuAnimations';
import { useNavigate } from 'react-router-dom';




const RoomScene = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const config = {
            // type: Phaser.AUTO,
            backgroundColor: '#37994c',
            // type: Phaser.AUTO,
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
            render: {
                pixelArt: true,
                antialias: false,
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
        // let wKey;
        let interactables = [];

        const game = new Phaser.Game(config);

        function preload() {
            this.load.tilemapTiledJSON('map_room', '/assets/map/map_room.json');
            this.load.image('furniture', './assets/tilesets/House_FurnitureState2.png');
            this.load.image('small_furniture', './assets/tilesets/House_SmallItems.png');
            this.load.image('floor', './assets/tilesets/House_FloorsAndWalls.png');
            this.load.image('door', './assets/tilesets/House_DoorsAndWindows.png');
            // this.load.image('house', './assets/tilesets/Houses.png');
            this.load.image('tree', './assets/tilesets/forest_demo_objects.png');
            this.load.image('grass', './assets/tilesets/forest_demo_terrain.png');
            this.load.spritesheet('anu', spriteSheet, { frameWidth: 48, frameHeight: 98 });
        }

        function create() {
            setupAnuAnimations(this);

            // const wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);


            const map = this.make.tilemap({ key: 'map_room' });
            console.log("Loaded layers:", map.layers.map(l => l.name));
            console.log("Tilesets:", map.tilesets.map(ts => ts.name));
            console.log("Layers:", map.layers.map(l => l.name));

            const houseTiles = map.addTilesetImage('house', 'house');
            const treeTiles = map.addTilesetImage('tree', 'tree');
            const floorTiles = map.addTilesetImage('floor', 'floor');
            const furnitureTiles = map.addTilesetImage('furniture', 'furniture');
            const smallFurnitureTiles = map.addTilesetImage('small_furniture', 'small_furniture');
            const doorTiles = map.addTilesetImage('door', 'door');
            const grassTiles = map.addTilesetImage('grass', 'grass');

            player = this.physics.add.sprite(95, 340, 'anu').setScale(0.7);

            map.createLayer('background', grassTiles);
            map.createLayer('floor2', floorTiles);

            const floorLayer = map.createLayer('floor', floorTiles);
            floorLayer.setCollisionByExclusion([-1]);

            // map.createLayer('floor', floorTiles);
            map.createLayer('furniture2', [doorTiles, furnitureTiles]);
            map.createLayer('furniture', furnitureTiles);
            map.createLayer('furniture1', [furnitureTiles, doorTiles]);
            map.createLayer('furniture3', [smallFurnitureTiles, doorTiles]);

            map.createLayer('interactables', doorTiles);

            this.children.bringToTop(player);

            this.physics.add.collider(player, floorLayer);

            const objectsLayer = map.getObjectLayer('interactables');
            objectsLayer.objects.forEach(obj => {
                const rect = this.add.rectangle(
                    obj.x + obj.width / 2,
                    obj.y + obj.height / 2,
                    obj.width,
                    obj.height
                );
                this.physics.add.existing(rect, true);
                rect.name = obj.name;
                rect.setStrokeStyle(2, 0xC1A78E, 0.9);
                interactables.push(rect);
            });

            cursors = this.input.keyboard.createCursorKeys();
            spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.cameras.main.startFollow(player, true, 0.1, 0.1);
            this.cameras.main.setZoom(7);
            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            player.setCollideWorldBounds(true);


            console.log('Creating instruction text...');

            const instructionText = this.add.text(
                0, 0,
                'Press W to go back',
                {
                    font: '5px monospace',
                    fill: '#ffffff',
                    backgroundColor: '#000000aa',
                    padding: { x: 8, y: 4 },
                    resolution: 5
                }
            ).setScrollFactor(0).setDepth(1000).setVisible(false);

            this.time.delayedCall(0, () => {
                instructionText.setPosition(
                    (this.cameras.main.width / 2) - (instructionText.width / 2),
                    this.cameras.main.height - 490
                );

                instructionText.setVisible(true);
            });



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
                if (distance < 50) {
                    obj.setStrokeStyle(1, 0xc45e00, 1);
                    if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                        console.log(`Interacted with: ${obj.name}`);
                    }
                } else {
                    obj.setStrokeStyle();
                }
            });

            if (Phaser.Input.Keyboard.JustDown(this.wKey)) {
                navigate('/');
            }



        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="room-container" className="w-full h-full" />;
};

export default RoomScene;
