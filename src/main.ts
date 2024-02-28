import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import type { Object3D } from 'three';
import { Group } from 'three';

const mixers: THREE.AnimationMixer[] = [];
const clock = new THREE.Clock();

const container = document.createElement('div');
document.body.appendChild(container);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(100, 200, 300);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 5);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 5);
dirLight.position.set(0, 200, 100);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 180;
dirLight.shadow.camera.bottom = -100;
dirLight.shadow.camera.left = -120;
dirLight.shadow.camera.right = 120;
scene.add(dirLight);

// ground
const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2000, 2000),
    new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
grid.material.opacity = 0.2;
grid.material.transparent = true;
scene.add(grid);
const loader = new FBXLoader();
const parentObject = new Group();
let mixer: THREE.AnimationMixer;
const actions: THREE.AnimationAction[] = [];

const loadModelTexture = async (
    modelPath: string,
    texturePath: string,
    name: string,
    animPath?: string,
): Promise<Object3D> => {
    const object = await new Promise<Object3D>((resolve) => loader.load(modelPath, (object) => resolve(object)));
    object.name = name;

    if (animPath) {
        loader.load(animPath, (animObject: Object3D) => {
            mixer = new THREE.AnimationMixer(object);
            mixers.push(mixer);
            actions.push(mixer.clipAction(animObject.animations[0]));
        });
    }
    object.traverse((child: any) => {
        if (child.isMesh) {
            const texture = new THREE.TextureLoader().load(texturePath);
            child.castShadow = true;
            child.receiveShadow = false;
            child.flatshading = true;
            child.material.map = texture;
            child.material.needsUpdate = true;
        }
    });

    if (object.name === 'axe') {
        //object.position.set(-60, 80, 0);
        //object.scale.set(1, 1, 1);
        object.rotateY(90);
    }
    return object;
};
const loadObjects = async (): Promise<void> => {
    parentObject.add(
        await loadModelTexture(
            'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_body_mesh.fbx',
            'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_body_D.png',
            'body',
            'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_ultimate.fbx',
        ),
    );
    const slots: any = [];
    parentObject.traverse((child) => {
        const name = child.name.trim(); // Exported bones don't have dots in their names
        console.log(name);
        slots[name] = child;
    });
    parentObject.add(
        await loadModelTexture(
            'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_set1_mesh.fbx',
            'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_set1_D.png',
            'clothing',
            'assets/units/SkeletonWarrior_2HandAxe/Animations/SkeletonWarrior_2h_ultimate.fbx',
        ),
    );
    const axe = await loadModelTexture(
        'assets/units/SkeletonWarrior_2HandAxe/Models/skeleton_2h_axe.fbx',
        'assets/units/SkeletonWarrior_2HandAxe/Textures/skeleton_2HAxe_D.png',
        'axe',
    );
    scene.add(parentObject);
    console.log(slots);
    //mixamorigRightHandIndex1
    slots['weapon_end'].add(axe);
    // axe.add(slots['mixamorigRightHandIndex1']);
    // axe.add(slots['mixamorigRightHandIndex2']);
    // axe.add(slots['mixamorigRightHandIndex3']);

    console.log(`Actions`, actions);
    actions.forEach((action) => action.play());
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
window.addEventListener('resize', onWindowResize, false);
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

    renderer.render(scene, camera);

    stats.update();
}

function render() {
    renderer.render(scene, camera);
}

animate();
