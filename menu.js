import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nombre = document.getElementById("nombre");
const menuDiv = document.getElementById("menu");

const id = new URLSearchParams(location.search).get("id");

let data = null;
let carrito = [];

async function cargar() {
  if (!id) return;

  const ref = doc(db, "menus", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  data = snap.data();

  nombre.innerText = data.nombre;

  data.categorias.forEach(cat => {
    const div = document.createElement("div");
    div.innerHTML = `<h2>${cat.nombre}</h2>`;

    cat.items.forEach(item => {
      const el = document.createElement("div");
      el.innerHTML = `
        <p>${item.nombre} - $${item.precio}</p>
        <button onclick="agregar('${item.nombre}', ${item.precio})">Agregar</button>
      `;
      div.appendChild(el);
    });

    menuDiv.appendChild(div);
  });
}

window.agregar = (n, p) => {
  carrito.push({ n, p });
};

window.enviar = () => {
  if (!data) return;

  let texto = "Hola, quiero pedir:%0A";
  carrito.forEach(i => texto += `- ${i.n} ($${i.p})%0A`);

  window.open(`https://wa.me/${data.whatsapp}?text=${texto}`);
};

cargar();