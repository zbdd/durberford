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
            if (gameObject.attachTo) gameObject.attachTo.add(gameObject.object);
            else this.add(gameObject.object);

            this.actions.push(...gameObject.actions);
        });
    }

    public getActions(): string[] {
        const uniqueClipNames: string[] = [];
        this.actions.forEach((action) => {
            const clipName = action.getClip().name;
            if (!uniqueClipNames.includes(clipName)) uniqueClipNames.push(clipName);
        });
        return uniqueClipNames;
    }

    public setActions(actions: AnimationAction[]) {
        this.actions = actions;
    }

    public playAction(name: string): void {
        this.actions.forEach((action) => {
            if (action.getClip().name === name) action.play();
        });
    }
}
