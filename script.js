function err(msg) {
  const e = document.getElementById('error');
  e.textContent = msg;
  e.style.display = msg ? 'block' : 'none';
  if (msg) document.getElementById('results').style.display = 'none';
}

function calc() {
  err('');
  const er = +document.getElementById('er').value;
  const h  = +document.getElementById('h').value;
  const f  = +document.getElementById('freq').value;
  const td = +document.getElementById('tanD').value;

  if (!er || er <= 0)       return err('Enter a valid relative permittivity (εr > 0).');
  if (!h  || h  <= 0)       return err('Enter a valid substrate height (h > 0).');
  if (!f  || f  <= 0)       return err('Enter a valid design frequency (f > 0).');
  if (isNaN(td) || td < 0)  return err('Loss tangent must be >= 0.');

  const c   = 3e11;
  const fHz = f * 1e9;

  const W   = (c / (2 * fHz)) * Math.sqrt(2 / (er + 1));
  const eef = (er + 1) / 2 + (er - 1) / 2 * Math.pow(1 + 12 * h / W, -0.5);
  const wh  = W / h;
  const dL  = 0.412 * h * ((eef + 0.3) * (wh + 0.264)) / ((eef - 0.258) * (wh + 0.8));
  const Lef = c / (2 * fHz * Math.sqrt(eef));
  const L   = Lef - 2 * dL;

  if (L <= 0) return err('Non-physical length result. Please check your inputs.');

  document.getElementById('oW').textContent    = W.toFixed(3);
  document.getElementById('oL').textContent    = L.toFixed(3);
  document.getElementById('oEeff').textContent = eef.toFixed(4);
  document.getElementById('oDL').textContent   = dL.toFixed(4);

  const rows = [
    ['er',   er],
    ['h',    h + ' mm'],
    ['f',    fHz.toExponential(3) + ' Hz'],
    ['tan d', td],
    ['— Width', ''],
    ['W = (c/2f).sqrt(2/(er+1))',  W.toFixed(4) + ' mm'],
    ['W/h',  wh.toFixed(4)],
    ['— Effective Permittivity', ''],
    ['eeff = (er+1)/2 + (er-1)/2.(1+12h/W)^-0.5',  eef.toFixed(6)],
    ['— Length Extension', ''],
    ['dL = 0.412.h.[(eeff+0.3)(W/h+0.264)] / [(eeff-0.258)(W/h+0.8)]',  dL.toFixed(6) + ' mm'],
    ['— Length', ''],
    ['Leff = c/(2f.sqrt(eeff))',  Lef.toFixed(4) + ' mm'],
    ['L = Leff - 2.dL',  L.toFixed(4) + ' mm'],
  ];

  document.getElementById('stbl').innerHTML = rows.map(([l, v]) =>
    `<tr class="${l.startsWith('—') ? 'sep' : ''}"><td>${l}</td><td>${v}</td></tr>`
  ).join('');

  document.getElementById('results').style.display = 'block';
  document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

function toggleSteps() {
  const s    = document.getElementById('steps');
  const b    = document.querySelector('.tog');
  const open = s.style.display === 'block';
  s.style.display = open ? 'none' : 'block';
  b.innerHTML = (open ? '&#9658;' : '&#9660;') + (open ? ' Show' : ' Hide') + ' Intermediate Steps';
}

function reset() {
  ['er', 'h', 'freq', 'tanD'].forEach(id => document.getElementById(id).value = '');
  err('');
  document.getElementById('results').style.display = 'none';
  document.getElementById('steps').style.display   = 'none';
  document.querySelector('.tog').innerHTML = '&#9658; Show Intermediate Steps';
}
