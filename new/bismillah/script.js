const VEHICLE_TYPES = [
    { key: 'mobil', label: 'Mobil / SUV / MPV', safe: 2, heavy: 3 },
    { key: 'bus', label: 'Bus / Minibus', safe: 10, heavy: 12 },
    { key: 'truk-kecil', label: 'Truk Kecil', safe: 5, heavy: 8 },
    { key: 'truk-sedang', label: 'Truk Sedang', safe: 10, heavy: 15 },
    { key: 'truk-besar', label: 'Truk Besar', safe: 20, heavy: 30 },
    { key: 'trailer', label: 'Trailer', safe: 25, heavy: 35 }
];
const DEFAULT_LOCATION = { lat: -6.2088, lon: 106.8456, name: 'Jakarta' };
const OSRM_BASE = 'https://router.project-osrm.org';

const cityDatabase = [
    { name: 'jakarta', displayName: 'Jakarta', lat: -6.2088, lon: 106.8456 },
    { name: 'bandung', displayName: 'Bandung', lat: -6.9147, lon: 107.6098 },
    { name: 'surabaya', displayName: 'Surabaya', lat: -7.2504, lon: 112.7688 },
    { name: 'semarang', displayName: 'Semarang', lat: -6.9667, lon: 110.4167 },
    { name: 'medan', displayName: 'Medan', lat: 3.5952, lon: 98.6722 },
    { name: 'makassar', displayName: 'Makassar', lat: -5.1477, lon: 119.4327 },
    { name: 'denpasar', displayName: 'Denpasar', lat: -8.6500, lon: 115.2167 },
    { name: 'palembang', displayName: 'Palembang', lat: -2.9761, lon: 104.7754 },
    { name: 'yogyakarta', displayName: 'Yogyakarta', lat: -7.7956, lon: 110.3695 },
    { name: 'balikpapan', displayName: 'Balikpapan', lat: 1.2654, lon: 116.8315 },
    { name: 'banjarmasin', displayName: 'Banjarmasin', lat: -3.3233, lon: 114.5818 },
    { name: 'pontianak', displayName: 'Pontianak', lat: -0.0260, lon: 109.3425 },
    { name: 'manado', displayName: 'Manado', lat: 1.4747, lon: 124.8423 },
    { name: 'padang', displayName: 'Padang', lat: -0.9471, lon: 100.4170 },
    { name: 'jambi', displayName: 'Jambi', lat: -1.6100, lon: 103.6136 },
    { name: 'pekanbaru', displayName: 'Pekanbaru', lat: 0.5076, lon: 101.4478 },
    { name: 'malang', displayName: 'Malang', lat: -7.9828, lon: 112.6326 },
    { name: 'bogor', displayName: 'Bogor', lat: -6.5976, lon: 106.7965 },
    { name: 'solo', displayName: 'Solo', lat: -7.5684, lon: 110.8241 },
    { name: 'batam', displayName: 'Batam', lat: 1.1167, lon: 104.1414 },
    { name: 'tangerang', displayName: 'Tangerang', lat: -6.1783, lon: 106.6318 },
    { name: 'bekasi', displayName: 'Bekasi', lat: -6.2341, lon: 107.0018 },
    { name: 'depok', displayName: 'Depok', lat: -6.3981, lon: 106.7944 },
    { name: 'cirebon', displayName: 'Cirebon', lat: -6.7320, lon: 108.5526 },
    { name: 'tasikmalaya', displayName: 'Tasikmalaya', lat: -7.3270, lon: 108.2140 },
    { name: 'sukabumi', displayName: 'Sukabumi', lat: -6.9280, lon: 106.9270 },
    { name: 'garut', displayName: 'Garut', lat: -7.2200, lon: 107.9167 },
    { name: 'kudus', displayName: 'Kudus', lat: -6.8080, lon: 110.8241 },
    { name: 'jepara', displayName: 'Jepara', lat: -6.5949, lon: 110.6698 },
    { name: 'rembang', displayName: 'Rembang', lat: -6.7371, lon: 111.4013 },
    { name: 'probolinggo', displayName: 'Probolinggo', lat: -7.7543, lon: 113.2032 },
    { name: 'kediri', displayName: 'Kediri', lat: -7.8294, lon: 112.0117 },
    { name: 'madiun', displayName: 'Madiun', lat: -7.6335, lon: 111.5166 },
    { name: 'tulungagung', displayName: 'Tulungagung', lat: -8.0678, lon: 111.9038 },
    { name: 'blitar', displayName: 'Blitar', lat: -8.0946, lon: 112.1442 },
    { name: 'kalianda', displayName: 'Kalianda', lat: -5.4810, lon: 105.7233 },
    { name: 'banda aceh', displayName: 'Banda Aceh', lat: 5.5500, lon: 95.3200 },
    { name: 'lhokseumawe', displayName: 'Lhokseumawe', lat: 5.1913, lon: 97.1419 },
    { name: 'meulaboh', displayName: 'Meulaboh', lat: 4.1442, lon: 96.1241 },
    { name: 'kupang', displayName: 'Kupang', lat: -10.1771, lon: 123.5815 },
    { name: 'jayapura', displayName: 'Jayapura', lat: -2.5339, lon: 140.7181 },
    { name: 'ambon', displayName: 'Ambon', lat: -3.6951, lon: 128.1932 },
    { name: 'kendari', displayName: 'Kendari', lat: -3.9792, lon: 122.5120 },
    { name: 'palu', displayName: 'Palu', lat: -0.8956, lon: 119.8705 },
    { name: 'gorontalo', displayName: 'Gorontalo', lat: 0.5400, lon: 123.0597 },
    { name: 'ternate', displayName: 'Ternate', lat: 0.7996, lon: 127.3770 },
    { name: 'manokwari', displayName: 'Manokwari', lat: -0.8610, lon: 134.0624 },
    { name: 'samarinda', displayName: 'Samarinda', lat: -0.5025, lon: 117.1536 },
    { name: 'palopo', displayName: 'Palopo', lat: -3.0026, lon: 120.1989 },
    { name: 'martapura', displayName: 'Martapura', lat: -3.3748, lon: 114.8341 },
    { name: 'bitung', displayName: 'Bitung', lat: 1.4475, lon: 125.1926 },
    { name: 'tomohon', displayName: 'Tomohon', lat: 1.3187, lon: 124.9114 },
    { name: 'salatiga', displayName: 'Salatiga', lat: -7.3405, lon: 110.4988 },
    { name: 'magelang', displayName: 'Magelang', lat: -7.4728, lon: 110.2157 },
    { name: 'purwokerto', displayName: 'Purwokerto', lat: -7.4314, lon: 109.2469 },
    { name: 'cimahi', displayName: 'Cimahi', lat: -6.8990, lon: 107.5423 },
    { name: 'serang', displayName: 'Serang', lat: -6.1200, lon: 106.1500 },
    { name: 'pangkalan bun', displayName: 'Pangkalan Bun', lat: -2.7056, lon: 111.6658 },
    { name: 'tanjung pinang', displayName: 'Tanjung Pinang', lat: 0.9120, lon: 104.4536 },
    { name: 'pangkal pinang', displayName: 'Pangkal Pinang', lat: 2.1253, lon: 106.1204 }
];

