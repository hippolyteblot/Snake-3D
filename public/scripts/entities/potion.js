import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';

export class Potion {
    constructor(position, scene) {
        this.scene = scene;

        const loader = new GLTFLoader();
        // Charge le modèle 3D
        loader.load('assets/models/potion.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(position.x, position.y, -0.5);
            root.scale.set(0.0025, 0.0025, 0.0025);
            root.rotation.x = Math.PI / 2;
            scene.add(root);
            this.block = root;
            setInterval(() => {
                this.rotate();
            }, 25);
        }
        );
    }
    // Supprime l'objet de la scène
    remove() {
        this.scene.remove(this.block);
    }

    // Change sa position
    updatePosition(newCase) {
        this.block.position.x = newCase.x;
        this.block.position.y = newCase.y;
    }

    // Fait tourner l'objet
    rotate() {
        this.block.rotation.y += 0.05;
    }
}