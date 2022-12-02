import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


export class Stone {
    constructor(position, scene) {
        this.scene = scene;

        const loader = new GLTFLoader();
        // Chargement du modèle 3D
        loader.load('assets/models/stone3.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(position.x, position.y, -0.5);
            root.scale.set(0.7, 0.7, 0.7);
            root.rotation.x = Math.PI / 2;
            root.rotation.y = Math.PI / 2 * Math.floor(Math.random() * 4);
            scene.add(root);
            this.block = root;
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
}