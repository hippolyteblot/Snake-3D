// Import de Three.js (depuis un CDN pour alléger le projet)
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';

export class Cell {
    constructor(x, y, i, color1, color2, scene) {

        var color = color1;
        if(i%2 == 0) {
            color = color2;
        }

        this.block = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshLambertMaterial({ color: color })
        );

        this.block.position.x = x;
        this.block.position.y = y;
        this.block.receiveShadow = true;

        this.x = x;
        this.y = y;

        this.movingDirection = "none";

        scene.add(this.block);
    }
}