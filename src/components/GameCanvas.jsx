import { useEffect } from 'react';
import * as Phaser from 'phaser';
import { setupAnuAnimations } from './hooks/useAnuAnimations';
import { useNavigate } from 'react-router-dom';
import spriteSheet from './../assets/sprite_sheet.png';

const GameCanvas = () => {
    const navigate = useNavigate();

    useEffect(() => {
        let player;
        let cursors;
        let spaceKey;
        let house1, house2, house3, house4;
        let popupText;

        function preload() {
            this.load.spritesheet('anu', spriteSheet, { frameWidth: 48, frameHeight: 98 });
            this.load.spritesheet('house_anim', '/assets/tilesets/Houses.png', {
                frameWidth: 150,
                frameHeight: 150,
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

            map.createLayer('sky', tilesetSky);
            map.createLayer('grass', tilesetGrass);
            map.createLayer('tree', tilesetTree);
            map.createLayer('house', tilesetHouse);

            cursors = this.input.keyboard.createCursorKeys();
            spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            setupAnuAnimations(this);

            player = this.physics.add.sprite(780, 400, 'anu').setScale(0.7);
            player.setCollideWorldBounds(true);

            house1 = this.physics.add.sprite(875, 337, 'house_anim').setImmovable(true);
            house2 = this.physics.add.sprite(219, 320, 'house_anim').setImmovable(true);
            house3 = this.physics.add.sprite(507, 331, 'house_anim').setImmovable(true);
            house4 = this.physics.add.sprite(395, 423, 'house_anim').setImmovable(true);

            this.anims.create({
                key: 'house1_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 375, end: 385 }),
                frameRate: 9,
                repeat: -1,
            });

            this.anims.create({
                key: 'house2_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 330, end: 340 }),
                frameRate: 9,
                repeat: -1,
            });

            this.anims.create({
                key: 'house3_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 0, end: 10 }),
                frameRate: 9,
                repeat: -1,
            });

            this.anims.create({
                key: 'house4_anim',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 30, end: 40 }),
                frameRate: 9,
                repeat: -1,
            });

            popupText = this.add.text(
                this.cameras.main.width / 2,
                this.cameras.main.height - 60,
                'Press SPACE to enter room',
                {
                    font: '18px monospace',
                    fill: '#ffffff',
                    backgroundColor: '#836953',
                    padding: { x: 12, y: 6 }
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(1000)
                .setVisible(true);


        }

        function update() {
            player.setVelocity(0);
            console.log('Update loop running');

            const houses = [
                { sprite: house1, anim: 'house1_anim', baseFrame: 375 },
                { sprite: house2, anim: 'house2_anim', baseFrame: 330 },
                { sprite: house3, anim: 'house3_anim', baseFrame: 0 },
                { sprite: house4, anim: 'house4_anim', baseFrame: 30 },
            ];

            let closest = null;
            let minDistance = 60;

            houses.forEach((house) => {
                const dist = Phaser.Math.Distance.Between(player.x, player.y, house.sprite.x, house.sprite.y);
                if (dist < minDistance) {
                    closest = house;
                    minDistance = dist;
                }
            });

            houses.forEach((house) => {
                if (house === closest) {
                    if (!house.sprite.anims.isPlaying) {
                        house.sprite.anims.play(house.anim);
                    }
                } else {
                    house.sprite.anims.stop();
                    house.sprite.setFrame(house.baseFrame);
                }
            });

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

            if (closest?.sprite === house1) {
                popupText.setVisible(true);
                popupText.setText('Press SPACE to enter room');

                if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                    player.anims.play('select', true);
                    setTimeout(() => {
                        game.destroy(true);
                        navigate('/room');
                    }, 200);
                }
            } else {
                popupText.setVisible(false);
            }

            console.log('Player:', player.x.toFixed(1), player.y.toFixed(1));
            console.log('House1:', house1.x, house1.y);
            console.log('Distance:', Phaser.Math.Distance.Between(player.x, player.y, house1.x, house1.y));
        }


        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#202020',
            parent: 'game-container',
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false },
            },
            render: { pixelArt: true, antialias: false },
            scene: { preload, create, update },
        };

        const game = new Phaser.Game(config);

        return () => {
            game.destroy(true);
        };
    }, []);

    return <div id="game-container" className="w-full h-full" />;
};

export default GameCanvas;
