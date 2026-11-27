import { createPlayer, updatePlayer, drawPlayer } from "./player.js";
import { spawnWave, updateEnemies, drawEnemies } from "./enemies.js";
import { getBestScore, saveBestScore } from "./storage.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const overlay = document.querySelector("#overlay");
const startButton = document.querySelector("#start-button");
const overlayTitle = document.querySelector("#overlay-title");
const overlayCopy = document.querySelector("#overlay-copy");
const scoreEl = document.querySelector("#score");
const bestEl = document.querySelector("#best");
const waveEl = document.querySelector("#wave");
const livesEl = document.querySelector("#lives");
const statusEl = document.querySelector("#status");
const threatEl = document.querySelector("#threat");

const W = canvas.width, H = canvas.height;
const keys = Object.create(null);
let player, enemies, bullets, particles, score, wave, running, paused, gameOver, lastTime, elapsed;
let best = getBestScore();
bestEl.textContent = format(best);

function format(value) { return String(value).padStart(6, "0"); }
function updateHud() {
  scoreEl.textContent = format(score);
  bestEl.textContent = format(best);
  waveEl.textContent = String(wave).padStart(2, "0");
  livesEl.textContent = "♥ ".repeat(Math.max(0, player.lives)).trim() || "—";
  threatEl.textContent = wave < 3 ? "LOW" : wave < 6 ? "ELEVATED" : "CRITICAL";
}
function startGame() {
  player = createPlayer(W, H); enemies = spawnWave(1, W); bullets = []; particles = [];
  score = 0; wave = 1; elapsed = 0; running = true; paused = false; gameOver = false;
  overlay.classList.add("hidden"); statusEl.textContent = "MISSION ACTIVE"; updateHud();
}
function endGame() {
  running = false; gameOver = true;
  best = saveBestScore(score);
  updateHud(); statusEl.textContent = "MISSION FAILED";
  overlayTitle.textContent = "MISSION OVER";
  overlayCopy.innerHTML = `Puntuación: <b>${format(score)}</b><br>Récord local: <b>${format(best)}</b><br>El sector necesita otro piloto.`;
  startButton.textContent = "VOLVER A INTENTAR ↗";
  overlay.classList.remove("hidden");
}
function shoot() {
  if (player.cooldown > 0) return;
  bullets.push({ x: player.x, y: player.y - 20, speed: 570 });
  player.cooldown = 0.23;
}
function burst(x,y,color) {
  for(let i=0;i<9;i++) particles.push({x,y,vx:(Math.random()-.5)*170,vy:(Math.random()-.5)*170,life:.45,color});
}
function update(dt) {
  elapsed += dt;
  updatePlayer(player, dt, keys, W);
  if (keys.Space || keys[" "]) shoot();
  updateEnemies(enemies, dt, elapsed, W, H);
  for (const bullet of bullets) bullet.y -= bullet.speed * dt;
  bullets = bullets.filter(b => b.y > -10);
  for (const p of particles) { p.x += p.vx*dt; p.y += p.vy*dt; p.life -= dt; }
  particles = particles.filter(p => p.life > 0);

  for (const bullet of bullets) {
    for (const enemy of enemies) {
      if (enemy.alive && Math.hypot(bullet.x-enemy.x, bullet.y-enemy.y) < enemy.radius+5) {
        enemy.alive = false; bullet.y = -100; score += 100; burst(enemy.x,enemy.y,"#ff4fd8"); break;
      }
    }
  }
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    if (enemy.y > H - 75 || Math.hypot(player.x-enemy.x,player.y-enemy.y) < 27) {
      enemy.alive = false; player.lives--; player.invulnerable = 1.4; burst(enemy.x,enemy.y,"#42f5f5");
      if (player.lives <= 0) { endGame(); return; }
    }
  }
  if (enemies.every(e => !e.alive)) {
    wave++; enemies = spawnWave(wave, W);
    score += 250;
  }
  updateHud();
}
function drawBackground(time) {
  ctx.fillStyle = "#050511"; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle = "#191934"; ctx.lineWidth = 1;
  for(let x=0;x<W;x+=45){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<H;y+=45){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  for(let i=0;i<75;i++){
    const x=(i*137.5)%W, y=(i*83.7+time*(12+i%5)*5)%H;
    ctx.fillStyle = i%5===0 ? "#ff4fd8" : "#a6b7ff";
    ctx.globalAlpha=.25+(i%4)*.15; ctx.fillRect(x,y,2,2);
  }
  ctx.globalAlpha=1;
}
function draw(time) {
  drawBackground(time);
  if (player) drawPlayer(ctx,player,time);
  drawEnemies(ctx,enemies||[],time);
  ctx.save(); ctx.shadowBlur=12; ctx.shadowColor="#42f5f5"; ctx.fillStyle="#42f5f5";
  for(const b of bullets||[]) ctx.fillRect(b.x-2,b.y-9,4,15);
  ctx.restore();
  for(const p of particles||[]){ctx.globalAlpha=Math.max(0,p.life/.45);ctx.fillStyle=p.color;ctx.fillRect(p.x,p.y,3,3);}
  ctx.globalAlpha=1;
  if(paused){ctx.fillStyle="#070716bb";ctx.fillRect(0,0,W,H);ctx.fillStyle="#42f5f5";ctx.font="bold 36px Orbitron, sans-serif";ctx.textAlign="center";ctx.fillText("PAUSED",W/2,H/2);}
}
function loop(timestamp) {
  const dt = Math.min((timestamp-lastTime)/1000 || 0, .033); lastTime=timestamp;
  if(running && !paused) update(dt);
  draw(timestamp/1000);
  requestAnimationFrame(loop);
}
document.addEventListener("keydown", e => {
  if(["ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
  const key = e.code === "Space" ? "Space" : (e.code === "ArrowLeft" || e.code === "ArrowRight" ? e.code : e.key.toLowerCase());
  keys[key] = true;
  if(e.key.toLowerCase()==="p" && running) { paused=!paused; statusEl.textContent=paused?"PAUSED":"MISSION ACTIVE"; }
  if(e.key==="Enter" && !running) startGame();
});
document.addEventListener("keyup", e => { const key = e.code === "Space" ? "Space" : (e.code === "ArrowLeft" || e.code === "ArrowRight" ? e.code : e.key.toLowerCase());
  keys[key] = false; });
startButton.addEventListener("click",startGame);
bestEl.textContent=format(best);
player=createPlayer(W,H); enemies=[]; bullets=[]; particles=[]; score=0; wave=1; running=false; paused=false;
requestAnimationFrame(t=>{lastTime=t;requestAnimationFrame(loop);});
