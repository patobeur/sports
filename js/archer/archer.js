import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { _move } from '../3d/move.js';
import { _board } from '../board.js';
import { _score } from '../score.js';
import { _front } from '../front.js';
import { _scene } from './scene.js';
import { _cibles } from '../3d/lib/cibles.js';
import { _arrows } from '../3d/lib/arrows.js';
import { _createStars } from '../3d/lib/stars.js';
import { _CubeManager } from '../3d/lib/nuages.js';

const raycaster = new THREE.Raycaster();
const gravity = new THREE.Vector3(0, -0.01, 0);

_board.init(
    'Archer',
    {scoreBoard:true,bestScoreBoard:true},
    '*{margin:0;padding:0;box-sizing: border-box;}'+
    'body{background-color: rgb(190, 190, 190);}'+
    '.container{width:100%;height:100%;position:absolute;overflow:hidden;z-index:2;margin:0;padding:0;box-sizing:border-box;}'+
    '.score{position:absolute;top:5px;left:5px;font-size:16px;font-weight:bold;}'+
    '.bestscore{position:absolute;top:5px;right:5px;font-size:16px;font-weight:bold;}'
)
_move.init()
_score.init()
_scene.init()
_cibles.init(_scene)
_arrows.init(_scene,_cibles,_score,raycaster,gravity)

const cubeManager = new _CubeManager(_scene.scene, _scene.camera, 
    50, //maxClouds
    5000, //spawnRate
    5, //numCubesPerGroup
    50, //spawnDistance
    0.02, //speed
    5000 //10000
);
_createStars(_scene.scene, 2000, 800);

// Animate
let clock = new THREE.Clock()
function animate() {
    let delta = clock.getDelta();
    requestAnimationFrame(animate);
    _move.updatePlayerMovement(); 
    _arrows.checkArrows();
    _scene.renderer.render(_scene.scene, _scene.camera);
    // _scene.soleil.animate(delta)
    cubeManager.update();
}
animate();

let mire = _front.createDiv({
    style:{backgroundColor:"black",position:'absolute',top:"calc( 50% - 1px)",left:"calc( 50% - 1px)",width:"4px",height:"4px"}
})
document.body.append(mire)