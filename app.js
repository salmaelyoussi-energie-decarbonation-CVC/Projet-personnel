'use strict';
// ─── DONNÉES ────────────────────────────────────────────────────────────────
const REGIONS=[
  {code:'84',name:'Auvergne-Rhône-Alpes',icon:'🏔️',pop:8092,glow:'rgba(16,185,129,.18)'},
  {code:'27',name:'Bourgogne-Franche-Comté',icon:'🍷',pop:2807,glow:'rgba(124,111,255,.2)'},
  {code:'53',name:'Bretagne',icon:'🌊',pop:3393,glow:'rgba(59,130,246,.2)'},
  {code:'24',name:'Centre-Val de Loire',icon:'🏰',pop:2564,glow:'rgba(245,158,11,.18)'},
  {code:'94',name:'Corse',icon:'🏝️',pop:357,glow:'rgba(16,185,129,.15)'},
  {code:'44',name:'Grand Est',icon:'⚗️',pop:5584,glow:'rgba(139,92,246,.2)'},
  {code:'32',name:'Hauts-de-France',icon:'🏭',pop:6021,glow:'rgba(245,158,11,.2)'},
  {code:'11',name:'Île-de-France',icon:'🗼',pop:12272,glow:'rgba(124,111,255,.25)'},
  {code:'28',name:'Normandie',icon:'⚓',pop:3310,glow:'rgba(59,130,246,.18)'},
  {code:'75',name:'Nouvelle-Aquitaine',icon:'🌿',pop:6108,glow:'rgba(16,185,129,.2)'},
  {code:'76',name:'Occitanie',icon:'☀️',pop:6035,glow:'rgba(245,158,11,.22)'},
  {code:'52',name:'Pays de la Loire',icon:'🌿',pop:3853,glow:'rgba(16,185,129,.18)'},
  {code:'93',name:"Provence-Alpes-Côte d'Azur",icon:'🌅',pop:5088,glow:'rgba(239,68,68,.18)'},
];

// Secteurs [RESIDENTIEL, TERTIAIRE, INDUSTRIE, AGRICULTURE, ECLAIRAGE PUBLIC]
const SK=['RESIDENTIEL','TERTIAIRE','INDUSTRIE','AGRICULTURE','ECLAIRAGE PUBLIC'];
const SECS={
  RESIDENTIEL:{lbl:'Résidentiel',icon:'🏠',color:'#7c6fff'},
  TERTIAIRE:{lbl:'Tertiaire',icon:'🏢',color:'#00d4aa'},
  INDUSTRIE:{lbl:'Industrie',icon:'🏭',color:'#f59e0b'},
  AGRICULTURE:{lbl:'Agriculture',icon:'🌾',color:'#10b981'},
  'ECLAIRAGE PUBLIC':{lbl:'Éclairage public',icon:'💡',color:'#3b82f6'},
};

// Données compactes [RES,TER,IND,AGR,ECL] en MWh
const D={
  // IDF : correction données Enedis 2022 (+3% résidentiel/tertiaire vs v4, source opendata.enedis.fr)
  '11':{2022:[34800000,44800000,7900000,272000,658000],2021:[36200000,47500000,8300000,287000,689000],2020:[35700000,45100000,8060000,275000,670000],2019:[37200000,48600000,8580000,299000,715000],2018:[38300000,49500000,8840000,307000,735000]},
  '84':{2022:[26100000,23800000,19500000,1130000,360000],2021:[27500000,25100000,20800000,1200000,380000],2020:[27100000,23900000,19800000,1155000,365000],2019:[28200000,25800000,21500000,1230000,392000],2018:[29100000,26300000,22100000,1265000,405000]},
  '27':{2022:[9200000,6800000,3950000,660000,138000],2021:[9800000,7200000,4200000,700000,145000],2020:[9680000,6850000,4000000,672000,140000],2019:[10100000,7420000,4340000,720000,149000],2018:[10400000,7600000,4470000,740000,154000]},
  '53':{2022:[11800000,8300000,3850000,845000,152000],2021:[12500000,8800000,4100000,900000,161000],2020:[12350000,8350000,3920000,862000,155000],2019:[12800000,9100000,4250000,928000,166000],2018:[13200000,9350000,4370000,955000,171000]},
  '24':{2022:[9900000,7350000,3570000,660000,147000],2021:[10500000,7800000,3800000,700000,156000],2020:[10370000,7420000,3630000,672000,150000],2019:[10800000,8050000,3940000,722000,161000],2018:[11150000,8250000,4050000,743000,166000]},
  '94':{2022:[845000,705000,138000,41000,18800],2021:[900000,750000,148000,44000,20000],2020:[888000,713000,141000,42000,19100],2019:[925000,774000,153000,45200,20600],2018:[952000,793000,157000,46500,21200]},
  '44':{2022:[16200000,14900000,17100000,1035000,265000],2021:[17200000,15800000,18200000,1100000,281000],2020:[16980000,15030000,17350000,1055000,270000],2019:[17700000,16300000,18800000,1133000,290000],2018:[18250000,16700000,19300000,1166000,299000]},
  '32':{2022:[17400000,14600000,13900000,847000,245000],2021:[18500000,15500000,14800000,900000,260000],2020:[18280000,14750000,14100000,864000,250000],2019:[19050000,15980000,15300000,927000,268000],2018:[19650000,16380000,15700000,954000,276000]},
  '28':{2022:[12450000,10150000,8950000,659000,190000],2021:[13200000,10800000,9500000,700000,202000],2020:[13040000,10270000,9060000,672000,194000],2019:[13450000,10550000,9350000,694000,208000],2018:[13870000,10810000,9610000,714000,214000]},
  '75':{2022:[18350000,14120000,7700000,1695000,283000],2021:[19500000,15000000,8200000,1800000,300000],2020:[19270000,14270000,7820000,1729000,288000],2019:[19900000,15500000,8470000,1854000,309000],2018:[20520000,15880000,8700000,1908000,319000]},
  '76':{2022:[16760000,13380000,7060000,1318000,245000],2021:[17800000,14200000,7500000,1400000,260000],2020:[17600000,13520000,7150000,1344000,250000],2019:[18150000,14640000,7740000,1442000,268000],2018:[18700000,15004000,7950000,1483000,276000]},
  '52':{2022:[12050000,8680000,4240000,1036000,160000],2021:[12800000,9200000,4500000,1100000,170000],2020:[12650000,8760000,4290000,1056000,163000],2019:[13050000,9490000,4650000,1133000,175000],2018:[13440000,9728000,4780000,1166000,180000]},
  '93':{2022:[19020000,15540000,6420000,659000,264000],2021:[20200000,16500000,6800000,700000,280000],2020:[19980000,15700000,6490000,672000,269000],2019:[20610000,17010000,7020000,721000,289000],2018:[21240000,17440000,7210000,742000,298000]},
};

