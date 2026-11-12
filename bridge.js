/* Brücke zwischen Modul (läuft im iframe) und der Klassen-App.
   Ein Modul ruft am Ende seines Skripts auf:
     AppBridge.register({
       getState(){ return {punkte, erledigt:[...], stationen:[...], daten:{...}} },
       setState(s){ ...gespeicherten Stand wiederherstellen... }
     });
   und bei jeder Änderung: AppBridge.changed();
   Läuft das Modul allein (ohne App), passiert einfach nichts. */
(function () {
  const inApp = window.parent !== window;
  let mod = null, pending = null, timer = null;

  function snapshot() {
    if (!mod) return null;
    try { return mod.getState(); } catch (e) { console.error('getState', e); return null; }
  }
  function send(type) {
    if (!inApp) return;
    parent.postMessage({ app: 'klassenapp', type, state: snapshot() }, location.origin);
  }

  window.AppBridge = {
    inApp,
    register(m) {
      mod = m;
      if (pending) { apply(pending); pending = null; }
      send('ready');
    },
    changed() { clearTimeout(timer); timer = setTimeout(() => send('state'), 300); }
  };

  function apply(s) {
    try { mod.setState(s); } catch (e) { console.error('setState', e); }
  }

  addEventListener('message', (e) => {
    if (e.origin !== location.origin) return;
    const d = e.data;
    if (!d || d.app !== 'klassenapp') return;
    if (d.type === 'load' && d.state) { mod ? apply(d.state) : (pending = d.state); }
    if (d.type === 'collect') send('state');
  });
})();
