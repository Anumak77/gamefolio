import { useEffect } from 'react';
import Phaser from 'phaser';
import spriteSheet from './assets/sprite_sheet.png';

const GameCanvas = () => {

    useEffect(() => {
        const config = {
            backgroundColor: '#1e1e2f',
            type: Phaser.AUTO,
            width: '100%',
            height: '100%',
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
            this.load.image('grass', '/assets/tilesets/grass.png');
            this.load.image('tree', '/assets/tilesets/tree.png');
            this.load.image('house', '/assets/tilesets/house.png');
            this.load.image('sky', '/assets/tilesets/sky.png');
        }



        function create() {
            const map = this.make.tilemap({ key: 'map' });
            const tilesetSky = map.addTilesetImage('sky', 'sky');
            const tilesetGrass = map.addTilesetImage('grass', 'grass');
            const tilesetTree = map.addTilesetImage('tree', 'tree');
            const tilesetHouse = map.addTilesetImage('house', 'house');

            // ✅ Order matters: render from back (sky) to front
            map.createLayer('sky', tilesetSky, 0, 0);
            map.createLayer('grass', tilesetGrass, 0, 0);
            map.createLayer('tree', tilesetTree, 0, 0);
            map.createLayer('house', tilesetHouse, 0, 0);

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

            player = this.physics.add.sprite(1450, 900, 'anushree').setScale(2);
            cursors = this.input.keyboard.createCursorKeys();

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
        }

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container" className="w-full h-full" />;
};

export default GameCanvas;
