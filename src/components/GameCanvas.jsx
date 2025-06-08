import React, { useEffect, useState } from 'react';
import * as Phaser from 'phaser';
import spriteSheet from '../../public/assets/sprite_sheet.png'
import { useNavigate } from 'react-router-dom';
import { setupAnuAnimations } from './hooks/useAnuAnimations';
import LoadingPage from './common/LoadingPage';

const GameCanvas = () => {
    const navigate = useNavigate();
    const [booted, setBooted] = useState(false);

    useEffect(() => {
        let player, cursors, spaceKey, house, popupText;
        let currentScene = null;
        const proximityRadius = 100;

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
            currentScene = this;

            const map = this.make.tilemap({ key: 'map' });
            this.add.image(map.widthInPixels / 2, map.heightInPixels / 2, 'sky')
                .setDisplaySize(map.widthInPixels, map.heightInPixels)
                .setOrigin(0.5)
                .setDepth(-10);

            const tilesetGrass = map.addTilesetImage('grass', 'grass');
            const tilesetHouse = map.addTilesetImage('house', 'house');
            const tilesetTree = map.addTilesetImage('tree', 'tree');
            const tilesetSky = map.addTilesetImage('sky', 'sky');

            map.createLayer('sky', tilesetSky);
            map.createLayer('grass', tilesetGrass);
            map.createLayer('house', [tilesetHouse, tilesetTree]);
            map.createLayer('tree', tilesetTree);

            house = this.add.sprite(348, 374, 'house_anim').setScale(1).setDepth(1);
            this.anims.create({
                key: 'house_idle',
                frames: this.anims.generateFrameNumbers('house_anim', { start: 345, end: 359 }),
                frameRate: 10,
                repeat: -1,
            });
            house.anims.play('house_idle');
            house.anims.pause();

            cursors = this.input.keyboard.createCursorKeys();
            spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            setupAnuAnimations(this);

            player = this.physics.add.sprite(200, 400, 'anu').setScale(0.7);
            player.setCollideWorldBounds(true);
            player.setDepth(2);

            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            const topOffset = 300;
            this.physics.world.setBounds(
                0,
                topOffset,
                map.widthInPixels,
                map.heightInPixels - topOffset
            );

            this.cameras.main.startFollow(player);
            this.cameras.main.setZoom(7);

            popupText = this.add.text(
                this.scale.width / 2,
                this.scale.height - 40,
                'Press SPACE to enter',
                {
                    font: '24px monospace',
                    fill: '#ffffff',
                    backgroundColor: '#000000aa',
                    padding: { x: 12, y: 6 },
                }
            )
                .setOrigin(0.5)
                .setScrollFactor(0)
                .setDepth(1000)
                .setVisible(false);
        }

        function update() {
            player.setVelocity(0);

            if (cursors.left.isDown) player.setVelocityX(-160), player.anims.play('left', true);
            else if (cursors.right.isDown) player.setVelocityX(160), player.anims.play('right', true);
            else if (cursors.up.isDown) player.setVelocityY(-160), player.anims.play('up', true);
            else if (cursors.down.isDown) player.setVelocityY(160), player.anims.play('down', true);
            else player.anims.stop();

            const distance = Phaser.Math.Distance.Between(player.x, player.y, house.x, house.y);
            const popupDom = document.getElementById('popup');

            if (distance < proximityRadius) {
                house.anims.play('house_idle', true);
                if (popupDom) popupDom.style.display = 'block';
                if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
                    navigate('/room');
                }
            } else {
                house.anims.stop();
                if (popupDom) popupDom.style.display = 'none';
            }

            popupText.setPosition(
                currentScene.cameras.main.scrollX + currentScene.scale.width / 2,
                currentScene.cameras.main.scrollY + currentScene.scale.height - 40
            );
        }

        const config = {
            type: Phaser.AUTO,
            parent: 'game-container',
            backgroundColor: 'transparent',
            scale: {
                mode: Phaser.Scale.RESIZE,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: '100%',
                height: '100%',
            },
            physics: {
                default: 'arcade',
                arcade: { gravity: { y: 0 }, debug: false },
            },
            render: { pixelArt: true, antialias: false },
            scene: { preload, create, update },
        };

        const timer = setTimeout(() => {
            new Phaser.Game(config);
            document.getElementById('game-container')?.classList.add('loaded');
            setBooted(true);
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {!booted && <LoadingPage />}
            <div
                id="game-container"
                className=""
                style={{
                    width: '100vw',
                    height: '100vh',
                    opacity: booted ? 1 : 0,
                    transition: 'opacity 0.5s ease-in',
                }}
            />
            <div
                id="popup"
                style={{
                    position: 'absolute',
                    bottom: '40px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '10px 20px',
                    fontFamily: 'monospace',
                    fontSize: '30px',
                    borderRadius: '8px',
                    zIndex: 1000,
                    display: 'none',
                }}
            >
                Press SPACE to enter
            </div>
        </>
    );
};

export default GameCanvas;
