// ====== Ubah data di sini ======

const EMAIL_TUJUAN = ["rzuanindya74", "gmail.com"].join("@");

const PERAN = [
  "calon web developer",
  "mahasiswa jaringan internet",
  "pembelajar yang rajin"
];

// ================================


// Tema terang dan gelap

const root = document.documentElement;
const themeBtn = document.getElementById("theme");

function setTheme(t) {
  root.dataset.theme = t;
  themeBtn.textContent = t === "dark" ? "☀️" : "🌙";

  try {
    localStorage.setItem("tema", t);
  } catch (e) {}
}

let saved = null;

try {
  saved = localStorage.getItem("tema");
} catch (e) {}

setTheme(
  saved ||
  (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
);

themeBtn.onclick = () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
};


// Menu mobile

const menu = document.getElementById("menu");
const links = document.getElementById("links");

menu.onclick = () => {
  const o = links.classList.toggle("open");

  menu.setAttribute("aria-expanded", o);
};

links.querySelectorAll("a").forEach(a => {
  a.onclick = () => {
    links.classList.remove("open");
    menu.setAttribute("aria-expanded", false);
  };
});


// Efek mengetik

const typed = document.getElementById("typed");

let r = 0;
let c = 0;
let hapus = false;

function ketik() {
  const t = PERAN[r];

  typed.textContent = t.slice(0, c);

  if (!hapus && c === t.length) {
    hapus = true;
    return setTimeout(ketik, 1400);
  }

  if (hapus && c === 0) {
    hapus = false;
    r = (r + 1) % PERAN.length;
  }

  c += hapus ? -1 : 1;

  setTimeout(ketik, hapus ? 40 : 80);
}

ketik();


// Bar keahlian muncul saat terlihat

const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll("i").forEach(b => {
        b.style.width = b.dataset.level + "%";
      });

      io.unobserve(e.target);
    }
  });
}, { threshold: .3 });

io.observe(document.getElementById("skills"));


// Filter proyek

const chips = document.querySelectorAll(".chip");
const projects = document.querySelectorAll(".project");

chips.forEach(ch => {
  ch.onclick = () => {
    chips.forEach(x => {
      x.setAttribute("aria-pressed", x === ch);
    });

    projects.forEach(p => {
      p.classList.toggle(
        "hidden",
        ch.dataset.filter !== "semua" &&
        p.dataset.cat !== ch.dataset.filter
      );
    });
  };
});


// Menu aktif saat scroll

const secs = document.querySelectorAll("main section[id]");
const navA = document.querySelectorAll(".links a[href^='#']");

const navObs = new IntersectionObserver(es => {
  es.forEach(e => {
    if (e.isIntersecting) {
      navA.forEach(a => {
        a.classList.toggle(
          "active",
          a.getAttribute("href") === "#" + e.target.id
        );
      });
    }
  });
}, {
  rootMargin: "-45% 0px -50% 0px"
});

secs.forEach(s => navObs.observe(s));


// Formulir kontak menggunakan Formspree

document.getElementById("form").addEventListener("submit", async (e) => {

  e.preventDefault();

  const form = e.target;
  const status = document.getElementById("status");

  const nama = document.getElementById("nama").value.trim();
  const email = document.getElementById("email").value.trim();
  const pesan = document.getElementById("pesan").value.trim();

  if (!nama || !email || !pesan) {
    status.textContent = "Semua kolom wajib diisi!";
    return;
  }

  if (!document.getElementById("email").checkValidity()) {
    status.textContent = "Format email tidak valid!";
    return;
  }

  status.textContent = "Mengirim pesan...";

  try {

    const response = await fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: {
        "Accept": "application/json"
      }
    });

    if (response.ok) {
      status.textContent = "Pesan berhasil dikirim!";
      form.reset();
    } else {
      status.textContent = "Pesan gagal dikirim. Coba lagi.";
    }

  } catch (error) {

    status.textContent = "Terjadi kesalahan koneksi.";

  }

});


// Tahun otomatis

document.getElementById("year").textContent =
  new Date().getFullYear();