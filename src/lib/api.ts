import { PlanType, TdiCard } from '../types';

// =============================================
// CONFIGURACIÓN DE GITHUB
// =============================================
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
const GITHUB_REPO = 'elispastor/AGENTE';
const GITHUB_USER = 'elispastor';

// =============================================
// FUNCIÓN PARA SUBIR TARJETA A GITHUB
// =============================================
async function subirTarjetaAGitHub(nombre: string, html: string): Promise<string> {
  if (!GITHUB_TOKEN) {
    console.warn('⚠️ GITHUB_TOKEN no configurado. Usando fallback local.');
    return null;
  }

  const path = `tarjetas/${nombre.toLowerCase().replace(/\s+/g, '-')}.html`;
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${path}`;

  try {
    // 1. Verificar si el archivo ya existe
    let sha = null;
    try {
      const checkResponse = await fetch(url, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (checkResponse.ok) {
        const data = await checkResponse.json();
        sha = data.sha;
      }
    } catch (err) {
      // El archivo no existe, continuamos
    }

    // 2. Subir el archivo
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Agregar tarjeta de ${nombre}`,
        content: btoa(unescape(encodeURIComponent(html))),
        sha: sha || undefined,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error al subir a GitHub:', error);
      throw new Error('Error al subir la tarjeta a GitHub');
    }

    const data = await response.json();
    // 3. Devolver el enlace de GitHub Pages
    return `https://${GITHUB_USER}.github.io/${GITHUB_REPO.replace(`${GITHUB_USER}/`, '')}/${path}`;
  } catch (error) {
    console.error('Error en subirTarjetaAGitHub:', error);
    return null;
  }
}

