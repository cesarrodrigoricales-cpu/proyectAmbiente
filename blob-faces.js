/* ==========================================================================
   BLOB FACES — agrega caritas tiernas y bracitos que saludan
   a cada figura geométrica .kawaii-blob del sitio, sin tocar el HTML.
   ========================================================================== */
(function () {
  function addFaceAndArms(blob, index) {
    // Carita (ojitos + cachetitos + boquita)
    const face = document.createElement('div');
    face.className = 'blob-face';
    face.innerHTML =
      '<span class="blob-eye eye-left"></span>' +
      '<span class="blob-eye eye-right"></span>' +
      '<span class="blob-blush blush-left"></span>' +
      '<span class="blob-blush blush-right"></span>' +
      '<span class="blob-mouth"></span>';

    // Bracitos
    const armLeft = document.createElement('span');
    armLeft.className = 'blob-arm arm-left';
    const armRight = document.createElement('span');
    armRight.className = 'blob-arm arm-right';

    // Piecitos con su pie redondito
    const legLeft = document.createElement('span');
    legLeft.className = 'blob-leg leg-left';
    const legRight = document.createElement('span');
    legRight.className = 'blob-leg leg-right';

    // Delays escalonados para que no todos se muevan igual (más tierno y natural)
    const baseDelay = (index % 6) * 0.35;
    armLeft.style.animationDelay = baseDelay + 's';
    armRight.style.animationDelay = (baseDelay + 0.3) + 's';
    legLeft.style.animationDelay = (baseDelay + 0.15) + 's';
    legRight.style.animationDelay = (baseDelay + 0.45) + 's';

    face.querySelectorAll('.blob-eye').forEach(function (eye, i) {
      eye.style.animationDelay = (baseDelay + i * 0.7) + 's';
    });

    blob.appendChild(face);
    blob.appendChild(armLeft);
    blob.appendChild(armRight);
    blob.appendChild(legLeft);
    blob.appendChild(legRight);
  }

  function init() {
    var blobs = document.querySelectorAll('.kawaii-blob');
    blobs.forEach(function (blob, index) {
      // Evita duplicar si el script corre más de una vez
      if (!blob.querySelector('.blob-face')) {
        addFaceAndArms(blob, index);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();