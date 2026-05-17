const form = document.getElementById('truck-form');
const resultSection = document.getElementById('result');
const messageText = document.getElementById('message');
const displayPlate = document.getElementById('displayPlate');
const displayType = document.getElementById('displayType');
const displayEmpty = document.getElementById('displayEmpty');
const displayCargo = document.getElementById('displayCargo');
const displayTotal = document.getElementById('displayTotal');
const displayLimit = document.getElementById('displayLimit');
const mobileLink = document.getElementById('mobileLink');

function updateMobileLink() {
  const origin = window.location.origin;
  const path = window.location.pathname;
  if (origin && origin !== 'null') {
    const url = `${origin}${path}`;
    mobileLink.href = url;
    mobileLink.textContent = url;
  } else {
    mobileLink.textContent = 'Buka halaman ini melalui server web untuk melihat link akses HP.';
    mobileLink.removeAttribute('href');
  }
}

updateMobileLink();

const vehicleLimits = {
  car: {
    label: 'Mobil roda 4',
    maxWeight: 5000,
  },
  truck6: {
    label: 'Truk roda 6',
    maxWeight: 10000,
  },
  truckMore: {
    label: 'Truk lebih dari 6 roda',
    maxWeight: 14000,
  },
};

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const licensePlate = document.getElementById('licensePlate').value.trim();
  const vehicleType = document.getElementById('vehicleType').value;
  const emptyWeight = Number(document.getElementById('emptyWeight').value);
  const cargoWeight = Number(document.getElementById('cargoWeight').value);
  const totalWeight = emptyWeight + cargoWeight;
  const selectedVehicle = vehicleLimits[vehicleType];
  const limitWeight = selectedVehicle.maxWeight;

  displayPlate.textContent = licensePlate.toUpperCase();
  displayType.textContent = selectedVehicle.label;
  displayEmpty.textContent = emptyWeight.toLocaleString('id-ID');
  displayCargo.textContent = cargoWeight.toLocaleString('id-ID');
  displayTotal.textContent = totalWeight.toLocaleString('id-ID');
  displayLimit.textContent = limitWeight.toLocaleString('id-ID');

  if (totalWeight <= limitWeight) {
    messageText.textContent = `${selectedVehicle.label} dengan plat ${licensePlate.toUpperCase()} dinyatakan aman. Total berat masih dalam batas maksimal.`;
    messageText.style.color = '#166534';
    resultSection.style.borderColor = '#bbf7d0';
    resultSection.style.backgroundColor = '#f0fdf4';
  } else {
    const over = totalWeight - limitWeight;
    messageText.textContent = `${selectedVehicle.label} dengan plat ${licensePlate.toUpperCase()} melebihi batas sebesar ${over.toLocaleString('id-ID')} kg. Kurangi muatan atau ganti kendaraan.`;
    messageText.style.color = '#b91c1c';
    resultSection.style.borderColor = '#fecaca';
    resultSection.style.backgroundColor = '#fef2f2';
  }

  resultSection.hidden = false;
});