// =============================================
// GENERAR HTML DE LA TARJETA
// =============================================
function generarHtmlTarjeta(data: {
  nombre: string;
  telefono: string;
  email: string;
  fotoPortada: string;
  fotosCarrusel?: string[];
  plan: PlanType;
}): string {
  const fotos = [data.fotoPortada, ...(data.fotosCarrusel || [])];
  
  let slidesHTML = '';
  let indicadoresHTML = '';

  if (fotos.length === 0) {
    slidesHTML = `<div class="slide"><div class="placeholder">📸 Sube tus fotos</div></div>`;
    indicadoresHTML = `<span class="indicator active"></span>`;
  } else {
    fotos.forEach((url, index) => {
      const isActive = index === 0 ? 'active' : '';
      slidesHTML += `<div class="slide ${isActive}"><img src="${url}" alt="Foto ${index + 1}"></div>`;
      indicadoresHTML += `<span class="indicator ${isActive}" data-index="${index}"></span>`;
    });
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://guia-digital.com/${data.nombre.toLowerCase().replace(/\s+/g, '-')}`)}`;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes">
  <title>${data.nombre} - Tarjeta TDI</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: linear-gradient(145deg, #0a1a2e, #1a2f44);
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 16px;
      font-family: 'Segoe UI', Roboto, system-ui, sans-serif;
    }
    .container {
      max-width: 520px;
      width: 100%;
      background: rgba(255,255,255,0.06);
      backdrop-filter: blur(12px);
      border-radius: 32px;
      padding: 24px 20px;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 30px 60px -12px rgba(0,0,0,0.7);
    }
    .carousel-container {
      position: relative;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      overflow: hidden;
      border-radius: 16px;
      background: #0b2b40;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
    }
    .carousel-slides {
      display: flex;
      transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      height: 350px;
    }
    .carousel-slides .slide {
      min-width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0b2b40;
      position: relative;
    }
    .carousel-slides .slide img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background: #0b2b40;
    }
    .carousel-slides .slide .placeholder {
      font-size: 48px;
      color: #fbbf24;
      text-align: center;
      padding: 20px;
    }
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0, 0, 0, 0.5);
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
      z-index: 10;
      backdrop-filter: blur(4px);
    }
    .carousel-btn:hover { background: rgba(0, 0, 0, 0.8); }
    .carousel-btn.prev { left: 10px; }
    .carousel-btn.next { right: 10px; }
    .carousel-indicators {
      position: absolute;
      bottom: 15px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 10;
    }
    .carousel-indicators .indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: background 0.3s ease, transform 0.3s ease;
    }
    .carousel-indicators .indicator.active {
      background: #fbbf24;
      transform: scale(1.2);
    }
    .info {
      text-align: center;
      color: white;
      margin-top: 20px;
      padding: 16px;
      background: rgba(0,0,0,0.3);
      border-radius: 16px;
    }
    .info h2 { font-size: 24px; font-weight: 700; color: #fbbf24; }
    .info p { font-size: 16px; color: #a0c4e8; margin: 4px 0; }
    .botones {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
      margin: 16px 0;
    }
    .botones a, .botones button {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 60px;
      font-weight: 700;
      font-size: 14px;
      border: none;
      text-decoration: none;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      flex: 1 0 auto;
      justify-content: center;
    }
    .botones a:hover, .botones button:hover { transform: scale(1.04); }
    .btn-wa { background: #25D366; color: #fff; }
    .btn-llamar { background: #1a4b6d; color: #fff; }
    .btn-compartir { background: #fbbf24; color: #0b1a2e; }
    .qr { text-align: center; margin: 12px 0; }
    .qr img { width: 100px; height: 100px; border-radius: 16px; background: #fff; padding: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
    .qr p { color: #a0c4e8; font-size: 13px; margin-top: 4px; }
    .menu-toggle {
      position: fixed;
      top: 16px;
      right: 16px;
      background: rgba(0,0,0,0.7);
      color: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      z-index: 100;
      backdrop-filter: blur(4px);
      transition: 0.3s;
    }
    .menu-toggle:hover { background: #fbbf24; color: #0b1a2e; }
    .menu-panel {
      position: fixed;
      top: 0;
      right: -300px;
      width: 280px;
      height: 100%;
      background: rgba(10, 26, 46, 0.95);
      backdrop-filter: blur(12px);
      padding: 80px 20px 20px;
      transition: right 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      z-index: 99;
      box-shadow: -4px 0 30px rgba(0,0,0,0.5);
      border-left: 1px solid rgba(255,255,255,0.05);
    }
    .menu-panel.open { right: 0; }
    .menu-panel a {
      display: block;
      color: #a0c4e8;
      text-decoration: none;
      font-size: 18px;
      font-weight: 600;
      padding: 14px 20px;
      border-radius: 12px;
      transition: 0.2s;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    .menu-panel a:hover {
      background: rgba(251, 191, 36, 0.1);
      color: #fbbf24;
      padding-left: 28px;
    }
    .menu-panel .menu-title {
      color: #fbbf24;
      font-size: 20px;
      font-weight: 700;
      padding: 14px 20px 30px;
      text-align: center;
      border-bottom: 2px solid rgba(251, 191, 36, 0.2);
      margin-bottom: 10px;
    }
    @media (max-width: 480px) {
      .container { padding: 16px; }
      .carousel-slides { height: 220px; }
      .carousel-btn { width: 32px; height: 32px; font-size: 16px; }
      .info h2 { font-size: 20px; }
      .botones a, .botones button { font-size: 13px; padding: 10px 14px; }
      .qr img { width: 80px; height: 80px; }
      .menu-panel { width: 240px; }
    }
    @media (min-width: 768px) { .carousel-slides { height: 420px; } }
    @media (min-width: 1024px) { .carousel-slides { height: 480px; } }
  </style>
</head>
<body>
  <button class="menu-toggle" id="menuToggle" aria-label="Menú">☰</button>
  <div class="menu-panel" id="menuPanel">
    <div class="menu-title">📇 TDI</div>
    <a href="https://guia-digital.com">🏠 Inicio</a>
    <a href="https://guia-digital.com/tarjetas">📇 Mis Tarjetas</a>
    <a href="https://guia-digital.com/planes">📊 Planes</a>
    <a href="https://guia-digital.com/contacto">📩 Contacto</a>
    <a href="https://wa.me/${data.telefono}" target="_blank">💬 WhatsApp</a>
    <a href="mailto:${data.email}">📧 Email</a>
    <a href="#" onclick="compartir()">🔗 Compartir</a>
  </div>
  <div class="container">
    <div class="carousel-container" id="carouselContainer">
      <div class="carousel-slides" id="carouselSlides">${slidesHTML}</div>
      <button class="carousel-btn prev" id="prevBtn">&#10094;</button>
      <button class="carousel-btn next" id="nextBtn">&#10095;</button>
      <div class="carousel-indicators" id="indicatorsContainer">${indicadoresHTML}</div>
    </div>
    <div class="info">
      <h2>🧾 ${data.nombre}</h2>
      <p>📱 ${data.telefono}</p>
      <p>📧 ${data.email}</p>
    </div>
    <div class="botones">
      <a href="https://wa.me/${data.telefono}" target="_blank" class="btn-wa">💬 WhatsApp</a>
      <a href="tel:${data.telefono}" class="btn-llamar">📞 Llamar</a>
      <button class="btn-compartir" onclick="compartir()">🔗 Compartir</button>
    </div>
    <div class="qr">
      <img src="${qrUrl}" alt="Código QR">
      <p>📲 Escanea para ver la tarjeta</p>
    </div>
  </div>
  <script>
    const slidesContainer = document.getElementById('carouselSlides');
    const slides = slidesContainer.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;
      slidesContainer.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      indicators.forEach(function(ind, i) {
        if (i === currentIndex) ind.classList.add('active');
        else ind.classList.remove('active');
      });
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    if (nextBtn) nextBtn.addEventListener('click', function() { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', function() { prevSlide(); resetAutoPlay(); });
    indicators.forEach(function(ind, i) {
      ind.addEventListener('click', function() { goToSlide(i); resetAutoPlay(); });
    });

    function startAutoPlay() { autoPlayInterval = setInterval(nextSlide, 5000); }
    function resetAutoPlay() { clearInterval(autoPlayInterval); startAutoPlay(); }

    const carouselContainer = document.getElementById('carouselContainer');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', function() { clearInterval(autoPlayInterval); });
      carouselContainer.addEventListener('mouseleave', function() { startAutoPlay(); });
    }
    if (totalSlides > 1) startAutoPlay();

    const menuToggle = document.getElementById('menuToggle');
    const menuPanel = document.getElementById('menuPanel');
    let menuOpen = false;

    menuToggle.addEventListener('click', function() {
      menuOpen = !menuOpen;
      menuPanel.classList.toggle('open', menuOpen);
      menuToggle.textContent = menuOpen ? '✕' : '☰';
    });

    document.querySelectorAll('.menu-panel a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuPanel.classList.remove('open');
        menuToggle.textContent = '☰';
        menuOpen = false;
      });
    });

    function compartir() {
      const url = window.location.href;
      if (navigator.share) {
        navigator.share({ title: '${data.nombre} - Tarjeta TDI', url: url });
      } else {
        navigator.clipboard.writeText(url).then(function() {
          alert('📋 Enlace copiado. ¡Comparte tu tarjeta!');
        });
      }
    }
  </script>
</body>
</html>`;
}

// =============================================
// GENERAR TARJETA (MODIFICADO PARA USAR GITHUB)
// =============================================
export async function generarTarjetaAPI(data: {
  nombre: string;
  telefono: string;
  email: string;
  fotoPortada: string;
  fotosCarrusel?: string[];
  plan: PlanType;
}): Promise<{ enlace: string; id: string; success: boolean; source: 'render' | 'local' }> {
  const fallbackId = 'tdi-' + Math.random().toString(36).substring(2, 9);

  try {
    // 1. Generar HTML de la tarjeta
    const html = generarHtmlTarjeta(data);

    // 2. Subir a GitHub
    const enlace = await subirTarjetaAGitHub(data.nombre, html);

    if (enlace) {
      return {
        enlace: enlace,
        id: fallbackId,
        success: true,
        source: 'local'
      };
    } else {
      // Fallback local si GitHub falla
      const currentOrigin = window.location.origin;
      return {
        enlace: `${currentOrigin}/#tarjeta-${fallbackId}`,
        id: fallbackId,
        success: true,
        source: 'local'
      };
    }
  } catch (error) {
    console.error('Error en generarTarjetaAPI:', error);
    // Fallback local
    const currentOrigin = window.location.origin;
    return {
      enlace: `${currentOrigin}/#tarjeta-${fallbackId}`,
      id: fallbackId,
      success: true,
      source: 'local'
    };
  }
}
