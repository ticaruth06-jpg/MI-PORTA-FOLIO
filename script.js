/* ================== CONFIGURACIÓN ================== */
const CONFIG = {
  nombreEstudiante: "Nayeli Quispe Tica",
  codigoEstudiante: "U00057H",
  universidad: "Universidad Peruana Los Andes",
  claveAdministrador: "1234",
  usuario: "ticaruth06-jpg",
  repo: "MI-PORTAFOLIO-ACADEMICO",
  rama: "main"
};

const CURSOS = [
  {
    id: "algoritmo", codigo: "332141", nombre: "Algoritmo y Estructura de Datos", icono: "🧮", cls: "c-algoritmo",
    unidades: 4, semanasPorUnidad: 4, totalSemanas: 16,
    colores: [["#276ef1", "#42c6e8"], ["#1d4e89", "#5b9dff"], ["#701c3c", "#a43d5d"], ["#7f1d1d", "#bd3a3a"]]
  },
  {
    id: "taller", codigo: "IS-102", nombre: "Desarrollo de Aplicaciones", icono: "💻", cls: "c-taller",
    unidades: 2, semanasPorUnidad: 8, totalSemanas: 16,
    colores: [["#7042bd", "#b789eb"], ["#5c359e", "#9c72d2"]]
  }
];

// Temas oficiales del sílabo UPLA - Algoritmos y Estructuras de Datos
const TEMAS_INICIALES_ALGORITMO = {
  1: "Arreglos Unidimensionales",
  2: "Arreglos Bidimensionales",
  3: "Arreglos paralelos",
  4: "Arreglos de Objetos",
  5: "ArrayList",
  6: "Pilas de objetos y aplicaciones con pilas",
  7: "Colas: TDA cola, representación, operaciones y aplicaciones de colas",
  8: "Recursividad: Algoritmos de programación recursiva y múltiple",
  9: "Listas Simplemente Enlazadas (LSE): TDA, representación y operaciones",
  10: "Listas Circulares Simples (LCS): definición, representación y objetos",
  11: "Listas Doblemente Enlazadas (LDE): TDA, representación y operaciones",
  12: "Listas Circulares Dobles (LCD): TDA, representación y aplicaciones",
  13: "Árboles: TDA árbol, árboles generales, binarios y recorridos",
  14: "Grafos: TDA grafo, definición, representación y conexiones",
  15: "Métodos de ordenación, Búsqueda secuencial y Búsqueda binaria",
  16: "Exposición de trabajo final y evaluación de desempeño final"
};

// Temas oficiales del sílabo UPLA - Desarrollo de Aplicaciones I
const TEMAS_INICIALES_TALLER = {
  1: "Diseño, que es Maven y Pom.xml",
  2: "Aplicacion en Maven, Web Application",
  3: "Programación Orientada a Objetos en Web Application",
  4: "Diseño de una pagina web en Maven",
  5: "Gestión de Archivos y Persistencia de Datos Locales (JFileChooser)",
  6: "Personalización Visual Avanzada e Identidad del Proyecto (Look and Feel)",
  7: "Diseño de Interfaces Complejas con Tablas y Listas (JTable, JList, JComboBox)",
  8: "Orquestación de Mensajes, Diálogos de Usuario y Cierre de Fase (JOptionPane)",
  9: "Conectividad y Configuración del Driver de Base de Datos (JDBC)",
  10: "Operaciones de Persistencia: Inserción y Lectura de Datos (CRUD: Insert/Select)",
  11: "Operaciones de Persistencia II: Actualización, Eliminación y Transacciones",
  12: "Vinculación Dinámica y Cierre de la Capa de Datos",
  13: "Migración a Arquitectura Cliente-Servidor e Hilos",
  14: "Depuración, Manejo de Excepciones y Pruebas del Sistema",
  15: "Compilación y Generación del Archivo Ejecutable (.jar)",
  16: "Sustentación del Proyecto Final y Cierre de Curso"
};

/* ================== ESTADO ================== */
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const CLAVE_ROL = "portafolio_rol";
let rol = sessionStorage.getItem(CLAVE_ROL) || "";
let cursoActual = "";
let openSem = null;
let RAMA = CONFIG.rama;

