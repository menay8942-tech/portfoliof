let s1=document.getElementById('s1'),s2=document.getElementById('s2'),s3=document.getElementById('s3');
let side='X',cur='X',board=Array(9).fill(""),score=[0,0],playing=true,mode='friend';
let cSound=new Audio('1.mp3'),wSound=new Audio('2.mp3');

document.getElementById('btnFriend').onclick=()=>{mode='friend';document.getElementById('enemy').textContent='صديق';s1.classList.remove('active');s2.classList.add('active')}
document.getElementById('btnAI').onclick=()=>{mode='ai';document.getElementById('enemy').textContent='كمبيوتر';s1.classList.remove('active');s2.classList.add('active')}

document.querySelectorAll('.card').forEach(el=>{
 el.onclick=()=>{document.querySelectorAll('.card').forEach(x=>x.classList.remove('active'));el.classList.add('active');side=el.dataset.s;cur=side}
});
document.getElementById('go').onclick=()=>{
  s2.classList.remove('active');s3.classList.add('active');
  if(mode=='ai' && cur!=side) aiMove(); // لو الكمبيوتر هو اللي يبدأ
}

let cells=document.querySelectorAll('.cell');
cells.forEach(cell=>{
 cell.addEventListener('click',()=>{
  let i=cell.dataset.i; if(board[i]!=""||!playing) return;
  // في وضع الكمبيوتر امنعيه يلعب دور مش دوره
  if(mode=='ai' && cur!=side) return;
  makeMove(i, cur);
  if(playing && mode=='ai') setTimeout(aiMove, 500);
 })
});

function makeMove(i, player){
  board[i]=player; cells[i].textContent=player; cells[i].classList.add(player.toLowerCase());
  cSound.currentTime=0;cSound.play().catch(()=>{}); check();
}

function aiMove(){
  if(!playing) return;
  let best = findBestMove();
  if(best!=-1) makeMove(best, cur);
}

function findBestMove(){
  // 1- يكسب لو يقدر
  for(let i=0;i<9;i++) if(board[i]==""){board[i]=cur; if(isWin(cur)){board[i]=""; return i;} board[i]="";}
  // 2- يمنعك تكسبي
  let human = cur=='X'?'O':'X';
  for(let i=0;i<9;i++) if(board[i]==""){board[i]=human; if(isWin(human)){board[i]=""; return i;} board[i]="";}
  // 3- يلعب في النص
  if(board[4]=="") return 4;
  // 4- ركن عشوائي
  let corners=[0,2,6,8].filter(i=>board[i]=="");
  if(corners.length) return corners[Math.floor(Math.random()*corners.length)];
  // 5- اي مكان فاضي
  let empty=board.map((v,i)=>v==""?i:null).filter(v=>v!=null);
  return empty.length? empty[Math.floor(Math.random()*empty.length)] : -1;
}
function isWin(p){
  let w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return w.some(([a,b,c])=>board[a]==p&&board[b]==p&&board[c]==p);
}
function check(){
 let wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
 for(let [a,b,c] of wins){if(board[a]&&board[a]==board[b]&&board[a]==board[c]){cells[a].classList.add('win');cells[b].classList.add('win');cells[c].classList.add('win');wSound.play().catch(()=>{});if(board[a]=='X')score[0]++;else score[1]++;document.getElementById('sc').textContent=score[0]+' - '+score[1];show(board[a]==side?'انتي كسبتي! 🎉':'الكمبيوتر كسب 😅');playing=false;return}}
 if(!board.includes("")){show('تعادل 🤝');playing=false;return}
 cur=cur=='X'?'O':'X';
}
function show(t){document.getElementById('wt').textContent=t;document.getElementById('pop').classList.add('show')}
function resetGame(){board=Array(9).fill("");cells.forEach(c=>{c.textContent='';c.className='cell'});playing=true;cur=side;document.getElementById('pop').classList.remove('show'); if(mode=='ai' && cur!=side) setTimeout(aiMove,500);}
document.getElementById('again').addEventListener('click', resetGame);
document.getElementById('reset').addEventListener('click', resetGame);