const cityNames = [
    'Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Semarang', 'Medan', 'Makassar', 'Denpasar', 'Palembang',
    'Balikpapan', 'Banjarmasin', 'Pontianak', 'Manado', 'Padang', 'Jambi', 'Pekanbaru', 'Malang', 'Bogor',
    'Solo', 'Batam', 'Tangerang', 'Bekasi', 'Depok', 'Cirebon', 'Tasikmalaya', 'Sukabumi', 'Garut', 'Kudus',
    'Jepara', 'Rembang', 'Probolinggo', 'Kediri', 'Madiun', 'Tulungagung', 'Blitar', 'Kalianda', 'Banda Aceh',
    'Lhokseumawe', 'Meulaboh', 'Kupang', 'Jayapura', 'Ambon', 'Kendari', 'Palu', 'Gorontalo', 'Ternate',
    'Manokwari', 'Samarinda', 'Palopo', 'Martapura', 'Bitung', 'Tomohon', 'Salatiga', 'Magelang', 'Purwokerto',
    'Cimahi', 'Serang', 'Pangkalan Bun', 'Tanjung Pinang', 'Pangkal Pinang', 'Padang Sidempuan', 'Batu',
    'Lumajang', 'Banyuwangi', 'Situbondo', 'Jember', 'Rabad', 'Banyumas', 'Cilacap', 'Purworejo',
    'Kebumen', 'Banjarnegara', 'Purbalingga', 'Bojonegoro', 'Grobogan', 'Ngawi', 'Pati', 'Pekalongan', 'Batang',
    'Kendal', 'Demak', 'Blora', 'Temanggung', 'Wonosobo', 'Boyolali', 'Karanganyar', 'Klaten', 'Sragen',
    'Karangasem', 'Buleleng', 'Tabanan', 'Jembrana', 'Bangli', 'Gianyar', 'Badung', 'Denpasar',
    'Mataram', 'Bima', 'Sumba', 'Flores', 'Raja Ampat', 'Sorong', 'Biak', 'Timika', 'Merauke', 'Manokwari',
    'Sorong', 'Jayapura', 'Sentani', 'Kaimana', 'Nabire', 'Timika', 'Sorong', 'Agats', 'Tual', 'Ambon',
    'Ternate', 'Tidore', 'Banda', 'Kupang', 'Waingapu', 'Ende', 'Maumere', 'Lhokseumawe', 'Langsa', 'Banda Aceh',
    'Meulaboh', 'Takengon', 'Solok', 'Bukittinggi', 'Payakumbuh', 'Padang Panjang', 'Sawahlunto', 'Painan',
    'Padang Pariaman', 'Batusangkar', 'Bengkulu', 'Curup', 'Lubuk Linggau', 'Lahat', 'Prabumulih', 'Pagar Alam',
    'Muara Enim', 'Tanjung Enim', 'Palembang', 'Lematang', 'Prabumulih', 'Baturaja', 'Pangkal Pinang',
    'Tanjunguban', 'Sungailiat', 'Belitung', 'Tanjung Pandan', 'Ranai', 'Selat Panjang', 'Tanjung Pinang',
    'Bintan', 'Karimun', 'Tanjung Uban', 'Sungai Liat', 'Toboali', 'Pekanbaru', 'Dumai', 'Rengat', 'Bengkalis',
    'Siak', 'Tembilahan', 'Tanjungpinang', 'Batam', 'Bintan', 'Tanjung Balai Karimun', 'Tanjung Pinang',
    'Natuna', 'Anambas', 'Tarempa', 'Sabang', 'Banda Aceh', 'Lhokseumawe', 'Langsa', 'Meulaboh', 'Sigli',
    'Takengon', 'Bireuen', 'Lhokseumawe', 'Kutacane', 'Solok', 'Bukittinggi', 'Padang', 'Padang Panjang',
    'Payakumbuh', 'Sawahlunto', 'Painan', 'Pariaman', 'Lubuk Basung', 'Bukittinggi', 'Batusangkar',
    'Muko-Muko', 'Bengkulu', 'Curup', 'Rejang Lebong', 'Bengkulu Selatan', 'Bengkulu Utara', 'Seluma',
    'Baso', 'Padang Sidempuan', 'Parapat', 'Sipirok', 'Binjai', 'Stabat', 'Pematang Siantar', 'Tebing Tinggi',
    'Tanjung Balai', 'Rantau Prapat', 'Panyabungan', 'Palas', 'Gunungsitoli'
];

