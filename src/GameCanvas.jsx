import { useEffect } from 'react';
import Phaser from 'phaser';
import spriteSheet from './assets/sprite_sheet.png';

const GameCanvas = () => {

    useEffect(() => {
        const config = {
            backgroundColor: '#1e1e2f',
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,

            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true
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

        const game = new Phaser.Game(config);

        function preload() {
            this.load.spritesheet('anushree', spriteSheet, {
                frameWidth: 48,
                frameHeight: 98
            });

            // 🧱 Load the Tiled JSON map and tilesets
            this.load.tilemapTiledJSON('map', '/assets/map/map.json');
            this.load.image('grass', '/assets/tilesets/forest_demo_terrain.png');
            this.load.image('tree', '/assets/tilesets/forest_demo_objects.png');
            this.load.image('house', '/assets/tilesets/Houses.png');
            this.load.image('sky', '/assets/tilesets/dawnbackground.png');
        }



        function create() {
            const map = this.make.tilemap({ key: 'map' });

            const tilesetSky = map.addTilesetImage('sky', 'sky');
            const tilesetGrass = map.addTilesetImage('grass', 'grass');
            const tilesetTree = map.addTilesetImage('tree', 'tree');
            const tilesetHouse = map.addTilesetImage('house', 'house');

            map.createLayer('sky', tilesetSky, 0, 0);
            map.createLayer('grass', tilesetGrass, 0, 0);
            map.createLayer('tree', tilesetTree, 0, 0);
            map.createLayer('house', tilesetHouse, 0, 0);

            console.log(map.layers);



            spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            this.anims.create({
                key: 'down',
                frames: this.anims.generateFrameNumbers('anushree', { start: 0, end: 2 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('anushree', { start: 12, end: 14 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('anushree', { start: 24, end: 26 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'up',
                frames: this.anims.generateFrameNumbers('anushree', { start: 36, end: 38 }),
                frameRate: 10,
                repeat: -1
            });

            this.anims.create({
                key: 'select',
                frames: this.anims.generateFrameNumbers('anushree', { start: 79, end: 80 }),
                frameRate: 8,
                repeat: 0
            });

            // this.add.image(10, 10, 'background').setOrigin(0).setScrollFactor(0);

            player = this.physics.add.sprite(780, 350, 'anushree').setScale(0.7);
            cursors = this.input.keyboard.createCursorKeys();

            console.log("Map loaded:", map);
            console.log("Player:", player);

            this.cameras.main.scrollX = 25; // Move camera right by 100px
            this.cameras.main.scrollY = 5000;  // Move camera down by 50px


            // this.cameras.main.startFollow(player);
            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

            this.cameras.main.scrollX = 300; // Shift right
            this.cameras.main.scrollY = -5; // Shift down

            this.cameras.main.setZoom(7); // Try 2x zoom (1 = default)


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

            if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                player.anims.play('select', true);
            }

            console.log(`Player position: x=${player.x.toFixed(2)}, y=${player.y.toFixed(2)}`);

        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container" className="w-full h-full" />;
};

export default GameCanvas;
