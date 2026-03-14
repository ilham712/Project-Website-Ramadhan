// ============================================
// KONFIGURASI API
// ============================================
const API_BASE = 'https://api.myquran.com/v2';
const TAHUN = 2026;
const BULAN = 3; // Maret (Ramadhan 2026)

// ============================================
// ELEMENT SELECTION
// ============================================
const pilihKota = document.getElementById('pilih-kota');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const retryBtn = document.getElementById('retry-btn');
const lokasiInfo = document.getElementById('lokasi-info');
const namaLokasi = document.getElementById('nama-lokasi');
const namaDaerah = document.getElementById('nama-daerah');
const tabelContainer = document.getElementById('tabel-container');
const jadwalBody = document.getElementById('jadwal-body');

// ============================================
// DAFTAR KOTA (ID dari API MyQuran)
// ============================================
const daftarKota = [
    { id: 1301, nama: 'Jakarta' },
    { id: 1302, nama: 'Bandung' },
    { id: 1303, nama: 'Surabaya' },
    { id: 1304, nama: 'Yogyakarta' },
    { id: 1305, nama: 'Semarang' },
    { id: 1306, nama: 'Medan' },
    { id: 1307, nama: 'Makassar' },
    { id: 1308, nama: 'Palembang' },
    { id: 1309, nama: 'Denpasar' },
    { id: 1310, nama: 'Balikpapan' },
    { id: 1311, nama: 'Manado' },
    { id: 1312, nama: 'Padang' },
    { id: 1313, nama: 'Malang' },
    { id: 1314, nama: 'Bogor' },
    { id: 1315, nama: 'Bekasi' },
    { id: 1316, nama: 'Depok' },
    { id: 1317, nama: 'Tangerang' },
    { id: 1318, nama: 'Cirebon' },
    { id: 1319, nama: 'Pekanbaru' },
    { id: 1320, nama: 'Banjarmasin' }
];

// ============================================
// INITIALIZATION - Isi Dropdown Kota
// ============================================
function initDropdown() {
    daftarKota.forEach(kota => {
        const option = document.createElement('option');
        option.value = kota.id;
        option.textContent = kota.nama;
        pilihKota.appendChild(option);
    });
}

// ============================================
// FETCH DATA JADWAL
// ============================================
async function fetchJadwal(kotaId) {
    // Tampilkan loading
    showLoading();
    hideError();
    hideTabel();
    hideLokasi();

    try {
        const response = await fetch(`${API_BASE}/sholat/jadwal/${kotaId}/${TAHUN}/${BULAN}`);
        
        if (!response.ok) {
            throw new Error('Gagal mengambil data');
        }

        const result = await response.json();
        
        if (result.status) {
            renderJadwal(result.data);
        } else {
            throw new Error('Data tidak ditemukan');
        }
    } catch (error) {
        console.error('Error:', error);
        showError();
    } finally {
        hideLoading();
    }
}

// ============================================
// RENDER JADWAL KE TABEL
// ============================================
function renderJadwal(data) {
    // Tampilkan info lokasi
    namaLokasi.textContent = data.lokasi;
    namaDaerah.textContent = data.daerah;
    showLokasi();

    // Clear tabel
    jadwalBody.innerHTML = '';

    // Dapatkan tanggal hari ini untuk highlight
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    // Render setiap jadwal
    data.jadwal.forEach(jadwal => {
        const row = document.createElement('tr');
        
        // Highlight hari ini
        if (jadwal.date === todayStr) {
            row.classList.add('hari-ini');
        }

        row.innerHTML = `
            <td>${formatTanggal(jadwal.tanggal)}</td>
            <td>${jadwal.imsak}</td>
            <td>${jadwal.subuh}</td>
            <td>${jadwal.dzuhur}</td>
            <td>${jadwal.ashar}</td>
            <td>${jadwal.maghrib}</td>
            <td>${jadwal.isya}</td>
        `;

        jadwalBody.appendChild(row);
    });

    showTabel();
}

// ============================================
// FORMAT TANGGAL (Opsional, untuk tampilan lebih rapi)
// ============================================
function formatTanggal(tanggalStr) {
    // Contoh: "Minggu, 01/03/2026" → "01 Mar 2026"
    const parts = tanggalStr.split(', ');
    if (parts.length > 1) {
        const datePart = parts[1];
        const [day, month, year] = datePart.split('/');
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        return `${day} ${months[parseInt(month) - 1]} ${year}`;
    }
    return tanggalStr;
}

// ============================================
// UI STATE FUNCTIONS
// ============================================
function showLoading() {
    loadingEl.style.display = 'block';
}

function hideLoading() {
    loadingEl.style.display = 'none';
}

function showError() {
    errorEl.style.display = 'block';
}

function hideError() {
    errorEl.style.display = 'none';
}

function showTabel() {
    tabelContainer.style.display = 'block';
}

function hideTabel() {
    tabelContainer.style.display = 'none';
}

function showLokasi() {
    lokasiInfo.style.display = 'block';
}

function hideLokasi() {
    lokasiInfo.style.display = 'none';
}

// ============================================
// EVENT LISTENERS
// ============================================

// Ketika kota dipilih
pilihKota.addEventListener('change', function() {
    const kotaId = this.value;
    if (kotaId) {
        fetchJadwal(kotaId);
    } else {
        hideTabel();
        hideLokasi();
    }
});

// Tombol retry
retryBtn.addEventListener('click', function() {
    const kotaId = pilihKota.value;
    if (kotaId) {
        fetchJadwal(kotaId);
    }
});

// ============================================
// INITIALIZATION
// ============================================
window.addEventListener('DOMContentLoaded', function() {
    initDropdown();
    
    // Opsional: Auto-load kota pertama (Jakarta)
    // pilihKota.value = '1301';
    // fetchJadwal(1301);
});