function crearDatosIniciales() {
  const d = {};
  CURSOS.forEach(c => {
    d[c.id] = { semanas: {} };
    for (let i = 1; i <= c.totalSemanas; i++) {
      const t = c.id === "algoritmo" ? TEMAS_INICIALES_ALGORITMO[i] : TEMAS_INICIALES_TALLER[i];
      d[c.id].semanas[i] = { unidad: Math.ceil(i / c.semanasPorUnidad), tema: t || "", temaPath: null, entregas: [] };
    }
  });
  return d;
}
let datos = crearDatosIniciales();

/* ================== UTILIDADES ================== */
function toast(m, ms = 3500) {
  const t = $("#toast"); t.textContent = m; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), ms);
}
const fmtSize = b => !b ? "" : b < 1024 ? b + " B" : b < 1048576 ? Math.max(1, Math.round(b / 1024)) + " KB" : (b / 1048576).toFixed(1) + " MB";
const extension = n => (String(n).split(".").pop() || "").toLowerCase();
const esImagen = e => e && e.tipo === "archivo" && ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg", "avif"].includes(extension(e.nombre));
const esPdf = e => e && e.tipo === "archivo" && extension(e.nombre) === "pdf";
function icono(e) {
  if (e.tipo === "enlace") return "🔗";
  const x = extension(e.nombre);
  if (esImagen(e)) return "🖼️";
  if (["zip", "rar", "7z", "gz"].includes(x)) return "📦";
  if (x === "pdf") return "📕";
  if (["doc", "docx", "odt"].includes(x)) return "📘";
  if (["xls", "xlsx", "csv"].includes(x)) return "📗";
  if (["ppt", "pptx"].includes(x)) return "📙";
  if (["java", "js", "html", "css", "py", "c", "cpp", "sql", "json", "txt", "md", "jar"].includes(x)) return "📄";
  return "📁";
}
const semDe = (cid, n) => datos[cid].semanas[n];
const semActual = () => semDe(openSem.cid, openSem.num);
const cursoDe = id => CURSOS.find(c => c.id === id);
const pad = n => String(n).padStart(2, "0");
const rangoSemanas = (c, u) => { const s = (u - 1) * c.semanasPorUnidad + 1; return Array.from({ length: c.semanasPorUnidad }, (_, i) => s + i); };

