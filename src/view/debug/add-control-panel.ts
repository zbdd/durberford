import { Pane } from 'tweakpane';
import type { View } from '../view.ts';
import type { GameObject } from '../components';

const createToggleGuiButton = (pane: Pane) => {
    const button = document.createElement('button');
    button.innerText = '⚙️';
    button.style.position = 'absolute';
    button.style.zIndex = '100';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.cursor = 'pointer';
    button.title = 'Show control panel';
    button.addEventListener('click', () => {
        pane.hidden = !pane.hidden;
        button.innerText = pane.hidden ? '⚙️' : '❌';
    });
    pane.hidden = false;

    return button;
};

/**
 * https://cocopon.github.io/tweakpane/
 */
export const addControlPanel = ({
    view,
    gameObject,
    animations,
}: {
    view: View;
    gameObject: GameObject;
    animations: string[];
}): {
    pane: Pane;
    button: HTMLButtonElement;
} => {
    const pane = new Pane();
    const tab = pane.addTab({ pages: [{ title: 'Unit' }] });
    const [unitPage] = tab.pages;
    const animationOptions = Object.values(animations)
        .sort()
        .reduce(
            (prev, nextKey) => {
                prev[nextKey] = nextKey;
                return prev;
            },
            {} as Record<string, string>,
        );
    const animationState = {
        name: animations[0],
    };
    unitPage.addBinding(animationState, 'name', {
        label: 'name',
        options: animationOptions,
    });
    unitPage
        .addButton({
            title: 'Play',
        })
        .on('click', () => {
            gameObject.stopActions();
            gameObject.playAction(animationState.name);
        });
    unitPage
        .addButton({
            title: 'Stop',
        })
        .on('click', () => {
            gameObject.stopActions();
        });

    void view;

    pane.element.style.position = 'absolute';
    pane.element.style.top = '20px';
    pane.element.style.right = '20px';
    pane.element.style.zIndex = '1000';

    const button = createToggleGuiButton(pane);

    return {
        pane,
        button,
    };
};
