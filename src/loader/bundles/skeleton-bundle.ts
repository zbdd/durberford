import type { AnimationAction, Object3D } from 'three';
import { AnimationMixer, TextureLoader } from 'three';
import type { GameAssetGroup } from '../loader.ts';
import type { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

type LoadAssetProps = {
    modelPath: string;
    texturePath: string;
    animationPaths: string[];
    attachToBone?: string;
    name: string;
};

export type LoadedAssetProps = {
    model: Object3D;
    name: string;
    mixer: AnimationMixer;
    animations: AnimationAction[];
};

export class UnitAsset {
    private readonly loader: FBXLoader;

    constructor(loader: FBXLoader) {
        this.loader = loader;
    }

    public async load(): Promise<LoadedAssetProps> {
        const assetsToLoad = this.getAssetsToLoad();
        const children: LoadedAssetProps[] = [];
        let parent: LoadedAssetProps | undefined = undefined;

        for (const childAsset of assetsToLoad) {
            const model = await this.loader.loadAsync(childAsset.modelPath);
            const mixer = new AnimationMixer(model);

            this.attachTextureToModel(model, childAsset.texturePath);
            const animations = this.attachAnimationsToMixer(mixer, childAsset.animationPaths);
            const name = childAsset.name;

            const loadedAsset = {
                model,
                animations,
                name,
                mixer,
            };

            if (parent && childAsset.attachToBone) {
                void '';
            } else if (parent) {
                parent.model.add(loadedAsset.model);
            }

            if (!parent) {
                parent = loadedAsset;
            } else {
                children.push(loadedAsset);
            }
        }
        if (!parent) throw Error(`Failed to create UnitAsset`);

        return parent;
    }

    private attachTextureToModel(model: Object3D, texturePath: string): void {
        model.traverse((child: any) => {
            if (child.isMesh) {
                const texture = new TextureLoader().load(texturePath);
                child.castShadow = true;
                child.receiveShadow = false;
                child.flatshading = true;
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    }

    private attachAnimationsToMixer(mixer: AnimationMixer, animationPaths: string[]): AnimationAction[] {
        const animations: AnimationAction[] = [];
        animationPaths.map(async (paths) => {
            const animation = await this.loader.loadAsync(paths);
            animations.push(mixer.clipAction(animation.animations[0]));
        });
        return animations;
    }

    public getAssetsToLoad(): LoadAssetProps[] {
        return [
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
                attachToBone: 'weapon_end',
                animationPaths: [],
            },
        ];
    }
}
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
