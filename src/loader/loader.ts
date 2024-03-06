import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import type { GameObjectProps } from '../view';
import { GameObject } from '../view';
import type { AnimationAction, Group, Object3D, Object3DEventMap } from 'three';
import { AnimationMixer, TextureLoader } from 'three';
import { getSkeletonBundle } from './bundles';

export type GameAssetGroup = {
    name: string;
    assets: GameAssetProps[];
};

export type GameAssetProps = {
    name: string;
    modelPath: string;
    texturePath: string;
    animationPaths: string[];
    attachTo?: string;
    onAttached?: (object: Object3D) => void;
};

export class Loader extends FBXLoader {
    private readonly mixers: AnimationMixer[];

    constructor({ mixers }: { mixers: AnimationMixer[] }) {
        super();

        this.mixers = mixers;
    }

    public async loadGameAssets({
        assetsGroup,
        loadDefaults = true,
    }: {
        assetsGroup?: GameAssetGroup[];
        loadDefaults?: boolean;
    }): Promise<GameObject[]> {
        const gameObjects: GameObject[] = [];

        if (!assetsGroup) assetsGroup = [];
        if (loadDefaults) assetsGroup.push(getSkeletonBundle());

        for (const group of assetsGroup) {
            const objectsAndActions: {
                modelObject: Object3D;
                actions: AnimationAction[];
                attachTo?: string;
                onAttached?: (object: Object3D) => void;
            }[] = [];

            for (const asset of group.assets) {
                const loadedObject = await this.loadAsset(asset);
                objectsAndActions.push(loadedObject);
            }

            const gameObjectProps: GameObjectProps[] = [];
            objectsAndActions.forEach((pair, index) => {
                gameObjectProps.push({
                    name: pair.modelObject.name,
                    object: pair.modelObject,
                    actions: pair.actions,
                    attachTo:
                        index === 0
                            ? undefined
                            : pair.attachTo
                              ? this.findObjectByName(pair.attachTo, gameObjectProps[0].object)
                              : gameObjectProps[0].object,
                });
                pair.onAttached?.(pair.modelObject);
            });
            gameObjects.push(new GameObject({ gameObjectProps }));
        }

        return gameObjects;
    }

    private findObjectByName(name: string, objectToSearch: Object3D): Object3D | undefined {
        let object: Object3D | undefined;

        objectToSearch.traverse((child) => {
            if (child.name.trim() === name) object = child;
        });

        return object;
    }

    private async loadAsset(asset: GameAssetProps): Promise<{
        modelObject: Group<Object3DEventMap>;
        actions: AnimationAction[];
        attachTo?: string;
        onAttached?: (object: Object3D) => void;
    }> {
        const modelObject = await this.loadAsync(asset.modelPath);
        if (!modelObject) throw Error(`Failed to load asset: ${asset.name}`);

        const actions: AnimationAction[] = [];

        modelObject.name = asset.name;

        if (asset.animationPaths.length > 0) {
            const mixer = new AnimationMixer(modelObject);
            for (const path of asset.animationPaths) {
                const animationObject = await this.loadAsync(path);

                if (animationObject) {
                    this.mixers.push(mixer);
                    actions.push(mixer.clipAction(animationObject.animations[0]));
                }
            }
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
            attachTo: asset.attachTo,
            onAttached: asset.onAttached,
        };
    }
}
