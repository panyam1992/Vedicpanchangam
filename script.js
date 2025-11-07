// Names for Tithi, Vara, Nakshatras, Yoga, Karanam
const TITHI_NAMES = [
  'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami', 'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami', 'Ekadashi', 'Dvadashi', 'Trayodashi', 'Chaturdashi', 'Purnima/Amavasya', 'Unused'
];

const VARA_NAMES = ['Sunday (Ravivara)','Monday (Somavara)','Tuesday (Mangalavara)','Wednesday (Budhavara)','Thursday (Guruvaar)','Friday (Shukravara)','Saturday (Shanivara)'];

const NAKSHATRA_NAMES = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashirsha','Ardra','Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni','Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshta','Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha','Purva Bhadrapada','Uttara Bhadrapada','Revati'
];

const YOGA_NAMES = Array.from({length:27}, (_,i)=>`Yoga ${i+1}`);
const KARANAM_NAMES = Array.from({length:11}, (_,i)=>`Karanam ${i+1}`);

function populateSelects(){
  const tithi = document.getElementById('tithi');
  const vara = document.getElementById('vara');
  const nak = document.getElementById('nakshatra');
  const yoga = document.getElementById('yoga');
  const kar = document.getElementById('karanam');
  const janma = document.getElementById('janma');

  // Tithi: 1..16 (use names where possible)
  for(let i=1;i<=16;i++){
    const opt = document.createElement('option');
    const name = TITHI_NAMES[i-1] || `Tithi ${i}`;
    opt.value = i;
    opt.textContent = `${name} (${i})`;
    tithi.appendChild(opt);
  }

  // Vara 1..7
  for(let i=1;i<=7;i++){
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${VARA_NAMES[i-1]} (${i})`;
    vara.appendChild(opt);
  }

  // Nakshatra 1..27
  for(let i=1;i<=27;i++){
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${NAKSHATRA_NAMES[i-1]} (${i})`;
    nak.appendChild(opt);
  }

  // Yoga 1..27
  for(let i=1;i<=27;i++){
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${YOGA_NAMES[i-1]} (${i})`;
    yoga.appendChild(opt);
  }

  // Karanam 1..11
  for(let i=1;i<=11;i++){
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${KARANAM_NAMES[i-1]} (${i})`;
    kar.appendChild(opt);
  }

  // Janma Nakshatra 1..27
  for(let i=1;i<=27;i++){
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `${NAKSHATRA_NAMES[i-1]} (${i})`;
    janma.appendChild(opt);
  }
}

function readInt(id){
  const el = document.getElementById(id);
  if(!el) return 0;
  const n = parseInt(el.value,10);
  return Number.isNaN(n) ? 0 : n;
}

function calculateForAll(){
  const samvatsaram = document.getElementById('samvatsaram').value || '';
  const t = readInt('tithi');
  const v = readInt('vara');
  const n = readInt('nakshatra');
  const y = readInt('yoga');
  const k = readInt('karanam');
  const j = readInt('janma');

  const sumMain = t + v + n + y + k;
  const totalJanma = sumMain + j;

  // For each of the 27 nakshatras, compute the parts based on totalJanma
  const rows = [];
  for(let i=1;i<=27;i++){
    const total = sumMain + i; // shift by the nakshatra index for each report
    const part1mul = total * 3; const part1q = Math.floor(part1mul/8); const part1r = part1mul % 8;
    const part2mul = total * 7; const part2q = Math.floor(part2mul/3); const part2r = part2mul % 3;
    const part3mul = total * 3; const part3q = Math.floor(part3mul/5); const part3r = part3mul % 5;
    rows.push({idx:i, name: NAKSHATRA_NAMES[i-1], total, part1:{mul:part1mul,q:part1q,r:part1r}, part2:{mul:part2mul,q:part2q,r:part2r}, part3:{mul:part3mul,q:part3q,r:part3r}});
  }

  renderResults(samvatsaram, sumMain, totalJanma, rows);
}

