import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import type { GameObjectProps } from '../view';
import { GameObject } from '../view';
import type { AnimationAction, Group, Object3D, Object3DEventMap } from 'three';
import { AnimationMixer } from 'three';
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

type LoadedAssetProps = {
    modelObject: Group<Object3DEventMap>;
    actions: AnimationAction[];
    attachTo?: string;
    onAttached?: (object: Object3D) => void;
    mixer: AnimationMixer;
};

export class Loader extends FBXLoader {
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
            const objectsAndActions: LoadedAssetProps[] = [];

            for (const asset of group.assets) {
                const loadedObject = await this.loadAsset(asset);
                objectsAndActions.push(loadedObject);
            }

            const gameObjectProps: GameObjectProps[] = [];
            objectsAndActions.forEach((prop, index) => {
                gameObjectProps.push({
                    name: prop.modelObject.name,
                    object: prop.modelObject,
                    actions: prop.actions,
                    mixer: prop.mixer,
                    attachTo:
                        index === 0
                            ? undefined
                            : prop.attachTo
                              ? this.findObjectByName(prop.attachTo, gameObjectProps[0].object)
                              : gameObjectProps[0].object,
                });
                prop.onAttached?.(prop.modelObject);
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

    private async loadAsset(asset: GameAssetProps): Promise<LoadedAssetProps> {
        const modelObject = await this.loadAsync(asset.modelPath);
        if (!modelObject) throw Error(`Failed to load asset: ${asset.name}`);

        const actions: AnimationAction[] = [];

        modelObject.name = asset.name;
        const mixer = new AnimationMixer(modelObject);

        if (asset.animationPaths.length > 0) {
            for (const path of asset.animationPaths) {
                const animationObject = await this.loadAsync(path);

                if (animationObject) {
                    actions.push(mixer.clipAction(animationObject.animations[0]));
                }
            }
        }

        return {
            modelObject,
            actions,
            attachTo: asset.attachTo,
            onAttached: asset.onAttached,
            mixer,
        };
    }
}