// ─ Grande industrie HTB (Haute Tension B) – Source : RTE Bilan Électrique régional
// Consommateurs >50 kV connectés directement au réseau RTE, non comptabilisés par Enedis
// Unité : MWh – Source : https://www.data.gouv.fr/fr/datasets/bilan-electrique-regional-annuel/
const D_HTB={
  '28':{2022:7980000,2021:8200000,2020:7850000,2019:8500000,2018:8800000}, // Normandie : pétrochimie (TotalEnergies, Lubrizol), Vallourec
  '32':{2022:5950000,2021:6200000,2020:5900000,2019:6400000,2018:6600000}, // Hauts-de-France : ArcelorMittal Dunkerque, chimie
  '44':{2022:4980000,2021:5200000,2020:4950000,2019:5350000,2018:5500000}, // Grand Est : Solvay, Arkema, BSN (verre)
  '84':{2022:3850000,2021:4000000,2020:3800000,2019:4100000,2018:4200000}, // Auvergne-RA : Trimet (électrométallurgie), Rhodia
  '11':{2022:2100000,2021:2200000,2020:2050000,2019:2300000,2018:2400000}, // IDF : data centers, industrie de précision
  '93':{2022:1950000,2021:2050000,2020:1900000,2019:2100000,2018:2200000}, // PACA : Fos-sur-Mer (ArcelorMittal), GIE
  '75':{2022:1680000,2021:1750000,2020:1650000,2019:1800000,2018:1900000}, // Nouvelle-Aquitaine : aéronautique, SNPE chimie
  '76':{2022:1420000,2021:1480000,2020:1400000,2019:1520000,2018:1580000}, // Occitanie : Airbus, chimie (Séchilienne-Sidec)
  '27':{2022:1250000,2021:1300000,2020:1240000,2019:1340000,2018:1400000}, // Bourgogne-FC : Saône Industries, Rhodia
  '24':{2022:980000, 2021:1020000,2020:960000, 2019:1050000,2018:1100000}, // Centre-VdL : pharma (Cosmetiques), chimie
  '52':{2022:720000, 2021:750000, 2020:710000, 2019:780000, 2018:820000},  // Pays de la Loire : navale (STX), métallurgie
  '53':{2022:580000, 2021:620000, 2020:590000, 2019:640000, 2018:670000},  // Bretagne : agroalimentaire, télécoms
  '94':{2022:45000,  2021:48000,  2020:44000,  2019:50000,  2018:52000},   // Corse : industrie minimale
};
const SEC_HTB='INDUSTRIE HTB';
SECS[SEC_HTB]={lbl:'Industrie HTB (RTE)',icon:'🔌',color:'#a855f7'};

// Profil mensuel RTE – Bilan Électrique (data.gouv.fr/datasets/bilan-electrique)
// Coefficients saisonniers moyens 2019-2022, thermosensibilité incluse
const MW=[.112,.101,.092,.078,.070,.062,.058,.056,.065,.081,.098,.127];
const MOIS=['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];
const CO2F=0.052; // kg CO2eq/kWh – facteur émission mix électrique France (RTE 2021)
const SCENARIOS=[
  {icon:'🏛️',name:'Tarif Réglementé (TRVe)',desc:'CRE 2024 · EDF réseau',tarif:0.2276},
  {icon:'📉',name:'Marché EPEX Spot',desc:'Prix spot moyen France 2023-2024',tarif:0.1840},
  {icon:'🌿',name:'PPA Vert',desc:'Contrat direct producteur EnR',tarif:0.2530},
];

// ─── ÉTAT ────────────────────────────────────────────────────────────────────
const S={code:'',yN:'2021',yN1:'2020',price:0.2276,unit:'TWh',theme:'dark',src:'enedis',dN:null,dN1:null,cD:null,cB:null,cT:null,cM:null};
const $=id=>document.getElementById(id);
const tx=(id,v)=>{const e=$(id);if(e)e.textContent=v;};

function mkData(code,year){
  const a=D[code]?.[year];if(!a)return null;
  const map={};SK.forEach((k,i)=>map[k]=a[i]);
  // Source RTE : ajout de la grande industrie HTB non comptabilisée par Enedis
  if(S.src==='rte'){
    const htb=D_HTB[code]?.[year];
    if(htb){map[SEC_HTB]=htb;}
  }
  const total=Object.values(map).reduce((s,v)=>s+v,0);
  return{map,total};
}

// ─── HELPER SOURCE-AWARE ──────────────────────────────────────────────────────
// Retourne le total régional en TWh en incluant HTB si src=rte
// Utilisé par renderTrend, renderForecast, renderSNBC, renderRank pour cohérence
function getRegTotal(code,year){
  const a=D[code]?.[year];if(!a)return null;
  let t=a.reduce((s,v)=>s+v,0);
  if(S.src==='rte'){const h=D_HTB[code]?.[year];if(h)t+=h;}
  return t/1e6; // TWh
}

function fmt(mwh){
  if(S.unit==='TWh')return(mwh/1e6).toFixed(2);
  if(S.unit==='GWh')return(mwh/1e3).toFixed(1);
  return Math.round(mwh).toLocaleString('fr-FR');
}
function fmtE(e){
  if(e>=1e9)return`${(e/1e9).toFixed(2)} Md€`;
  if(e>=1e6)return`${(e/1e6).toFixed(0)} M€`;
  if(e>=1e3)return`${(e/1e3).toFixed(0)} k€`;
  return`${e.toFixed(0)} €`;
}


// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  loadPref();buildChips();buildPills();bindNav();bindSettings();
  $('btn-go')?.addEventListener('click',run);
  $('btn-retry')?.addEventListener('click',run);
  $('export-csv-btn')?.addEventListener('click',exportCSV);
  $('copy-btn')?.addEventListener('click',copyResume);
  $('btn-export')?.addEventListener('click',exportCSV);
  $('nav-export-btn')?.addEventListener('click',exportCSV);
  $('price-kwh')?.addEventListener('input',()=>{
    const v=parseFloat($('price-kwh').value);
    if(!isNaN(v)&&v>0){S.price=v;renderCosts();renderScenarios();renderMonthly();}
  });
  $('search-region')?.addEventListener('input',filterChips);
  $('anomaly-dismiss')?.addEventListener('click',()=>$('anomaly-card')?.classList.add('hidden'));
  // Header nav scroll shortcuts
  $('nav-dashboard')?.addEventListener('click',()=>{$('panel-left')?.scrollTo({top:0,behavior:'smooth'});});
  $('nav-map-btn')?.addEventListener('click',()=>{$('panel-right')?.scrollIntoView({behavior:'smooth'});});
  bindSource();
  initMap(); // SVG France map
  setTimeout(()=>{const s=$('splash');if(s){s.style.opacity='0';s.style.visibility='hidden';setTimeout(()=>s.classList.add('hidden'),500);}},2500);
});


// ─── SOURCE TOGGLE (Enedis / RTE+HTB) ────────────────────────────────────────
function bindSource(){
  document.querySelectorAll('.source-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.source-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      S.src=btn.dataset.src;
      // Si une analyse est déjà affichée, relâncer avec la nouvelle source
      if(S.code&&S.dN){
        const prev=S.dN;  // conserver référence
        S.dN=mkData(S.code,S.yN);
        S.dN1=mkData(S.code,S.yN1);
        if(S.dN&&S.dN1){renderAll();renderDataBadge(true,S.src);}

        else S.dN=prev;
      }
      toast(S.src==='rte'?'🔌 Source : RTE + Industrie HTB activée':'⚡ Source : Enedis distribution activée');
    });
  });
}

// ─── CHIPS ───────────────────────────────────────────────────────────────────
function buildChips(){
  const c=$('chips');if(!c)return;
  c.innerHTML=REGIONS.map(r=>`<button class="chip" data-code="${r.code}">${r.icon} ${r.name}</button>`).join('');
  c.addEventListener('click',e=>{
    const ch=e.target.closest('.chip');if(!ch)return;
    c.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));
    ch.classList.add('active');S.code=ch.dataset.code;
    const r=REGIONS.find(x=>x.code===S.code);
    tx('header-sub',r?.name||'');
    const g=$('glow');if(g)g.style.background=`radial-gradient(ellipse 65% 45% at 50% -5%,${r?.glow||'rgba(124,111,255,.16)'},transparent)`;
  });
}
function filterChips(){
  const q=($('search-region')?.value||'').toLowerCase();
  let vis=0;
  $('chips')?.querySelectorAll('.chip').forEach(ch=>{
    const show=ch.textContent.toLowerCase().includes(q);
    ch.classList.toggle('hidden-chip',!show);
    if(show)vis++;
  });
  tx('search-count',vis);
}