let map;
let userMarker;
let destinationMarker;
let routeLayer;
let userLocation = null;
let destinationLocation = null;
let selectingOnMap = false;
let vehicleList = JSON.parse(localStorage.getItem('vehicleList')) || [];

const destinationInput = document.getElementById('destinationInput');
const destinationSuggestions = document.getElementById('destinationSuggestions');
const chooseOnMapBtn = document.getElementById('chooseOnMapBtn');
const routeSummary = document.getElementById('routeSummary');
const routeInstructions = document.getElementById('routeInstructions');
const instructionsList = document.getElementById('instructionsList');
const toggleInstructionsBtn = document.getElementById('toggleInstructionsBtn');

function initApp() {
    initMap();
    initGeolocation();
    initDestinationSearch();
    setupFormListener();
    setupVehicleTypeInfo();
    setupClearButton();
    setupToggleInstructions();
    loadVehicleList();
}

document.addEventListener('DOMContentLoaded', initApp);

function initMap() {
    map = L.map('map').setView([DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    map.on('click', handleMapClick);
}

function initGeolocation() {
    if (!navigator.geolocation) {
        updateGeoText('Browser tidak mendukung Geolocation.', null);
        setUserLocation(DEFAULT_LOCATION, null);
        return;
    }

    updateGeoText('Mencari lokasi...', null);
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude, accuracy } = position.coords;
            setUserLocation({ lat: latitude, lon: longitude, name: 'Lokasi Saya' }, accuracy);
            showAlert('Lokasi berhasil ditemukan. Menggunakan GPS device.', 'success');
        },
        () => {
            updateGeoText('Izin lokasi ditolak. Menggunakan Jakarta sebagai fallback.', null);
            setUserLocation(DEFAULT_LOCATION, null);
            showAlert('Izin lokasi tidak diberikan. Lokasi di-set ke Jakarta.', 'warning');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
}

function setUserLocation(location, accuracy) {
    userLocation = location;
    if (userMarker) {
        userMarker.remove();
    }

    userMarker = L.circleMarker([location.lat, location.lon], {
        radius: 10,
        color: '#1d4ed8',
        fillColor: '#3b82f6',
        fillOpacity: 0.9,
        weight: 3
    }).addTo(map).bindPopup('<strong>Lokasi Saya</strong>');

    map.setView([location.lat, location.lon], 13);
    updateGeoText('Lokasi aktif.', accuracy);
}

function updateGeoText(status, accuracy) {
    document.getElementById('currentLocationText').textContent = userLocation
        ? `${userLocation.name} (${userLocation.lat.toFixed(4)}, ${userLocation.lon.toFixed(4)})`
        : 'Menunggu lokasi...';
    document.getElementById('locationAccuracyText').textContent = accuracy ? `${Math.round(accuracy)} meter` : 'Tidak tersedia';
    document.getElementById('geoStatusText').textContent = status;
}

function initDestinationSearch() {
    destinationInput.addEventListener('input', () => {
        const query = destinationInput.value.trim();
        if (!query) {
            destinationSuggestions.innerHTML = '';
            return;
        }
        const matches = cityNames
            .filter(city => city.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 12);

        if (matches.length === 0) {
            destinationSuggestions.innerHTML = '<li class="autocomplete-empty">Tidak ada hasil untuk kota ini.</li>';
            return;
        }

        destinationSuggestions.innerHTML = matches
            .map(city => `<li class="autocomplete-item" data-city="${city}">${city}</li>`)
            .join('');
    });

    destinationSuggestions.addEventListener('click', event => {
        const item = event.target.closest('.autocomplete-item');
        if (!item) return;
        const city = item.dataset.city;
        destinationInput.value = city;
        destinationSuggestions.innerHTML = '';
        selectDestination(city);
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('#destinationInput') && !event.target.closest('#destinationSuggestions')) {
            destinationSuggestions.innerHTML = '';
        }
    });

    chooseOnMapBtn.addEventListener('click', () => {
        selectingOnMap = true;
        chooseOnMapBtn.textContent = 'Klik di Peta...';
        document.getElementById('mapHint').textContent = 'Klik di peta untuk memilih destinasi. Klik lagi untuk membatalkan.';
    });
}