function renderResults(samvatsaram, sumMain, totalJanma, rows){
  const root = document.getElementById('result');
  root.innerHTML = '';

  const title = document.createElement('h2');
  title.textContent = 'Kandaya Phalalu';
  root.appendChild(title);

  const year = document.createElement('div');
  year.innerHTML = `<strong>Samvatsaram:</strong> ${samvatsaram}`;
  root.appendChild(year);

  const summary = document.createElement('div');
  summary.innerHTML = `<strong>Total:</strong> ${sumMain} &nbsp; <strong>Total + Janma:</strong> ${totalJanma}`;
  root.appendChild(summary);

  const container = document.createElement('div');
  container.className = 'nak-container';

  rows.forEach(r=>{
    const tbl = document.createElement('table');
    tbl.className = 'nak-table';
    const cap = document.createElement('caption');
    cap.textContent = `${r.name} (${r.idx})`;
    tbl.appendChild(cap);

    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Part</th><th>Multiply</th><th>Quotient</th><th>Remainder</th></tr>';
    tbl.appendChild(thead);

    const tb = document.createElement('tbody');
    const makeRow = (label, part) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${label}</td><td>${part.mul}</td><td>${part.q}</td><td>${part.r}</td>`;
      return tr;
    };
    tb.appendChild(makeRow('Part 1 (×3 ÷8)', r.part1));
    tb.appendChild(makeRow('Part 2 (×7 ÷3)', r.part2));
    tb.appendChild(makeRow('Part 3 (×3 ÷5)', r.part3));
    tbl.appendChild(tb);

    container.appendChild(tbl);
  });

  root.appendChild(container);
}

function makePrint(){
  const title = 'Kandaya Phalalu';
  const samvatsaram = document.getElementById('samvatsaram').value || '';
  // We'll recreate the minimal print content: title, year, nakshatra names and three remainders each
  // Use current calculated rows by re-running calculation logic but only collect the remainders
  const t = readInt('tithi');
  const v = readInt('vara');
  const n = readInt('nakshatra');
  const y = readInt('yoga');
  const k = readInt('karanam');
  const j = readInt('janma');
  const sumMain = t + v + n + y + k;

  // find selected Yoga and Karanam names (if any) — use values already read above
  const yogaName = (YOGA_NAMES[y-1]) ? `${YOGA_NAMES[y-1]} (${y})` : '';
  const karanamName = (KARANAM_NAMES[k-1]) ? `${KARANAM_NAMES[k-1]} (${k})` : '';

  let html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>
    @page { size: auto; margin: 20mm; }
    body{font-family:Arial,Helvetica,sans-serif;margin:0;padding:0}
    .print-header, .print-footer{width:100%;position:fixed;left:0}
    .print-header{top:0;height:60px;display:flex;align-items:center;justify-content:space-between;padding:6px 12px;border-bottom:1px solid #ddd}
    .print-footer{bottom:0;height:60px;display:flex;align-items:center;justify-content:space-between;padding:6px 12px;border-top:1px solid #ddd;font-size:12px}
    .print-body{padding:80px 12px 80px 12px}
    table{width:100%;border-collapse:collapse;margin-bottom:8px;font-size:12px}
    td,th{border:1px solid #222;padding:6px;text-align:left}
    th{background:#f0f0f0}
    h1{margin:0 0 6px 0;font-size:20px}
  </style></head><body>`;

  // header with three positions
  html += `<div class="print-header"><div>JAYA GURU DATTA</div><div>SRIMATRE NAMAH</div><div>SRI GURU DATTA</div></div>`;

  // body with title, year, yoga and karanam
  html += `<div class="print-body">`;
  html += `<h1>${title}</h1>`;
  html += `<div><strong>Samvatsaram:</strong> ${samvatsaram}</div>`;
  if(yogaName) html += `<div><strong>Yoga:</strong> ${yogaName}</div>`;
  if(karanamName) html += `<div><strong>Karanam:</strong> ${karanamName}</div>`;
  html += `<hr>`;

  html += `<table><thead><tr><th>#</th><th>Nakshatra</th><th>Part1 Remainder</th><th>Part2 Remainder</th><th>Part3 Remainder</th></tr></thead><tbody>`;
  for(let i=1;i<=27;i++){
    const total = sumMain + i;
    const part1r = (total*3) % 8;
    const part2r = (total*7) % 3;
    const part3r = (total*3) % 5;
    html += `<tr><td>${i}</td><td>${NAKSHATRA_NAMES[i-1]}</td><td>${part1r}</td><td>${part2r}</td><td>${part3r}</td></tr>`;
  }
  html += `</tbody></table>`;
  html += `</div>`; // close print-body

  // footer with three positions
  html += `<div class="print-footer"><div>WWW.VEDICMOBILECALENDAR.COM</div><div>CREATED SREE RAMA DATTA PANYAM</div><div>ALL RIGHTS FOR PANCHANGAKARTA</div></div>`;

  html += `</body></html>`;

  const w = window.open('', '_blank');
  if(!w) { alert('Please allow popups to print'); return; }
  w.document.write(html);
  w.document.close();
  w.focus();
  w.print();
}

document.addEventListener('DOMContentLoaded', ()=>{
  populateSelects();
  document.getElementById('calcBtn').addEventListener('click', calculateForAll);
  document.getElementById('printBtn').addEventListener('click', makePrint);
});
