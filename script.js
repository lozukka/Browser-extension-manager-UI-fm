const extensionList = document.getElementById("extensions-list");

let extensions = [];
async function getExtensions() {
  extensions = await fetchExtensions();

  extensions.forEach((extension) => {
    const { logo, name, description, isActive } = extension;
    renderExtension(logo, name, description, isActive);
  });
}
async function fetchExtensions() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Failed to load products");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
function renderExtension(logo, name, description, isActive) {
  const extensionDiv = document.createElement("div");
  extensionDiv.className = "extension";

  // Käytetään template stringiä ja ternary-operaattoria
  extensionDiv.innerHTML = `
    <div class="extension__details">
      <img src="${logo}" alt="${name} logo" />
      <div class="extension__text">
        <h2 class="extension__name">${name}</h2>
        <p class="extension__description">${description}</p>
      </div>
    </div>
    <div class="buttons">
      <button class="remove-btn">Remove</button>
      <label class="switch">
        <input type="checkbox" ${isActive ? "checked" : ""} />
        <span class="slider round"></span>
      </label>
    </div>
  `;

  extensionList.appendChild(extensionDiv);
}

window.addEventListener("load", getExtensions);
