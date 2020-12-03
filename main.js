class BoxGame extends HTMLElement {
  constructor() {
    super();
    const shadow =  this.attachShadow({mode: 'open'});
    const div = document.createElement('div');
    div.setAttribute('id', 'box');
    shadow.appendChild(div);
    shadow.appendChild(this.getStyles());
  }

  static get observedAttributes() { return ['open']; }

  getStyles() {
    const style = document.createElement('style');
    style.textContent = `
      div {
        background: gray;
        align-items: center;
        text-shadow: #000 0 0;
        border-radius: 15px;
        margin: 10px;
        height: 60px;
        width: 60px;
      }
      
    `;
    return style;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'open') {
      this.openBox();
    }
  }

  openBox() {
    const shadow = this.shadowRoot;
    const div = shadow.getElementById('box');
    div.style.background =
        (this.getAttribute('winner') === 'true') ? 'blue': 'red';
  }
}


class ScoreGame extends HTMLElement {
  constructor() {
    super();
    const shadow =  this.attachShadow({mode: 'open'});
    const div = document.createElement('div');
    const wonDiv = document.createElement('div');
    const wonH1 = document.createElement('h1');
    wonH1.textContent = 'Won: ';
    const wonSpan = document.createElement('span');
    wonSpan.textContent = String(this.getAttribute('won') | 0);
    wonSpan.setAttribute('id', 'won-span');
    wonH1.appendChild(wonSpan);
    wonDiv.appendChild(wonH1);
    div.appendChild(wonDiv);

    const lostDiv = document.createElement('div');
    const lostH1 = document.createElement('h1');
    lostH1.textContent = 'Lost: ';
    const lostSpan = document.createElement('span');
    lostSpan.textContent = String(this.getAttribute('lost') | 0);
    lostSpan.setAttribute('id', 'lost-span');
    lostH1.appendChild(lostSpan);
    lostDiv.appendChild(lostH1);
    div.appendChild(lostDiv);

    shadow.appendChild(div);
    shadow.appendChild(this.getStyles());
  }

  static get observedAttributes() { return ['won', 'lost']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'won' || name === 'lost') {
      const shadow =  this.shadowRoot;
      const span = shadow.getElementById(`${name}-span`);
      span.textContent = String(this.getAttribute(name) | 0);
    }
  }

  getStyles() {
    const style = document.createElement('style');
    style.textContent = `
      div {
        background: pink;
        color: #fff;
        text-shadow: #000 0 0;
        border-radius: 15px;
        width: 300px;
        height: 60px;
        display: flex;
      }
      
    `;
    return style;
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
    this.won = 0;
    this.lost = 0;
    this.drawBoxInput();
    this.drawScore();
    this.startGame();
  }

  static get observedAttributes() { return ['box-count']; }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'box-count') {
      this.boxCount = newValue;
      this.clearBoard();
      this.startGame();
    }
  }

  startGame() {
    this.initGame();
    this.drawBoard();
  }

  initGame() {
    this.winner = Math.floor(Math.random() * Math.floor(this.boxCount));
    this.plays = 0;
    this.boxes = Array.from({length:this.boxCount},(value, i) => {
      const box = new BoxGame( this.winner === i );
      box.setAttribute('winner', String(this.winner === i));
      box.addEventListener('click', (_) => {
        box.setAttribute('open' , '');
        const isWinner = this.winner === i;
        this.plays++;
        if(isWinner) {
          this.showAlert('You win!!');
          this.updateScore(isWinner);
        } else if(!isWinner && this.plays === 3) {
          this.showAlert('Game over');
          this.updateScore(isWinner);
        }
        return isWinner;
      });
      return box;
    });
  }

  updateScore(win) {
    const shadow = this.shadowRoot;
    const score = shadow.getElementById('score');
    if (win) {
      this.won++;
      score.setAttribute('won', this.won);
    } else {
      this.lost++;
      score.setAttribute('lost', this.lost);
    }
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

  drawBoxInput() {
    const shadow = this.attachShadow({mode: 'open'});
    const input = document.createElement('input');
    input.type = 'number';
    input.value = '5';
    input.setAttribute('min', '5');
    input.addEventListener('input', (event) => {
      const value = parseInt(event.target.value);
      this.setAttribute('box-count', `${(value < 5)? 5 : value}`);
    });
    shadow.appendChild(input);
  }

  drawScore() {
    const shadow = this.shadowRoot;
    const score = new ScoreGame();
    score.setAttribute('id', 'score');
    shadow.appendChild(score);
  }

  drawBoard() {
    const shadow = this.shadowRoot;
    const div = document.createElement('div');
    div.setAttribute('id', 'board');
    this.boxes.forEach(box => {div.appendChild(box);});
    div.style.display = 'flex';
    shadow.appendChild(div);
  }
}

customElements.define('box-game', BoxGame);
customElements.define('score-game', ScoreGame);
customElements.define('board-game', BoardGame);

let trainingGameElement = document.createElement('board-game');
trainingGameElement.setAttribute('box-count' , '5');
document.body.appendChild(trainingGameElement);