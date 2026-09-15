/* Mansur Clicker — vNext. Все игровые данные хранятся локально. */
(() => {
  'use strict';

  const SAVE_KEY = 'mansur-clicker-save-v3';
  const SETTINGS_KEY = 'mansur-clicker-settings-v2';
  const OFFLINE_CAP = 8 * 60 * 60;

  const CHARACTERS = [
    { id:'mansur', name:'Мансур', image:'characters/mansur.png', unlock:1, mult:1.00, desc:'Главный мем. Сам решил, что он главный.' },
    { id:'bobik', name:'Бобик', image:'characters/bobik.png', unlock:3, mult:1.12, desc:'Лаевый пёс с нелегальным бизнесом.' },
    { id:'slava', name:'Слава', image:'characters/slava.png', unlock:6, mult:1.28, desc:'Заходит и случайно ломает баланс.' },
    { id:'vita', name:'Вита', image:'characters/vita.png', unlock:10, mult:1.48, desc:'Уровень уверенности: 9000.' },
    { id:'yas en', name:'Ясен', image:'characters/yasen.png', unlock:15, mult:1.75, desc:'Выглядит спокойно. Это подозрительно.' },
    { id:'genka', name:'Генка', image:'characters/genka.png', unlock:22, mult:2.10, desc:'Кликнул один раз — получил кредит.' }
  ];
  CHARACTERS[4].id='yasen';

  const UPGRADES = [
    {id:'fingers', icon:'👆', name:'Мемные пальцы', desc:'+1.5 силы клика', cost:25, growth:1.48, click:1.5, passive:0},
    {id:'brain', icon:'🧠', name:'Мозг на максималках', desc:'+6% крит-шанса', cost:180, growth:1.65, crit:0.06},
    {id:'wifi', icon:'📡', name:'Wi‑Fi из гаража', desc:'+4 монеты/сек', cost:350, growth:1.70, passive:4},
    {id:'factory', icon:'🏭', name:'Завод Мансуров', desc:'+20 монет/сек', cost:1500, growth:1.78, passive:20},
    {id:'meme', icon:'🗿', name:'Сверхмемность', desc:'+12% ко всему доходу', cost:8000, growth:1.92, global:0.12},
    {id:'critcharm', icon:'🎲', name:'Кубик судьбы', desc:'+10% крит-урона', cost:18000, growth:2.02, critDamage:0.10},
    {id:'clickstorm', icon:'🌪️', name:'Шторм кликов', desc:'+18 силы клика', cost:40000, growth:2.08, click:18},
    {id:'moneyprinter', icon:'💸', name:'Принтер бабок', desc:'+150 монет/сек', cost:125000, growth:2.15, passive:150}
  ];

  const QUESTS = [
    {id:'qclick25', title:'Разомни пальцы', desc:'Сделай 25 кликов', goal:25, type:'clicks', reward:{coins:300}},
    {id:'qcoins5k', title:'Первые серьёзные деньги', desc:'Заработай 5 000 монет', goal:5000, type:'totalCoins', reward:{coins:1000, crystals:1}},
    {id:'qbuy5', title:'Ой, магазин', desc:'Купи 5 улучшений', goal:5, type:'upgradesBought', reward:{coins:2500}},
    {id:'qcombo', title:'Не сбивай ритм', desc:'Достигни комбо x3.00', goal:3, type:'bestCombo', reward:{crystals:2}},
    {id:'qlevel10', title:'Левелапчик', desc:'Достигни 10 уровня', goal:10, type:'level', reward:{coins:10000, crystals:2}}
  ];

  const ACHIEVEMENTS = [
    {id:'a100', title:'100 тыков', desc:'100 кликов', check:s=>s.clicks>=100, reward:{coins:1000}},
    {id:'a10k', title:'Кликер-барон', desc:'10 000 монет всего', check:s=>s.totalCoins>=10000, reward:{crystals:2}},
    {id:'a10m', title:'Пахнет миллионами', desc:'1 000 000 монет всего', check:s=>s.totalCoins>=1e6, reward:{crystals:10}},
    {id:'acombo5', title:'ПЯТЁРКА', desc:'Комбо x5.00', check:s=>s.bestCombo>=5, reward:{coins:50000}},
    {id:'aprestige', title:'Опять сначала?', desc:'Сделай 1 престиж', check:s=>s.prestige>=1, reward:{crystals:8}},
    {id:'allchars', title:'Коллекционер', desc:'Открой всех персонажей', check:s=>CHARACTERS.every(c=>s.unlocked.includes(c.id)), reward:{crystals:20}}
  ];

  const defaultState = {
    coins:0,totalCoins:0,crystals:0,level:1,xp:0,
    selectedCharacter:'mansur',unlocked:['mansur'],upgrades:{},
    combo:1,bestCombo:1,lastClick:0,clicks:0,crits:0,upgradesBought:0,prestige:0,
    achievements:[],claimedQuests:[],daily:{key:'',progress:0,claimed:false,streak:0},
    lastSave:Date.now(), event:null, eventUntil:0
  };
  let state = loadState();
  let settings = loadSettings();
  let saveTimer = null, comboTimer = null, eventTimer = null;

  const $ = id => document.getElementById(id);
  const ui = {
    boot:$('boot'), app:$('app'), coins:$('coins'), totalCoins:$('totalCoins'), clickPower:$('clickPower'), perSecond:$('perSecond'), crystals:$('crystals'), level:$('level'), xpText:$('xpText'), xpBar:$('xpBar'), combo:$('combo'), comboBar:$('comboBar'), bestCombo:$('bestCombo'), clicks:$('clicks'), crits:$('crits'), critChance:$('critChance'), globalMultiplier:$('globalMultiplier'), prestigeCount:$('prestigeCount'), prestigePreview:$('prestigePreview'), prestigeButton:$('prestigeButton'), character:$('character'), clickTarget:$('clickTarget'), floatLayer:$('floatLayer'), burst:$('burst'), upgrades:$('upgrades'), quests:$('quests'), characters:$('characters'), achievements:$('achievements'), toastArea:$('toastArea'), modal:$('modal'), modalContent:$('modalContent'), eventBanner:$('eventBanner'), eventTitle:$('eventTitle'), eventText:$('eventText'), eventTimer:$('eventTimer'), dailyText:$('dailyText'), dailyButton:$('dailyButton'), dailyStreak:$('dailyStreak'), eventDescription:$('eventDescription'), eventIcon:$('eventIcon'), triggerEvent:$('triggerEvent'), playerTitle:$('playerTitle'), collectionCount:$('collectionCount'), achievementCount:$('achievementCount'), questCount:$('questCount'), muteButton:$('muteButton')
  };

  function cloneDefault(){ return JSON.parse(JSON.stringify(defaultState)); }
  function loadState(){
    try { const raw=JSON.parse(localStorage.getItem(SAVE_KEY)); if(!raw) return cloneDefault(); return {...cloneDefault(),...raw,upgrades:{...raw.upgrades}}; }
    catch { return cloneDefault(); }
  }
  function save(){ state.lastSave=Date.now(); localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
  function scheduleSave(){ clearTimeout(saveTimer); saveTimer=setTimeout(save,250); }
  function loadSettings(){ try{return {...{sound:true,quality:'high'},...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')}}catch{return {sound:true,quality:'high'}} }
  function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));}

  function fmt(n){
    if(!Number.isFinite(n)) return '∞';
    if(n<1000) return Math.floor(n).toLocaleString('ru-RU');
    const units=[['квин',1e18],['квадр',1e15],['трлн',1e12],['млрд',1e9],['млн',1e6],['тыс.',1e3]];
    const u=units.find(x=>n>=x[1]); if(!u) return String(Math.floor(n));
    const v=n/u[1]; return `${v>=100?Math.floor(v):v.toFixed(1)}${u[0]}`;
  }
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function xpNeed(l=state.level){return Math.floor(100*Math.pow(1.26,l-1));}
  function char(){return CHARACTERS.find(c=>c.id===state.selectedCharacter)||CHARACTERS[0];}
  function levelMultiplier(){return 1+Math.max(0,state.level-1)*0.012;}
  function upgradeCost(u){return Math.floor(u.cost*Math.pow(u.growth,state.upgrades[u.id]||0));}
  function critChance(){return clamp(0.05+UPGRADES.reduce((v,u)=>v+(u.crit||0)*(state.upgrades[u.id]||0),0),0,0.85);}
  function critDamage(){return 2+UPGRADES.reduce((v,u)=>v+(u.critDamage||0)*(state.upgrades[u.id]||0),0);}
  function globalMultiplier(){return char().mult*levelMultiplier()*(1+UPGRADES.reduce((v,u)=>v+(u.global||0)*(state.upgrades[u.id]||0),0)+state.crystals*0.01);}
  function clickPower(){const base=1+UPGRADES.reduce((v,u)=>v+(u.click||0)*(state.upgrades[u.id]||0),0); return Math.max(1,Math.floor(base*globalMultiplier()));}
  function passive(){const base=UPGRADES.reduce((v,u)=>v+(u.passive||0)*(state.upgrades[u.id]||0),0); return Math.floor(base*globalMultiplier());}
  function title(){ if(state.level>=50) return 'Мансуровский боженька'; if(state.level>=30) return 'Разрушитель экономики'; if(state.level>=15) return 'Профессиональный тыкальщик'; if(state.level>=7) return 'Уважаемый кликер'; return 'Локальный легендос'; }

  function render(){
    ui.coins.textContent=fmt(state.coins); ui.totalCoins.textContent=fmt(state.totalCoins); ui.clickPower.textContent=fmt(clickPower()); ui.perSecond.textContent=fmt(passive()); ui.crystals.textContent=fmt(state.crystals); ui.level.textContent=state.level; ui.clicks.textContent=fmt(state.clicks); ui.crits.textContent=fmt(state.crits); ui.bestCombo.textContent=`x${state.bestCombo.toFixed(2)}`; ui.combo.textContent=`x${state.combo.toFixed(2)}`; ui.critChance.textContent=`${Math.round(critChance()*100)}%`; ui.globalMultiplier.textContent=`x${globalMultiplier().toFixed(2)}`; ui.prestigeCount.textContent=state.prestige; ui.playerTitle.textContent=title();
    const need=xpNeed(), pct=state.xp/need*100; ui.xpText.textContent=`${fmt(state.xp)} / ${fmt(need)} XP`; ui.xpBar.style.width=`${clamp(pct,0,100)}%`; ui.comboBar.style.width=`${clamp((state.combo-1)/4*100,0,100)}%`;
    const c=char(); ui.character.src=c.image; ui.character.alt=c.name;
    const found=state.unlocked.length; ui.collectionCount.textContent=`${found}/${CHARACTERS.length}`; ui.achievementCount.textContent=`${state.achievements.length}/${ACHIEVEMENTS.length}`; ui.questCount.textContent=`${state.claimedQuests.length}/${QUESTS.length}`;
    const p=Math.floor(Math.max(0,state.totalCoins/100000)); ui.prestigePreview.textContent=`+${p} 💎`; ui.prestigeButton.disabled=p<=0;
    renderUpgrades(); renderQuests(); renderCharacters(); renderAchievements(); renderDaily(); renderEvent();
  }

  function addCoins(amount, gainXP=true){
    if(amount<=0) return; state.coins+=amount; state.totalCoins+=amount; if(gainXP) addXP(Math.max(1,Math.floor(amount*0.10))); checkAchievements(); scheduleSave();
  }
  function addXP(x){state.xp+=x; while(state.xp>=xpNeed()){state.xp-=xpNeed(); state.level++; const reward=100*state.level; addCoins(reward,false); CHARACTERS.forEach(c=>{if(state.level>=c.unlock && !state.unlocked.includes(c.id)){state.unlocked.push(c.id); toast(`Открыт ${c.name}! 🎉`,'success')}}); toast(`УРОВЕНЬ ${state.level}! +${fmt(reward)} 🪙`,'success');} checkAchievements();}
  function doClick(clientX,clientY){
    const now=performance.now(); const elapsed=now-state.lastClick;
    state.combo=elapsed<=900?clamp(state.combo+0.08,1,5):1; state.lastClick=now; state.bestCombo=Math.max(state.bestCombo,state.combo);
    const isCrit=Math.random()<critChance(); let earned=clickPower(); if(isCrit){earned=Math.floor(earned*critDamage());state.crits++; burst();}
    addCoins(earned); state.clicks++; addXP(Math.max(1,Math.floor(earned*0.22)));
    animateCharacter(); float(clientX,clientY,`+${fmt(earned)}${isCrit?' CRIT!':''}`); resetCombo(); checkDaily(); render(); playSfx(isCrit?'crit':'click');
  }
  function resetCombo(){clearTimeout(comboTimer); comboTimer=setTimeout(()=>{state.combo=1;render();},1150)}
  function animateCharacter(){ui.character.classList.remove('hit');void ui.character.offsetWidth;ui.character.classList.add('hit')}
  function burst(){ui.burst.classList.remove('show');void ui.burst.offsetWidth;ui.burst.classList.add('show')}
  function float(x,y,text){const r=ui.arena?ui.character.getBoundingClientRect():{left:0,top:0}; const s=document.createElement('span');s.className='float';s.textContent=text;s.style.left=`${x-r.left}px`;s.style.top=`${y-r.top}px`;ui.floatLayer.appendChild(s);s.addEventListener('animationend',()=>s.remove(),{once:true})}

  function buyUpgrade(id){const u=UPGRADES.find(x=>x.id===id);if(!u)return;const cost=upgradeCost(u);if(state.coins<cost){toast('Монет не хватает 😭','error');return;}state.coins-=cost;state.upgrades[id]=(state.upgrades[id]||0)+1;state.upgradesBought++;toast(`${u.name} → ур. ${state.upgrades[id]}`,'success');render();checkAchievements();playSfx('buy');scheduleSave()}
  function buyMax(){let bought=0;for(const u of UPGRADES){let guard=0;while(state.coins>=upgradeCost(u)&&guard<200){buyUpgrade(u.id);bought++;guard++}}toast(bought?`Куплено улучшений: ${bought} 🔥`:'Нечего покупать','info')}
  function renderUpgrades(){ui.upgrades.innerHTML='';UPGRADES.forEach(u=>{const lv=state.upgrades[u.id]||0,cost=upgradeCost(u),can=state.coins>=cost;const card=document.createElement('article');card.className=`upgrade-card ${can?'affordable':''}`;card.innerHTML=`<div class="upgrade-icon">${u.icon}</div><div class="upgrade-copy"><div class="upgrade-top"><b>${u.name}</b><span>ур. ${lv}</span></div><p>${u.desc}</p><button class="btn ${can?'btn-primary':'btn-muted'} buy" ${can?'':'disabled'}>${fmt(cost)} 🪙</button></div>`;card.querySelector('.buy').onclick=()=>buyUpgrade(u.id);ui.upgrades.appendChild(card)})}

  function renderQuests(){ui.quests.innerHTML='';QUESTS.forEach(q=>{const done=state.claimedQuests.includes(q.id),progress=questProgress(q);const card=document.createElement('article');card.className=`quest-card ${done?'done':''}`;card.innerHTML=`<div class="quest-icon">${done?'✅':'🎯'}</div><div class="upgrade-copy"><div class="upgrade-top"><b>${q.title}</b><span>${done?'ГОТОВО':fmt(progress)+'/'+fmt(q.goal)}</span></div><p>${q.desc}</p><div class="progress"><div class="fill" style="width:${clamp(progress/q.goal*100,0,100)}%"></div></div><button class="btn ${progress>=q.goal&&!done?'btn-primary':'btn-muted'} claim" ${progress>=q.goal&&!done?'':'disabled'}>${done?'ЗАБРАНО':'ЗАБРАТЬ НАРГАДУ'}</button></div>`;card.querySelector('.claim').onclick=()=>claimQuest(q);ui.quests.appendChild(card)})}
  function questProgress(q){if(q.type==='clicks')return state.clicks;if(q.type==='totalCoins')return state.totalCoins;if(q.type==='upgradesBought')return state.upgradesBought;if(q.type==='bestCombo')return state.bestCombo;if(q.type==='level')return state.level;return 0}
  function claimQuest(q){if(state.claimedQuests.includes(q.id))return;const p=questProgress(q);if(p<q.goal)return;state.claimedQuests.push(q.id);reward(q.reward);toast(`Задание «${q.title}» выполнено! 🎯`,'success');render();scheduleSave()}

  function renderCharacters(){ui.characters.innerHTML='';CHARACTERS.forEach(c=>{const unlocked=state.unlocked.includes(c.id),active=state.selectedCharacter===c.id;const card=document.createElement('article');card.className=`character-card ${unlocked?'':'locked'} ${active?'selected':''}`;card.innerHTML=`<div class="char-thumb"><img src="${c.image}" alt="" onerror="this.style.display='none'"><span>${unlocked?'':'🔒'}</span></div><div class="upgrade-copy"><div class="upgrade-top"><b>${c.name}</b><span>x${c.mult.toFixed(2)}</span></div><p>${unlocked?c.desc:`Открывается на ${c.unlock} уровне`}</p><button class="btn ${unlocked?'btn-secondary':'btn-muted'} select-char" ${unlocked?'':'disabled'}>${active?'ВЫБРАН':'ВЫБРАТЬ'}</button></div>`;card.querySelector('.select-char').onclick=()=>{state.selectedCharacter=c.id;toast(`${c.name} выходит на арену 😎`,'success');render();scheduleSave()};ui.characters.appendChild(card)})}

  function renderAchievements(){ui.achievements.innerHTML='';ACHIEVEMENTS.forEach(a=>{const done=state.achievements.includes(a.id),card=document.createElement('article');card.className=`achievement-card ${done?'done':''}`;card.innerHTML=`<div class="achievement-icon">${done?'🏆':'❓'}</div><div class="upgrade-copy"><div class="upgrade-top"><b>${a.title}</b><span>${done?'ПОЛУЧЕНО':'СКРЫТО'}</span></div><p>${a.desc}</p></div>`;ui.achievements.appendChild(card)})}
  function checkAchievements(){ACHIEVEMENTS.forEach(a=>{if(!state.achievements.includes(a.id)&&a.check(state)){state.achievements.push(a.id);reward(a.reward);toast(`Ачивка: ${a.title} 🏆`,'success')}})}

  function dailyKey(){const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`}
  function checkDaily(){const key=dailyKey();if(state.daily.key!==key){state.daily={key,progress:0,claimed:false,streak:state.daily.key?state.daily.streak+1:1}} state.daily.progress=Math.min(25,state.daily.progress+1);scheduleSave()}
  function renderDaily(){if(state.daily.key!==dailyKey()){state.daily={key:dailyKey(),progress:0,claimed:false,streak:state.daily.streak||0}}ui.dailyText.textContent=`Сделай 25 кликов. Прогресс: ${state.daily.progress}/25`;ui.dailyButton.disabled=state.daily.progress<25||state.daily.claimed;ui.dailyButton.textContent=state.daily.claimed?'УЖЕ ЗАБРАНО':state.daily.progress>=25?'ЗАБРАТЬ 2 500 🪙':'ЕЩЁ КЛИКАЙ';ui.dailyStreak.textContent=`🔥 ${state.daily.streak}`}
  ui.dailyButton.onclick=()=>{if(state.daily.progress>=25&&!state.daily.claimed){state.daily.claimed=true;reward({coins:2500,crystals:1});toast('Ежедневная награда забрана! 🎁','success');render();scheduleSave()}};

  const EVENTS=[
    {name:'Дождь из денег',icon:'💸',desc:'Доход x3 на 20 секунд',mult:3,duration:20000},
    {name:'КРИТ-ИСТЕРИКА',icon:'🔥',desc:'Крит-шанс 60% на 15 секунд',crit:0.60,duration:15000},
    {name:'Мемный спонсор',icon:'🤑',desc:'+10 000 монет моментально',instant:10000,duration:12000}
  ];
  function triggerRandomEvent(){const e=EVENTS[Math.floor(Math.random()*EVENTS.length)];state.event=e.name;state.eventUntil=Date.now()+e.duration;if(e.instant)addCoins(e.instant);ui.eventDescription.textContent=e.desc;toast(`${e.icon} ${e.name}!`,'success');playSfx('event');renderEvent();clearTimeout(eventTimer);eventTimer=setTimeout(()=>{state.event=null;state.eventUntil=0;renderEvent();},e.duration);scheduleSave()}
  function renderEvent(){const active=state.event&&Date.now()<state.eventUntil;if(!active){ui.eventBanner.classList.add('hidden');return;}const e=EVENTS.find(x=>x.name===state.event);ui.eventBanner.classList.remove('hidden');ui.eventTitle.textContent=`${e.icon} ${e.name}`;ui.eventText.textContent=e.desc;ui.eventTimer.textContent=`${Math.ceil((state.eventUntil-Date.now())/1000)}с`;ui.eventDescription.textContent=e.desc;ui.eventIcon.textContent=e.icon}
  ui.triggerEvent.onclick=triggerRandomEvent;
  setInterval(()=>{if(state.event&&Date.now()<state.eventUntil)renderEvent()},250);

  function effectivePassive(){let v=passive(),now=Date.now();if(state.event&&now<state.eventUntil){const e=EVENTS.find(x=>x.name===state.event);if(e?.mult)v*=e.mult}return v}
  function tick(){const gain=effectivePassive();if(gain>0)addCoins(gain,false);checkAchievements();render();}
  setInterval(tick,1000);

  function prestige(){const gain=Math.floor(state.totalCoins/100000);if(gain<1){toast('Нужно заработать хотя бы 100 000 всего.','error');return;}openModal(`<div class="modal-hero">♻️</div><h2>Перерождение</h2><p>Ты получишь <b>${gain} 💎</b>. Монеты, уровни и улучшения сбросятся.</p><button id="confirmPrestige" class="btn btn-danger btn-xl">ДА, ЛОМАЙ ВСЁ</button>`);$('confirmPrestige').onclick=()=>{state.coins=0;state.level=1;state.xp=0;state.upgrades={};state.combo=1;state.selectedCharacter='mansur';state.prestige++;state.crystals+=gain;state.lastClick=0;state.unlocked=Array.from(new Set(['mansur',...CHARACTERS.filter(c=>c.unlock===1).map(c=>c.id)]));closeModal();toast(`ПЕРЕРОЖДЕНИЕ! +${gain} 💎`,'success');checkAchievements();render();save();playSfx('prestige')}}
  ui.prestigeButton.onclick=prestige;

  function reward(r){if(r.coins)addCoins(r.coins,false);if(r.crystals)state.crystals+=r.crystals;scheduleSave()}
  function toast(msg,type='info'){const t=document.createElement('div');t.className=`toast ${type}`;t.textContent=msg;ui.toastArea.appendChild(t);requestAnimationFrame(()=>t.classList.add('show'));setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),250)},2300)}
  function openModal(html){ui.modalContent.innerHTML=html;ui.modal.classList.remove('hidden')};function closeModal(){ui.modal.classList.add('hidden')};$('modalClose').onclick=closeModal;ui.modal.addEventListener('click',e=>{if(e.target===ui.modal||e.target.classList.contains('modal-backdrop'))closeModal()});

  function playSfx(type){if(!settings.sound)return;/* audio hooks intentionally left local: put your files in audio/ and connect here */}
  ui.muteButton.onclick=()=>{settings.sound=!settings.sound;ui.muteButton.textContent=settings.sound?'🔊':'🔇';saveSettings();toast(settings.sound?'Звук включён':'Звук выключен')};

  function offlineReward(){const now=Date.now(),seconds=Math.min(OFFLINE_CAP,Math.max(0,(now-(state.lastSave||now))/1000));if(seconds<20)return;const gain=Math.floor(effectivePassive()*seconds*0.75);if(gain<=0)return;state.coins+=gain;state.totalCoins+=gain;openModal(`<div class="modal-hero">🌙</div><h2>Твой прогресс жил без тебя</h2><p>Пока тебя не было, игра собрала <b>${fmt(gain)} 🪙</b>.</p><button id="offlineOk" class="btn btn-primary btn-xl">ЗАБРАТЬ</button>`);$('offlineOk').onclick=closeModal;}

  function switchTab(name){document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.id===`tab-${name}`));render()}
  document.querySelectorAll('.nav-btn').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
  document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>openSettings());
  function openSettings(){openModal(`<div class="modal-hero">⚙️</div><h2>Настройки</h2><div class="settings"><button id="resetSave" class="btn btn-danger">СБРОСИТЬ ПРОГРЕСС</button><button id="exportSave" class="btn btn-secondary">ЭКСПОРТ СОХРАНЕНИЯ</button><button id="importSave" class="btn btn-secondary">ИМПОРТ СОХРАНЕНИЯ</button><button id="closeSettings" class="btn btn-muted">ЗАКРЫТЬ</button></div>`);$('closeSettings').onclick=closeModal;$('resetSave').onclick=()=>{if(confirm('Точно удалить весь прогресс?')){localStorage.removeItem(SAVE_KEY);location.reload()}};$('exportSave').onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mansur-clicker-save.json';a.click();URL.revokeObjectURL(a.href)};$('importSave').onclick=()=>{const input=document.createElement('input');input.type='file';input.accept='.json';input.onchange=async()=>{try{const parsed=JSON.parse(await input.files[0].text());state={...cloneDefault(),...parsed};save();location.reload()}catch{toast('Файл сохранения битый 😭','error')}};input.click()}}

  ui.clickTarget.addEventListener('pointerdown',e=>{e.preventDefault();doClick(e.clientX,e.clientY)});
  document.addEventListener('keydown',e=>{if((e.code==='Space'||e.code==='Enter')&&!ui.modal.classList.contains('hidden'))return;if(e.code==='Space'||e.code==='Enter'){e.preventDefault();const r=ui.clickTarget.getBoundingClientRect();doClick(r.left+r.width/2,r.top+r.height/2)}if(e.code==='Escape')closeModal()});
  $('playButton').onclick=()=>{ui.boot.classList.add('hidden');ui.app.classList.remove('hidden');offlineReward();render();toast('Mansur Clicker загружен. Поехали 😈','success')};
  window.addEventListener('beforeunload',save);

  if(state.daily.key!==dailyKey())state.daily={key:dailyKey(),progress:0,claimed:false,streak:state.daily.streak||0};
  state.unlocked=Array.from(new Set(['mansur',...state.unlocked.filter(id=>CHARACTERS.some(c=>c.id===id))]));
  render();
})();
