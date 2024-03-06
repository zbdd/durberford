import type { Object3D } from 'three';
import type { GameAssetGroup } from '../loader.ts';

export const getSkeletonBundle = (): GameAssetGroup => {
    return {
        name: 'SkeletonWarrior',
        assets: [
            {
                modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_body_mesh.fbx',
                texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_body_D.png',
                name: 'skeleton-body',
                animationPaths: getAnimations(),
            },
            {
                modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_set1_mesh.fbx',
                texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_set1_D.png',
                name: 'skeleton-clothing',
                animationPaths: getAnimations(),
            },
            {
                modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_2h_axe.fbx',
                texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_2HAxe_D.png',
                name: 'skeleton-axe',
                attachTo: 'weapon_end',
                animationPaths: [],
                onAttached: (object: Object3D) => {
                    object.rotateY(90);
                    object.rotateZ(90);
                },
            },
        ],
    };
};

const getAnimations = () => {
    return [
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_attack1.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_attack2.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_ultimate.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_walk.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_duying1.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_duying2.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_duying3.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_duying4.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_hit_react1.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_hit_react2.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_hit_react3.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_hit_react4.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_idle1.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_idle2.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_idle3.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_idle4.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_run1.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_run2.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_run3.fbx',
    ];
};
