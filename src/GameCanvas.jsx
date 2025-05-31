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

        let house1, house2, house3, house4;


        const game = new Phaser.Game(config);

        function preload() {
            this.load.spritesheet('anu', spriteSheet, {
                frameWidth: 48,
                frameHeight: 98
            });

            this.load.spritesheet('house_anim', '/assets/tilesets/Houses.png', {
                frameWidth: 150,
                frameHeight: 150
            });



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

            this.anims.create({
                key: 'select',
                frames: this.anims.generateFrameNumbers('anu', { start: 79, end: 80 }),
                frameRate: 8,
                repeat: 0
            });


            player = this.physics.add.sprite(780, 400, 'anu').setScale(0.7);

            const topBoundary = this.add.rectangle(
                map.widthInPixels / 2,
                300,
                map.widthInPixels,
                10,
                0xff0000,
                0
            );
            this.physics.add.existing(topBoundary, true);

            this.physics.add.collider(player, topBoundary);

            this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

            player.setCollideWorldBounds(true);

            cursors = this.input.keyboard.createCursorKeys();

            console.log("Map loaded:", map);
            console.log("Player:", player);

            this.cameras.main.scrollX = 25;
            this.cameras.main.scrollY = 5000;


            this.cameras.main.startFollow(player, true, 0.1, 0.1);
            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

            this.cameras.main.scrollX = 300;
            this.cameras.main.scrollY = -5;

            this.cameras.main.setZoom(7);


            ////////////////

            house1 = this.physics.add.sprite(875, 337, 'house_anim').setImmovable(true).setScale(1);
            house2 = this.physics.add.sprite(219, 320, 'house_anim').setImmovable(true).setScale(1);
            house3 = this.physics.add.sprite(507, 331, 'house_anim').setImmovable(true).setScale(1);
            house4 = this.physics.add.sprite(395, 423, 'house_anim').setImmovable(true).setScale(1);

            this.anims.create({
                key: 'house1_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 375, end: 385 }),
                frameRate: 9,
                repeat: -1
            });

            this.anims.create({
                key: 'house2_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 330, end: 341 }),
                frameRate: 9,
                repeat: -1
            });

            this.anims.create({
                key: 'house3_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 1, end: 10 }),
                frameRate: 9,
                repeat: -1
            });


            this.anims.create({
                key: 'house4_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 30, end: 40 }),
                frameRate: 9,
                repeat: -1
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

            if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                player.anims.play('select', true);
            }

            console.log(`Player position: x=${player.x.toFixed(2)}, y=${player.y.toFixed(2)}`);

            const houses = [
                { sprite: house1, anim: 'house1_anim', baseFrame: 375 },
                { sprite: house2, anim: 'house2_anim', baseFrame: 330 },
                { sprite: house3, anim: 'house3_anim', baseFrame: 0 },
                { sprite: house4, anim: 'house4_anim', baseFrame: 30 }
            ];

            let closest = null;
            let minDistance = 120;

            houses.forEach(house => {
                const dist = Phaser.Math.Distance.Between(player.x, player.y, house.sprite.x, house.sprite.y);
                if (dist < minDistance) {
                    closest = house;
                    minDistance = dist;
                }
            });

            houses.forEach(house => {
                if (house === closest) {
                    if (!house.sprite.anims.isPlaying) {
                        house.sprite.anims.play(house.anim);
                    }
                } else {
                    house.sprite.anims.stop();
                    house.sprite.setFrame(house.baseFrame);
                }
            });
        }


        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container" className="w-full h-full" />;
};

export default GameCanvas;
