import {
    Color,
    DirectionalLight,
    Fog,
    GridHelper,
    HemisphereLight,
    Mesh,
    MeshPhongMaterial,
    PlaneGeometry,
    Scene,
} from 'three';

export class View extends Scene {
    constructor() {
        super();

        // Background
        this.background = new Color(0xa0a0a0);
        this.fog = new Fog(0xa0a0a0, 200, 1000);

        // Lighting
        const hemiLight = new HemisphereLight(0xffffff, 0x444444, 5);
        hemiLight.position.set(0, 200, 0);
        this.add(hemiLight);

        const dirLight = new DirectionalLight(0xffffff, 5);
        dirLight.position.set(0, 200, 100);
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 180;
        dirLight.shadow.camera.bottom = -100;
        dirLight.shadow.camera.left = -120;
        dirLight.shadow.camera.right = 120;
        this.add(dirLight);

        // Ground
        const mesh = new Mesh(
            new PlaneGeometry(2000, 2000),
            new MeshPhongMaterial({ color: 0x999999, depthWrite: false }),
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.receiveShadow = true;
        this.add(mesh);

        const grid = new GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.2;
        grid.material.transparent = true;
        this.add(grid);
    }
}
