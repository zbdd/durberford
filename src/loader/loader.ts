import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GameObject } from '../view';
import type { AnimationAction, Group, Object3D, Object3DEventMap } from 'three';
import { AnimationMixer, TextureLoader } from 'three';

export type GameAssetProps = {
    name: string;
    modelPath: string;
    texturePath: string;
    animationPath?: string;
    attachTo?: string;
    onAttached?: (object: Object3D) => void;
};

export class Loader extends FBXLoader {
    private readonly mixers: AnimationMixer[];

    constructor({ mixers }: { mixers: AnimationMixer[] }) {
        super();

        this.mixers = mixers;
    }

    public async loadGameAssets(
        assets: GameAssetProps[],
    ): Promise<{ gameObject: GameObject; attachTo?: string; onAttached?: (object: Object3D) => void }[]> {
        const gameObjects: { gameObject: GameObject; attachTo?: string; onAttached?: (object: Object3D) => void }[] =
            [];

        for (const asset of assets) {
            const loadedObject = await this.loadAsset(asset);
            gameObjects.push({
                gameObject: new GameObject({
                    gameObjectProps: [
                        {
                            name: asset.name,
                            object: loadedObject.modelObject,
                            actions: loadedObject.actions,
                        },
                    ],
                }),
                attachTo: asset.attachTo,
                onAttached: asset.onAttached,
            });
        }

        return gameObjects;
    }

    private async loadAsset(asset: GameAssetProps): Promise<{
        modelObject: Group<Object3DEventMap>;
        actions: AnimationAction[];
    }> {
        const modelObject = await this.loadAsync(asset.modelPath);
        if (!modelObject) throw Error(`Failed to load asset: ${asset.name}`);

        const actions: AnimationAction[] = [];

        modelObject.name = asset.name;

        if (asset.animationPath) {
            const animationObject = await this.loadAsync(asset.animationPath);
            const mixer = new AnimationMixer(modelObject);
            this.mixers.push(mixer);
            actions.push(mixer.clipAction(animationObject.animations[0]));
        }

        modelObject.traverse((child: any) => {
            if (child.isMesh) {
                const texture = new TextureLoader().load(asset.texturePath);
                child.castShadow = true;
                child.receiveShadow = false;
                child.flatshading = true;
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });

        return {
            modelObject,
            actions,
        };
    }
}
