import type { AnimationMixer } from 'three';
import { Clock, PerspectiveCamera, WebGLRenderer } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { GameObject } from './view';
import { View } from './view';
import { Loader } from './loader';
import { addControlPanel } from './view/debug';

const mixers: AnimationMixer[] = [];
const clock = new Clock();

const container = document.createElement('div');
document.body.appendChild(container);

const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(100, 200, 300);

const view = new View();
const loader = new Loader({ mixers });

const gameWrapper = document.createElement('div');

const gameObjects: GameObject[] = [];

const loadObjects = async (): Promise<void> => {
    gameObjects.push(...(await loader.loadGameAssets({})));
    gameObjects.forEach((gameObject) => view.add(gameObject));
};

void loadObjects().then(() => {
    createControlPanel();
});

const renderer = new WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 100, 0);
controls.update();

window.addEventListener('resize', onWindowResize);

// stats
const stats = new Stats();
container.appendChild(stats.dom);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta() * 0.0666;

    mixers.forEach((mixer) => {
        mixer.update(delta);
    });

    renderer.render(view, camera);

    stats.update();
}

function render() {
    renderer.render(view, camera);
}

animate();

function createControlPanel() {
    const controlPanel = addControlPanel({ view, gameObject: gameObjects[0], animations: gameObjects[0].getActions() });
    gameWrapper.appendChild(controlPanel.button);
    document.body.appendChild(gameWrapper);
}