/* ================== LECTURA DE ENTREGAS (GitHub, visible para todos) ================== */
function infoRepo() {
  const h = location.hostname, p = location.pathname.split("/").filter(Boolean);
  if (h.endsWith(".github.io") && p[0] && !p[0].includes(".")) return { usuario: h.split(".")[0], repo: p[0] };
  if (h.endsWith(".github.io")) return { usuario: h.split(".")[0], repo: h };
  return { usuario: CONFIG.usuario, repo: CONFIG.repo };
}
async function cargarEntregasPublicadas(d) {
  const { usuario, repo } = infoRepo();
  let arbol = null;
  try {
    const c = JSON.parse(sessionStorage.getItem("arbol_v2") || "null");
    if (c && Date.now() - c.t < 60000) { arbol = c.d; RAMA = c.r || RAMA; }
  } catch (e) {}
  if (!arbol) {
    for (const br of [...new Set([CONFIG.rama, "main", "master"])]) {
      try {
        const r = await fetch(`https://api.github.com/repos/${usuario}/${repo}/git/trees/${br}?recursive=1`);
        if (!r.ok) continue;
        arbol = (await r.json()).tree; RAMA = br;
        try { sessionStorage.setItem("arbol_v2", JSON.stringify({ t: Date.now(), d: arbol, r: br })); } catch (e) {}
        break;
      } catch (e) {}
    }
  }
  if (!arbol) return false;
  const tareas = [];
  for (const n of arbol) {
    const m = n.type === "blob" && n.path.match(/^entregas\/([^/]+)\/semana-(\d+)\/(.+)$/);
    if (!m || !d[m[1]]) continue;
    const sem = d[m[1]].semanas[parseInt(m[2], 10)];
    if (!sem) continue;
    const url = `https://raw.githubusercontent.com/${usuario}/${repo}/${RAMA}/${n.path.split("/").map(encodeURIComponent).join("/")}`;
    const nombre = m[3];
    if (nombre.toLowerCase() === "tema.txt") {
      sem.temaPath = n.path;
      tareas.push(fetch(url + "?v=" + Date.now()).then(r => r.text()).then(t => { t = t.trim(); if (t) sem.tema = t; }).catch(() => {}));
    } else if (/^enlaces?.*\.txt$/i.test(nombre)) {
      tareas.push(fetch(url + "?v=" + Date.now()).then(r => r.text()).then(t => {
        const ls = t.split(/\r?\n/).map(x => x.trim()).filter(x => /^https?:\/\//i.test(x));
        ls.forEach(x => sem.entregas.push({ tipo: "enlace", valor: x, path: n.path, nEnlaces: ls.length }));
      }).catch(() => {}));
    } else {
      sem.entregas.push({ tipo: "archivo", nombre, url, path: n.path, size: n.size || 0 });
    }
  }
  await Promise.all(tareas);
  return true;
}

/* ================== ENLACES A GITHUB (administradora, sin llaves) ================== */
const carpetaSemana = (cid, n) => `entregas/${cid}/semana-${pad(n)}`;
function urlSubir(cid, n) {
  const { usuario, repo } = infoRepo();
  return `https://github.com/${usuario}/${repo}/upload/${RAMA}/${carpetaSemana(cid, n)}`;
}
function urlNuevoEnlace(cid, n, enlace) {
  const { usuario, repo } = infoRepo();
  if (!/^https?:\/\//i.test(enlace)) enlace = "https://" + enlace;
  return `https://github.com/${usuario}/${repo}/new/${RAMA}/${carpetaSemana(cid, n)}?filename=${encodeURIComponent("enlace-" + Date.now() + ".txt")}&value=${encodeURIComponent(enlace)}`;
}
function urlTema(cid, n, sem, texto) {
  const { usuario, repo } = infoRepo();
  return sem.temaPath
    ? `https://github.com/${usuario}/${repo}/edit/${RAMA}/${sem.temaPath.split("/").map(encodeURIComponent).join("/")}`
    : `https://github.com/${usuario}/${repo}/new/${RAMA}/${carpetaSemana(cid, n)}?filename=tema.txt&value=${encodeURIComponent(texto)}`;
}

/* ================== RENDER ================== */
function progreso(c) {
  let hechas = 0;
  for (let i = 1; i <= c.totalSemanas; i++) if (semDe(c.id, i).entregas.length) hechas++;
  return { hechas, total: c.totalSemanas };
}
function totalEntregas() {
  let t = 0; CURSOS.forEach(c => Object.values(datos[c.id].semanas).forEach(s => t += s.entregas.length)); return t;
}
function renderAll() { renderCourses(); renderUnits(); countTo($("#statWorks"), totalEntregas()); }

function renderCourses() {
  $("#courses").innerHTML = CURSOS.map(c => {
    const p = progreso(c), pct = Math.round(p.hechas / p.total * 100), R = 34, C = 2 * Math.PI * R;
    return `<div class="course ${c.cls} ${c.id === cursoActual ? "active" : ""} reveal in" data-course="${c.id}">
      <div class="top"><div><div class="ico">${c.icono}</div><span class="code">${esc(c.codigo)}</span><h3>${esc(c.nombre)}</h3>
      <p>${c.unidades} Unidades Académicas (${c.semanasPorUnidad} semanas por unidad)</p></div>
      <div class="ring"><svg width="78" height="78"><circle class="t" cx="39" cy="39" r="${R}"/><circle class="p" cx="39" cy="39" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/></svg><b>${pct}%</b></div></div>
      <div class="meta">${p.hechas}/${p.total} semanas con tareas · ${c.id === cursoActual ? "✔ Viendo este curso" : "Toca para ingresar"}</div></div>`;
  }).join("");
}

function renderUnits() {
  if (!cursoActual) { $("#units").innerHTML = ""; return; }
  const c = cursoDe(cursoActual);
  const evidencias = Object.values(datos[c.id].semanas).reduce((total, semana) => total + semana.entregas.length, 0);
  let h = `<section class="course-overview"><div><span>Curso seleccionado</span><h3>${esc(c.nombre)}</h3></div>
    <div class="overview-stat"><b>${c.totalSemanas}</b><span>semanas</span></div>
    <div class="overview-stat"><b>${evidencias}</b><span>${evidencias === 1 ? "evidencia subida" : "evidencias subidas"}</span></div></section>`;
  for (let u = 1; u <= c.unidades; u++) {
    const [c1, c2] = c.colores[u - 1], sems = rangoSemanas(c, u);
    h += `<section class="unit reveal in" style="--c1:${c1};--c2:${c2}"><div class="unit-head"><div class="num" style="background:linear-gradient(135deg,${c1},${c2})">${u}</div>
      <div><h3>Unidad Didáctica ${u}</h3><span>Semanas ${sems[0]} a ${sems[sems.length - 1]}</span></div><div class="line"></div></div><div class="weeks">`;
    sems.forEach((n, i) => {
      const s = semDe(c.id, n), cnt = s.entregas.length;
      h += `<div class="week ${cnt ? "has" : ""}" data-c="${c.id}" data-s="${n}" style="animation-delay:${i * 45}ms">
        <div class="wn"><span>Semana ${pad(n)}</span><span class="pill">${cnt ? "✓ Entregado" : "• Pendiente"}</span></div>
        <div class="tp ${s.tema ? "" : "empty"}">${s.tema ? esc(s.tema) : "Tema por definir"}</div>
        <div class="foot"><span class="count">${cnt ? cnt + (cnt === 1 ? " evidencia" : " evidencias") : "Sin evidencias"}</span><span class="go">Ver evidencias →</span></div></div>`;
    });
    h += "</div></section>";
  }
  $("#units").innerHTML = h;
}
function selectCourse(id) { cursoActual = id; renderAll(); }

function abrirSemana(cid, num) {
  openSem = { cid, num };
  const c = cursoDe(cid), s = semDe(cid, num);
  $("#wCourse").textContent = c.nombre + " · Unidad " + s.unidad;
  $("#wTitle").textContent = "Semana " + num + (s.tema ? " — " + s.tema : "");
  $("#topicInput").value = s.tema || "";
  $("#upGh").href = urlSubir(cid, num);
  $("#weekOv").classList.add("show");
  renderWeek();
}

function renderWeek() {
  const sem = semActual(), items = sem.entregas;
  if (!items.length) { $("#wContent").innerHTML = '<div class="empty-msg"><span class="big">📭</span>Sin evidencias adjuntas todavía.</div>'; return; }
  const idx = e => items.indexOf(e);
  const imgs = items.filter(esImagen), resto = items.filter(e => !esImagen(e));
  let h = "";
  if (imgs.length) {
    h += `<div class="sec-title">🖼️ Imágenes · toca “Ver” para ampliar</div><div class="gallery">` +
      imgs.map(e => `<div class="gcard"><div class="thumb" data-ver="${idx(e)}"><img loading="lazy" src="${esc(e.url)}" alt="${esc(e.nombre)}"></div>
      <div class="gname" title="${esc(e.nombre)}">${esc(e.nombre)}</div>
      <div class="gacts"><button class="mini" type="button" data-ver="${idx(e)}">👁️ Ver</button><button class="mini" type="button" data-desc="${idx(e)}">📥 Descargar</button><button class="mini danger admin-only inline" type="button" data-del="${idx(e)}">🗑 Descartar</button></div></div>`).join("") + "</div>";
  }
  if (resto.length) {
    h += `<div class="sec-title">📁 Archivos y enlaces</div><div class="files">` + resto.map(e => {
      if (e.tipo === "enlace") return `<div class="file"><div class="fi">🔗</div><div class="meta"><b>Enlace</b><span>${esc(e.valor)}</span></div>
        <div class="acts"><a class="btn btn-solid sm" href="${esc(e.valor)}" target="_blank" rel="noopener">🔗 Abrir enlace</a><button class="btn btn-danger sm admin-only inline" type="button" data-del="${idx(e)}">🗑 Descartar</button></div></div>`;
      return `<div class="file"><div class="fi">${icono(e)}</div><div class="meta"><b>${esc(e.nombre)}</b><span>${fmtSize(e.size)}</span></div>
        <div class="acts"><button class="btn btn-soft sm" type="button" data-ver="${idx(e)}">👁️ Ver</button><button class="btn btn-solid sm" type="button" data-desc="${idx(e)}">📥 Descargar</button><button class="btn btn-danger sm admin-only inline" type="button" data-del="${idx(e)}">🗑 Descartar</button></div></div>`;
    }).join("") + "</div>";
  }
  $("#wContent").innerHTML = h;
}

/* ================== SESIÓN (solo la administradora) ================== */
function applyRole() {
  document.body.classList.toggle("is-admin", rol === "admin");
  const b = $("#roleBadge");
  b.style.display = rol ? "" : "none"; b.className = "badge admin"; b.textContent = "🎓 Administradora";
  $("#btnLogin").style.display = rol ? "none" : "";
  $("#btnLogout").style.display = rol ? "" : "none";
}
function cerrarVentanas() { document.querySelectorAll(".overlay").forEach(o => o.classList.remove("show")); }
$("#btnLogin").onclick = () => { $("#loginOv").classList.add("show"); setTimeout(() => $("#passIn").focus(), 60); };
$("#btnLogout").onclick = () => { rol = ""; sessionStorage.removeItem(CLAVE_ROL); applyRole(); cerrarVentanas(); toast("Sesión cerrada"); };
function loginAdmin() {
  if ($("#passIn").value === CONFIG.claveAdministrador) {
    rol = "admin"; sessionStorage.setItem(CLAVE_ROL, rol); applyRole(); cerrarVentanas();
    $("#passIn").value = ""; $("#loginErr").style.display = "none";
    confetti(); toast("¡Hola Nayeli! Ahora puedes subir tus tareas y descartar las que te equivoques 🎉", 4500);
  } else {
    $("#loginErr").style.display = "block";
    const m = $("#pane-admin"); m.classList.remove("shake"); void m.offsetWidth; m.classList.add("shake");
  }
}
$("#loginAdmin").onclick = loginAdmin;
$("#passIn").addEventListener("keydown", e => { if (e.key === "Enter") loginAdmin(); });

/* ================== ADMINISTRADORA ================== */
$("#addLink").onclick = () => {
  const v = $("#linkUrl").value.trim();
  if (!v) { toast("Escribe o pega un enlace primero."); $("#linkUrl").focus(); return; }
  window.open(urlNuevoEnlace(openSem.cid, openSem.num, v), "_blank", "noopener");
  toast('Se abrió GitHub: pulsa "Commit new file" para guardar el enlace', 6500);
  $("#linkUrl").value = "";
};
$("#saveTopic").onclick = async () => {
  const v = $("#topicInput").value.trim();
  if (!v) { toast("Escribe el tema primero."); return; }
  const s = semActual();
  if (s.temaPath) {
    try { await navigator.clipboard.writeText(v); } catch (e) {}
    toast("Se abrirá GitHub: borra el texto anterior, pega el nuevo tema (Ctrl+V) y pulsa Commit changes", 8000);
  } else toast('Se abrió GitHub con el tema listo: solo pulsa "Commit new file"', 6500);
  window.open(urlTema(openSem.cid, openSem.num, s, v), "_blank", "noopener");
};

function descartar(it) {
  if (!it || rol !== "admin") return;
  const { usuario, repo } = infoRepo();
  const solo = it.tipo !== "enlace" || (it.nEnlaces || 1) <= 1;
  const nombre = it.tipo === "enlace" ? it.valor : it.nombre;
  const aviso = solo
    ? "Se abrirá GitHub: pulsa el botón verde “Commit changes” para borrarlo definitivamente."
    : "Este enlace está en un archivo con varios enlaces. Se abrirá GitHub para que borres solo esa línea y pulses “Commit changes”.";
  if (!confirm("¿Descartar “" + nombre + "”?\n\n" + aviso)) return;
  window.open(`https://github.com/${usuario}/${repo}/${solo ? "delete" : "edit"}/${RAMA}/${it.path.split("/").map(encodeURIComponent).join("/")}`, "_blank", "noopener");
  toast("Cuando termines en GitHub, vuelve aquí: la lista se actualiza sola 🔄", 7000);
}
let recargando = false, ultimaRecarga = Date.now();
async function recargar(avisar) {
  if (recargando) return; recargando = true;
  try {
    try { sessionStorage.removeItem("arbol_v2"); } catch (e) {}
    const nuevo = crearDatosIniciales();
    if (await cargarEntregasPublicadas(nuevo)) {
      datos = nuevo; renderAll();
      if (openSem && $("#weekOv").classList.contains("show")) renderWeek();
      if (avisar) toast("Lista actualizada ✔");
    } else if (avisar) toast("No se pudo actualizar. Intenta en unos minutos.", 5000);
  } finally { recargando = false; ultimaRecarga = Date.now(); }
}
$("#btnRefresh").onclick = () => recargar(true);
document.addEventListener("visibilitychange", () => {      // al volver de GitHub, se actualiza sola
  if (document.visibilityState === "visible" && rol === "admin" && Date.now() - ultimaRecarga > 8000) recargar(false);
});

/* ================== VISOR (imagen con zoom, PDF) ================== */
const V = { z: 1, x: 0, y: 0, list: [], i: 0 };
const MAXZ = 6;
function aplicarV() {
  const img = $("#vImg"), st = $("#vStage");
  // límites: la imagen ampliada no se puede arrastrar fuera de la pantalla
  const lx = Math.max(0, (img.offsetWidth * V.z - st.clientWidth) / 2) + 90;
  const ly = Math.max(0, (img.offsetHeight * V.z - st.clientHeight) / 2) + 90;
  V.x = Math.max(-lx, Math.min(lx, V.x)); V.y = Math.max(-ly, Math.min(ly, V.y));
  img.style.transform = `translate(${V.x}px,${V.y}px) scale(${V.z})`;
  img.style.cursor = V.z > 1 ? "grab" : "zoom-in";
  $("#vZoom").textContent = Math.round(V.z * 100) + "%";
}
function zoomEn(factor, cx, cy) {            // cx, cy: posición respecto al centro del visor
  const nz = Math.min(MAXZ, Math.max(1, V.z * factor)), k = nz / V.z;
  V.x = cx - (cx - V.x) * k; V.y = cy - (cy - V.y) * k; V.z = nz;
  if (V.z <= 1.001) { V.z = 1; V.x = 0; V.y = 0; }
  aplicarV();
}
function centroRel(e) { const r = $("#vStage").getBoundingClientRect(); return [e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)]; }
function descargar(url, nombre) {
  const a = document.createElement("a"); a.href = url; a.download = nombre || "archivo"; a.rel = "noopener";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
}
function abrirVisor(it) {
  if (!it) return;
  const imgs = semActual().entregas.filter(esImagen);
  V.list = esImagen(it) ? imgs : [it]; V.i = Math.max(0, V.list.indexOf(it));
  $("#toast").classList.remove("show");
  $("#viewer").classList.add("show"); document.body.style.overflow = "hidden";
  mostrarVisor(true);
}
function mostrarVisor(anim) {
  const it = V.list[V.i], img = $("#vImg"), fr = $("#vFrame"), info = $("#vInfo"), vw = $("#viewer");
  $("#vTitle").textContent = it.nombre + (V.list.length > 1 ? `   (${V.i + 1}/${V.list.length})` : "");
  img.style.display = "none"; fr.style.display = "none"; info.style.display = "none"; fr.src = "about:blank";
  V.z = 1; V.x = 0; V.y = 0;
  vw.classList.toggle("noimg", !esImagen(it));
  if (esImagen(it)) {
    img.src = it.url; img.alt = it.nombre; img.style.display = "block"; aplicarV();
    img.classList.remove("grow"); void img.offsetWidth; if (anim) img.classList.add("grow");
  } else if (esPdf(it)) {
    fr.src = it.url; fr.style.display = "block";
  } else {
    info.style.display = "block";
    info.innerHTML = `<div class="vinfo"><div style="font-size:3rem">${icono(it)}</div><h3>Este archivo no tiene vista previa en el navegador</h3><p>Los archivos Word, ZIP, RAR o de código deben descargarse y abrirse con su programa.</p></div>`;
  }
  $("#vPrev").style.display = $("#vNext").style.display = V.list.length > 1 ? "" : "none";
}
function cerrarVisor() { $("#viewer").classList.remove("show"); $("#vFrame").src = "about:blank"; document.body.style.overflow = ""; }
const pasoVisor = d => { V.i = (V.i + d + V.list.length) % V.list.length; mostrarVisor(true); };
$("#vPrev").onclick = () => pasoVisor(-1);
$("#vNext").onclick = () => pasoVisor(1);
$("#vClose").onclick = cerrarVisor;
$("#vIn").onclick = () => zoomEn(1.4, 0, 0);
$("#vOut").onclick = () => zoomEn(1 / 1.4, 0, 0);
$("#vReset").onclick = () => { V.z = 1; V.x = 0; V.y = 0; aplicarV(); };
$("#vDl").onclick = () => { const it = V.list[V.i]; descargar(it.url, it.nombre.split("/").pop()); };
$("#vStage").addEventListener("wheel", e => {
  if (!esImagen(V.list[V.i])) return;
  e.preventDefault(); const [cx, cy] = centroRel(e); zoomEn(e.deltaY < 0 ? 1.25 : 0.8, cx, cy);
}, { passive: false });
(function () {
  const img = $("#vImg"), ptrs = new Map(); let drag = null, pinch = null, moved = 0;
  img.addEventListener("pointerdown", e => {
    img.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); moved = 0;
    if (ptrs.size === 1) { drag = { sx: e.clientX, sy: e.clientY, ox: V.x, oy: V.y }; if (V.z > 1) img.classList.add("dragging"); }
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), z: V.z }; img.classList.add("dragging"); }
  });
  img.addEventListener("pointermove", e => {
    if (!ptrs.has(e.pointerId)) return;
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.size === 2 && pinch) {
      const [a, b] = [...ptrs.values()], d = Math.hypot(a.x - b.x, a.y - b.y);
      const nz = Math.min(MAXZ, Math.max(1, pinch.z * d / pinch.d)), k = nz / V.z;
      V.x *= k; V.y *= k; V.z = nz; if (V.z <= 1.001) { V.z = 1; V.x = V.y = 0; }
      aplicarV(); moved = 99; return;
    }
    if (drag && ptrs.size === 1) {
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy; moved = Math.max(moved, Math.hypot(dx, dy));
      if (V.z > 1) { V.x = drag.ox + dx; V.y = drag.oy + dy; aplicarV(); }
    }
  });
  const fin = e => {
    const eraUno = ptrs.size === 1; ptrs.delete(e.pointerId);
    if (ptrs.size < 2) pinch = null;
    img.classList.remove("dragging");
    if (e.type === "pointerup" && eraUno && moved < 6) {          // un clic: acerca o aleja
      if (V.z > 1) { V.z = 1; V.x = 0; V.y = 0; aplicarV(); }
      else { const [cx, cy] = centroRel(e); zoomEn(2.5, cx, cy); }
    }
    drag = null;
  };
  img.addEventListener("pointerup", fin); img.addEventListener("pointercancel", fin);
})();

