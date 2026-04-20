import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nombre = document.getElementById("nombre");
const whatsapp = document.getElementById("whatsapp");
const catInput = document.getElementById("cat");
const prodInput = document.getElementById("prod");
const precioInput = document.getElementById("precio");
const lista = document.getElementById("lista");
const qr = document.getElementById("qr");
const link = document.getElementById("link");

let menu = {
  nombre: "",
  whatsapp: "",
  categorias: []
};

window.agregar = function () {
  const cat = catInput.value.trim();
  const prod = prodInput.value.trim();
  const precio = precioInput.value.trim();

  if (!cat || !prod || !precio) return;

  let categoria = menu.categorias.find(c => c.nombre === cat);

  if (!categoria) {
    categoria = { nombre: cat, items: [] };
    menu.categorias.push(categoria);
  }

  categoria.items.push({ nombre: prod, precio });

  render();
};

function render() {
  lista.innerHTML = "";

  menu.categorias.forEach(c => {
    c.items.forEach(i => {
      const li = document.createElement("li");
      li.innerText = `${c.nombre} - ${i.nombre} ($${i.precio})`;
      lista.appendChild(li);
    });
  });
}

window.guardar = async function () {
  menu.nombre = nombre.value.trim();
  menu.whatsapp = whatsapp.value.trim();

  if (!menu.nombre || !menu.whatsapp || menu.categorias.length === 0) {
    alert("Completá todos los datos");
    return;
  }

  const docRef = await addDoc(collection(db, "menus"), menu);

  const url = `${location.origin}/menu.html?id=${docRef.id}`;

  link.innerText = url;

  QRCode.toCanvas(qr, url, { width: 250 });
};