function selectDestination(cityName) {
    const local = lookupLocalCity(cityName);
    if (local) {
        destinationLocation = {
            name: local.displayName,
            query: cityName,
            lat: local.lat,
            lon: local.lon
        };
        setDestinationMarker(destinationLocation);
        document.getElementById('mapHint').textContent = `Tujuan diisi: ${local.displayName}`;
        return;
    }

    destinationLocation = { name: cityName, query: cityName };
    removeDestinationMarker();
    document.getElementById('mapHint').textContent = `Tujuan diisi: ${cityName} (koordinat akan dicari saat submit).`;
}

function handleMapClick(event) {
    if (!selectingOnMap) return;

    const { lat, lng } = event.latlng;
    selectingOnMap = false;
    chooseOnMapBtn.textContent = 'Pilih di Map';
    document.getElementById('mapHint').textContent = 'Destinasi dipilih dari peta.';

    const confirmed = confirm(`Gunakan lokasi ini sebagai destinasi?\nLat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`);
    if (!confirmed) {
        document.getElementById('mapHint').textContent = 'Pemilihan destinasi dibatalkan.';
        return;
    }

    destinationLocation = {
        name: `Koordinat ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        query: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        lat,
        lon: lng
    };
    destinationInput.value = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    setDestinationMarker(destinationLocation);
}

function setDestinationMarker(location) {
    if (destinationMarker) {
        destinationMarker.remove();
    }

    destinationMarker = L.marker([location.lat, location.lon], {
        icon: L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMjYzN2ZmIiBkPSJNMTIgMEM3LjAzIDAgMyA0LjAzIDMgOWMwIDUuMjUgOSAxMyA5IDEzczAtNy43NSA5LTEzYzAtNC45Ny00LjAzLTktOS05em0wIDEyYy0xLjY2IDAtMy0xLjM0LTMtM3MxLjM0LTMgMy0zIDMgMS4zNCAzIDMtMS4zNCAzLTN6Ii8+PC9zdmc+',
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        })
    }).addTo(map).bindPopup(`<strong>Destinasi</strong><br>${location.name}`).openPopup();
}

function removeDestinationMarker() {
    if (destinationMarker) {
        destinationMarker.remove();
        destinationMarker = null;
    }
}

function lookupLocalCity(query) {
    const normalized = query.trim().toLowerCase();
    return cityDatabase.find(city => city.name === normalized || city.displayName.toLowerCase() === normalized) || null;
}

function getVehicleType(typeKey) {
    return VEHICLE_TYPES.find(type => type.key === typeKey) || null;
}

function setupVehicleTypeInfo() {
    const vehicleTypeSelect = document.getElementById('jenisKendaraan');
    const thresholdInfo = document.getElementById('weightThresholdInfo');

    function updateThresholdText() {
        const vehicleType = getVehicleType(vehicleTypeSelect.value);
        if (!vehicleType) {
            thresholdInfo.textContent = 'Pilih jenis kendaraan untuk melihat batas berat aman dan overload.';
            return;
        }
        thresholdInfo.textContent = `Batas aman: hingga ${vehicleType.safe} ton. Batas overload: di atas ${vehicleType.heavy} ton.`;
    }

    vehicleTypeSelect.addEventListener('change', updateThresholdText);
    updateThresholdText();
}

function classifyWeight(typeKey, weight) {
    const vehicleType = getVehicleType(typeKey);
    if (!vehicleType) {
        return {
            status: 'unknown',
            category: 'Tidak diketahui',
            message: 'Jenis kendaraan tidak dikenali.',
            isOverload: false,
            maxSafe: null,
            maxHeavy: null,
            vehicleTypeLabel: 'Tidak diketahui'
        };
    }

    if (weight <= vehicleType.safe) {
        return {
            status: 'aman',
            category: 'Aman',
            message: `Berat kendaraan ${weight.toFixed(1)} ton masih di dalam batas aman untuk ${vehicleType.label}.`, 
            isOverload: false,
            maxSafe: vehicleType.safe,
            maxHeavy: vehicleType.heavy,
            vehicleTypeLabel: vehicleType.label
        };
    }

    if (weight <= vehicleType.heavy) {
        return {
            status: 'berat',
            category: 'Berat',
            message: `Berat kendaraan ${weight.toFixed(1)} ton berada di atas batas aman tetapi masih di bawah batas overload untuk ${vehicleType.label}.`, 
            isOverload: false,
            maxSafe: vehicleType.safe,
            maxHeavy: vehicleType.heavy,
            vehicleTypeLabel: vehicleType.label
        };
    }

    return {
        status: 'overload',
        category: 'OVERLOAD',
        message: `Berat kendaraan ${weight.toFixed(1)} ton melebihi batas overload untuk ${vehicleType.label} (${vehicleType.heavy} ton).`, 
        isOverload: true,
        maxSafe: vehicleType.safe,
        maxHeavy: vehicleType.heavy,
        vehicleTypeLabel: vehicleType.label
    };
}

async function findDestinationCoordinates(query) {
    if (isCoordinateInput(query)) {
        const { lat, lon } = parseLatLon(query);
        return { name: `Koordinat ${lat.toFixed(4)}, ${lon.toFixed(4)}`, query, lat, lon };
    }

    const localCity = lookupLocalCity(query);
    if (localCity) {
        return { name: localCity.displayName, query, lat: localCity.lat, lon: localCity.lon };
    }

    return await geocodeCityName(query);
}

function isCoordinateInput(value) {
    return /^-?\d+(?:\.\d+)?\s*,\s*-?\d+(?:\.\d+)?$/.test(value.trim());
}

function parseLatLon(value) {
    const [lat, lon] = value.split(',').map(item => parseFloat(item.trim()));
    return { lat, lon };
}

async function geocodeCityName(query) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ', Indonesia')}&limit=1`;
    try {
        const response = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            return null;
        }

        const location = data[0];
        return {
            name: location.display_name,
            query,
            lat: parseFloat(location.lat),
            lon: parseFloat(location.lon)
        };
    } catch (error) {
        return null;
    }
}

