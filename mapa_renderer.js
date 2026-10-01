/* ==========================================================
   MAPA DETALHADO DA RÚSSIA — 100% OFFLINE (CORRIGIDO)
   ========================================================== */

const MapaRussia = (function () {

    /* ---------------------------------------------------
       1) PROJEÇÃO CÔNICA CONFORME DE LAMBERT (esférica)
       --------------------------------------------------- */
    const RAD = Math.PI / 180;
    const RAIO_TERRA = 6371;

    const PHI1 = 50 * RAD;
    const PHI2 = 70 * RAD;
    const PHI0 = 56 * RAD;
    const LAMBDA0 = 100;

    const n = Math.log(Math.cos(PHI1) / Math.cos(PHI2)) /
              Math.log(Math.tan(Math.PI / 4 + PHI2 / 2) / Math.tan(Math.PI / 4 + PHI1 / 2));
    const F = (Math.cos(PHI1) * Math.pow(Math.tan(Math.PI / 4 + PHI1 / 2), n)) / n;
    const rho0 = RAIO_TERRA * F / Math.pow(Math.tan(Math.PI / 4 + PHI0 / 2), n);

    function deltaLongitude(lonGraus) {
        let d = lonGraus - LAMBDA0;
        d = ((d + 540) % 360) - 180;
        return d;
    }

    function projetar(lat, lon) {
        const phi = lat * RAD;
        const deltaLambda = deltaLongitude(lon) * RAD;
        const rho = RAIO_TERRA * F / Math.pow(Math.tan(Math.PI / 4 + phi / 2), n);
        const x = rho * Math.sin(n * deltaLambda);
        const y = rho0 - rho * Math.cos(n * deltaLambda);
        return { x, y };
    }

    /* ---------------------------------------------------
       2) FRONTEIRAS (offline)
       --------------------------------------------------- */
    const Fronteiras = {
        continental: [
            [30.0,69.8],[31.1,69.5],[32.4,69.9],[33.0,69.3],[34.8,68.9],[36.5,68.6],
            [39.5,67.7],[41.0,66.8],[43.7,68.65],[48.0,68.3],[52.3,68.7],[58.0,69.6],
            [60.0,70.6],[66.8,72.6],[68.0,73.6],[70.0,72.5],[73.5,71.0],[76.0,73.5],
            [79.0,72.5],[84.0,73.5],[91.0,76.8],[97.0,77.5],[104.3,77.7],[112.0,76.2],
            [118.0,73.5],[126.3,71.8],[133.0,71.3],[139.0,71.5],[148.0,70.8],[156.0,70.2],
            [161.0,69.6],[169.0,69.7],[178.0,68.9],[-179.0,66.1],[-169.7,66.05],
            [-173.2,64.5],[-177.5,64.4],[179.5,62.0],[174.0,61.0],[168.0,60.5],
            [163.5,59.8],[162.0,58.0],[163.0,54.5],[160.5,52.0],[156.7,50.9],
            [155.0,51.5],[156.0,54.0],[155.0,56.0],[151.5,59.0],[145.0,59.5],
            [141.5,59.0],[137.0,56.0],[140.5,53.0],[140.0,51.5],[138.5,48.5],
            [135.5,45.0],[132.9,43.1],[131.3,42.5],[130.6,42.4],[131.0,44.0],
            [133.5,46.5],[134.5,48.4],[130.5,49.5],[127.5,50.2],[122.0,50.3],
            [119.5,50.0],[116.0,49.8],[111.5,49.3],[104.5,50.2],[98.5,50.5],
            [94.0,49.2],[88.8,49.2],[85.5,49.6],[81.0,50.8],[76.5,53.5],
            [71.0,54.5],[65.0,54.0],[61.5,51.0],[58.0,51.0],[53.0,51.5],
            [48.5,50.0],[47.0,46.5],[48.6,44.9],[47.5,43.3],[47.9,41.2],
            [46.5,41.8],[43.0,42.7],[40.2,43.4],[39.9,43.4],[38.0,44.5],
            [37.3,45.2],[38.3,46.7],[38.9,47.1],[39.7,48.0],[39.9,49.6],
            [40.1,50.0],[38.2,50.4],[35.4,50.8],[34.2,51.3],[32.4,52.3],
            [31.8,53.9],[31.3,55.0],[30.9,55.8],[28.1,57.3],[27.4,58.7],
            [27.9,59.4],[28.9,60.0],[30.3,59.9],[29.7,60.5],[29.0,61.3],
            [30.5,62.9],[30.0,64.0],[29.5,66.0],[29.0,68.0],[29.5,69.3],
            [30.0,69.8]
        ],
        kaliningrado: [
            [19.65,54.38],[20.9,54.28],[22.75,54.35],[22.85,54.85],[22.65,55.28],
            [21.3,55.3],[19.95,55.0],[19.6,54.7],[19.65,54.38]
        ],
        sacalina: [
            [142.0,54.4],[143.2,50.9],[143.0,48.9],[142.7,46.9],[141.9,45.9],
            [142.0,47.0],[141.8,49.0],[141.6,51.0],[141.9,53.5],[142.0,54.4]
        ],
        novaZembliaSul: [
            [52.0,70.5],[54.5,70.0],[57.0,70.4],[56.5,71.3],[53.0,71.5],[51.0,71.0],[52.0,70.5]
        ],
        novaZembliaNorte: [
            [53.5,72.0],[56.0,71.7],[59.0,72.5],[60.5,74.0],[57.0,76.0],[52.0,75.5],[51.5,73.5],[53.5,72.0]
        ],
        curilas: [
            [156.4,50.7],[155.6,50.0],[154.8,49.3],[153.3,48.4],[152.0,47.9],
            [150.8,47.0],[149.6,46.4],[148.9,45.4],[147.9,45.0],[146.1,44.4]
        ]
    };

    // Lista de todos os anéis (incluindo as Curilas como um anel de pontos)
    const todosOsAneis = [
        Fronteiras.continental,
        Fronteiras.kaliningrado,
        Fronteiras.sacalina,
        Fronteiras.novaZembliaSul,
        Fronteiras.novaZembliaNorte,
        Fronteiras.curilas  // ← agora incluído no bounding box
    ];

    /* ---------------------------------------------------
       3) CÁLCULO DO BOUNDING BOX (UMA ÚNICA VEZ, COM MAIS MARGEM)
       --------------------------------------------------- */
    function calcularBoundingBoxGlobal() {
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        todosOsAneis.forEach(anel => {
            anel.forEach(([lon, lat]) => {
                const p = projetar(lat, lon);
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            });
        });
        // Margem aumentada para 12% (antes era 5%)
        const margemX = (maxX - minX) * 0.10;
        const margemY = (maxY - minY) * 0.10;
        return {
            minX: minX - margemX,
            maxX: maxX + margemX,
            minY: minY - margemY,
            maxY: maxY + margemY
        };
    }

    const BBOX_GLOBAL = calcularBoundingBoxGlobal();

    /* ---------------------------------------------------
       4) FUNÇÕES DE TRANSFORMAÇÃO (compartilhadas)
       --------------------------------------------------- */
    function obterTransformacao(larguraPx, alturaPx) {
        const { minX, maxX, minY, maxY } = BBOX_GLOBAL;
        const escala = Math.min(
            larguraPx / (maxX - minX),
            alturaPx / (maxY - minY)
        );
        const offsetX = (larguraPx - (maxX - minX) * escala) / 2;
        const offsetY = (alturaPx - (maxY - minY) * escala) / 2;
        return { escala, offsetX, offsetY, minX, minY };
    }

    // Converte coordenadas projetadas (x,y) para pixels no SVG
    function projetarParaPixel(px, py, larguraPx, alturaPx) {
        const { escala, offsetX, offsetY, minX, minY } = obterTransformacao(larguraPx, alturaPx);
        const x = offsetX + (px - minX) * escala;
        const y = alturaPx - (offsetY + (py - minY) * escala); // inverte Y
        return { x, y };
    }

    /* ---------------------------------------------------
       5) API PÚBLICA
       --------------------------------------------------- */

    // Converte (lat, lon) para coordenadas de tela (pixels)
    function localizarNaTela(lat, lon, larguraPx = 900, alturaPx = 700) {
        const p = projetar(lat, lon);
        return projetarParaPixel(p.x, p.y, larguraPx, alturaPx);
    }

    // Gera o SVG completo do mapa
    function gerarSVG(opcoes = {}) {
        const larguraPx = opcoes.largura || 900;
        const alturaPx = opcoes.altura || 700;
        const cidades = opcoes.cidades || [];
        const mostrarRotulos = opcoes.mostrarRotulos !== false;
        const transliterar = (typeof Dicionarios !== 'undefined')
            ? Dicionarios.transliterarCirilico
            : (t) => t;

        function anelParaPath(anel) {
            const pontos = anel.map(([lon, lat]) => {
                const p = projetar(lat, lon);
                const pixel = projetarParaPixel(p.x, p.y, larguraPx, alturaPx);
                return `${pixel.x.toFixed(1)},${pixel.y.toFixed(1)}`;
            });
            return `M ${pontos.join(' L ')} Z`;
        }

        let svg = `<svg viewBox="0 0 ${larguraPx} ${alturaPx}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">`;
        svg += `<rect width="${larguraPx}" height="${alturaPx}" fill="#eaf3fa"/>`;

        const corTerra = '#d8e8d4';
        const corBorda = '#4a6b52';

        // Desenha todos os anéis principais (excluindo as Curilas, que são pontos)
        const aneisPrincipais = todosOsAneis.filter(a => a !== Fronteiras.curilas);
        aneisPrincipais.forEach(anel => {
            svg += `<path d="${anelParaPath(anel)}" fill="${corTerra}" stroke="${corBorda}" stroke-width="1.2"/>`;
        });

        // Ilhas Curilas (pontos)
        Fronteiras.curilas.forEach(([lon, lat]) => {
            const p = localizarNaTela(lat, lon, larguraPx, alturaPx);
            svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.0" fill="${corTerra}" stroke="${corBorda}" stroke-width="0.8"/>`;
        });

        // Cidades (se fornecidas)
        cidades.forEach(cidade => {
            const p = localizarNaTela(cidade.lat, cidade.lon, larguraPx, alturaPx);
            svg += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="#c0392b" stroke="#ffffff" stroke-width="1"/>`;
            if (mostrarRotulos) {
                const rotulo = transliterar(cidade.nome);
                svg += `<text x="${(p.x + 6).toFixed(1)}" y="${(p.y - 6).toFixed(1)}" font-size="12" fill="#222">${rotulo}</text>`;
            }
        });

        svg += `</svg>`;
        return svg;
    }

    function getBoundingBox() {
        return BBOX_GLOBAL;
    }

    return {
        projetar,
        localizarNaTela,
        gerarSVG,
        getBoundingBox,
        Fronteiras
    };
})();

// Compatibilidade com módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MapaRussia;
}