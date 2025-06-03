export const setupAnuAnimations = (scene) => {
    scene.anims.create({ key: 'down', frames: scene.anims.generateFrameNumbers('anu', { start: 0, end: 2 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'left', frames: scene.anims.generateFrameNumbers('anu', { start: 12, end: 14 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'right', frames: scene.anims.generateFrameNumbers('anu', { start: 24, end: 26 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'up', frames: scene.anims.generateFrameNumbers('anu', { start: 36, end: 38 }), frameRate: 10, repeat: -1 });
};