/* ================== EVENTOS ================== */
document.querySelectorAll("[data-close]").forEach(b => b.onclick = cerrarVentanas);
document.querySelectorAll(".overlay").forEach(o => o.addEventListener("mousedown", e => { if (e.target === o) cerrarVentanas(); }));
document.addEventListener("keydown", e => {
  if ($("#viewer").classList.contains("show")) {
    if (e.key === "Escape") cerrarVisor();
    else if (e.key === "ArrowLeft" && V.list.length > 1) pasoVisor(-1);
    else if (e.key === "ArrowRight" && V.list.length > 1) pasoVisor(1);
    else if (e.key === "+" || e.key === "=") zoomEn(1.4, 0, 0);
    else if (e.key === "-") zoomEn(1 / 1.4, 0, 0);
    else if (e.key === "0") { V.z = 1; V.x = 0; V.y = 0; aplicarV(); }
    return;
  }
  if (e.key === "Escape") cerrarVentanas();
});
document.addEventListener("click", e => {
  const dl = e.target.closest("[data-del]"); if (dl) { descartar(semActual().entregas[+dl.dataset.del]); return; }
  const v = e.target.closest("[data-ver]"); if (v) { abrirVisor(semActual().entregas[+v.dataset.ver]); return; }
  const d = e.target.closest("[data-desc]"); if (d) { const it = semActual().entregas[+d.dataset.desc]; descargar(it.url, it.nombre.split("/").pop()); return; }
  const cc = e.target.closest("[data-course]");
  if (cc) { selectCourse(cc.dataset.course); setTimeout(() => $("#units").scrollIntoView({ behavior: "smooth", block: "start" }), 50); return; }
  const w = e.target.closest("[data-c][data-s]"); if (w) abrirSemana(w.dataset.c, +w.dataset.s);
});
$("#units").addEventListener("mousemove", e => {      // efecto 3D en las tarjetas
  const w = e.target.closest(".week"); if (!w || matchMedia("(hover:none)").matches) return;
  const r = w.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
  w.style.setProperty("--ry", (x * 10) + "deg"); w.style.setProperty("--rx", (-y * 10) + "deg");
});
$("#units").addEventListener("mouseout", e => { const w = e.target.closest(".week"); if (w) { w.style.setProperty("--rx", "0deg"); w.style.setProperty("--ry", "0deg"); } });
window.addEventListener("scroll", () => $("#nav").classList.toggle("solid", scrollY > 40), { passive: true });

