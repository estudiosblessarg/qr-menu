import { firebaseConfig } from "./firebase.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const nombre = document.getElementById("nombre");
const whatsapp = document.getElementById("whatsapp");
const catInput = document.getElementById("cat");
const prodInput = document.getElementById("prod");
const precioInput = document.getElementById("precio");
const lista = document.getElementById("lista");
const qr = document.getElementById("qr");
const link = document.getElementById("link");

// Estado
let menu = {
  nombre: "",
  whatsapp: "",
  categorias: []
};

// Agregar producto
window.agregar = function () {
  const cat = catInput.value.trim();
  const prod = prodInput.value.trim();
  const precio = Number(precioInput.value);

  if (!cat || !prod || !precio) {
    alert("Completá todo");
    return;
  }

  let categoria = menu.categorias.find(c => c.nombre === cat);

  if (!categoria) {
    categoria = { nombre: cat, items: [] };
    menu.categorias.push(categoria);
  }

  categoria.items.push({ nombre: prod, precio });

  render();

  prodInput.value = "";
  precioInput.value = "";
};

// Render
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

// Guardar
window.guardar = async function () {
  try {
    menu.nombre = nombre.value.trim();
    menu.whatsapp = whatsapp.value.trim();

    if (!menu.nombre || !menu.whatsapp || menu.categorias.length === 0) {
      alert("Faltan datos");
      return;
    }

    const docRef = await addDoc(collection(db, "menus"), menu);

    console.log("ID:", docRef.id);

    // 🔥 URL CORRECTA (HASH LIMPIO)
    const url = `${window.location.origin}/menu.html#${docRef.id}`;

    link.innerText = url;

    // copiar automático
    navigator.clipboard.writeText(url);

    // QR
    qr.innerHTML = "";
    const canvas = document.createElement("canvas");

    QRCode.toCanvas(canvas, url, { width: 250 }, (err) => {
      if (err) return console.error(err);
      qr.appendChild(canvas);
    });

    alert("Menú creado!");

  } catch (e) {
    console.error(e);
    alert("Error guardando");
  }
};