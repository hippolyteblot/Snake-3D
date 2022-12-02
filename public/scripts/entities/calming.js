import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


export class Calming {
    constructor(position, scene) {
        this.scene = scene;

        const loader = new GLTFLoader();
        // Chargement du modèle 3D
        loader.load('assets/models/calming.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(position.x, position.y, -0.7);
            root.scale.set(0.15, 0.15, 0.15);
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

    // Le fait tourner
    rotate() {
        this.block.rotation.y += 0.05;
    }
}