import type { AnimationAction, Object3D } from 'three';
import { Group } from 'three';

export type GameObjectProps = {
    name: string;
    object: Object3D;
    actions: { name: string; action: AnimationAction }[];
    attachTo?: Object3D;
};

export class GameObject extends Group {
    private actions: { name: string; action: AnimationAction }[];

    constructor({ gameObjectProps }: { gameObjectProps: GameObjectProps[] }) {
        super();

        this.name = gameObjectProps?.[0].name;
        this.actions = [];

        gameObjectProps.forEach((gameObject) => {
            if (gameObject.attachTo) gameObject.attachTo.add(gameObject.object);
            else this.add(gameObject.object);

            this.actions.push(...gameObject.actions);
        });
    }

    public getActions(): { name: string; action: AnimationAction }[] {
        return this.actions;
    }

    public setActions(actions: { name: string; action: AnimationAction }[]) {
        this.actions = actions;
    }

    public playAction(name: string): void {
        this.actions.forEach((action) => {
            if (action.name === name) action.action.play();
        });
    }
}
