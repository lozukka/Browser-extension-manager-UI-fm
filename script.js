//------EXTENSIONS LIST----------
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
//------EXTENSIONS FILTER----------
const allBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");
const inactiveBtn = document.getElementById("inactive-btn");

allBtn.addEventListener("click", (event) => {
  emptyExtensionList();
  getExtensions();
});
activeBtn.addEventListener("click", (event) => {
  emptyExtensionList();
  extensions.forEach((extension) => {
    const { logo, name, description, isActive } = extension;
    if (isActive === true) {
      renderExtension(logo, name, description, isActive);
    }
  });
});
inactiveBtn.addEventListener("click", (event) => {
  emptyExtensionList();
  extensions.forEach((extension) => {
    const { logo, name, description, isActive } = extension;
    if (isActive === false) {
      renderExtension(logo, name, description, isActive);
    }
  });
});

function emptyExtensionList() {
  extensionList.innerHTML = "";
}
//--------THEME SWITCHER-----------
/**
 * Utility function to calculate the current theme setting.
 * Look for a local storage value.
 * Fall back to system setting.
 * Fall back to light mode.
 */
function calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
}) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

/**
 * Utility function to update the button text and aria-label.
 */
function updateButton({ buttonEl, isDark }) {
  const newCta = isDark
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 22 22"><g clip-path="url(#a)"><path stroke="#FBFDFE" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.98" d="M11 1.833v1.834m0 14.666v1.834M3.667 11H1.833m3.955-5.212L4.492 4.492m11.72 1.296 1.297-1.296M5.788 16.215l-1.296 1.296m11.72-1.296 1.297 1.296M20.167 11h-1.834m-2.75 0a4.583 4.583 0 1 1-9.167 0 4.583 4.583 0 0 1 9.167 0Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h22v22H0z"/></clipPath></defs></svg>`
    : `<svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          viewBox="0 0 22 22"
        >
          <g clip-path="url(#a)">
            <path
              stroke="#091540"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.98"
              d="M20.125 11.877A7.333 7.333 0 1 1 10.124 1.875a9.168 9.168 0 1 0 10.001 10.002Z"
            />
          </g>
          <defs>
            <clipPath id="a"><path fill="#fff" d="M0 0h22v22H0z" /></clipPath>
          </defs>
        </svg>`;
  const ariaLabel = isDark
    ? "Sun icon, switch to light theme"
    : "Moon icon, switch to dark theme";

  buttonEl.setAttribute("aria-label", ariaLabel);
  buttonEl.innerHTML = newCta;
}

/**
 * Utility function to update the theme setting on the html tag
 */
function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

/**
 * On page load:
 */

/**
 * 1. Grab what we need from the DOM and system settings on page load
 */
const button = document.querySelector("[data-theme-toggle]");
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");

/**
 * 2. Work out the current site settings
 */
let currentThemeSetting = calculateSettingAsThemeString({
  localStorageTheme,
  systemSettingDark,
});

/**
 * 3. Update the theme setting and button text accoridng to current settings
 */
updateButton({ buttonEl: button, isDark: currentThemeSetting === "dark" });
updateThemeOnHtmlEl({ theme: currentThemeSetting });

/**
 * 4. Add an event listener to toggle the theme
 */
button.addEventListener("click", (event) => {
  const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

  localStorage.setItem("theme", newTheme);
  updateButton({ buttonEl: button, isDark: newTheme === "dark" });
  updateThemeOnHtmlEl({ theme: newTheme });

  currentThemeSetting = newTheme;
});
