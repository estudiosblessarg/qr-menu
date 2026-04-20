let menu = {
  nombre: "",
  whatsapp: "",
  categorias: []
};

function agregar() {
  const cat = document.getElementById("cat").value;
  const prod = document.getElementById("prod").value;
  const precio = document.getElementById("precio").value;

  let categoria = menu.categorias.find(c => c.nombre === cat);

  if (!categoria) {
    categoria = { nombre: cat, items: [] };
    menu.categorias.push(categoria);
  }

  categoria.items.push({ nombre: prod, precio });

  renderLista();
}

function renderLista() {
  const ul = document.getElementById("lista");
  ul.innerHTML = "";

  menu.categorias.forEach(c => {
    c.items.forEach(i => {
      const li = document.createElement("li");
      li.innerText = `${c.nombre} - ${i.nombre} ($${i.precio})`;
      ul.appendChild(li);
    });
  });
}

function generar() {
  menu.nombre = document.getElementById("nombre").value;
  menu.whatsapp = document.getElementById("whatsapp").value;

  const json = JSON.stringify(menu);
  const encoded = btoa(unescape(encodeURIComponent(json)));

  const url = `${location.origin}${location.pathname.replace("index.html","")}menu.html?data=${encoded}`;

  document.getElementById("resultado").innerText = url;

  QRCode.toCanvas(document.getElementById("qr"), url);
}