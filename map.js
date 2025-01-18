// Sélectionner la carte SVG et la rendre interactive
const svgMap = document.getElementById('svg-map');
let isPanning = false;
let startX, startY, transformX = 0, transformY = 0, scale = 1;

// Zoom
svgMap.addEventListener('wheel', (event) => {
    event.preventDefault();
    const zoomIntensity = 0.1;
    scale += event.deltaY > 0 ? -zoomIntensity : zoomIntensity;
    scale = Math.min(Math.max(scale, 0.5), 5); // Limiter le zoom
    svgMap.style.transform = `scale(${scale}) translate(${transformX}px, ${transformY}px)`;
});

// Déplacement
svgMap.addEventListener('mousedown', (event) => {
    isPanning = true;
    startX = event.clientX - transformX;
    startY = event.clientY - transformY;
    svgMap.style.cursor = "grabbing";
});

svgMap.addEventListener('mousemove', (event) => {
    if (!isPanning) return;
    transformX = event.clientX - startX;
    transformY = event.clientY - startY;
    svgMap.style.transform = `scale(${scale}) translate(${transformX}px, ${transformY}px)`;
});

svgMap.addEventListener('mouseup', () => {
    isPanning = false;
    svgMap.style.cursor = "grab";
});

svgMap.addEventListener('mouseleave', () => {
    isPanning = false;
    svgMap.style.cursor = "grab";
});
