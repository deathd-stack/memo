const list = document.getElementById("list");
const modal = document.getElementById("modal");

const addBtn = document.getElementById("addBtn");
const deleteBtn = document.getElementById("deleteBtn");
const saveBtn = document.getElementById("saveBtn");
const closeBtn = document.getElementById("closeBtn");

const flight = document.getElementById("flight");
const memo = document.getElementById("memo");
const cmptInputs = document.querySelectorAll(".cmpt input");

const photoInput = document.getElementById("photoInput");

let data = JSON.parse(localStorage.getItem("memos") || "[]");

function render() {
  list.innerHTML = "";
  data.forEach((m, i) => {
    const div = document.createElement("div");
    div.className = "memo";
    div.innerHTML = `
      <input type="checkbox" data-i="${i}">
      <strong>${m.flight}</strong><br>
      <small>${m.date} ${m.time}</small>
      <p>${m.memo}</p>
      <small>${m.cmpt.join(" | ")}</small>
      ${m.photo ? `<img src="${m.photo}" width="100%">` : ""}
    `;
    list.appendChild(div);
  });
}

addBtn.onclick = () => modal.classList.remove("hidden");
closeBtn.onclick = () => modal.classList.add("hidden");

saveBtn.onclick = () => {
  const now = new Date();
  data.unshift({
    flight: flight.value,
    memo: memo.value,
    cmpt: [...cmptInputs].map(i => i.value),
    date: now.toLocaleDateString(),
    time: now.toLocaleTimeString(),
    photo: null
  });

  localStorage.setItem("memos", JSON.stringify(data));
  modal.classList.add("hidden");

  flight.value = memo.value = "";
  cmptInputs.forEach(i => i.value = "");

  render();
};

deleteBtn.onclick = () => {
  const checks = document.querySelectorAll("input[type=checkbox]:checked");
  data = data.filter((_, i) => ![...checks].some(c => +c.dataset.i === i));
  localStorage.setItem("memos", JSON.stringify(data));
  render();
};

// 두 번 탭 → 사진 추가
let lastTap = 0;
document.body.onclick = () => {
  const now = Date.now();
  if (now - lastTap < 300) photoInput.click();
  lastTap = now;
};

photoInput.onchange = e => {
  const reader = new FileReader();
  reader.onload = () => {
    if (data[0]) {
      data[0].photo = reader.result;
      localStorage.setItem("memos", JSON.stringify(data));
      render();
    }
  };
  reader.readAsDataURL(e.target.files[0]);
};

render();