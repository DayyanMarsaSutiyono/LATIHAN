const form = document.getElementById('maintenance-form');
const recordsBody = document.getElementById('records-body');
const clearStorageButton = document.getElementById('clear-storage');

async function loadRecords() {
  const response = await fetch('/records');
  if (!response.ok) {
    throw new Error('Gagal memuat data perawatan.');
  }
  return response.json();
}

function renderTable(records) {
  recordsBody.innerHTML = '';

  if (records.length === 0) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = '<td colspan="6" class="empty-state">Belum ada data perawatan. Tambahkan data menggunakan formulir di atas.</td>';
    recordsBody.appendChild(emptyRow);
    return;
  }

  records.forEach((record, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${record.plate}</td>
      <td>${record.type}</td>
      <td>${Number(record.kilometers).toLocaleString('id-ID')} km</td>
      <td>${record.date}</td>
      <td>${record.notes}</td>
    `;
    recordsBody.appendChild(row);
  });
}

async function renderRecords() {
  try {
    const records = await loadRecords();
    renderTable(records);
  } catch (error) {
    recordsBody.innerHTML = '<tr><td colspan="6" class="empty-state">Terjadi kesalahan saat memuat data.</td></tr>';
    console.error(error);
  }
}

function resetForm() {
  form.reset();
  form.querySelector('#plate').focus();
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  const newRecord = {
    plate: formData.get('plate').trim(),
    type: formData.get('type').trim(),
    kilometers: Number(formData.get('kilometers')),
    date: formData.get('date'),
    notes: formData.get('notes').trim(),
  };

  try {
    const response = await fetch('/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord),
    });

    if (!response.ok) {
      throw new Error('Gagal menyimpan data perawatan.');
    }

    await renderRecords();
    resetForm();
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

clearStorageButton.addEventListener('click', async () => {
  if (!confirm('Hapus semua data perawatan?')) {
    return;
  }

  try {
    const response = await fetch('/records', { method: 'DELETE' });
    if (!response.ok) {
      throw new Error('Gagal menghapus data.');
    }
    renderTable([]);
  } catch (error) {
    alert(error.message);
    console.error(error);
  }
});

renderRecords();
