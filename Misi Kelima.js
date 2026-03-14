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
    { id: 1, nama: 'Jakarta' },
    { id: 2, nama: 'Bandung' },
    { id: 3, nama: 'Surabaya' },
    { id: 4, nama: 'Yogyakarta' },
    { id: 5, nama: 'Semarang' },
    { id: 6, nama: 'Medan' },
    { id: 7, nama: 'Makassar' },
    { id: 8, nama: 'Palembang' },
    { id: 9, nama: 'Denpasar' },
    { id: 10, nama: 'Balikpapan' },
    { id: 11, nama: 'Manado' },
    { id: 12, nama: 'Padang' },
    { id: 13, nama: 'Malang' },
    { id: 14, nama: 'Bogor' },
    { id: 15, nama: 'Bekasi' },
    { id: 16, nama: 'Depok' },
    { id: 17, nama: 'Tangerang' },
    { id: 18, nama: 'Cirebon' },
    { id: 19, nama: 'Pekanbaru' },
    { id: 20, nama: 'Banjarmasin' }
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
    console.log('✅ Dropdown kota initialized');
}

// ============================================
// FETCH DATA JADWAL
// ============================================
async function fetchJadwal(kotaId) {
    const kotaName = daftarKota.find(k => k.id == kotaId)?.nama || 'Unknown';
    console.log(`🔄 Fetching jadwal untuk ${kotaName} (ID: ${kotaId})...`);
    
    // Tampilkan loading
    showLoading();
    hideError();
    hideTabel();
    hideLokasi();

    try {
        const url = `${API_BASE}/sholat/jadwal/${kotaId}/${TAHUN}/${BULAN}`;
        console.log('📡 API URL:', url);
        
        const response = await fetch(url);
        console.log('📥 Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ Data received:', result);
        
        if (result.status) {
            console.log('📊 Rendering jadwal...');
            renderJadwal(result.data);
        } else {
            throw new Error('Data tidak ditemukan');
        }
    } catch (error) {
        console.error('❌ Error fetching jadwal:', error);
        showError();
    } finally {
        hideLoading();
    }
}

// ============================================
// RENDER JADWAL KE TABEL
// ============================================
function renderJadwal(data) {
    console.log('📋 Data lokasi:', data.lokasi, data.daerah);
    
    // Tampilkan info lokasi
    namaLokasi.textContent = data.lokasi;
    namaDaerah.textContent = data.daerah;
    showLokasi();

    // Clear tabel
    jadwalBody.innerHTML = '';

    // Dapatkan tanggal hari ini untuk highlight
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    console.log('📅 Hari ini:', todayStr);

    // Render setiap jadwal
    let rowCount = 0;
    data.jadwal.forEach(jadwal => {
        const row = document.createElement('tr');
        
        // Highlight hari ini
        if (jadwal.date === todayStr) {
            row.classList.add('hari-ini');
            console.log('✨ Highlight hari ini:', jadwal.tanggal);
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
        rowCount++;
    });

    console.log(`✅ Rendered ${rowCount} rows`);
    showTabel();
}

// ============================================
// FORMAT TANGGAL
// ============================================
function formatTanggal(tanggalStr) {
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
    console.log('🔄 Showing loading...');
}

function hideLoading() {
    loadingEl.style.display = 'none';
}

function showError() {
    errorEl.style.display = 'block';
    console.log('⚠️ Showing error...');
}

function hideError() {
    errorEl.style.display = 'none';
}

function showTabel() {
    tabelContainer.style.display = 'block';
    console.log('✅ Showing tabel...');
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
pilihKota.addEventListener('change', function() {
    const kotaId = this.value;
    console.log('🎯 Kota dipilih, ID:', kotaId);
    if (kotaId) {
        fetchJadwal(kotaId);
    } else {
        hideTabel();
        hideLokasi();
    }
});

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
    console.log('🚀 Page loaded, initializing...');
    initDropdown();
});
