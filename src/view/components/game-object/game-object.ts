import type { AnimationAction, Object3D } from 'three';
import { Group } from 'three';

export type GameObjectProps = {
    name: string;
    object: Object3D;
    actions: AnimationAction[];
    attachTo?: Object3D;
};

export class GameObject extends Group {
    private actions: AnimationAction[];

    constructor({ gameObjectProps }: { gameObjectProps: GameObjectProps[] }) {
        super();

        this.name = gameObjectProps?.[0].name;
        this.actions = [];

        gameObjectProps.forEach((gameObject) => {
            if (gameObject.attachTo) return void gameObject.attachTo.add(gameObject.object);

            this.add(gameObject.object);
            this.actions.push(...gameObject.actions);
        });
    }

    public getActions(): AnimationAction[] {
        return this.actions;
    }

    public setActions(actions: AnimationAction[]) {
        this.actions = actions;
    }
}