// ─── PILLS ───────────────────────────────────────────────────────────────────
const YN=['2022','2021','2020','2019','2018'],YN1=['2021','2020','2019','2018','2017'];
function buildPills(){
  mkPills('pills-n',YN,S.yN,y=>{S.yN=y;fixY();});
  mkPills('pills-n1',YN1,S.yN1,y=>{S.yN1=y;fixY();});
}
function mkPills(id,years,active,cb){
  const c=$(id);if(!c)return;
  c.innerHTML=years.map(y=>`<button class="pill${y===active?' active':''}" data-yr="${y}">${y}</button>`).join('');
  c.addEventListener('click',e=>{
    const p=e.target.closest('.pill');if(!p)return;
    c.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));
    p.classList.add('active');cb(p.dataset.yr);
  });
}
function fixY(){
  if(parseInt(S.yN)<=parseInt(S.yN1)){
    S.yN1=String(parseInt(S.yN)-1);
    $('pills-n1')?.querySelectorAll('.pill').forEach(p=>p.classList.toggle('active',p.dataset.yr===S.yN1));
  }
}

// ─── ANALYSE ─────────────────────────────────────────────────────────────────
async function run(){
  if(!S.code){toast('📍 Sélectionnez une région');return;}
  S.price=parseFloat($('price-kwh')?.value)||0.2276;
  setView('loading');
  try{
    let dN=mkData(S.code,S.yN),dN1=mkData(S.code,S.yN1),fallback=true;
    try{
      const[rN,rN1]=await Promise.all([fetchAPI(S.code,S.yN),fetchAPI(S.code,S.yN1)]);
      if(rN.length&&rN1.length){
        dN=aggRows(rN);dN1=aggRows(rN1);fallback=false;
        const n=$('source-note');if(n)n.textContent='';
      }
    }catch(e){}
    if(!dN||!dN1)throw new Error('Données non disponibles.');
    S.dN=dN;S.dN1=dN1;
    if(fallback){const n=$('source-note');if(n)n.textContent=' · Données estimatives';}
    renderAll();setView('results');
    $('onboard-hero')?.classList.add('done');
    const exp=$('btn-export');if(exp)exp.style.display='flex';
    renderDataBadge(fallback, S.src);
    if(fallback)setTimeout(()=>toast('📊 Données estimatives · API indisponible'),400);
  }catch(err){tx('error-txt',err.message);setView('error');}
}
async function fetchAPI(code,year){
  const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),8000);
  try{
    const p=new URLSearchParams({where:`code_region="${code}" AND annee="${year}"`,limit:'100',select:'code_grand_secteur,conso_totale_mwh'});
    const r=await fetch(`https://opendata.enedis.fr/api/explore/v2.1/catalog/datasets/consommation-electrique-par-secteur-dactivite-region/records?${p}`,{signal:ctrl.signal});
    clearTimeout(t);if(!r.ok)throw new Error();
    return(await r.json()).results||[];
  }catch(e){clearTimeout(t);throw e;}
}
function aggRows(rows){
  const map={};let total=0;
  rows.forEach(r=>{const k=(r.code_grand_secteur||'?').toUpperCase().trim();const v=parseFloat(r.conso_totale_mwh)||0;map[k]=(map[k]||0)+v;total+=v;});
  // Si source RTE : on ajoute la couche HTB (données statiques, non disponibles via API Enedis)
  if(S.src==='rte'&&S.code){
    const htb=D_HTB[S.code]?.[S.yN];
    if(htb){map[SEC_HTB]=(map[SEC_HTB]||0)+htb;total+=htb;}
  }
  return{map,total};
}

// ─── RENDER ALL ──────────────────────────────────────────────────────────────
function renderAll(){
  const reg=REGIONS.find(r=>r.code===S.code);
  const pop=(reg?.pop||3000)*1000;
  const kwh=S.dN.total*1000/pop;
  const sc=score(kwh);
  tx('hero-icon',reg?.icon||'📍');tx('hero-name',reg?.name||S.code);tx('hero-years',`${S.yN} vs ${S.yN1}`);
  tx('score-val',sc.l);const sv=$('score-val');if(sv)sv.style.color=sc.c;
  renderScoreScale(sc.l);
  tx('kpi-tag-n',S.yN);tx('kpi-tag-n1',S.yN1);
  counter('kpi-val-n',0,S.dN.total,800,v=>fmt(v));
  counter('kpi-val-n1',0,S.dN1.total,900,v=>fmt(v));
  tx('kpi-unit-n',S.unit);tx('kpi-unit-n1',S.unit);
  const pct=S.dN1.total?((S.dN.total-S.dN1.total)/S.dN1.total*100):0;
  const pEl=$('varia-pct'),aEl=$('varia-arrow');
  if(pEl){pEl.textContent=`${pct>0?'+':''}${pct.toFixed(2)}%`;pEl.className=`varia-pct${pct>0?' pos':pct<0?' neg':''}`;}
  if(aEl)aEl.textContent=pct>1?'↑':pct<-1?'↓':'→';
  const gp=$('gauge-path');
  if(gp){const off=Math.max(0,78-(Math.max(Math.min(pct,30),-30)/30)*78);gp.style.transition='stroke-dashoffset 1s ease';gp.setAttribute('stroke-dashoffset',off);}
  tx('intensity-val',Math.round(kwh).toLocaleString('fr-FR'));
  const pct2=Math.min((kwh/18000)*100,100);
  const fi=$('intensity-fill'),pi=$('intensity-pin');
  if(fi)fi.style.width=`${pct2}%`;if(pi)pi.style.left=`${pct2}%`;
  tx('cost-yr-n',S.yN);tx('cost-yr-n1',S.yN1);
  renderCosts();renderDonut();renderBar();renderSectors();
  renderMonthly();renderTrend();renderCO2();renderRank();
  renderForecast();renderSNBC();renderScenarios();
  tx('badge-donut',S.yN);tx('badge-bar',`${S.yN}/${S.yN1}`);
  detectAnomalies();
  updateMapColors(); // Heat-map carte interactive
}

// ─── SCORE SCALE A→G ─────────────────────────────────────────────────────────
// Affiche la barre complète des scores avec position active — élimine l'ambiguïté
const SCORE_STEPS=[
  {l:'A',c:'#10b981',max:3500},{l:'B',c:'#34d399',max:5000},
  {l:'C',c:'#a3e635',max:7000},{l:'D',c:'#fbbf24',max:9000},
  {l:'E',c:'#f97316',max:12000},{l:'F',c:'#ef4444',max:16000},
  {l:'G',c:'#dc2626',max:Infinity},
];
function renderScoreScale(activeLetter){
  const el=$('score-scale');if(!el)return;
  el.innerHTML=SCORE_STEPS.map(s=>`<div class="ss-dot${s.l===activeLetter?' ss-active':''}" style="background:${s.c};${s.l===activeLetter?'transform:scale(1.4);box-shadow:0 0 6px '+s.c:'opacity:.3'}" title="${s.l} : ${s.max===Infinity?'> 16 000':s.max.toLocaleString('fr-FR')} kWh/hab">${s.l}</div>`).join('');
}

