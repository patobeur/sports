import * as THREE from 'three';
const _arrows = {
    arrowDatas: {'basic': {length:3}},
    arrows: [],
    maxArrows: 15,
    shootedArrows: 0,
    _scene:undefined,
    init:function (_scene,_cibles,_score,raycaster,gravity) {
        this._cibles = _cibles
        this._score = _score
        this._scene = _scene
        this.raycaster = raycaster
        this.gravity = gravity
        document.addEventListener('click', _arrows.shootArrow);
    },
    shootArrow:function () {
        console.log(_arrows.arrows.length,'/',_arrows.maxArrows,'/',_arrows.shootedArrows)
        if (_arrows.arrows.length >= _arrows.maxArrows) {
            _arrows.resetArrows();
        }
        const arrowGeometry = new THREE.CylinderGeometry(0.045, 0.045, _arrows.arrowDatas.basic.length, 10);
        const arrowMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xffff00 });
        const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
        
        // Position the arrow slightly in front of the camera
        let arrowPosition = new THREE.Vector3();
        _arrows._scene.camera.getWorldPosition(arrowPosition);
        let forward = new THREE.Vector3();
        _arrows._scene.camera.getWorldDirection(forward);
        arrowPosition.addScaledVector(forward, 1.5);
        arrow.position.copy(arrowPosition);
        
        arrow.castShadow = true
        arrow.receiveShadow = true;
        let velocity = forward.clone().multiplyScalar(1.5);
        
        // Align arrow's rotation with camera direction
        arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), velocity.clone().normalize());
        
        _arrows.arrows.push({ mesh: arrow, velocity, stopped: false });
        _arrows.shootedArrows++
        _arrows._scene.scene.add(arrow);
    },
    checkCollision:function (arrow) {
        if (arrow.stopped) return;
    
        let direction = arrow.velocity.clone().normalize();
        this.raycaster.set(arrow.mesh.position, direction);
        const intersects = this.raycaster.intersectObjects(this._cibles.cible.children, true);
    
        if (intersects.length > 0) {
            let impact = intersects[0];
    
            // Ajouter des points au score
            this._score.addToScore(impact.object.userData.points);
    
            // Positionner la flèche avec un léger enfoncement
            arrow.mesh.position.copy(impact.point);
            let penetration = -(this.arrowDatas.basic.length/2) + (this.arrowDatas.basic.length/3)
            // console.log(penetration)
            arrow.mesh.position.addScaledVector(direction, penetration);
    
            // Corriger l'orientation pour qu'elle suive la trajectoire de la flèche
            arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    
            arrow.stopped = true;
        }
    },    
    resetArrows:function (){
        // Reset arrows
        _arrows.arrows.forEach(arrow => _arrows._scene.scene.remove(arrow.mesh));
        _arrows.arrows = [];
    },    
    checkArrows:function (){
        this.arrows.forEach(arrow => {
            if (!arrow.stopped) {
                arrow.velocity.add(this.gravity);
                arrow.mesh.position.add(arrow.velocity);
                
                // Update arrow rotation to follow trajectory
                arrow.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrow.velocity.clone().normalize());
                this.checkCollision(arrow);
            }
        });
    }
}
export {_arrows}