/* ================== EFECTOS ================== */
function countTo(el, n) {
  const from = +el.dataset.cur || 0; el.dataset.cur = n;
  if (from === n && el.textContent == n) return;
  const t0 = performance.now(), dur = 900;
  (function f(t) { const p = Math.min(1, (t - t0) / dur); el.textContent = Math.round(from + (n - from) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(f); })(t0);
}
const io = new IntersectionObserver(es => es.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("in"); const c = en.target.querySelector("[data-count]"); if (c) countTo(c, +c.dataset.count); io.unobserve(en.target); }
}), { threshold: .2 });
document.querySelectorAll(".reveal").forEach(el => { if (!el.classList.contains("in")) io.observe(el); });

(function () {   // máquina de escribir
  const frases = ["Estudiante de la " + CONFIG.universidad, "Algoritmo y Estructura de Datos", "Desarrollo de Aplicaciones", "Programando mi futuro 🚀"];
  let i = 0, j = 0, del = false; const el = $("#typed");
  (function tick() {
    const f = frases[i]; el.textContent = f.slice(0, j);
    if (!del && j < f.length) { j++; setTimeout(tick, 60); }
    else if (!del) { del = true; setTimeout(tick, 1600); }
    else if (j > 0) { j--; setTimeout(tick, 28); }
    else { del = false; i = (i + 1) % frases.length; setTimeout(tick, 300); }
  })();
})();

