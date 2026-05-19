const size = 3;
let board = [];
let moves = 0;

const puzzle = document.getElementById('puzzle');
const movesEl = document.getElementById('moves');
const messageEl = document.getElementById('message');

function initBoard(){
  board = [1,2,3,4,5,6,7,8,0];
  moves = 0;
  updateMoves();
  buildGrid();
  messageEl.textContent = '';
}

function shuffleBoard(){
  do {
    board = board.slice().sort(()=>Math.random()-0.5);
  } while(!isSolvable(board) || isSolved(board));
  moves = 0; updateMoves(); buildGrid(); messageEl.textContent = '';
}

function isSolvable(arr){
  const a = arr.filter(n=>n!==0);
  let inv = 0;
  for(let i=0;i<a.length;i++){
    for(let j=i+1;j<a.length;j++) if(a[i]>a[j]) inv++;
  }
  return inv%2===0;
}

function isSolved(arr){
  for(let i=0;i<8;i++) if(arr[i]!==i+1) return false;
  return arr[8]===0;
}

function buildGrid(){
  puzzle.innerHTML = '';
  board.forEach((val,idx)=>{
    const d = document.createElement('div');
    d.className = 'tile' + (val===0? ' empty' : '');
    d.textContent = val===0 ? '' : val;
    d.dataset.index = idx;
    d.addEventListener('click', ()=> tryMove(idx));
    puzzle.appendChild(d);
  });
}

function tryMove(idx){
  if(board[idx]===0) return;
  const neighbors = [idx-1, idx+1, idx-size, idx+size];
  const canMove = neighbors.some(n=>{
    if(n<0 || n>=board.length) return false;
    if((idx%size===0) && n===idx-1) return false;
    if((idx%size===size-1) && n===idx+1) return false;
    return board[n]===0;
  });
  if(!canMove) return;
  const emptyIndex = neighbors.find(n=>board[n]===0);
  board[emptyIndex] = board[idx];
  board[idx] = 0;
  moves++; updateMoves(); buildGrid();
  if(isSolved(board)) messageEl.textContent = 'Selamat! Anda menyelesaikan puzzle.';
}

function updateMoves(){ movesEl.textContent = 'Gerakan: ' + moves; }

document.getElementById('shuffleBtn').addEventListener('click', shuffleBoard);
document.getElementById('solveBtn').addEventListener('click', initBoard);

initBoard();
