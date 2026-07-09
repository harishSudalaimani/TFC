const form = document.querySelector("#jerseyForm");
const button = document.querySelector("#submitBtn");
const message = document.querySelector("#message");
const players = document.querySelector("#players");
const count = document.querySelector("#count");

let editingId = null;

function escapeHtml(value) {
  const d = document.createElement("div");
  d.textContent = value;
  return d.innerHTML;
}

async function loadPlayers() {
  try {
    const response = await fetch("/api/players", { cache: "no-store" });
    const data = await response.json();

    if (!response.ok) throw new Error();

    count.textContent = data.players.length;

    players.innerHTML = data.players.length
      ? data.players.map(p => `
        <div class="player">
          <div class="player-name">${escapeHtml(p.name)}</div>
          <div class="player-size">${escapeHtml(p.size)}</div>
          <div class="player-number">${p.jersey_number}</div>
          <button
            class="edit-player"
            type="button"
            data-id="${p.id}"
            data-name="${escapeHtml(p.name)}"
            data-size="${escapeHtml(p.size)}"
            data-number="${p.jersey_number}"
          >
            EDIT
          </button>
        </div>
      `).join("")
      : `<p class="empty">No players yet. Be the first.</p>`;

  } catch {
    players.innerHTML = `<p class="empty">Could not load the squad.</p>`;
  }
}

players.addEventListener("click", e => {
  const editButton = e.target.closest(".edit-player");

  if (!editButton) return;

  editingId = Number(editButton.dataset.id);

  form.name.value = editButton.dataset.name;
  form.size.value = editButton.dataset.size;
  form.number.value = editButton.dataset.number;

  button.firstElementChild.textContent = "UPDATE JERSEY";

  message.textContent = "Editing jersey details";
  message.className = "message editing";

  form.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  form.name.focus();
});

form.addEventListener("submit", async e => {
  e.preventDefault();

  message.textContent = "";
  message.className = "message";

  button.disabled = true;
  button.firstElementChild.textContent = editingId
    ? "UPDATING..."
    : "SAVING...";

  const data = {
    name: form.name.value.trim(),
    size: form.size.value,
    number: Number(form.number.value)
  };

  try {
    const response = await fetch(
      editingId ? `/api/update?id=${editingId}` : "/api/register",
      {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Could not save jersey.");
    }

    const wasEditing = editingId !== null;

    editingId = null;
    form.reset();

    message.textContent = wasEditing
      ? "Jersey updated ✓"
      : "Jersey registered ✓";

    message.className = "message ok";

    await loadPlayers();

  } catch (error) {
    message.textContent = error.message;
    message.className = "message error";
  } finally {
    button.disabled = false;
    button.firstElementChild.textContent = "SUBMIT JERSEY";
  }
});

loadPlayers();