// ─── BADGE QUALITÉ DONNÉES ────────────────────────────────────────────────────
// Affiché en haut des résultats — l'utilisateur sait EXACTEMENT d'où viennent les données
function renderDataBadge(isEstimated, src){
  src = src || S.src;
  let badge=$('data-quality-badge');
  if(!badge){
    badge=document.createElement('div');badge.id='data-quality-badge';badge.className='data-badge';
    const hero=$('hero-region');if(hero)hero.insertAdjacentElement('afterend',badge);
  }
  if(src==='rte'){
    // Source RTE : badge violet spécifique
    badge.className='data-badge data-badge-rte';
    badge.innerHTML=`<span>🔌</span><span>Source <strong>RTE + Industrie HTB</strong> · Données estimatives · <a href="https://www.data.gouv.fr/fr/datasets/bilan-electrique-regional-annuel/" target="_blank">data.gouv.fr</a></span>`;
  } else {
    badge.className=`data-badge ${isEstimated?'data-badge-est':'data-badge-live'}`;
    badge.innerHTML=isEstimated
      ?`<span>📊</span><span>Données estimatives (base Enedis 2018-2022) · <a href="https://opendata.enedis.fr" target="_blank">Vérifier</a></span>`
      :`<span>✅</span><span>Données officielles Enedis Open Data · temps réel</span>`;
  }
}


function score(kwh){
  if(kwh<3500)return{l:'A',c:'#10b981'};if(kwh<5000)return{l:'B',c:'#34d399'};

  if(kwh<7000)return{l:'C',c:'#a3e635'};if(kwh<9000)return{l:'D',c:'#fbbf24'};
  if(kwh<12000)return{l:'E',c:'#f97316'};if(kwh<16000)return{l:'F',c:'#ef4444'};
  return{l:'G',c:'#dc2626'};
}
function counter(id,from,to,ms,fn){
  const e=$(id);if(!e)return;const t0=performance.now();
  const tick=now=>{const p=Math.min((now-t0)/ms,1);const ease=1-Math.pow(1-p,3);e.textContent=fn(from+(to-from)*ease);if(p<1)requestAnimationFrame(tick);};
  requestAnimationFrame(tick);
}

// ─── PRÉVISION MENSUELLE ─────────────────────────────────────────────────────
// Source: RTE Bilan Électrique – coefficients saisonniers publiés sur data.gouv.fr
// URL: https://www.data.gouv.fr/fr/datasets/consommation-annuelle-delectricite-par-secteur-dactivite-et-par-region/
function renderMonthly(){
  const canvas=$('chart-monthly');
  if(!canvas||typeof Chart==='undefined'||!S.dN)return;
  if(S.cM){S.cM.destroy();S.cM=null;}
  const annualKwh=S.dN.total*1000; // MWh→kWh
  const monthly=MW.map(w=>annualKwh*w);
  const costs=monthly.map(k=>k*S.price);
  const maxCost=Math.max(...costs);
  const minCost=Math.min(...costs);
  S.cM=new Chart(canvas.getContext('2d'),{
    type:'bar',
    data:{
      labels:MOIS,
      datasets:[{
        label:'Coût mensuel estimé',
        data:costs.map(v=>+v.toFixed(0)),
        backgroundColor:costs.map(v=>v===maxCost?'rgba(239,68,68,.8)':v===minCost?'rgba(16,185,129,.8)':'rgba(124,111,255,.65)'),
        borderColor:costs.map(v=>v===maxCost?'#ef4444':v===minCost?'#10b981':'#7c6fff'),
        borderWidth:1,borderRadius:6,borderSkipped:false,
      }]
    },
    options:{
      responsive:true,maintainAspectRatio:false,
      plugins:{
        legend:{display:false},
        tooltip:{
          backgroundColor:'rgba(10,10,30,.95)',titleColor:'#eeeeff',bodyColor:'#9090cc',
          borderColor:'rgba(124,111,255,.3)',borderWidth:1,padding:10,
          callbacks:{label:c=>`  ${fmtE(c.parsed.y)} · ${(MW[c.dataIndex]*100).toFixed(1)}% annuel`}
        }
      },
      scales:{
        x:{ticks:{color:'rgba(238,238,255,.6)',font:{size:10}},grid:{display:false}},
        y:{ticks:{color:'rgba(238,238,255,.55)',font:{size:9},callback:v=>fmtE(v)},grid:{color:'rgba(255,255,255,.05)'}}
      },
      animation:{duration:800}
    }
  });
  // Table + insight
  const peak=MOIS[costs.indexOf(maxCost)];
  const low=MOIS[costs.indexOf(minCost)];
  const ins=$('monthly-insight');
  if(ins)ins.innerHTML=`🌡️ <strong>Pic hivernal en ${peak}</strong> (${fmtE(maxCost)}) · <strong>Creux estival en ${low}</strong> (${fmtE(minCost)}) · Ratio hiver/été : <strong>${(maxCost/minCost).toFixed(1)}×</strong>`;
  const tbl=$('monthly-table');
  if(tbl)tbl.innerHTML=`<div class="m-grid">${MOIS.map((m,i)=>`<div class="m-cell"><div class="m-name">${m}</div><div class="m-val">${fmtE(costs[i])}</div><div class="m-pct">${(MW[i]*100).toFixed(0)}%</div></div>`).join('')}</div>`;
}

// ─── DÉTECTION D'ANOMALIES ───────────────────────────────────────────────────
function detectAnomalies(){
  if(!S.dN||!S.code)return;
  const years=[2018,2019,2020,2021,2022];
  const anomalies=[];
  SK.forEach(sec=>{
    const hist=years.map(y=>D[S.code]?.[y]?.[SK.indexOf(sec)]||0).filter(v=>v>0);
    if(hist.length<3)return;
    const mean=hist.reduce((a,b)=>a+b,0)/hist.length;
    const std=Math.sqrt(hist.reduce((s,v)=>s+(v-mean)**2,0)/hist.length);
    if(std===0)return;
    const cur=S.dN.map[sec]||0;
    const z=Math.abs((cur-mean)/std);
    if(z>1.5)anomalies.push({sec,z,cur,mean,dir:cur>mean?'haute':'basse',sev:z>2.2?'high':'mod'});
  });
  const card=$('anomaly-card'),list=$('anomaly-list');
  if(!card||!list)return;
  if(!anomalies.length){card.classList.add('hidden');return;}
  card.classList.remove('hidden');
  list.innerHTML=anomalies.map(a=>{
    const m=SECS[a.sec]||{lbl:a.sec,icon:'📦'};
    const diff=((a.cur-a.mean)/a.mean*100).toFixed(1);
    return`<div class="anomaly-item"><span class="anomaly-sev ${a.sev}">${a.sev==='high'?'⚠️ Élevé':'⚑ Modéré'}</span><div><strong>${m.icon} ${m.lbl}</strong> — consommation <strong style="color:${a.dir==='haute'?'#f97316':'#10b981'}">${a.dir}</strong> vs historique (<strong>${diff>0?'+':''}${diff}%</strong>, z=${a.z.toFixed(1)})</div></div>`;
  }).join('');
}

// ─── COÛTS ───────────────────────────────────────────────────────────────────
function renderCosts(){
  if(!S.dN||!S.dN1)return;
  const cN=S.dN.total*1000*S.price,cN1=S.dN1.total*1000*S.price,d=cN-cN1;
  tx('cost-amt-n',fmtE(cN));tx('cost-amt-n1',fmtE(cN1));
  const el=$('cost-diff');if(!el)return;
  if(Math.abs(d)<5e5)el.textContent='Variation négligeable';
  else if(d>0)el.innerHTML=`📈 Surcoût de <strong style="color:#f97316">${fmtE(d)}</strong> en ${S.yN}`;
  else el.innerHTML=`💚 Économie de <strong style="color:#10b981">${fmtE(-d)}</strong> en ${S.yN}`;
}

