export function createPlayer(width, height) {
  return { x: width / 2, y: height - 68, width: 34, height: 38, speed: 430, cooldown: 0, lives: 3, invulnerable: 0 };
}

export function updatePlayer(player, dt, keys, width) {
  const direction = (keys.ArrowRight || keys.d ? 1 : 0) - (keys.ArrowLeft || keys.a ? 1 : 0);
  player.x += direction * player.speed * dt;
  player.x = Math.max(25, Math.min(width - 25, player.x));
  player.cooldown = Math.max(0, player.cooldown - dt);
  player.invulnerable = Math.max(0, player.invulnerable - dt);
}

export function drawPlayer(ctx, player, time) {
  if (player.invulnerable > 0 && Math.floor(time * 12) % 2 === 0) return;
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.shadowBlur = 22; ctx.shadowColor = "#42f5f5";
  ctx.fillStyle = "#42f5f5";
  ctx.beginPath(); ctx.moveTo(0,-22); ctx.lineTo(17,17); ctx.lineTo(0,10); ctx.lineTo(-17,17); ctx.closePath(); ctx.fill();
  ctx.fillStyle = "#ff4fd8"; ctx.beginPath(); ctx.moveTo(-7,14); ctx.lineTo(0,27 + Math.sin(time*25)*5); ctx.lineTo(7,14); ctx.fill();
  ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0,-3,4,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
