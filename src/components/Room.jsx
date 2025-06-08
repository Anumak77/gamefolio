import { useEffect } from 'react';
import Phaser from 'phaser';
import { setupAnuAnimations } from './hooks/useAnuAnimations';


const Room = () => {
    useEffect(() => {
        let popupActive = false;

        let player, cursors, interObjects = [], spaceKey, popupText, sceneRef;

        const config = {
            type: Phaser.AUTO,
            width: window.innerWidth,
            height: window.innerHeight,
            parent: 'room-container',
            backgroundColor: '#000',
            pixelArt: true,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true,
                },
            },
            scene: {
                preload,
                create,
                update,
            },
        };


        let game = new Phaser.Game(config);
        // let player, cursors, interObjects = [], spaceKey, popupText;

        function preload() {
            this.load.spritesheet('anu', '/assets/sprite_sheet.png', {
                frameWidth: 48,
                frameHeight: 98,
            });


            this.load.tilemapTiledJSON('room', '/assets/map/room.json');
            this.load.image('home_floor', '/assets/tilesets/House_FloorsAndWalls.png');
            this.load.image('home_item', '/assets/tilesets/House_FurnitureState2.png');
            this.load.image('home_item2', '/assets/tilesets/House_SmallItems.png');
            this.load.image('home_item3', '/assets/tilesets/House_DoorsAndWindows.png');
            this.load.image('grass', '/assets/tilesets/forest_demo_terrain.png');
            this.load.image('plants', '/assets/tilesets/forest_demo_objects.png');
        }

        function create() {
            const map = this.make.tilemap({ key: 'room' });
            const interactables = map.getObjectLayer('inter').objects;

            sceneRef = this;
            spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);

            popupText = this.add.text(this.scale.width / 2, this.scale.height - 40, '', {
                font: '20px monospace',
                fill: '#ffffff',
                backgroundColor: '#000000aa',
                padding: { x: 10, y: 5 },
            })
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(1000)
                .setVisible(false);


            const homeFloor = map.addTilesetImage('home_floor', 'home_floor');
            const item1 = map.addTilesetImage('home_item', 'home_item');
            const item2 = map.addTilesetImage('home_item2', 'home_item2');
            const item3 = map.addTilesetImage('home_item3', 'home_item3');
            const grass = map.addTilesetImage('grass', 'grass');
            const plants = map.addTilesetImage('plants', 'plants');

            map.createLayer('grass', grass);
            map.createLayer('flowers', plants);
            map.createLayer('floorplan', homeFloor);
            const layoutLayer = map.createLayer('layout', [homeFloor, item3, item1, item2]);
            layoutLayer.setCollisionByExclusion([-1]);

            map.createLayer('windows', item3);
            map.createLayer('items-big', item1);
            map.createLayer('items-big2', item1);
            map.createLayer('items-small', item2);

            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.centerOn(map.widthInPixels / 2, map.heightInPixels / 2);
            this.cameras.main.setZoom(10);

            player = this.physics.add.sprite(90, 400, 'anu').setScale(0.5);
            player.setCollideWorldBounds(true);
            this.physics.add.collider(player, layoutLayer);

            this.cameras.main.startFollow(player);

            cursors = this.input.keyboard.createCursorKeys();

            setupAnuAnimations(this);

            // const interObjects = [];

            interactables.forEach(obj => {
                const ring = this.add.circle(obj.x, obj.y, 10, 0xffff00, 0.5); // glow ring
                ring.setVisible(false);
                interObjects.push({
                    name: obj.name,
                    x: obj.x,
                    y: obj.y,
                    ring,
                });
            });



        }
        function update() {
            player.setVelocity(0);

            if (cursors.left.isDown) {
                player.setVelocityX(-150);
                player.anims.play('left', true);
            } else if (cursors.right.isDown) {
                player.setVelocityX(150);
                player.anims.play('right', true);
            } else if (cursors.up.isDown) {
                player.setVelocityY(-150);
                player.anims.play('up', true);
            } else if (cursors.down.isDown) {
                player.setVelocityY(150);
                player.anims.play('down', true);
            } else {
                player.anims.stop();
                player.setFrame(0);
            }

            let foundNearby = false;

            for (let obj of interObjects) {
                let interactionRadius = 40;
                if (obj.name === 'book' || obj.name === 'fish') {
                    interactionRadius = 80;
                }

                const dist = Phaser.Math.Distance.Between(player.x, player.y, obj.x, obj.y);

                if (dist < interactionRadius) {
                    obj.ring.setVisible(true);
                    foundNearby = true;

                    if (Phaser.Input.Keyboard.JustDown(spaceKey) && !popupActive) {
                        popupActive = true;
                        popupText.setText(`You interacted with the ${obj.name}`);
                        popupText.setAlpha(0).setVisible(true);

                        sceneRef.tweens.add({
                            targets: popupText,
                            alpha: 1,
                            duration: 200,
                        });

                        sceneRef.time.delayedCall(1800, () => {
                            sceneRef.tweens.add({
                                targets: popupText,
                                alpha: 0,
                                duration: 200,
                                onComplete: () => {
                                    popupText.setVisible(false);
                                    popupActive = false;
                                },
                            });
                        });
                    }
                } else {
                    obj.ring.setVisible(false);
                }
            }
        }

        return () => {
            if (game) game.destroy(true);
        };
    }, []);

    return (
        <div
            id="room-container"
            style={{ width: '100vw', height: '100vh' }}
            tabIndex={0}
            autoFocus
            onClick={() => {
                const div = document.getElementById('room-container');
                div?.focus();
                console.log('Container focused');
            }}
        />
    );

};

export default Room;
