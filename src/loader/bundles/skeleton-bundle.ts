import type { AnimationAction, Object3D } from 'three';
import { AnimationMixer, TextureLoader } from 'three';
import type { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GameObject } from '../../view';

type LoadableAssets = {
    modelPath: string;
    texturePath: string;
    animationPaths: string[];
    attachToBone?: string;
    name: string;
};

export type LoadedAsset = {
    model: Object3D;
    name: string;
    mixer: AnimationMixer;
    actions: AnimationAction[];
};

export class UnitAsset {
    private readonly loader: FBXLoader;

    constructor(loader: FBXLoader) {
        this.loader = loader;
    }

    public async load(): Promise<GameObject> {
        const assetsToLoad = this.getAssetsToLoad();
        const children: GameObject[] = [];
        let parent: GameObject | undefined = undefined;
        const actions: AnimationAction[] = [];

        for (const childAsset of assetsToLoad) {
            const model = await this.loader.loadAsync(childAsset.modelPath);
            const mixer = new AnimationMixer(model);
            const nameOfBone = childAsset.attachToBone;

            this.attachTextureToModel(model, childAsset.texturePath);
            actions.push(...(await this.attachAnimationsToMixer(mixer, childAsset.animationPaths)));
            const name = childAsset.name;

            const newObject = new GameObject({
                model,
                actions,
                name,
                mixer,
            });

            if (parent && nameOfBone) {
                const bone = this.findObjectByName(nameOfBone, parent);
                if (bone) {
                    bone.add(model);
                    model.rotateY(90);
                    model.rotateZ(90);
                }
            } else if (parent) {
                parent.add(newObject);
            }

            if (!parent) {
                parent = newObject;
            } else {
                children.push(newObject);
            }
        }
        if (!parent) throw Error(`Failed to create UnitAsset`);

        parent.addChildren(children);
        return parent;
    }

    private findObjectByName(name: string, objectToSearch: Object3D): Object3D | undefined {
        let object: Object3D | undefined;

        objectToSearch.traverse((child) => {
            if (child.name.trim() === name) object = child;
        });

        return object;
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

    private async attachAnimationsToMixer(mixer: AnimationMixer, animationPaths: string[]): Promise<AnimationAction[]> {
        return await Promise.all(
            animationPaths.map(async (paths) => {
                const animation = await this.loader.loadAsync(paths);
                return mixer.clipAction(animation.animations[0]);
            }),
        );
    }

    public getAssetsToLoad(): LoadableAssets[] {
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