function setupFormListener() {
    const form = document.getElementById('truckForm');
    form.addEventListener('submit', async event => {
        event.preventDefault();
        await handleFormSubmit();
    });
}

function setupClearButton() {
    document.getElementById('btnClearAll').addEventListener('click', function () {
        if (vehicleList.length === 0) {
            alert('Tidak ada data untuk dihapus!');
            return;
        }
        if (confirm('Apakah Anda yakin ingin menghapus semua data kendaraan?')) {
            vehicleList = [];
            localStorage.removeItem('vehicleList');
            loadVehicleList();
            showAlert('Semua data kendaraan telah dihapus.', 'success');
        }
    });
}

function setupToggleInstructions() {
    toggleInstructionsBtn.addEventListener('click', () => {
        routeInstructions.classList.toggle('hidden');
        toggleInstructionsBtn.textContent = routeInstructions.classList.contains('hidden') ? 'Tampilkan' : 'Sembunyikan';
    });
}

async function handleFormSubmit() {
    const platNomor = document.getElementById('platNomor').value.trim();
    const jenisKendaraan = document.getElementById('jenisKendaraan').value;
    const beratKendaraan = parseFloat(document.getElementById('beratKendaraan').value);
    const destinationQuery = destinationInput.value.trim();

    if (!platNomor || !jenisKendaraan || !beratKendaraan || !destinationQuery) {
        showAlert('Plat nomor, jenis kendaraan, berat, dan tujuan harus diisi.', 'warning');
        return;
    }

    if (beratKendaraan <= 0) {
        showAlert('Berat kendaraan harus lebih besar dari 0.', 'warning');
        return;
    }

    const vehicleType = getVehicleType(jenisKendaraan);
    if (!vehicleType) {
        showAlert('Jenis kendaraan tidak valid. Pilih jenis kendaraan dari daftar.', 'warning');
        return;
    }

    const weightInfo = classifyWeight(jenisKendaraan, beratKendaraan);

    const destination = await findDestinationCoordinates(destinationQuery);
    if (!destination || !destination.lat || !destination.lon) {
        showAlert('Tujuan tidak ditemukan. Silakan gunakan nama kota Indonesia yang valid.', 'warning');
        return;
    }

    destinationLocation = destination;
    setDestinationMarker(destinationLocation);

    const route = await fetchRoute(userLocation, destinationLocation);
    if (!route) {
        showAlert('Tidak dapat menghitung rute saat ini. Silakan coba lagi.', 'warning');
        return;
    }

    showRoute(route, destinationLocation, weightInfo);

    const vehicle = {
        id: Date.now(),
        platNomor: platNomor.toUpperCase(),
        jenisKendaraan: vehicleType.label,
        jenisKey: jenisKendaraan,
        beratKendaraan,
        kategoriBerat: weightInfo.category,
        tujuan: destinationLocation.name,
        routeSummary: `${route.distance.toFixed(1)} km, ${route.duration.toFixed(0)} menit`,
        status: weightInfo.status === 'overload' ? 'overload' : 'safe',
        timestamp: new Date().toLocaleString('id-ID')
    };

    vehicleList.unshift(vehicle);
    localStorage.setItem('vehicleList', JSON.stringify(vehicleList));
    loadVehicleList();

    if (weightInfo.isOverload) {
        showAlert(`⚠️ PERINGATAN! ${weightInfo.message}`, 'warning');
    } else {
        showAlert(`✅ ${weightInfo.message}`, 'success');
    }
}

