const map = L.map("map");
const form = document.querySelector("form");
const API_KEY = "at_8a4h2azs2UIgsp7xdGfsqbd1FY7bK";

function setLocationInfo(data) {
  const { city, country, region, timezone } = data.location;
  const locationInfo = document.querySelector(".location-info");
  locationInfo.innerHTML = `
    <div class="location-info__item">
      <h2>IP Address</h2>
      <p>${data.ip}</p>
    </div>
    <div class="location-info__item">
      <h2>Location</h2>
      <p>${city}, ${region} ${country}</p>
    </div>
    <div class="location-info__item">
      <h2>Timezone</h2>
      <p>UTC ${timezone}</p>
    </div>
    <div class="location-info__item">
      <h2>ISP</h2>
      <p>${data.isp}</p>
    </div>
  `;
  locationInfo.style.display = "flex";
}

async function setMap(ipAddress = null) {
  const data = await getData(ipAddress);
  setLocationInfo(data);

  const { lat, lng } = data.location;

  map.setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {}).addTo(
    map
  );

  const customIcon = L.icon({
    iconUrl: "/images/icon-location.svg",
    iconSize: [38, 50],
    iconAnchor: [19, 50],
    popupAnchor: [-3, -76],
  });

  L.marker([lat, lng], { icon: customIcon }).addTo(map);
}

async function getData(ipAddress = null) {
  try {
    const response = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}` +
        (ipAddress ? `&ipAddress=${ipAddress}` : "")
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await setMap();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const inputEl = document.querySelector("input");
    const ipAddress = inputEl.value.trim();
    await setMap(ipAddress);
    inputEl.value = "";
  });
});
