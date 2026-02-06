import { initFlipbook } from "./flipbook.js";

const CONFIG = {
    flippingTime: 600,
    mobileScrollSupport: true,
    showCover: true
};

const TOTAL_PAGES = 28;

// 👇 DIMENSIONES REALES DE TUS IMÁGENES JPG
const IMAGE_WIDTH = 1488;
const IMAGE_HEIGHT = 1925;
const IMAGE_RATIO = IMAGE_WIDTH / IMAGE_HEIGHT;  // ≈ 0.773

async function init() {
    try {
        const container = document.getElementById("book");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        const pageCounter = document.getElementById("pageCounter");
        const homeBtn = document.getElementById("homeBtn");

        if (!container) throw new Error("No se encontró #book");

        container.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                <span>Cargando catálogo...</span>
            </div>
        `;

        /* =========================
           CREAR PÁGINAS DESDE JPG
        ========================= */
        const pages = [];

        for (let i = 1; i <= TOTAL_PAGES; i++) {
            const pageNumber = i.toString().padStart(2, "0");

            const wrapper = document.createElement("div");
            wrapper.classList.add("page");

            const img = document.createElement("img");
            img.src = `assets/images/catalogo/page-${pageNumber}.jpg`;
            img.style.width = "100%";
            img.style.height = "100%";
            img.style.objectFit = "contain";

            wrapper.appendChild(img);
            pages.push(wrapper);
            console.log(`assets/images/catalogo/page-${pageNumber}.jpg`);
        }

        container.innerHTML = "";

        const isMobile = window.innerWidth < 900;

        // 👇 CONFIGURACIÓN IDÉNTICA AL PDF
        const flipbook = initFlipbook(container, pages, {
            ...CONFIG,
            width: IMAGE_WIDTH,
            height: IMAGE_HEIGHT,
            maintainRatio: true,
            pageRatio: IMAGE_RATIO,
            size: "fixed",
            usePortrait: isMobile,
            showCover: true
        });

        const pageFlip = flipbook.instance;

        /* =========================
           BOTÓN INICIO
        ========================= */
        if (homeBtn) {
            homeBtn.addEventListener("click", () => {
                if (!pageFlip) return;
                pageFlip.turnToPage(0);
            });
        }

        console.log("Flipbook inicializado", pageFlip);

        /* =========================
           CONTROLES
        ========================= */
        if (prevBtn && nextBtn && pageCounter) {
            setupNavigation(pageFlip, pages.length, prevBtn, nextBtn, pageCounter);
        }

        /* =========================
           RESIZE
        ========================= */
        const resizeHandler = () => {
            console.log("Redimensionando flipbook...");
            flipbook.updateSize();
        };

        let resizeTimeout;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(resizeHandler, 250);
        });

        setTimeout(() => {
            flipbook.updateSize();
        }, 300);

        /* =========================
           DEBUG
        ========================= */
        window.flipbookApp = {
            pageFlip,
            flipbook,
            goToPage: (pageNum) => {
                if (pageFlip && pageNum >= 1 && pageNum <= pages.length) {
                    pageFlip.flip(pageNum - 1);
                }
            },
            getCurrentPage: () =>
                pageFlip ? pageFlip.getCurrentPageIndex() + 1 : 1
        };

        console.log("Aplicación inicializada correctamente");

    } catch (error) {
        console.error("ERROR DETECTADO:", error);
    }
}

/* =========================
   NAVEGACIÓN
========================= */
function setupNavigation(pageFlip, totalPages, prevBtn, nextBtn, pageCounter) {
    if (!pageFlip) return;

    const updatePageCounter = () => {
        const currentPage = pageFlip.getCurrentPageIndex() + 1;
        pageCounter.textContent = `Página ${currentPage} de ${totalPages}`;

        prevBtn.disabled = currentPage <= 1;
        nextBtn.disabled = currentPage >= totalPages;
    };

    prevBtn.addEventListener("click", () => {
        if (!prevBtn.disabled) pageFlip.flipPrev();
    });

    nextBtn.addEventListener("click", () => {
        if (!nextBtn.disabled) pageFlip.flipNext();
    });

    document.addEventListener("keydown", (e) => {
        if (!pageFlip) return;

        switch (e.key) {
            case "ArrowLeft":
                e.preventDefault();
                pageFlip.flipPrev();
                break;
            case "ArrowRight":
                e.preventDefault();
                pageFlip.flipNext();
                break;
            case "Home":
                e.preventDefault();
                pageFlip.flip(0);
                break;
            case "End":
                e.preventDefault();
                pageFlip.flip(totalPages - 1);
                break;
        }
    });

    pageFlip.on("flip", updatePageCounter);
    pageFlip.on("changeState", updatePageCounter);

    updatePageCounter();
}

/* =========================
   INIT
========================= */
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}

console.log("app.js cargado correctamente");