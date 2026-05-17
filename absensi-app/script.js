// Initialize data from localStorage
let absensiData = JSON.parse(localStorage.getItem('absensiData')) || [];

// Set default date to today
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
    displayTable();
    updateStats();
});

// Form submission
document.getElementById('absensiForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newData = {
        id: Date.now(),
        nama: document.getElementById('nama').value.trim(),
        nim: document.getElementById('nim').value.trim(),
        kelas: document.getElementById('kelas').value,
        tanggal: document.getElementById('tanggal').value,
        status: document.getElementById('status').value,
        keterangan: document.getElementById('keterangan').value.trim()
    };

    // Validasi duplikasi
    const isDuplicate = absensiData.some(item => 
        item.nama === newData.nama && 
        item.tanggal === newData.tanggal
    );

    if (isDuplicate) {
        alert('Data absensi untuk mahasiswa ini pada tanggal tersebut sudah ada!');
        return;
    }

    absensiData.push(newData);
    saveData();
    displayTable();
    updateStats();
    this.reset();
    document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
    
    showNotification('Data berhasil ditambahkan!', 'success');
});

// Display table
function displayTable() {
    const tableBody = document.getElementById('tableBody');
    let filteredData = filterData();

    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr class="empty-row"><td colspan="8" class="text-center">Belum ada data absensi</td></tr>';
        return;
    }

    tableBody.innerHTML = filteredData.map((item, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${item.nama}</td>
            <td>${item.nim}</td>
            <td>Kelas ${item.kelas}</td>
            <td>${formatDate(item.tanggal)}</td>
            <td>
                <span class="status-badge status-${item.status.toLowerCase()}">
                    ${item.status}
                </span>
            </td>
            <td>${item.keterangan || '-'}</td>
            <td>
                <button class="btn-edit" onclick="editData(${item.id})">Edit</button>
                <button class="btn-delete" onclick="deleteData(${item.id})">Hapus</button>
            </td>
        </tr>
    `).join('');
}

// Filter data
function filterData() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filterKelas = document.getElementById('filterKelas').value;
    const filterStatus = document.getElementById('filterStatus').value;

    return absensiData.filter(item => {
        const matchSearch = item.nama.toLowerCase().includes(searchTerm) || 
                          item.nim.toLowerCase().includes(searchTerm);
        const matchKelas = filterKelas === '' || item.kelas === filterKelas;
        const matchStatus = filterStatus === '' || item.status === filterStatus;

        return matchSearch && matchKelas && matchStatus;
    });
}

// Search dan filter event listeners
document.getElementById('searchInput').addEventListener('keyup', () => {
    displayTable();
});

document.getElementById('filterKelas').addEventListener('change', () => {
    displayTable();
});

document.getElementById('filterStatus').addEventListener('change', () => {
    displayTable();
});

document.getElementById('btnReset').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterKelas').value = '';
    document.getElementById('filterStatus').value = '';
    displayTable();
});

// Edit data
function editData(id) {
    const item = absensiData.find(d => d.id === id);
    if (!item) return;

    document.getElementById('nama').value = item.nama;
    document.getElementById('nim').value = item.nim;
    document.getElementById('kelas').value = item.kelas;
    document.getElementById('tanggal').value = item.tanggal;
    document.getElementById('status').value = item.status;
    document.getElementById('keterangan').value = item.keterangan;

    // Highlight form and scroll
    document.querySelector('.form-section').style.backgroundColor = '#fef3c7';
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });

    // Update submit button
    const form = document.getElementById('absensiForm');
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.textContent = 'Update Data';
    submitBtn.dataset.editId = id;

    form.onsubmit = function(e) {
        e.preventDefault();
        
        const updatedData = {
            id: item.id,
            nama: document.getElementById('nama').value.trim(),
            nim: document.getElementById('nim').value.trim(),
            kelas: document.getElementById('kelas').value,
            tanggal: document.getElementById('tanggal').value,
            status: document.getElementById('status').value,
            keterangan: document.getElementById('keterangan').value.trim()
        };

        const index = absensiData.findIndex(d => d.id === id);
        absensiData[index] = updatedData;
        saveData();
        displayTable();
        updateStats();
        form.reset();
        document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
        document.querySelector('.form-section').style.backgroundColor = '';
        submitBtn.textContent = 'Simpan Data';
        delete submitBtn.dataset.editId;
        form.onsubmit = defaultSubmit;
        
        showNotification('Data berhasil diperbarui!', 'success');
    };
}

function defaultSubmit(e) {
    e.preventDefault();
    
    const newData = {
        id: Date.now(),
        nama: document.getElementById('nama').value.trim(),
        nim: document.getElementById('nim').value.trim(),
        kelas: document.getElementById('kelas').value,
        tanggal: document.getElementById('tanggal').value,
        status: document.getElementById('status').value,
        keterangan: document.getElementById('keterangan').value.trim()
    };

    const isDuplicate = absensiData.some(item => 
        item.nama === newData.nama && 
        item.tanggal === newData.tanggal
    );

    if (isDuplicate) {
        alert('Data absensi untuk mahasiswa ini pada tanggal tersebut sudah ada!');
        return;
    }

    absensiData.push(newData);
    saveData();
    displayTable();
    updateStats();
    this.reset();
    document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
    
    showNotification('Data berhasil ditambahkan!', 'success');
}

// Delete data
function deleteData(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        absensiData = absensiData.filter(d => d.id !== id);
        saveData();
        displayTable();
        updateStats();
        showNotification('Data berhasil dihapus!', 'info');
    }
}

// Update statistics
function updateStats() {
    const allData = absensiData;
    const hadir = allData.filter(d => d.status === 'Hadir').length;
    const izin = allData.filter(d => d.status === 'Izin').length;
    const sakit = allData.filter(d => d.status === 'Sakit').length;
    const alpa = allData.filter(d => d.status === 'Alpa').length;

    document.getElementById('statHadir').textContent = hadir;
    document.getElementById('statIzin').textContent = izin;
    document.getElementById('statSakit').textContent = sakit;
    document.getElementById('statAlpa').textContent = alpa;
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('absensiData', JSON.stringify(absensiData));
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
}

// Export to CSV
document.getElementById('btnExport').addEventListener('click', function() {
    if (absensiData.length === 0) {
        alert('Tidak ada data untuk diekspor!');
        return;
    }

    const headers = ['No', 'Nama Mahasiswa', 'NIM', 'Kelas', 'Tanggal', 'Status', 'Keterangan'];
    const rows = absensiData.map((item, index) => [
        index + 1,
        item.nama,
        item.nim,
        'Kelas ' + item.kelas,
        formatDate(item.tanggal),
        item.status,
        item.keterangan || '-'
    ]);

    const csvContent = [
        headers.join(','),
        ...rows.map(row => 
            row.map(cell => 
                typeof cell === 'string' && cell.includes(',') 
                    ? `"${cell}"` 
                    : cell
            ).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const timestamp = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `absensi_${timestamp}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Data berhasil diekspor!', 'success');
});

// Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : type === 'info' ? '#2563eb' : '#ef4444'};
        color: white;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        word-wrap: break-word;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
