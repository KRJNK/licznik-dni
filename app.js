// Licznik dni do wydarzeń. Daty w localStorage, sortowanie rosnąco.
(function () {
  'use strict';
  var KEY = 'licznik-v1';
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (Array.isArray(s)) return s;
    } catch (e) {}
    return [];
  }
  var events = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(events)); } catch (e) {} }
  function daysLeft(dateStr) {
    var now = new Date(); now.setHours(0, 0, 0, 0);
    var d = new Date(dateStr + 'T00:00:00');
    return Math.round((d - now) / 86400000);
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function render() {
    events.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    var list = document.getElementById('list');
    list.innerHTML = '';
    document.getElementById('empty').hidden = events.length > 0;
    events.forEach(function (ev, i) {
      var n = daysLeft(ev.date);
      var d = document.createElement('div');
      d.className = 'row';
      var label = n === 0 ? '🎉 DZIŚ!' : n > 0 ? n + ' dni' : 'minęło ' + (-n) + ' dni temu';
      d.innerHTML = '<span style="flex:2"><strong>' + esc(ev.name) + '</strong><br>' +
        '<span class="hint">' + esc(ev.date) + '</span></span>' +
        '<span class="big" style="font-size:1.1rem;flex:1">' + label + '</span> ';
      var del = document.createElement('button');
      del.type = 'button'; del.textContent = '×'; del.title = 'Usuń';
      del.addEventListener('click', function () { events.splice(i, 1); save(); render(); });
      d.appendChild(del);
      list.appendChild(d);
    });
  }
  document.getElementById('add').addEventListener('click', function () {
    var name = document.getElementById('name').value.trim();
    var date = document.getElementById('date').value;
    if (!name || !date) return;
    events.push({ name: name, date: date });
    document.getElementById('name').value = '';
    save(); render();
  });
  render();
})();
