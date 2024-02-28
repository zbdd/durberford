import type { Object3D } from 'three';
import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { View } from './view';
import { Loader } from './loader';

const mixers: THREE.AnimationMixer[] = [];
const clock = new THREE.Clock();

const container = document.createElement('div');
document.body.appendChild(container);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(100, 200, 300);

const view = new View();
const loader = new Loader({ mixers });

const loadObjects = async (): Promise<void> => {
    const gameObjects = await loader.loadGameAssets([
        {
            modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_body_mesh.fbx',
            texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_body_D.png',
            name: 'skeleton-body',
            animationPath: 'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_ultimate.fbx',
        },
        {
            modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_set1_mesh.fbx',
            texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_set1_D.png',
            name: 'skeleton-clothing',
            animationPath: 'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_ultimate.fbx',
        },
        {
            modelPath: 'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_2h_axe.fbx',
            texturePath: 'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_2HAxe_D.png',
            name: 'skeleton-axe',
            onComplete: (object: Object3D) => {
                object.rotateY(90);
                object.rotateZ(90);
            },
        },
    ]);
    gameObjects.forEach((gameObject) => view.add(gameObject));
};

void loadObjects();

const renderer = new THREE.WebGLRenderer({ antialias: true });
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

    const delta = clock.getDelta() * 0.1;

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
