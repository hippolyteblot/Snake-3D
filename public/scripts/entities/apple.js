// Import de Three.js (depuis un CDN pour alléger le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';


export class Apple {
    constructor(position, scene) {
        this.scene = scene;
        this.block = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
        );
        this.block.position.x = position[0];
        this.block.position.y = position[1];
        this.scene.add(this.block);
    }

    remove() {
        this.scene.remove(this.block);
    }

    updatePosition(position) {
        this.block.position.x = position[0];
        this.block.position.y = position[1];
    }
}