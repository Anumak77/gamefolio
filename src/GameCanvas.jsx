import { useEffect } from 'react';
import Phaser from 'phaser';
import spriteSheet from './assets/sprite_sheet.png'; // Replace with actual path

const GameCanvas = () => {

    useEffect(() => {
        const config = {
            backgroundColor: '#1e1e2f',
            type: Phaser.AUTO,
            width: 800,
            height: 600,
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

        const game = new Phaser.Game(config);

        function preload() {
            console.log("Loading sprites...");
            this.load.spritesheet('anushree', spriteSheet, {
                frameWidth: 48,
                frameHeight: 98
            });
        }


        function create() {
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
                frames: this.anims.generateFrameNumbers('anushree', { start: 79, end: 80 }), // pick based on your sheet
                frameRate: 8,
                repeat: 0
            });


            player = this.physics.add.sprite(400, 300, 'anushree');
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