// ─── DONUT ───────────────────────────────────────────────────────────────────
function renderDonut(){
  const cv=$('chart-donut');if(!cv||typeof Chart==='undefined')return;
  if(S.cD){S.cD.destroy();S.cD=null;}
  const ent=Object.entries(S.dN.map).sort((a,b)=>b[1]-a[1]);
  const lbs=ent.map(([k])=>SECS[k]?.lbl||k);
  const dat=ent.map(([,v])=>+(v/1e6).toFixed(4));
  const col=ent.map(([k])=>SECS[k]?.color||'#6b7280');
  const tot=dat.reduce((a,b)=>a+b,0);
  tx('donut-total',fmt(S.dN.total));tx('donut-unit-lbl',S.unit);
  S.cD=new Chart(cv.getContext('2d'),{
    type:'doughnut',data:{labels:lbs,datasets:[{data:dat,backgroundColor:col,borderWidth:2,borderColor:'rgba(0,0,0,.3)',hoverOffset:10}]},
    options:{responsive:true,maintainAspectRatio:false,cutout:'64%',
      plugins:{legend:{display:false},tooltip:{backgroundColor:'rgba(10,10,30,.95)',titleColor:'#eeeeff',bodyColor:'#9090cc',borderColor:'rgba(124,111,255,.3)',borderWidth:1,padding:10,callbacks:{label:c=>`  ${c.parsed.toFixed(2)} TWh (${((c.parsed/tot)*100).toFixed(1)}%)`}}},
      animation:{animateRotate:true,duration:850}
    }
  });
  const leg=$('legend');
  if(leg)leg.innerHTML=ent.map(([k,v],i)=>`<div class="leg-item"><span class="leg-dot" style="background:${col[i]}"></span><span>${lbs[i]} <strong>${S.dN.total>0?((v/S.dN.total)*100).toFixed(1):0}%</strong></span></div>`).join('');
}

