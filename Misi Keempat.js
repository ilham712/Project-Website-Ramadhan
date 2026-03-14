const ramadhanStartDate = new Date("2026-02-19");

const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        this.classList.add('active');
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        
        updateTotalProgress();
    });
});

const shalatChecks = document.querySelectorAll('.shalat-check');
const shalatProgressText = document.getElementById('shalat-progress-text');
const shalatStatus = document.getElementById('shalat-status');
const saveShalatBtn = document.getElementById('save-shalat');

function updateShalatProgress() {
    const checked = document.querySelectorAll('.shalat-check:checked').length;
    const total = 5;
    const percent = (checked / total) * 100;
    
    shalatProgressText.textContent = `${checked}/${total}`;
    
    if (percent === 0) {
        shalatStatus.textContent = '💪 Ayo mulai!';
        shalatStatus.style.color = '#666';
    } else if (percent <= 40) {
        shalatStatus.textContent = '⚠️ Belum optimal';
        shalatStatus.style.color = '#D4AF37';
    } else if (percent < 100) {
        shalatStatus.textContent = '✅ Cukup baik';
        shalatStatus.style.color = '#2D6A4F';
    } else {
        shalatStatus.textContent = '🌟 MasyaAllah lengkap!';
        shalatStatus.style.color = '#1B4332';
    }
    
    return percent;
}

shalatChecks.forEach(check => {
    check.addEventListener('change', updateShalatProgress);
});

saveShalatBtn.addEventListener('click', function() {
    const shalatData = [];
    shalatChecks.forEach(check => {
        shalatData.push({ id: check.id, checked: check.checked });
    });
    localStorage.setItem('shalatData', JSON.stringify(shalatData));
    alert('✅ Data shalat tersimpan!');
    updateTotalProgress();
});

function loadShalatData() {
    const saved = localStorage.getItem('shalatData');
    if (saved) {
        const data = JSON.parse(saved);
        data.forEach(item => {
            const check = document.getElementById(item.id);
            if (check) check.checked = item.checked;
        });
        updateShalatProgress();
    }
}

const quranTarget = document.getElementById('quran-target');
const quranRead = document.getElementById('quran-read');
const quranProgressBar = document.getElementById('quran-progress-bar');
const quranProgressText = document.getElementById('quran-progress-text');
const quranStatus = document.getElementById('quran-status');
const saveQuranBtn = document.getElementById('save-quran');
const resetQuranBtn = document.getElementById('reset-quran');

function updateQuranProgress() {
    const target = parseInt(quranTarget.value) || 1;
    const read = parseInt(quranRead.value) || 0;
    const percent = Math.min((read / target) * 100, 100);
    
    quranProgressBar.style.width = `${percent}%`;
    quranProgressText.textContent = `${Math.round(percent)}%`;
    
    // Status dinamis sesuai ketentuan Misi 4
    if (percent < 50) {
        quranStatus.textContent = '📖 Masih bisa ditambah';
        quranStatus.style.color = '#D4AF37';
    } else if (percent < 100) {
        quranStatus.textContent = '🎯 Hampir selesai';
        quranStatus.style.color = '#2D6A4F';
    } else {
        quranStatus.textContent = '✨ Target tercapai!';
        quranStatus.style.color = '#1B4332';
    }
    
    return percent;
}

quranTarget.addEventListener('input', updateQuranProgress);
quranRead.addEventListener('input', updateQuranProgress);

saveQuranBtn.addEventListener('click', function() {
    const quranData = {
        target: quranTarget.value,
        read: quranRead.value
    };
    localStorage.setItem('quranData', JSON.stringify(quranData));
    alert('✅ Data Qur\'an tersimpan!');
    updateTotalProgress();
});

resetQuranBtn.addEventListener('click', function() {
    quranTarget.value = '';
    quranRead.value = '';
    updateQuranProgress();
});

function loadQuranData() {
    const saved = localStorage.getItem('quranData');
    if (saved) {
        const data = JSON.parse(saved);
        quranTarget.value = data.target || '';
        quranRead.value = data.read || '';
        updateQuranProgress();
    }
}

const kalenderGrid = document.getElementById('kalender-grid');
const hariRamadhanEl = document.getElementById('hari-ramadhan');
const namaHariEl = document.getElementById('nama-hari');
const puasaCount = document.getElementById('puasa-count');
const puasaProgressBar = document.getElementById('puasa-progress-bar');
const puasaStatus = document.getElementById('puasa-status');
const savePuasaBtn = document.getElementById('save-puasa');