function showAlert(message, type) {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.innerHTML = '';
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alertContainer.appendChild(alert);
    setTimeout(() => {
        alert.remove();
    }, 6000);
}

async function fetchRoute(origin, destination) {
    if (!origin || !destination) {
        return null;
    }

    const url = `${OSRM_BASE}/route/v1/driving/${origin.lon},${origin.lat};${destination.lon},${destination.lat}?overview=full&steps=true&geometries=geojson`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        if (!data.routes || data.routes.length === 0) {
            return null;
        }

        const route = data.routes[0];
        return {
            geometry: route.geometry,
            distance: route.distance / 1000,
            duration: route.duration / 60,
            steps: route.legs[0].steps
        };
    } catch (error) {
        return null;
    }
}

function showRoute(route, destination, weightInfo) {
    routeSummary.classList.remove('hidden');
    routeInstructions.classList.remove('hidden');
    toggleInstructionsBtn.textContent = 'Sembunyikan';

    if (routeLayer) {
        routeLayer.remove();
    }

    routeLayer = L.geoJSON(route.geometry, {
        style: {
            color: '#16a34a',
            weight: 6,
            opacity: 0.9
        }
    }).addTo(map);

    const bounds = routeLayer.getBounds();
    map.fitBounds(bounds.pad(0.16));

    routeSummary.innerHTML = `
        <div>
            <strong>Mulai dari</strong>
            <div>${userLocation.name}</div>
        </div>
        <div>
            <strong>Tujuan</strong>
            <div>${destination.name}</div>
        </div>
        <div>
            <strong>Jenis Kendaraan</strong>
            <div>${weightInfo.vehicleTypeLabel || 'Tidak diketahui'}</div>
        </div>
        <div>
            <strong>Batas aman</strong>
            <div>${weightInfo.maxSafe ? `${weightInfo.maxSafe.toFixed(1)} ton` : 'N/A'}</div>
        </div>
        <div>
            <strong>Batas overload</strong>
            <div>${weightInfo.maxHeavy ? `${weightInfo.maxHeavy.toFixed(1)} ton` : 'N/A'}</div>
        </div>
        <div>
            <strong>Jarak</strong>
            <div>${route.distance.toFixed(1)} km</div>
        </div>
        <div>
            <strong>Perkiraan waktu</strong>
            <div>${route.duration.toFixed(0)} menit</div>
        </div>
        <div>
            <strong>Kategori berat</strong>
            <div>${weightInfo.category}</div>
        </div>
        <div>
            <strong>Status muatan</strong>
            <div>${weightInfo.isOverload ? 'OVERLOAD - Hati-hati' : 'AMAN'}</div>
        </div>
    `;

    instructionsList.innerHTML = route.steps
        .map((step, index) => {
            const instruction = formatInstruction(step);
            return `
                <div class="instruction-step">
                    <p><strong>${index + 1}. ${instruction}</strong></p>
                    <small>${(step.distance / 1000).toFixed(2)} km • ${(step.duration / 60).toFixed(0)} menit</small>
                </div>
            `;
        })
        .join('');
}

