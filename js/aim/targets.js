
import { _front } from '../front.js';
import { _board } from '../board.js';
import { _score } from '../score.js';
const _targets = {
    objects: [], // Liste des objets actifs
    maxObjects: 1, // Limite d'objets simultanés
    pointTimeout: 5000, // Durée de vie maximale d'un objet (en ms)
    colorSteps: ["yellow","gold","orange","darkorange","orangered","black"], // Dégradé des couleurs
	// -----------------------------
	size:50, // taille de la cible en pixel (w et h)
	// -----------------------------
	// -----------------------------

	init:function (){
		this.addCss()
	},
	createTarget: function (){
        const x = Math.random() * (_board.width - this.size);
        const y = Math.random() * (_board.height - this.size);
		const targetElement = _front.createDiv({
			'tag':'div',
			'style':{
				left:`${x}px`,
				top:`${y}px`
			},
			'attributes':{className:'target',},
		})
        _board.board.appendChild(targetElement);
		
        const objData = {
            element: targetElement,
            x: x,
            y: y,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 2 - 1,
            size: this.size,
            speed: 3,
            rotation: 0,
            isClickable: true,
            colorIndex: 0,
            startTime: Date.now(), // Initialisation correcte de startTime
        };

        this.objects.push(objData);
		return objData
	},
	addCss:function (){
		let css =`.target {`+
			`position: absolute;`+
			`border-radius: 50%;`+
			`transition: opacity 0.5s ease-out, background-color 0.5s;`+
			`display: flex;`+
			`justify-content: center;`+
			`align-items: center;`+
			`color: black;`+
			`user-select: none;`+
			`background-color: ${this.colorSteps[0]};`+
			`width: ${this.size}px;`+
			`height: ${this.size}px`+
		`}`
		_front.addCss(css,'targets')

	},
	manageObjectLifecycle:function (obj){
		const colorChangeInterval = this.pointTimeout / (this.colorSteps.length - 1);

        const colorChange = setInterval(() => {
            if (obj.colorIndex >= this.colorSteps.length - 1) {
                clearInterval(colorChange);
                obj.isClickable = false;
                obj.element.style.backgroundColor = "black";

                // Supprimer l'objet après qu'il devienne noir
                setTimeout(() => this.removeObject(obj), 500);
            } else {
                obj.colorIndex++;
                obj.element.style.backgroundColor = this.colorSteps[obj.colorIndex];
            }
        }, colorChangeInterval);
	},
	removeObject:function (obj){
        obj.element.style.opacity = "0";
        setTimeout(() => {
            obj.element.remove();
            const index = this.objects.indexOf(obj);
            if (index > -1) {
                this.objects.splice(index, 1);
            }

            // Créer un nouvel objet si nécessaire
            this.createMovingObject();
        }, 500);
	},
	moveObject:function (obj){
        let currentDx = obj.dx;
        let currentDy = obj.dy;

        function updatePosition() {
            if (!obj || !obj.element || !obj.element.parentNode) return;

            obj.x += currentDx * obj.speed;
            obj.y += currentDy * obj.speed;

            if (obj.x <= 0 || obj.x + obj.size >= _board.width) currentDx *= -1;
            if (obj.y <= 0 || obj.y + obj.size >= _board.height) currentDy *= -1;

            obj.element.style.left = `${Math.min(Math.max(0, obj.x), _board.width - obj.size)}px`;
            obj.element.style.top = `${Math.min(Math.max(0, obj.y), _board.height - obj.size)}px`;

            requestAnimationFrame(updatePosition);
        }

        updatePosition();
	},
	handleObjectClick:function (obj){
		    if (!obj.isClickable) return;
	
		    const reactionTime = Date.now() - obj.startTime; // Utilisation correcte de startTime
		    const points = Math.max(10000 - reactionTime, 0) / 20;
		    obj.element.textContent = points;
		    obj.element.style.width = `40px`;
		    obj.element.style.height = `40px`;
		    let point = Math.round(points)
		    _score.addToScore(point);
	
		    // Mettre à jour le meilleur score si nécessaire
		    if (_score.score > _score.bestScore) {
		        _score.bestScore = _score.score;
		        localStorage.setItem("bestScore", _score.bestScore);
		        _board.bestScoreBoard.innerText = `Best Score: ${_score.bestScore}`;
		    }
	
		    this.removeObject(obj);
	},
	createMovingObject:function (){
        if (this.objects.length >= this.maxObjects) return;

        const objData = this.createTarget()
        const object = objData.element

        // Gestion de la durée de vie et du dégradé de couleurs
        this.manageObjectLifecycle(objData);

        // Gestion des clics
        object.addEventListener("click", () => this.handleObjectClick(objData),false);

        // Déplacement de l'objet
        this.moveObject(objData);
	},
}
export { _targets }
