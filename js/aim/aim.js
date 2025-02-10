
import { _front } from '../front.js';
import { _board } from '../board.js';
import { _score } from '../score.js';
import { _targets } from './targets.js';

document.addEventListener("DOMContentLoaded", () => {
    _board.init(
        'Aim',
        {board:true,scoreBoard:true,bestScoreBoard:true},
        '*{margin:0;padding:0;box-sizing: border-box;}'+
        'body{background-color: rgb(190, 190, 190);}'+
        '.container{width:100%;height:100%;position:absolute;overflow:hidden;z-index:2;margin:0;padding:0;box-sizing:border-box;}'+
        '.score{position:absolute;top:5px;left:5px;font-size:16px;font-weight:bold;}'+
        '.bestscore{position:absolute;top:5px;right:5px;font-size:16px;font-weight:bold;}',
    )
    _score.init()
    _targets.init()
    _targets.createMovingObject();
});
