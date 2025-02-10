import * as THREE from 'three';
import { _scene } from '../archer/scene.js';

const _move = {
    moveSpeed: 0.1, // Vitesse de déplacement
    keys: { z: false, q: false, s: false, d: false },
    init: function (){
        this.addListener()
    },
    addListener: function (){
        document.addEventListener('keydown', (event) => {
            this.keys[event.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.key.toLowerCase()] = false;
        });
    },
    updatePlayerMovement: function () {
        let direction = new THREE.Vector3();
        _scene.camera.getWorldDirection(direction);
        direction.y = 0; // Supprime le mouvement vertical (évite de voler)
    
        let right = new THREE.Vector3();
        right.crossVectors(_scene.camera.up, direction).normalize(); // Calcul du vecteur latéral
    
        if (this.keys.z) _scene.camera.position.addScaledVector(direction, this.moveSpeed);
        if (this.keys.s) _scene.camera.position.addScaledVector(direction, -this.moveSpeed);
        if (this.keys.q) _scene.camera.position.addScaledVector(right, this.moveSpeed);
        if (this.keys.d) _scene.camera.position.addScaledVector(right, -this.moveSpeed);
    }
}
export { _move }
