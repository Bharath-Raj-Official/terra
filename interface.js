let terrainPaused=false,terrainMuted=false;
const reducedTerrainMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function terrainReady(){document.getElementById('start').disabled=false;updateTerrainUI();}
function playTerrainSound(sound){if(sound?.isLoaded())sound.play();}
function startTerrainAudio(){userStartAudio();if(!terrainMuted&&backgroundMusic?.isLoaded()&&!backgroundMusic.isPlaying())backgroundMusic.loop();}
function startTerrain(){startupScreenActive=false;terrainPaused=false;startTerrainAudio();updateTerrainUI();}
function toggleTerrainPause(){if(startupScreenActive||gameState==='gameover'||levelComplete)return;terrainPaused=!terrainPaused;player.velocity.x=0;if(terrainPaused)backgroundMusic.pause();else startTerrainAudio();updateTerrainUI();}
function updateTerrainUI(){const $=id=>document.getElementById(id);if(!$('overlay'))return;$('orbs').textContent=`Orbs ${orbCount} / 5`;$('lives').textContent=`Lives ${Math.max(0,playerLives)}`;$('pause').textContent=terrainPaused?'Resume':'Pause';const show=startupScreenActive||terrainPaused||gameState==='gameover'||levelComplete;$('overlay').hidden=!show;
 if(typeof updateSprites==='function')updateSprites(!show);
 if(show){$('screen-title').textContent=startupScreenActive?'Welcome to Terra':terrainPaused?'Take a breath.':levelComplete?'You found your way home.':'A new beginning.';$('screen-copy').textContent=startupScreenActive?'Collect five orbs to open the portal. Avoid ghosts and keep moving.':terrainPaused?'Your adventure is waiting.':levelComplete?'All five orbs collected. The portal is open.':'The landscape has another path for you.';$('start').textContent=startupScreenActive?'Start adventure':terrainPaused?'Resume adventure':'Play again';}
}
document.addEventListener('DOMContentLoaded',()=>{
 const $=id=>document.getElementById(id);$('start').onclick=()=>{if(startupScreenActive)startTerrain();else if(terrainPaused)toggleTerrainPause();else resetGame();};$('pause').onclick=toggleTerrainPause;
 $('mute').onclick=()=>{terrainMuted=!terrainMuted;outputVolume(terrainMuted?0:1);$('mute').textContent=terrainMuted?'Unmute':'Mute';};
 $('fullscreen').onclick=()=>{const stage=document.querySelector('.game');if(document.fullscreenElement)document.exitFullscreen();else stage.requestFullscreen?.().catch(()=>{});};
 for(const b of document.querySelectorAll('[data-action]')){b.onpointerdown=e=>{e.preventDefault();if(startupScreenActive||terrainPaused||gameState!=='playing'||levelComplete)return;b.setPointerCapture(e.pointerId);const action=b.dataset.action;if(action==='jump'){if(remainingJumps>0){jump(player);remainingJumps--;}}else if(action==='stop')player.velocity.x=0;else player.velocity.x=action==='left'?-2:2;};b.onpointerup=()=>{if(b.dataset.action!=='jump')player.velocity.x=0;};b.onpointercancel=()=>{if(player)player.velocity.x=0;};}
});
window.addEventListener('blur',()=>{if(typeof player!=='undefined'&&player){player.velocity.x=0;if(!startupScreenActive&&!terrainPaused)toggleTerrainPause();}});

