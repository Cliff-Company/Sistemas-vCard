// flipbook.js - VERSIÓN CON PROPORCIÓN FIJA

export function initFlipbook(container, pages, config = {}) {
  console.log("initFlipbook llamado");
  console.log("Container dimensions:", container.clientWidth, "x", container.clientHeight);
  
  container.innerHTML = "";
  
  // PROPORCIÓN DE PÁGINA ESTÁNDAR (A4: 210x297 = ~0.707)
  const PAGE_RATIO = 0.85; // Proporción ancho/alto (A4 portrait)
  
  // Configuración por defecto
  const defaultConfig = {
    width: container.clientWidth || 600,
    height: container.clientHeight || 800,
    size: "stretch",
    minWidth: 300,
    maxWidth: 1200,
    minHeight: 400,
    maxHeight: 1000,
    maxShadowOpacity: 0.5,
    showCover: false,
    mobileScrollSupport: true,
    usePortrait: true,
    startPage: 0,
    flippingTime: 500,
    swipeDistance: 30,
    drawShadow: true,
    // Nueva opción para mantener proporción
    maintainRatio: true,
    pageRatio: PAGE_RATIO
  };
  
  // Combinar configuraciones
  const finalConfig = { ...defaultConfig, ...config };
  
  // FUNCIÓN PARA CALCULAR DIMENSIONES CON PROPORCIÓN
  const calculateDimensions = () => {
    const containerWidth = container.clientWidth || finalConfig.width;
    const containerHeight = container.clientHeight || finalConfig.height;
    
    let width, height;
    
    if (finalConfig.maintainRatio && finalConfig.pageRatio) {
      // Calcular basado en el contenedor manteniendo proporción
      const containerRatio = containerWidth / containerHeight;
      
      if (containerRatio > finalConfig.pageRatio) {
        // Contenedor más ancho que la página: limitar por altura
        height = Math.min(containerHeight, finalConfig.maxHeight);
        height = Math.max(height, finalConfig.minHeight);
        width = height * finalConfig.pageRatio;
      } else {
        // Contenedor más alto que la página: limitar por ancho
        width = Math.min(containerWidth, finalConfig.maxWidth);
        width = Math.max(width, finalConfig.minWidth);
        height = width / finalConfig.pageRatio;
      }
    } else {
      // Sin mantener proporción
      width = Math.min(containerWidth, finalConfig.maxWidth);
      width = Math.max(width, finalConfig.minWidth);
      height = Math.min(containerHeight, finalConfig.maxHeight);
      height = Math.max(height, finalConfig.minHeight);
    }
    
    console.log("Dimensiones calculadas:", width, "x", height, "ratio:", width/height);
    return { width, height };
  };
  
  const initialDimensions = calculateDimensions();
  
  console.log("Config final:", { 
    ...finalConfig, 
    width: initialDimensions.width, 
    height: initialDimensions.height 
  });
  
  // Crear instancia de PageFlip con dimensiones calculadas
  const pageFlip = new window.St.PageFlip(container, {
    ...finalConfig,
    width: initialDimensions.width,
    height: initialDimensions.height
  });
  
  // Cargar páginas
  pageFlip.loadFromHTML(pages);
  console.log("Páginas cargadas en PageFlip:", pages.length);
  
  // Función para actualizar tamaño MANTENIENDO PROPORCIÓN
  const updateSize = () => {
  console.log("Recalculando tamaño...");

  // Solo recalcula layout interno
  if (typeof pageFlip.update === "function") {
    pageFlip.update();
  }
};

  
  // Función para destruir
  const destroy = () => {
    if (pageFlip && typeof pageFlip.destroy === 'function') {
      pageFlip.destroy();
    }
  };
  
  // Retornar objeto con control
  return {
    instance: pageFlip,
    updateSize,
    destroy,
    getDimensions: calculateDimensions
  };
}