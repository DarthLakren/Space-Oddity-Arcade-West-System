export function spawnWave(wave, width) {
  const count = Math.min(4 + wave * 2, 18);
  const enemies = [];
  for (let i = 0; i < count; i++) {
    enemies.push({
      x: 55 + (i % 9) * ((width - 110) / 8),
      y: 55 + Math.floor(i / 9) * 58,
      radius: 15,
      speed: 34 + wave * 8 + Math.random() * 18,
      phase: Math.random() * Math.PI * 2,
      alive: true
    });
  }
  return enemies;
}

export function updateEnemies(enemies, dt, time, width, height) {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    enemy.y += enemy.speed * dt;
    enemy.x += Math.sin(time * 1.8 + enemy.phase) * 30 * dt;
    enemy.x = Math.max(22, Math.min(width - 22, enemy.x));
  }
}

export function drawEnemies(ctx, enemies, time) {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;
    ctx.save(); ctx.translate(enemy.x, enemy.y);
    ctx.shadowBlur = 16; ctx.shadowColor = "#ff4fd8";
    ctx.strokeStyle = "#ff4fd8"; ctx.lineWidth = 2;
    ctx.fillStyle = "#38133d";
    ctx.beginPath(); ctx.moveTo(-17,-8); ctx.lineTo(-8,-15); ctx.lineTo(0,-9); ctx.lineTo(8,-15); ctx.lineTo(17,-8); ctx.lineTo(13,10); ctx.lineTo(0,15); ctx.lineTo(-13,10); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.fillRect(-7,-2,4,4); ctx.fillRect(4,-2,4,4);
    ctx.restore();
  }
}
