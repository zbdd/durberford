import type { AnimationAction, AnimationMixer, Object3D } from 'three';
import { Group } from 'three';

export type GameObjectProps = {
    name: string;
    object: Object3D;
    mixer: AnimationMixer;
    actions: AnimationAction[];
    attachTo?: Object3D;
};

export class GameObject extends Group {
    private actions: AnimationAction[];
    private readonly mixer: AnimationMixer;
    private readonly actionPlaying: AnimationAction | undefined;
    private readonly children: GameObject[];

    constructor({ gameObjectProps }: { gameObjectProps: GameObjectProps[] }) {
        super();

        const gameObject = gameObjectProps.shift();
        if (!gameObject) throw Error(`Cannot instantiate GameObject without GameObjectProps`);

        console.log(gameObject);
        this.name = gameObject.name;
        this.mixer = gameObject.mixer;
        this.add(gameObject.object);

        this.children = [];
        this.actions = [];
        this.actionPlaying = undefined;

        gameObjectProps.forEach((nextObject) => {
            if (nextObject.attachTo) nextObject.attachTo.add(nextObject.object);
            else this.add(nextObject.object);

            this.actions.push(...nextObject.actions);
            this.children.push(new GameObject({ gameObjectProps: [nextObject] }));
        });
    }

    public update(deltaSec: number): void {
        this.mixer.update(deltaSec);
        this.children.forEach((child) => child.update(deltaSec));
    }

    public getActions(): string[] {
        const uniqueClipNames: string[] = [];
        this.actions.forEach((action) => {
            const clipName = action.getClip().name;
            if (!uniqueClipNames.includes(clipName)) uniqueClipNames.push(clipName);
        });
        return uniqueClipNames;
    }

    public setActions(actions: AnimationAction[]): void {
        this.actions = actions;
    }

    public stopActions(fadeDurationSeconds = 0): void {
        this.actions.forEach((action, index) => {
            if (action.isRunning() && fadeDurationSeconds > 0) {
                action.fadeOut(fadeDurationSeconds);
                setTimeout(() => this.actions[index].stop(), fadeDurationSeconds * 1000);
            } else action.stop();
        });
    }

    public playAction(name: string, fadeInDuration = 0, isLoop: boolean): void {
        this.actions.forEach((action) => {
            if (action.getClip().name === name && !action.isRunning()) {
                if (fadeInDuration > 0) {
                    action.fadeIn(fadeInDuration);
                    this.actionPlaying?.fadeOut(fadeInDuration);
                }
                action.play();
            }
        });
    }
}