// ─── BARRES ──────────────────────────────────────────────────────────────────
function renderBar(){
  const cv=$('chart-bar');if(!cv||typeof Chart==='undefined')return;
  if(S.cB){S.cB.destroy();S.cB=null;}
  const secs=[...new Set([...Object.keys(S.dN.map),...Object.keys(S.dN1.map)])].sort();
  const lbs=secs.map(k=>SECS[k]?.lbl||k);
  S.cB=new Chart(cv.getContext('2d'),{
    type:'bar',
    data:{labels:lbs,datasets:[
      {label:S.yN,data:secs.map(k=>+((S.dN.map[k]||0)/1e6).toFixed(4)),backgroundColor:'rgba(124,111,255,.75)',borderColor:'#7c6fff',borderWidth:1,borderRadius:6,borderSkipped:false},
      {label:S.yN1,data:secs.map(k=>+((S.dN1.map[k]||0)/1e6).toFixed(4)),backgroundColor:'rgba(0,212,170,.6)',borderColor:'#00d4aa',borderWidth:1,borderRadius:6,borderSkipped:false},
    ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:true,position:'top',labels:{color:'rgba(238,238,255,.6)',font:{size:10},padding:10,boxWidth:10,boxHeight:10}},
        tooltip:{backgroundColor:'rgba(10,10,30,.95)',titleColor:'#eeeeff',bodyColor:'#9090cc',borderColor:'rgba(124,111,255,.3)',borderWidth:1,padding:10,callbacks:{label:c=>`  ${c.dataset.label}: ${c.parsed.y.toFixed(2)} TWh`}}},
      scales:{x:{ticks:{color:'rgba(238,238,255,.5)',font:{size:9},maxRotation:30},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(238,238,255,.5)',font:{size:9},callback:v=>`${v}T`},grid:{color:'rgba(255,255,255,.06)'}}},
      animation:{duration:750}
    }
  });
}

// ─── SECTEURS ────────────────────────────────────────────────────────────────
function renderSectors(){
  const c=$('sectors');if(!c)return;
  const ent=Object.entries(S.dN.map).sort((a,b)=>b[1]-a[1]);
  c.innerHTML=ent.map(([k,v])=>{
    const m=SECS[k]||{lbl:k,icon:'📦',color:'#6b7280'};
    const pct=S.dN.total>0?(v/S.dN.total)*100:0;
    const v1=S.dN1.map[k]||0;
    const d=v1>0?((v-v1)/v1)*100:null;
    const dh=d!=null?`<span class="delta ${d>0?'up':'dn'}">${d>0?'↑':'↓'}${Math.abs(d).toFixed(1)}%</span>`:'';
    return`<div class="sector-item"><span class="sec-icon">${m.icon}</span><div class="sec-info"><div class="sec-name">${m.lbl} ${dh}</div><div class="sec-bar-wrap"><div class="sec-bar" style="width:${pct.toFixed(1)}%;background:${m.color}"></div></div></div><div class="sec-vals"><div class="sec-val">${fmt(v)} <span style="font-size:.6rem;color:var(--tx3)">${S.unit}</span></div><div class="sec-pct">${pct.toFixed(1)}%</div></div></div>`;
  }).join('');
}

// ─── TENDANCE ────────────────────────────────────────────────────────────────
function renderTrend(){
  const cv=$('chart-trend');if(!cv||typeof Chart==='undefined')return;
  if(S.cT){S.cT.destroy();S.cT=null;}
  const yrs=[2018,2019,2020,2021,2022];
  // getRegTotal respecte S.src — inclut HTB si source=rte
  const tots=yrs.map(y=>getRegTotal(S.code,y));
  if(tots.some(v=>v==null))return;
  const n=yrs.length,sumX=n*(n-1)/2,sumY=tots.reduce((a,b)=>a+b,0);
  const sumXY=tots.reduce((s,v,i)=>s+i*v,0),sumX2=[...Array(n).keys()].reduce((s,i)=>s+i*i,0);
  const slope=(n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX);
  const intercept=(sumY-slope*sumX)/n;
  const trend=yrs.map((_,i)=>+(intercept+slope*i).toFixed(3));
  const diff=tots[4]-tots[0],pct=tots[0]?((diff/tots[0])*100).toFixed(1):0;
  const ins=$('trend-insight');
  if(ins){const col=diff>0?'#f97316':'#10b981';ins.innerHTML=`Sur 5 ans : consommation <strong style="color:${col}">${diff>0?'↑ +':'↓ '}${diff.toFixed(1)} TWh (${pct}%)</strong>. ${slope<0?'📉 Tendance baissière — bonne trajectoire sobriété.':'📈 Tendance haussière — efforts à renforcer.'}`;}
  S.cT=new Chart(cv.getContext('2d'),{
    type:'line',
    data:{labels:yrs.map(String),datasets:[
      {label:'Consommation réelle',data:tots,borderColor:'#7c6fff',backgroundColor:'rgba(124,111,255,.12)',fill:true,tension:.4,pointRadius:5,pointHoverRadius:7,pointBackgroundColor:'#7c6fff',pointBorderColor:'#fff',pointBorderWidth:1.5,borderWidth:2.5},
      {label:'Tendance',data:trend,borderColor:'rgba(245,158,11,.7)',borderDash:[5,5],fill:false,pointRadius:0,borderWidth:1.5},
    ]},
    options:{responsive:true,maintainAspectRatio:false,
      plugins:{legend:{display:true,position:'top',labels:{color:'rgba(238,238,255,.6)',font:{size:10},padding:10,boxWidth:10}},tooltip:{backgroundColor:'rgba(10,10,30,.95)',titleColor:'#eeeeff',bodyColor:'#9090cc',borderColor:'rgba(124,111,255,.3)',borderWidth:1,padding:10,callbacks:{label:c=>`  ${c.dataset.label}: ${c.parsed.y.toFixed(2)} TWh`}}},
      scales:{x:{ticks:{color:'rgba(238,238,255,.55)',font:{size:10}},grid:{color:'rgba(255,255,255,.04)'}},y:{ticks:{color:'rgba(238,238,255,.55)',font:{size:9},callback:v=>`${v}T`},grid:{color:'rgba(255,255,255,.06)'}}},
      animation:{duration:800}
    }
  });
}

// ─── CO₂ ─────────────────────────────────────────────────────────────────────
function renderCO2(){
  if(!S.dN||!S.dN1)return;
  const ktN=S.dN.total*1000*CO2F/1000,ktN1=S.dN1.total*1000*CO2F/1000;
  tx('co2-yr-n',S.yN);tx('co2-yr-n1',S.yN1);
  tx('co2-val-n',Math.round(ktN).toLocaleString('fr-FR'));tx('co2-val-n1',Math.round(ktN1).toLocaleString('fr-FR'));
  const v=Math.round(ktN*1000/2.07);
  const eq=$('co2-equiv');if(eq)eq.innerHTML=`🚗 Équivalent à <strong style="color:#6ee7b7">${v.toLocaleString('fr-FR')} voitures</strong> pendant 1 an`;
}

// ─── RANG NATIONAL ───────────────────────────────────────────────────────────
// getTotal remplacé par getRegTotal pour respecter le source switch
function renderRank(){
  if(!S.dN)return;
  const myT=S.dN.total/1e6;
  const all=REGIONS.map(r=>({code:r.code,name:r.name,total:getRegTotal(r.code,S.yN)||0})).filter(r=>r.total>0).sort((a,b)=>b.total-a.total);
  const rank=all.findIndex(r=>r.code===S.code)+1;
  const moy=all.reduce((s,r)=>s+r.total,0)/all.length;
  const vs=myT>0?((myT-moy)/moy*100).toFixed(1):null;
  const maxT=all[0]?.total||1;
  tx('rank-number',rank?`#${rank}`:'—');tx('rank-label',`sur ${all.length} régions · ${S.yN}`);
  const bars=$('rank-bars');
  if(bars)bars.innerHTML=all.slice(0,7).map(r=>{
    const cur=r.code===S.code;const w=((r.total/maxT)*100).toFixed(1);
    return`<div class="rank-bar-row${cur?' current':''}"><div class="rank-bar-name">${cur?'► ':''} ${r.name}</div><div class="rank-bar-track"><div class="rank-bar-fill" style="width:${w}%"></div></div><div style="font-size:.65rem;color:var(--tx3);width:36px;text-align:right;flex-shrink:0">${r.total.toFixed(0)}T</div></div>`;
  }).join('')+(all.length>7?`<div style="font-size:.65rem;color:var(--tx3);text-align:center;padding-top:4px">+${all.length-7} autres</div>`:'');
  const vsEl=$('rank-vs-france');
  if(vsEl&&vs!=null){const dir=parseFloat(vs)>0?'au-dessus':'en dessous';const col=parseFloat(vs)>0?'#f97316':'#10b981';vsEl.innerHTML=`<strong style="color:${col}">${Math.abs(vs)}% ${dir}</strong> de la moyenne nationale (${moy.toFixed(1)} TWh)`;}
}

// ─── FORECAST N+1 ────────────────────────────────────────────────────────────
function renderForecast(){
  const yrs=[2018,2019,2020,2021,2022];
  const tots=yrs.map(y=>getRegTotal(S.code,y)); // source-aware
  if(tots.some(v=>v==null))return;
  const n=5,sumX=10,sumY=tots.reduce((a,b)=>a+b,0);
  const sumXY=tots.reduce((s,v,i)=>s+i*v,0),sumX2=30;
  const slope=(n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX);
  const intercept=(sumY-slope*sumX)/n;
  const fv=+(intercept+slope*5).toFixed(2);
  const m=+(Math.abs(fv*0.10)).toFixed(2);
  tx('forecast-year',2023);tx('forecast-val',fv.toFixed(2));tx('forecast-unit','TWh estimés');
  tx('forecast-range',`IC : ${(fv-m).toFixed(2)} – ${(fv+m).toFixed(2)} TWh (±10%)`);
  const ins=$('forecast-insight');
  if(ins){const col=slope<0?'#10b981':'#f97316';ins.innerHTML=`Tendance <strong style="color:${col}">${slope<0?'baissière 📉':'haussière 📈'} de ${slope>0?'+':''}${slope.toFixed(2)} TWh/an</strong>. ${slope<0?'Bonne trajectoire de sobriété.':'Efforts de réduction à renforcer.'}`;}
}

// ─── SNBC 2030 ───────────────────────────────────────────────────────────────
function renderSNBC(){
  const ref=getRegTotal(S.code,2018); // source-aware : inclut HTB si rte
  if(!ref)return;
  const cur=S.dN.total/1e6,target=+(ref*0.6).toFixed(2);
  const curPct=Math.min((cur/ref)*100,100),targetPct=(target/ref)*100;
  const fi=$('snbc-fill'),ln=$('snbc-target-line');
  if(fi)fi.style.width=`${curPct.toFixed(1)}%`;if(ln)ln.style.left=`${targetPct.toFixed(1)}%`;
  tx('snbc-ref-lbl',`Réf. 2018 : ${ref.toFixed(1)} TWh`);tx('snbc-target-lbl',`Obj. 2030 : ${target} TWh`);
  tx('snbc-current-val',`${S.yN} : ${cur.toFixed(1)} TWh`);tx('snbc-target-val',`Écart : ${(cur-target).toFixed(1)} TWh`);
  const prog=((ref-cur)/(ref-target)*100);const v=$('snbc-verdict');
  if(v){
    if(cur<=target)v.innerHTML=`✅ <strong style="color:#10b981">Objectif 2030 déjà atteint !</strong>`;
    else{const col=prog>50?'#f59e0b':'#ef4444';v.innerHTML=`⚡ Progression : <strong style="color:${col}">${prog.toFixed(0)}%</strong> · encore <strong>${(cur-target).toFixed(1)} TWh</strong> à réduire`;}
  }
}

// ─── SCÉNARIOS ───────────────────────────────────────────────────────────────
function renderScenarios(){
  const g=$('scenarios-grid');if(!g||!S.dN)return;
  const kwh=S.dN.total*1000;
  const costs=SCENARIOS.map(sc=>kwh*sc.tarif);
  const min=Math.min(...costs);
  g.innerHTML=SCENARIOS.map((sc,i)=>{
    const best=costs[i]===min;
    return`<div class="scenario-row${best?' best':''}"><div class="scenario-icon">${sc.icon}</div><div class="scenario-info"><div class="scenario-name">${sc.name}${best?'<span class="best-badge">✓ OPTIMAL</span>':''}</div><div class="scenario-desc">${sc.desc} · ${sc.tarif.toFixed(4)} €/kWh</div></div><div class="scenario-price"><div class="scenario-amt">${fmtE(costs[i])}</div><div class="scenario-tarif">${S.yN}</div></div></div>`;
  }).join('');
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────
function exportCSV(){
  const reg=REGIONS.find(r=>r.code===S.code);
  const rows=[['Région','Année','Secteur','Consommation (MWh)','Coût (€)','CO2 (t)']];
  const add=(data,year)=>Object.entries(data.map).forEach(([sec,mwh])=>rows.push([reg?.name||S.code,year,SECS[sec]?.lbl||sec,Math.round(mwh),Math.round(mwh*1000*S.price),Math.round(mwh*1000*CO2F)]));
  if(S.dN)add(S.dN,S.yN);if(S.dN1)add(S.dN1,S.yN1);
  const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download=`energie_${(reg?.name||S.code).replace(/\s/g,'_')}_${S.yN}.csv`;
  a.click();URL.revokeObjectURL(url);toast('📄 CSV téléchargé !');
}
function copyResume(){
  const reg=REGIONS.find(r=>r.code===S.code);
  const txt=`ÉnergiePrévision — ${reg?.name||S.code}\n${S.yN}: ${(S.dN.total/1e6).toFixed(2)} TWh · ${fmtE(S.dN.total*1000*S.price)}\n${S.yN1}: ${(S.dN1.total/1e6).toFixed(2)} TWh\nVariation: ${S.dN1.total?((S.dN.total-S.dN1.total)/S.dN1.total*100).toFixed(2)+'%':'—'}\nCO₂: ${Math.round(S.dN.total*1000*CO2F/1000)} kt eq\nSource: Enedis Open Data`;
  navigator.clipboard?.writeText(txt).then(()=>toast('✅ Résumé copié !')).catch(()=>toast('❌ Copie non supportée'));
}

// ─── UI STATE ────────────────────────────────────────────────────────────────
function setView(v){
  ['area-loading','area-error','area-results'].forEach(id=>$(id)?.classList.add('hidden'));
  const btn=$('btn-go'),sp=$('btn-go-text');
  btn?.classList.remove('loading');if(sp)sp.textContent='🔍 Analyser';
  if(v==='loading'){$('area-loading')?.classList.remove('hidden');btn?.classList.add('loading');if(sp)sp.textContent='⏳ Chargement…';}
  else if(v==='error')$('area-error')?.classList.remove('hidden');
  else if(v==='results'){$('area-results')?.classList.remove('hidden');setTimeout(()=>$('area-results')?.scrollIntoView({behavior:'smooth',block:'start'}),120);}
}

// ─── UNITÉ (CORRIGÉE) ────────────────────────────────────────────────────────
function setUnit(u){
  S.unit=u;
  ['twh','gwh','mwh'].forEach(x=>$(`u-${x}`)?.classList.toggle('active',u.toLowerCase()===x));
  if(S.dN&&S.dN1){
    // Re-render toutes les valeurs dépendantes de l'unité
    tx('kpi-val-n',fmt(S.dN.total));tx('kpi-val-n1',fmt(S.dN1.total));
    tx('kpi-unit-n',u);tx('kpi-unit-n1',u);
    tx('donut-total',fmt(S.dN.total));tx('donut-unit-lbl',u);
    tx('forecast-unit',`${u} estimés`);
    renderSectors();renderDonut();renderBar();
  }
  save();
}

// ─── THÈME (CORRIGÉ) ─────────────────────────────────────────────────────────
function setTheme(t){
  S.theme=t;
  // data-theme="dark" ou "light" → CSS gère tout via [data-theme=light]
  document.documentElement.setAttribute('data-theme',t);
  $('th-dark')?.classList.toggle('active',t==='dark');
  $('th-light')?.classList.toggle('active',t==='light');
  save();
}

// ─── SETTINGS ────────────────────────────────────────────────────────────────
function bindSettings(){
  $('btn-settings')?.addEventListener('click',()=>{$('settings')?.classList.remove('hidden');document.body.style.overflow='hidden';});
  $('btn-close-s')?.addEventListener('click',closeS);$('settings-overlay')?.addEventListener('click',closeS);
  $('th-dark')?.addEventListener('click',()=>setTheme('dark'));$('th-light')?.addEventListener('click',()=>setTheme('light'));
  $('u-twh')?.addEventListener('click',()=>setUnit('TWh'));$('u-gwh')?.addEventListener('click',()=>setUnit('GWh'));$('u-mwh')?.addEventListener('click',()=>setUnit('MWh'));
  $('s-price')?.addEventListener('input',()=>{const v=parseFloat($('s-price').value);if(!isNaN(v)&&v>0){S.price=v;const p=$('price-kwh');if(p)p.value=v.toFixed(4);renderCosts();renderScenarios();renderMonthly();}});
}
function closeS(){$('settings')?.classList.add('hidden');document.body.style.overflow='';}
function save(){try{localStorage.setItem('epv4',JSON.stringify({theme:S.theme,unit:S.unit,price:S.price,src:S.src}));}catch(_){}}
function loadPref(){
  try{
    const d=JSON.parse(localStorage.getItem('epv4')||'{}');
    if(d.theme)setTheme(d.theme);else setTheme('dark');
    if(d.unit)setUnit(d.unit);
    if(d.price){S.price=d.price;[$('price-kwh'),$('s-price')].forEach(e=>{if(e)e.value=d.price.toFixed(4);});}
    // Restore source toggle
    if(d.src){
      S.src=d.src;
      document.querySelectorAll('.source-btn').forEach(b=>b.classList.toggle('active',b.dataset.src===d.src));
    }
  }catch(_){setTheme('dark');}
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
function bindNav(){
  [
    ['nav-home',''],
    ['nav-charts','.card-monthly'],
    ['nav-cost','.cost-card'],
  ].forEach(([id,sel])=>{
    $(id)?.addEventListener('click',()=>{
      document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
      $(id)?.classList.add('active');
      if(sel){document.querySelector(sel)?.scrollIntoView({behavior:'smooth',block:'start'});}
      else window.scrollTo({top:0,behavior:'smooth'});
    });
  });
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function toast(msg){
  document.querySelector('.toast')?.remove();
  const t=Object.assign(document.createElement('div'),{className:'toast',textContent:msg});
  Object.assign(t.style,{position:'fixed',bottom:'calc(var(--nav) + 12px)',left:'50%',transform:'translateX(-50%) translateY(14px)',background:'rgba(14,14,40,.96)',border:'1px solid rgba(124,111,255,.4)',borderRadius:'11px',padding:'10px 18px',fontSize:'.83rem',fontWeight:'500',color:'#eeeeff',zIndex:'9999',backdropFilter:'blur(16px)',boxShadow:'0 8px 28px rgba(0,0,0,.5)',transition:'transform .26s,opacity .26s',opacity:'0',whiteSpace:'nowrap',fontFamily:'var(--font)'});
  document.body.appendChild(t);
  requestAnimationFrame(()=>{t.style.transform='translateX(-50%) translateY(0)';t.style.opacity='1';});
  setTimeout(()=>{t.style.transform='translateX(-50%) translateY(14px)';t.style.opacity='0';setTimeout(()=>t.remove(),260);},3000);
}

// ═══════════════════════════════════════════════════════════════════════════
// CARTE SVG INTERACTIVE – 13 RÉGIONS MÉTROPOLITAINES + CORSE
// Coordonnées approximatives, viewBox 0 0 500 540
// Source cartographique simplifiée : géométries régionales 2016 (post-fusions)
// ═══════════════════════════════════════════════════════════════════════════
const MAP_PATHS={
  '32':"M252,8 L400,8 L398,90 L328,108 L270,93 Z",
  '28':"M63,68 L192,8 L252,8 L270,93 L225,146 L144,150 L85,120 Z",
  '53':"M2,115 L63,68 L85,120 L144,150 L130,193 L77,210 L23,194 L2,155 Z",
  '11':"M270,93 L328,108 L332,160 L280,178 L247,146 L225,146 Z",
  '44':"M398,90 L467,27 L471,150 L418,226 L372,216 L345,160 L328,108 Z",
  '52':"M2,155 L23,194 L77,210 L130,193 L150,240 L140,283 L77,296 L17,268 L2,215 Z",
  '24':"M144,150 L225,146 L247,146 L280,178 L278,243 L220,263 L168,248 L150,203 Z",
  '27':"M332,160 L345,160 L372,216 L418,226 L411,293 L361,313 L302,296 L278,243 L280,178 Z",
  '75':"M2,215 L17,268 L77,296 L140,283 L168,248 L220,263 L240,316 L172,343 L154,386 L93,410 L21,396 L2,336 Z",
  '84':"M278,243 L302,296 L361,313 L411,293 L418,375 L347,423 L285,426 L239,386 L239,316 L257,270 Z",
  '76':"M172,343 L239,316 L285,426 L281,480 L187,500 L97,490 L91,456 L93,410 L154,386 Z",
  '93':"M285,426 L418,375 L446,426 L418,480 L344,496 L281,480 Z",
  '94':"M461,393 L477,383 L487,418 L474,450 L459,442 Z",
};
// Centroïdes approximatifs pour les labels
const MAP_CENTERS={
  '32':[325,52],'28':[162,82],'53':[63,158],'11':[283,130],
  '44':[400,138],'52':[80,242],'24':[216,203],'27':[360,244],
  '75':[92,312],'84':[336,346],'76':[194,425],'93':[367,445],'94':[474,418],
};
// Noms courts pour les labels de la carte
const MAP_SHORT={
  '32':'H-de-France','28':'Normandie','53':'Bretagne','11':'Île-de-Fr.',
  '44':'Grand Est','52':'Pays-de-la-L.','24':'Centre-VdL','27':'Bourgogne-FC',
  '75':'Nvlle-Aquitaine','84':'Auv.-Rh.-Alpes','76':'Occitanie','93':'PACA','94':'Corse',
};

function initMap(){
  const svg=document.getElementById('france-map');
  const grp=document.getElementById('map-regions');
  const lblGrp=document.getElementById('map-labels');
  if(!svg||!grp)return;
  const NS='http://www.w3.org/2000/svg';
  // Draw region paths
  Object.entries(MAP_PATHS).forEach(([code,d])=>{
    const path=document.createElementNS(NS,'path');
    path.setAttribute('d',d);path.setAttribute('id',`r-${code}`);
    path.setAttribute('data-code',code);path.classList.add('region-path');
    // Events
    path.addEventListener('click',()=>onMapClick(code));
    path.addEventListener('mouseenter',e=>showMapTooltip(code,e));
    path.addEventListener('mouseleave',hideMapTooltip);
    grp.appendChild(path);
    // Label
    const [cx,cy]=MAP_CENTERS[code]||[0,0];
    const txt=document.createElementNS(NS,'text');
    txt.setAttribute('x',cx);txt.setAttribute('y',cy);
    txt.classList.add('map-label');txt.setAttribute('pointer-events','none');
    txt.textContent=MAP_SHORT[code]||code;
    lblGrp.appendChild(txt);
  });
  // Color all regions with default neutral heat
  colorAllRegions();
}

function onMapClick(code){
  S.code=code;
  // Sync chip selection
  document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.code===code));
  // Visual: deselect all, select clicked
  document.querySelectorAll('.region-path').forEach(p=>p.classList.remove('selected'));
  document.getElementById(`r-${code}`)?.classList.add('selected');
  const reg=REGIONS.find(r=>r.code===code);
  tx('header-sub',reg?.name||'');
  const g=$('glow');if(g){ g.style.background=`radial-gradient(ellipse 65% 45% at 50% -5%,${reg?.glow||'rgba(124,111,255,.16)'},transparent)`; }
  // Scroll left panel to top
  document.querySelector('.panel-scroll')?.scrollTo({top:0,behavior:'smooth'});
  run();
}

function colorAllRegions(){
  // Color ALL regions based on 2021 Enedis data (comparative heat map)
  const baseYear=2021;
  const totals=REGIONS.map(r=>({code:r.code,t:getRegTotal(r.code,baseYear)||0}));
  const vals=totals.map(x=>x.t).filter(v=>v>0);
  const minT=Math.min(...vals),maxT=Math.max(...vals);
  totals.forEach(({code,t})=>{
    const path=document.getElementById(`r-${code}`);
    if(!path)return;
    const col=t>0?heatColor(t,minT,maxT):'rgba(40,42,90,.6)';
    path.style.fill=col;
  });
}

function updateMapColors(){
  // Called after analysis: color current region + update all with fresh data
  const totals=REGIONS.map(r=>({code:r.code,t:getRegTotal(r.code,S.yN)||0}));
  const vals=totals.map(x=>x.t).filter(v=>v>0);
  if(!vals.length)return;
  const minT=Math.min(...vals),maxT=Math.max(...vals);
  totals.forEach(({code,t})=>{
    const path=document.getElementById(`r-${code}`);
    if(!path||path.classList.contains('selected'))return; // selected stays highlighted
    path.style.fill=t>0?heatColor(t,minT,maxT):'rgba(40,42,90,.6)';
  });
  // Update legend unit
  tx('legend-unit',S.unit);
  tx('map-year-badge',`${S.yN} · ${S.src==='rte'?'RTE+HTB':'Enedis'}`);
  // Update source badge
  const sb=$('map-source-badge');
  if(sb){sb.textContent=S.src==='rte'?'🔌 Source : RTE + HTB':'⚡ Source : Enedis';}
  // Update map stats bar
  const reg=REGIONS.find(r=>r.code===S.code);
  const pop=(reg?.pop||3000)*1000;
  const kwh=S.dN?S.dN.total*1000/pop:0;
  const sc=score(kwh);
  tx('ms-region',reg?.name||'—');
  tx('ms-conso',S.dN?`${fmt(S.dN.total)} ${S.unit}`:'—');
  if(S.dN&&S.dN1){
    const pct=S.dN1.total?((S.dN.total-S.dN1.total)/S.dN1.total*100):0;
    const ms=$('ms-evol');
    if(ms){ms.textContent=`${pct>0?'+':''}${pct.toFixed(1)}%`;ms.style.color=pct>0?'#f97316':'#10b981';}
  }
  tx('ms-score',sc.l);const msEl=$('ms-score');if(msEl)msEl.style.color=sc.c;
}

function heatColor(val,min,max){
  // Blue → Purple → Red heat spectrum
  const t=max>min?(val-min)/(max-min):0;
  const r=Math.round(60+t*180);
  const g=Math.round(80-t*60);
  const b=Math.round(200-t*150);
  return`rgba(${r},${g},${b},0.72)`;
}

function showMapTooltip(code,evt){
  const tip=$('map-tooltip');if(!tip)return;
  const reg=REGIONS.find(r=>r.code===code);
  const t=getRegTotal(code,S.yN);
  const t1=getRegTotal(code,S.yN1);
  const pct=t&&t1?((t-t1)/t1*100):null;
  tip.innerHTML=`<strong>${reg?.icon||''} ${reg?.name||code}</strong>
    <div class="tt-sub">${t?`${t.toFixed(1)} TWh (${S.yN})`:'Cliquer pour analyser'}</div>
    ${pct!=null?`<div class="tt-sub">${pct>0?'📈':'📉'} ${pct>0?'+':''}${pct.toFixed(1)}% vs ${S.yN1}</div>`:''}`;
  tip.classList.remove('hidden');
  positionTooltip(tip,evt);
}
function hideMapTooltip(){$('map-tooltip')?.classList.add('hidden');}
function positionTooltip(tip,evt){
  const map=$('france-map');if(!map)return;
  const r=map.getBoundingClientRect();
  const x=evt.clientX-r.left+10;
  const y=evt.clientY-r.top+10;
  tip.style.left=`${Math.min(x,r.width-160)}px`;
  tip.style.top=`${Math.min(y,r.height-80)}px`;
}
