const form = document.getElementById("todoForm");
const tbody = document.querySelector("#todoTable tbody");
const STORAGE_KEY = "coc_items";

let items = [];
let editIndex = null;

// --- Carica dati dal localStorage all'avvio ---
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    items = JSON.parse(saved);
    renderTable();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const costo = parseFloat(document.getElementById("costo").value);
  const tempo = parseFloat(document.getElementById("tempo").value);

  if (!nome || isNaN(costo) || isNaN(tempo) || costo <= 0 || tempo <= 0) {
    alert("Per favore inserisci valori validi!");
    return;
  }

  const rapporto = costo / tempo;

  if (editIndex !== null) {
    items[editIndex] = { nome, costo, tempo, rapporto };
    editIndex = null;
  } else {
    items.push({ nome, costo, tempo, rapporto });
  }

  items.sort((a, b) => a.rapporto - b.rapporto);
  saveToLocal();
  renderTable();
  form.reset();
});

function saveToLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function renderTable() {
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${item.nome}</td>
          <td>${item.costo.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</td>
          <td>${item.tempo.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</td>
          <td class="ratio">${item.rapporto.toLocaleString("it-IT", { maximumFractionDigits: 0 })}</td>
          <td>
            <button class="btn-small btn-edit" onclick="editItem(${index})">Modifica</button>
            <button class="btn-small btn-delete" onclick="deleteItem(${index})">Rimuovi</button>
          </td>
        `;
    tbody.appendChild(row);
  });
}

function editItem(index) {
  const item = items[index];
  document.getElementById("nome").value = item.nome;
  document.getElementById("costo").value = item.costo;
  document.getElementById("tempo").value = item.tempo;
  editIndex = index;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteItem(index) {
  if (confirm("Vuoi davvero rimuovere questo elemento?")) {
    items.splice(index, 1);
    saveToLocal();
    renderTable();
  }
}
