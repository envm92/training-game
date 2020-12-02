class BoxGame extends HTMLElement {
	constructor(winner) {
		super();
		this.winner = winner;
		const shadow =  this.attachShadow({mode: 'open'});
		const div = document.createElement('div');
		div.setAttribute('id', 'box');
		shadow.appendChild(div);
		shadow.appendChild(this.getStyles());
		this.addEventListener('click', this.onclick);
	}

	getStyles() {
		const style = document.createElement('style');
        style.textContent = `
            div {
                background: gray;
                align-items: center;
                color: #fff;
                text-shadow: #000 0 0;
                border-radius: 15px;
				margin: 10px;
				height: 60px;
				width: 60px;
			}
			
		`;
		return style;
	}

	onclick() {
		const shadow =  this.shadowRoot;
		const div = shadow.getElementById('box');
		if (this.winner) {
			div.style.background = 'blue';
		} else {
			div.style.background = 'red';
		}
	}
}

class BoardGame extends HTMLElement {

	boxCount = 5;
	winner = 0;
	plays = 0;
	boxes = [];

	constructor() {
		super();
		this.boxCount =  this.hasAttribute('box-count') ? this.getAttribute('box-count') : 5;
		this.startGame();
	}

	startGame() {
		this.initGame();
		this.drawBoard();
	}

	initGame() {
		this.winner = Math.floor(Math.random() * Math.floor(this.boxCount));
		this.plays = 0;
		this.boxes = Array.from({length:this.boxCount},(_, i) => {
			const box = new BoxGame( this.winner == i );
			box.addEventListener('click', () => {
				const isWinner = this.winner == i;
				this.plays++;
				if(isWinner) {
					this.showAlert('You win!!');
				} else if(!isWinner && this.plays == 3) {
					this.showAlert('Game over');
				}
				return isWinner;
			});
			return box;
		});
	}

	showAlert(msg) {
		setTimeout(() => {
			alert(msg)
			this.clearBoard();
			this.startGame();
		}, 200);
	}

	clearBoard() {
		const shadow = this.shadowRoot;
		shadow.removeChild(shadow.getElementById('board'));
	}

	drawBoard() {
		const shadow = (this.shadowRoot == null) ? this.attachShadow({mode: 'open'}) : this.shadowRoot;
		const div = document.createElement('div');
		div.setAttribute('id', 'board');
		this.boxes.forEach(box => {div.appendChild(box);});
		div.style.display = 'flex';
		shadow.appendChild(div);
	}
}

customElements.define('box-game', BoxGame);
customElements.define('board-game', BoardGame);

let trainingGameElement = document.createElement('board-game');
document.body.appendChild(trainingGameElement);