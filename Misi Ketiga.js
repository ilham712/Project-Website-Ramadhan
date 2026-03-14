const jenisZakatSelect = document.getElementById('jenis-zakat');
const formPenghasilan = document.getElementById('form-penghasilan');
const formEmas = document.getElementById('form-emas');
const hargaEmasInput = document.getElementById('harga-emas');
const hitungBtn = document.getElementById('hitung-btn');
const hasilBox = document.getElementById('hasil-zakat');

const inputGaji = document.getElementById('gaji');
const inputLain = document.getElementById('penghasilan-lain');
const inputGram = document.getElementById('gram-emas');

const resTotal = document.getElementById('res-total');
const resNisab = document.getElementById('res-nisab');
const resStatus = document.getElementById('res-status');
const resZakat = document.getElementById('res-zakat');


jenisZakatSelect.addEventListener('change', function() {
    if (this.value === 'penghasilan') {
        formPenghasilan.style.display = 'block';
        formEmas.style.display = 'none';
    } else {
        formPenghasilan.style.display = 'none';
        formEmas.style.display = 'block';
    }

    hasilBox.style.display = 'none';
});

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
};


hitungBtn.addEventListener('click', function() {
    const hargaEmas = parseFloat(hargaEmasInput.value);
    
    if (!hargaEmas || hargaEmas <= 0) {
        alert("Harap masukkan harga emas yang valid!");
        return;
    }

    const nisab = hargaEmas * 85;
    let totalHarta = 0;
    let zakat = 0;
    let status = "";

    if (jenisZakatSelect.value === 'penghasilan') {
        const gaji = parseFloat(inputGaji.value) || 0;
        const lain = parseFloat(inputLain.value) || 0;
        totalHarta = gaji + lain;
    } else {
        const gram = parseFloat(inputGram.value) || 0;
        totalHarta = gram * hargaEmas;
    }

    if (totalHarta <= 0) {
        alert("Harap masukkan jumlah harta/penghasilan!");
        return;
    }

    if (totalHarta >= nisab) {
        status = "Wajib Zakat";
        zakat = totalHarta * 0.025; 
        resStatus.style.color = "#1B4332"; 
    } else {
        status = "Belum Wajib (Belum mencapai Nisab)";
        zakat = 0;
        resStatus.style.color = "#D4AF37"; 
    }

    resTotal.textContent = formatRupiah(totalHarta);
    resNisab.textContent = formatRupiah(nisab);
    resStatus.textContent = status;
    resZakat.textContent = formatRupiah(zakat);
    
    hasilBox.style.display = 'block';
});