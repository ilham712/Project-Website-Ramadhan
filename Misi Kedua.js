let count = 0;
const target = 33;

const counter = document.getElementById("counter");
const tambahBtn = document.getElementById("tambah");
const resetBtn = document.getElementById("reset");
const notifikasi = document.getElementById("notifikasi");

tambahBtn.addEventListener("click", function() {
    count++;
    counter.textContent = count;

    if (count === target) {
        notifikasi.textContent = "✨ Target tercapai! MasyaAllah ✨";
    }
});

resetBtn.addEventListener("click", function() {
    count = 0;
    counter.textContent = count;
    notifikasi.textContent = "";
});