function getTodayRamadhanDay() {
    const today = new Date();
    const diffTime = today - ramadhanStartDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    const currentDay = diffDays + 1;
    
    if (currentDay < 1) return 1;
    if (currentDay > 30) return 30; 
    
    return currentDay;
}

function renderKalender() {
    kalenderGrid.innerHTML = '';
    const savedPuasa = JSON.parse(localStorage.getItem('puasaDays')) || [];
    const todayDay = getTodayRamadhanDay();
    
    hariRamadhanEl.textContent = todayDay;
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    namaHariEl.textContent = new Date().toLocaleDateString('id-ID', options);

    for (let i = 1; i <= 30; i++) {
        const dayBox = document.createElement('div');
        dayBox.className = 'kalender-day';
        dayBox.textContent = i;
        
        if (savedPuasa.includes(i)) {
            dayBox.classList.add('completed');
            dayBox.innerHTML = '✓';
        }
        
        if (i === todayDay) {
            dayBox.classList.add('current-day');
        }
        
        dayBox.addEventListener('click', function() {
            togglePuasaDay(i);
        });
        
        kalenderGrid.appendChild(dayBox);
    }
    
    updatePuasaProgress(savedPuasa);
}

function togglePuasaDay(day) {
    let savedPuasa = JSON.parse(localStorage.getItem('puasaDays')) || [];
    
    if (savedPuasa.includes(day)) {
        savedPuasa = savedPuasa.filter(d => d !== day);
    } else {
        savedPuasa.push(day);
    }
    
    localStorage.setItem('puasaDays', JSON.stringify(savedPuasa));
    renderKalender(); 
    updateTotalProgress(); 
}

function updatePuasaProgress(savedPuasa) {
    const count = savedPuasa.length;
    puasaCount.textContent = count;
    const percent = (count / 30) * 100;
    puasaProgressBar.style.width = `${percent}%`;
    
    if (count === 0) {
        puasaStatus.textContent = '🌱 Mulai perjalananmu';
        puasaStatus.style.color = '#666';
    } else if (count < 10) {
        puasaStatus.textContent = '💪 Awal yang bagus!';
        puasaStatus.style.color = '#D4AF37';
    } else if (count < 20) {
        puasaStatus.textContent = '🔥 Terus pertahankan!';
        puasaStatus.style.color = '#2D6A4F';
    } else if (count < 30) {
        puasaStatus.textContent = '🎯 Hampir selesai!';
        puasaStatus.style.color = '#1B4332';
    } else {
        puasaStatus.textContent = '🌟 Alhamdulillah Lengkap!';
        puasaStatus.style.color = '#1B4332';
    }
    
    return percent;
}

savePuasaBtn.addEventListener('click', function() {
    alert('✅ Progress puasa tersimpan di browser!');
});

function loadPuasaData() {
    renderKalender();
}

function updateTotalProgress() {
    const shalatPercent = updateShalatProgress();
    const quranPercent = updateQuranProgress();
    const puasaPercent = updatePuasaProgress(JSON.parse(localStorage.getItem('puasaDays')) || []);
    
    const totalPercent = Math.round((shalatPercent + quranPercent + puasaPercent) / 3);
    
    document.getElementById('total-progress-bar').style.width = `${totalPercent}%`;
    document.getElementById('total-progress-text').textContent = `${totalPercent}%`;

    const motivasiEl = document.getElementById('motivasi-status');
    if (totalPercent === 0) {
        motivasiEl.textContent = '✨ Semangat! Mulai dari langkah kecil';
    } else if (totalPercent < 40) {
        motivasiEl.textContent = '💪 Good start! Tingkatkan lagi';
    } else if (totalPercent < 80) {
        motivasiEl.textContent = '🎯 Mantap! Konsisten ya';
    } else if (totalPercent < 100) {
        motivasiEl.textContent = '🌟 Hampir sempurna!';
    } else {
        motivasiEl.textContent = '🏆 MasyaAllah! Ibadah maksimal!';
    }
}

window.addEventListener('DOMContentLoaded', function() {
    loadShalatData();
    loadQuranData();
    loadPuasaData();
    updateTotalProgress();
});