function formatInstruction(step) {
    const type = step.maneuver?.type || 'Lanjut';
    const modifier = step.maneuver?.modifier ? ` ${step.maneuver.modifier}` : '';
    const road = step.name ? ` ke ${step.name}` : '';
    return `${type}${modifier}${road}`;
}

function loadVehicleList() {
    const container = document.getElementById('dashboardContainer');
    if (vehicleList.length === 0) {
        container.innerHTML = '<p class="empty-message">Belum ada data kendaraan. Silakan input data di atas.</p>';
        return;
    }

    container.innerHTML = '';
    vehicleList.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = `vehicle-card ${vehicle.status}`;
        const statusText = vehicle.status === 'overload' ? 'OVERLOAD ⚠️' : 'AMAN ✅';
        const statusClass = vehicle.status === 'overload' ? 'status-overload' : 'status-safe';

        card.innerHTML = `
            <div class="vehicle-card-header">
                <span class="vehicle-card-plat">${vehicle.platNomor}</span>
                <span class="vehicle-card-status ${statusClass}">${statusText}</span>
            </div>
            <div class="vehicle-card-info"><strong>Jenis:</strong> ${vehicle.jenisKendaraan}</div>
            <div class="vehicle-card-info"><strong>Berat:</strong> ${vehicle.beratKendaraan} ton</div>
            <div class="vehicle-card-info"><strong>Kategori:</strong> ${vehicle.kategoriBerat}</div>
            <div class="vehicle-card-info"><strong>Tujuan:</strong> ${vehicle.tujuan}</div>
            <div class="vehicle-card-info"><strong>Rute:</strong> ${vehicle.routeSummary}</div>
            <div class="vehicle-card-info"><strong>Waktu:</strong> ${vehicle.timestamp}</div>
            <div class="vehicle-card-actions">
                <button class="btn-delete" onclick="deleteVehicle(${vehicle.id})">Hapus</button>
            </div>
        `;

        container.appendChild(card);
    });
}

function deleteVehicle(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        return;
    }
    vehicleList = vehicleList.filter(item => item.id !== id);
    localStorage.setItem('vehicleList', JSON.stringify(vehicleList));
    loadVehicleList();
}
