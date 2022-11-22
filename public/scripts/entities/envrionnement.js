import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


export class Environnement {
    constructor(position, scale, rotation, scene) {
        this.scene = scene;

        const loader = new GLTFLoader();
        loader.load('assets/models/environnement.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(position.x-0.5, position.y-0.5, -3.5*scale);
            root.scale.set(scale*0.96, scale*0.96, scale*0.96);
            root.rotation.x = Math.PI / 2;
            root.rotation.y = rotation;
            scene.add(root);
            this.block = root;
        }
        );
    }

    remove() {
        this.scene.remove(this.block);
    }

    updatePosition(newCase) {
        this.block.position.x = newCase.x;
        this.block.position.y = newCase.y;
    }
}