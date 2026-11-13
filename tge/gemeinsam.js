/* Gemeinsame Funktionen für Schüler-App und Lehrer-Auswertung */
const KA = (() => {
  /* ---- 8-stelliger Code: 2 Stellen Klasse + 5 Stellen Zufall + 1 Prüfziffer (Luhn) ---- */
  function pruefziffer(sieben) {
    let sum = 0;
    for (let i = 0; i < sieben.length; i++) {
      let d = +sieben[sieben.length - 1 - i];
      if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
      sum += d;
    }
    return String((10 - (sum % 10)) % 10);
  }
  function codeGueltig(code) {
    return /^\d{8}$/.test(code) && pruefziffer(code.slice(0, 7)) === code[7];
  }
  function neuerCode(klassenId, vorhandene = new Set()) {
    for (;;) {
      const mitte = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
      const sieben = klassenId + mitte;
      const code = sieben + pruefziffer(sieben);
      if (!vorhandene.has(code)) return code;
    }
  }
  const codeHuebsch = (c) => c.slice(0, 4) + ' ' + c.slice(4);

  /* ---- Datum für Dateinamen ---- */
  function stempel(d = new Date()) {
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
  }
  const dateiname = (s) => s.replace(/[^\wäöüÄÖÜß.\-]+/g, '-');

  /* ---- Rückmeldungen verschlüsseln: nur wer den Code kennt, kann seine lesen ---- */
  const enc = new TextEncoder(), dec = new TextDecoder();
  const b64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
  const unb64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function schluessel(code) {
    const basis = await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']);
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt: enc.encode('tgeapp-rueckmeldung'), iterations: 60000, hash: 'SHA-256' },
      basis, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
  }
  async function kennung(code) {
    const h = await crypto.subtle.digest('SHA-256', enc.encode('id:' + code));
    return [...new Uint8Array(h)].slice(0, 10).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  async function verschluesseln(code, obj) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const data = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await schluessel(code), enc.encode(JSON.stringify(obj)));
    return { iv: b64(iv), data: b64(data) };
  }
  async function entschluesseln(code, paket) {
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(paket.iv) }, await schluessel(code), unb64(paket.data));
    return JSON.parse(dec.decode(plain));
  }

  return { pruefziffer, codeGueltig, neuerCode, codeHuebsch, stempel, dateiname, kennung, verschluesseln, entschluesseln };
})();