(function () {   // partículas de fondo
  const cv = $("#bg"), cx = cv.getContext("2d"); let W, H, P = [], mouse = { x: -999, y: -999 };
  function size() { W = cv.width = cv.offsetWidth; H = cv.height = cv.offsetHeight; P = Array.from({ length: Math.min(70, Math.floor(W / 16)) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5, r: Math.random() * 2 + 1 })); }
  addEventListener("resize", size); size();
  cv.parentElement.addEventListener("mousemove", e => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  (function draw() {
    cx.clearRect(0, 0, W, H);
    P.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1;
      cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fillStyle = "rgba(255,255,255,.75)"; cx.fill();
      for (let k = i + 1; k < P.length; k++) { const q = P[k], d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 120) { cx.strokeStyle = `rgba(120,220,255,${.35 * (1 - d / 120)})`; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(q.x, q.y); cx.stroke(); } }
      const dm = Math.hypot(p.x - mouse.x, p.y - mouse.y); if (dm < 150) { cx.strokeStyle = `rgba(255,200,61,${.6 * (1 - dm / 150)})`; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(mouse.x, mouse.y); cx.stroke(); }
    });
    requestAnimationFrame(draw);
  })();
})();

function confetti() {
  const cv = $("#confetti"), cx = cv.getContext("2d"); cv.width = innerWidth; cv.height = innerHeight;
  const cols = ["#27d3ff", "#7b5cff", "#ff5fa2", "#ffc83d", "#2de2a6"];
  const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight / 3, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 3, s: Math.random() * 8 + 4, c: cols[Math.random() * 5 | 0], r: Math.random() * 6, vr: Math.random() * .4 - .2 }));
  let f = 0; (function d() { cx.clearRect(0, 0, cv.width, cv.height); ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += p.vr; cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c; cx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); cx.restore(); }); if (++f < 150) requestAnimationFrame(d); else cx.clearRect(0, 0, cv.width, cv.height); })();
}

/* ================== INICIO ================== */
(async () => {
  $("#heroNombre").textContent = CONFIG.nombreEstudiante;
  $("#heroCodigo").textContent = CONFIG.codigoEstudiante;
  applyRole(); renderAll();
  const ok = await cargarEntregasPublicadas(datos);
  if (!ok) $("#estado-publicacion").textContent = "No se pudieron leer las entregas desde GitHub. Recarga la página en unos minutos.";
  renderAll();
})();
