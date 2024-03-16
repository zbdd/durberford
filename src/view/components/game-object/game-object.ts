import type { AnimationAction, AnimationMixer, Object3D } from 'three';
import { Group } from 'three';

export type GameObjectProps = {
    model: Object3D;
    name: string;
    mixer: AnimationMixer;
    actions: AnimationAction[];
    children?: GameObject[];
};

export class GameObject extends Group {
    private actions: AnimationAction[];
    private readonly mixer: AnimationMixer;
    private readonly actionPlaying: AnimationAction | undefined;
    private readonly gameObjects: GameObject[];

    constructor({ model, name, mixer, actions, children }: GameObjectProps) {
        super();

        this.actions = actions;
        this.name = name;
        this.mixer = mixer;
        this.gameObjects = children ?? [];
        this.add(model);
    }

    public update(deltaSec: number): void {
        this.mixer.update(deltaSec);
        this.gameObjects.forEach((child) => child.update(deltaSec));
    }

    public addChildren(children: GameObject[]): void {
        this.gameObjects.push(...children);
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
        this.actions.forEach((action) => {
            if (action.isRunning() && fadeDurationSeconds > 0) {
                action.fadeOut(fadeDurationSeconds);
                // setTimeout(() => this.actions[index].stop(), fadeDurationSeconds * 1000);
            } else action.stop();
        });
        this.gameObjects.forEach((child) => child.stopActions(fadeDurationSeconds));
    }

    public playAction(name: string, fadeInDuration = 0): void {
        this.actions.forEach((action) => {
            if (action.getClip().name === name && !action.isRunning()) {
                if (fadeInDuration > 0) {
                    action.fadeIn(fadeInDuration);
                    this.actionPlaying?.fadeOut(fadeInDuration);
                }
                action.play();
            }
        });
        this.gameObjects.forEach((child) => child.playAction(name, fadeInDuration));
    }
}
