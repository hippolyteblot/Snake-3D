// Import de Three.js (depuis un CDN pour alléger le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


export class Apple {
    constructor(position, scene) {
        this.scene = scene;

        const loader = new GLTFLoader();
        loader.load('assets/models/apple.glb', (gltf) => {
            const root = gltf.scene;
            root.position.set(position.x, position.y, position.z);
            root.scale.set(0.6, 0.6, 0.6);
            root.rotation.x = Math.PI / 2;
            scene.add(root);
            this.block = root;
            setInterval(() => {
                this.rotate();
            }, 50);
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

    rotate() {
        this.block.rotation.y += 0.1;
    }
}