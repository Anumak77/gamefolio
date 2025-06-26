import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { setupAnuAnimations } from './hooks/useAnuAnimations';
import { useNavigate } from 'react-router-dom';

const Room = () => {
    const navigate = useNavigate();
    const containerRef = useRef();

    useEffect(() => {
        containerRef.current?.focus();
        console.log('Component mounted, initializing game...');

        let game;

        const MainScene = class extends Phaser.Scene {
            constructor() {
                super({ key: 'MainScene' });
                this.player = null;
                this.cursors = null;
                this.interObjects = [];
                this.popupActive = false;
                this.spaceKey = null;
                this.routerNavigate = navigate;
                this.lastDirection = null;
                this.popupTimeout = null;
            }

            preload() {
                console.log('Preloading assets...');
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

            create() {

                console.log('Scene create() called');
                this.add.text(100, 100, 'Hello World');
                const map = this.make.tilemap({ key: 'room' });
                const interactables = map.getObjectLayer('inter').objects;

                const homeFloor = map.addTilesetImage('home_floor', 'home_floor');
                const item1 = map.addTilesetImage('home_item', 'home_item');
                const item2 = map.addTilesetImage('home_item2', 'home_item2');
                const item3 = map.addTilesetImage('home_item3', 'home_item3');
                const grass = map.addTilesetImage('grass', 'grass');
                const plants = map.addTilesetImage('plants', 'plants');

                map.createLayer('grass', grass);
                map.createLayer('flowers', plants);
                map.createLayer('floorplan', homeFloor);
                this.layoutLayer = map.createLayer('layout', [homeFloor, item3, item1, item2]);
                this.layoutLayer.setCollisionByExclusion([-1]);

                map.createLayer('windows', item3);
                map.createLayer('items-big', item1);
                map.createLayer('items-big2', item1);
                map.createLayer('items-small', item2);

                this.player = this.physics.add.sprite(90, 400, 'anu').setScale(0.5);
                this.player.setCollideWorldBounds(true);
                this.physics.add.collider(this.player, this.layoutLayer);

                this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
                this.cameras.main.startFollow(this.player);
                this.cameras.main.setZoom(9);
                setupAnuAnimations(this);

                this.uiCam = this.cameras.add(0, 0, this.scale.width, this.scale.height);
                this.uiCam.setScroll(0, 0);
                this.uiCam.setZoom(1);
                this.uiCam.ignore(this.children.list);

                const x = this.scale.width / 2;
                const y = this.scale.height - 40;

                this.popupBackground = this.add.rectangle(x, y, 570, 60, 0x77DD77, 1)
                    .setOrigin(0.5)
                    .setDepth(1000)
                    .setVisible(false);
                this.popupBackground.uiElement = true;

                this.popupText = this.add.text(x, y, '', {
                    font: '33px Arial',
                    color: '#ffffff',
                    align: 'center',
                    wordWrap: { width: 1100 }
                })
                    .setOrigin(0.5)
                    .setDepth(1001)
                    .setVisible(false);
                this.popupText.uiElement = true;

                this.children.list.forEach(child => {
                    if (!child.uiElement) {
                        this.uiCam.ignore(child);
                    }
                });

                interactables.forEach(obj => {
                    const ring = this.add.circle(obj.x, obj.y, 15, 0xffff00, 0.3)
                        .setVisible(false)
                        .setDepth(1);
                    this.interObjects.push({
                        name: obj.name,
                        x: obj.x,
                        y: obj.y,
                        ring
                    });
                });

                this.input.keyboard.enabled = true;
                this.cursors = this.input.keyboard.createCursorKeys();
                this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
                this.input.keyboard.addCapture('SPACE');

                console.log('Popup text created:', this.popupText);

                this.debugGraphics = this.add.graphics().setDepth(10000);
            }

            update() {
                this.updatePopupPosition();

                if (this.popupActive) {
                    this.player.setVelocity(0);
                    return;
                }
                this.player.setVelocity(0);
                let moving = false;

                if (this.cursors.left.isDown) {
                    this.player.setVelocityX(-150);
                    this.player.anims.play('left', true);
                    moving = true;
                    this.lastDirection = 'left';
                }
                else if (this.cursors.right.isDown) {
                    this.player.setVelocityX(150);
                    this.player.anims.play('right', true);
                    moving = true;
                    this.lastDirection = 'right';
                }

                if (this.cursors.up.isDown) {
                    this.player.setVelocityY(-150);
                    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                        this.player.anims.play('up', true);
                    }
                    moving = true;
                    this.lastDirection = 'up';
                }
                else if (this.cursors.down.isDown) {
                    this.player.setVelocityY(150);
                    if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
                        this.player.anims.play('down', true);
                    }
                    moving = true;
                    this.lastDirection = 'down';
                }

                if (!moving && this.lastDirection) {
                    this.player.anims.stop();
                    this.player.setFrame(0);
                }

                if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
                    const nearbyObj = this.findNearbyInteractable();
                    if (nearbyObj) {
                        this.showPopup(`INTERACTED WITH: ${nearbyObj.name.toUpperCase()}`);
                    }
                }

                this.interObjects.forEach(obj => {
                    const dist = Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        obj.x,
                        obj.y
                    );
                    obj.ring.setVisible(dist < 50);
                });

                this.debugGraphics.clear();

            }

            updatePopupPosition() {
                if (!this.popupText || !this.popupBackground) return;

                const x = this.scale.width / 2;
                const y = this.scale.height - 40;

                this.popupText.setPosition(x, y);
                this.popupBackground.setPosition(x, y);
            }



            isNearInteractable() {
                return this.interObjects.some(obj => {
                    const dist = Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        obj.x,
                        obj.y
                    );
                    return dist < 100;
                });
            }

            findNearbyInteractable() {
                return this.interObjects.find(obj => {
                    const dist = Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        obj.x,
                        obj.y
                    );
                    return dist < 50;
                });
            }

            showPopup(message) {
                console.log("Popup elements:", {
                    background: this.popupBackground,
                    text: this.popupText,
                    backgroundVisible: this.popupBackground?.visible,
                    textVisible: this.popupText?.visible,
                });
                if (this.popupTimeout) {
                    clearTimeout(this.popupTimeout);
                }

                if (!this.popupText) {
                    this.createPopupElements();
                }

                this.popupText.setText(message);
                this.popupBackground.setVisible(true);
                this.popupText.setVisible(true);
                this.popupActive = true;

                this.time.delayedCall(2000, this.hidePopup.bind(this));
                this.popupTimeout = setTimeout(this.hidePopup.bind(this), 2000);

                console.log('Popup shown:', message);

            }

            hidePopup() {
                if (this.popupBackground) this.popupBackground.setVisible(false);
                if (this.popupText) this.popupText.setVisible(false);
                this.popupActive = false;
                this.popupTimeout = null;
            }

            createPopupElements() {
                const cam = this.cameras.main;
                const x = cam.width / 2;
                const y = cam.height - 50;

                this.popupBackground = this.add.rectangle(x, y, 40, 60, 0x00FF00, 1)
                    .setOrigin(0.5)
                    .setScrollFactor(0)
                    .setDepth(1000)
                    .setVisible(false);

                this.popupText = this.add.text(x, y, '', {
                    font: 'bold 21px Arial',
                    color: '#ffffff',
                    align: 'center',
                    wordWrap: { width: 220 },
                })
                    .setOrigin(0.5)
                    .setScrollFactor(0)
                    .setDepth(1001)
                    .setVisible(false);
            }

        };

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
                    debug: false
                },
            },
            scene: MainScene,
        };

        game = new Phaser.Game(config);
        console.log('Phaser game instance created:', game);
        return () => {
            game?.destroy(true);
        };
    }, []);

    return (
        <div
            id="room-container"
            ref={containerRef}
            style={{ width: '100vw', height: '100vh' }}
            tabIndex={0}
        />
    );
};

export default Room;