import type { Object3D } from 'three';

export const getSkeletonBundle = () => {
    return [
        {
            modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_body_mesh.fbx',
            texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_body_D.png',
            name: 'skeleton-body',
            animationDetail: {
                path: 'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_ultimate.fbx',
                name: 'ultimate',
            },
        },
        {
            modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_set1_mesh.fbx',
            texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_set1_D.png',
            name: 'skeleton-clothing',
            animationDetail: {
                path: 'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_ultimate.fbx',
                name: 'ultimate',
            },
        },
        {
            modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_2h_axe.fbx',
            texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_2HAxe_D.png',
            name: 'skeleton-axe',
            attachTo: 'weapon_end',
            onAttached: (object: Object3D) => {
                object.rotateY(90);
                object.rotateZ(90);
            },
        },
    ];
};
