const bundles = [
  { network: "MTN", plan: "Made4U", data: 1, price: 5, validity: "1 day", recommended: 1 },
  { network: "Telecel", plan: "Vodafone X", data: 2, price: 10, validity: "1 day", recommended: 2 },
  { network: "AT", plan: "BigTime Data", data: 3, price: 10, validity: "7 days", recommended: 3 },
  { network: "MTN", plan: "MashUp", data: 5, price: 20, validity: "7 days", recommended: 4 },
  { network: "Telecel", plan: "Made for Me", data: 8, price: 30, validity: "30 days", recommended: 5 },
  { network: "AT", plan: "BigTime Data", data: 10, price: 30, validity: "30 days", recommended: 6 },
  { network: "MTN", plan: "Made4U", data: 15, price: 50, validity: "30 days", recommended: 7 },
  { network: "Telecel", plan: "Vodafone X", data: 20, price: 60, validity: "30 days", recommended: 8 },
  { network: "AT", plan: "BigTime Data", data: 25, price: 70, validity: "30 days", recommended: 9 }
];

const networkStyles = {
  MTN: { label: "MTN", color: "#92630b", tint: "#fff3d4" },
  Telecel: { label: "T", color: "#a83246", tint: "#fae9ec" },
  AT: { label: "AT", color: "#316b9b", tint: "#e7f2fb" }
};

const grid = document.querySelector("#bundle-grid");
const count = document.querySelector("#results-count");
const searchInput = document.querySelector("#bundle-search");
const sortSelect = document.querySelector("#sort-select");
const dialog = document.querySelector("#bundle-dialog");
let activeNetwork = "all";

document.querySelector("#current-year").textContent = new Date().getFullYear();

function renderBundles() {
  const query = searchInput.value.trim().toLowerCase();
  const visibleBundles = bundles
    .filter((bundle) => activeNetwork === "all" || bundle.network === activeNetwork)
    .filter((bundle) => `${bundle.network} ${bundle.plan} ${bundle.data} gb`.toLowerCase().includes(query))
    .sort((a, b) => {
      switch (sortSelect.value) {
        case "price-low": return a.price - b.price || a.data - b.data;
        case "data-high": return b.data - a.data;
        case "value": return (a.price / a.data) - (b.price / b.data);
        default: return a.recommended - b.recommended;
      }
    });

  count.innerHTML = `<strong>${visibleBundles.length} bundles</strong> to compare`;
  if (visibleBundles.length === 0) {
    grid.innerHTML = '<div class="empty-state"><strong>No bundles found</strong><p>Try another search or choose a different network.</p></div>';
    return;
  }

  grid.innerHTML = visibleBundles.map((bundle) => {
    const style = networkStyles[bundle.network];
    const unitPrice = (bundle.price / bundle.data).toFixed(2);
    const badge = bundle.data / bundle.price >= 0.3 ? "Good value" : "";
    return `
      <article class="bundle-card">
        <div class="card-top">
          <div class="network">
            <span class="network-logo" style="--network-color:${style.color};--network-tint:${style.tint}" aria-hidden="true">${style.label}</span>
            <div><p class="network-name">${bundle.network}</p><p class="plan-name">${bundle.plan}</p></div>
          </div>
          ${badge ? `<span class="deal-tag">${badge}</span>` : ""}
        </div>
        <p class="data-volume">${bundle.data} GB</p>
        <p class="validity">Valid for ${bundle.validity}</p>
        <div class="card-bottom">
          <div><p class="price">GH₵${bundle.price} <small>/ bundle</small></p><p class="unit-price">GH₵${unitPrice} per GB · sample price</p></div>
          <button class="details-button" type="button" data-bundle="${bundle.network}|${bundle.plan}|${bundle.data}|${bundle.price}|${bundle.validity}">
            Details
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </article>`;
  }).join("");
}

document.querySelectorAll(".filter-chip").forEach((button) => {
  button.addEventListener("click", () => {
    activeNetwork = button.dataset.network;
    document.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", String(chip === button));
    });
    renderBundles();
  });
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  renderBundles();
});
searchInput.addEventListener("input", renderBundles);
sortSelect.addEventListener("change", renderBundles);

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-bundle]");
  if (!button) return;
  const [network, plan, data, price, validity] = button.dataset.bundle.split("|");
  document.querySelector("#dialog-title").textContent = `${data} GB · GH₵${price}`;
  document.querySelector("#dialog-subtitle").textContent = `${network} ${plan}`;
  document.querySelector("#detail-list").innerHTML = `
    <div class="detail-row"><span>Network</span><strong>${network}</strong></div>
    <div class="detail-row"><span>Data allowance</span><strong>${data} GB</strong></div>
    <div class="detail-row"><span>Validity</span><strong>${validity}</strong></div>
    <div class="detail-row"><span>Sample price</span><strong>GH₵${price}</strong></div>`;
  dialog.showModal();
});

document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

renderBundles();