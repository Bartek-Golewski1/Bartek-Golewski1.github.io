function drawGrid(canvasID){
  const canvas = document.getElementById(canvasID);
  const ctx = canvas.getContext('2d');

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  const cols = 4;
  const rows = 4;
  const cellWidth = canvas.width / cols;
  const cellHeight = canvas.height / cols;

  for(let i = 1; i< cols; i++){
    ctx.beginPath();
    ctx.moveTo(i * cellWidth,0);
    ctx.lineTo(i*cellWidth,canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  for (let i = 1; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellHeight);
    ctx.lineTo(canvas.width, i * cellHeight);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

let mapInstance = null;
function map() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      if (!mapInstance) {
        mapInstance = L.map('window1').setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
          attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);

        L.marker([lat, lng]).addTo(mapInstance).bindPopup('Twoja lokalizacja').openPopup();
      } else {

        mapInstance.setView([lat, lng], 13);

      }
    }, function(error) {
      console.error('Error getting location:', error);
      alert("Nie udało się pobrać lokalizacji");
    });
  }

}

function puzzle() {
  if (!mapInstance) {
    alert("Nie ma mapy");
    return;
  }

  drawGrid('window2');

  const canvas = document.getElementById('window2');
  const ctx = canvas.getContext('2d');
  const puzzleContainer = document.getElementById('puzzle-container');
  puzzleContainer.innerHTML = '';

  leafletImage(mapInstance, function(err, mapCanvas) {
    if (err) {
      console.error('Błąd podczas tworzenia obrazu mapy:', err);
      alert('Nie udało się pobrać obrazu mapy.');
      return;
    }

    const cols = 4;
    const rows = 4;
    const puzzleWidth = mapCanvas.width / cols;
    const puzzleHeight = mapCanvas.height / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = puzzleWidth;
        pieceCanvas.height = puzzleHeight;
        const pieceCtx = pieceCanvas.getContext('2d');

        pieceCtx.drawImage(
          mapCanvas,
          i * puzzleWidth, j * puzzleHeight, puzzleWidth, puzzleHeight,
          0, 0, puzzleWidth, puzzleHeight
        );

        const pieceImg = document.createElement('img');
        pieceImg.src = pieceCanvas.toDataURL();
        pieceImg.style.width = '100px';
        pieceImg.style.height = '100px';
        pieceImg.draggable = true;
        pieceImg.dataset.index = `${i}-${j}`;

        pieceImg.style.position = 'absolute';
        pieceImg.style.left = Math.random() * (puzzleContainer.offsetWidth - 100) + 'px';
        pieceImg.style.top = Math.random() * (puzzleContainer.offsetHeight - 100) + 'px';

        // Event drag
        pieceImg.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', e.target.dataset.index);
        });

        puzzleContainer.appendChild(pieceImg);
      }
    }

    canvas.addEventListener('dragover', (e) => e.preventDefault());
    canvas.addEventListener('drop', (e) => {
      e.preventDefault();
      const index = e.dataTransfer.getData('text/plain');

      // Pobierz pozycję drop względem canvasu
      const rect = canvas.getBoundingClientRect();
      const dropX = e.clientX - rect.left;
      const dropY = e.clientY - rect.top;

      const cols = 4;
      const rows = 4;
      const cellWidth = canvas.width / cols;
      const cellHeight = canvas.height / rows;

      // Oblicz, w którym kwadracie grida upuszczono puzzle (na podstawie pozycji myszy)
      const gridCol = Math.floor(dropX / cellWidth);
      const gridRow = Math.floor(dropY / cellHeight);

      // Sprawdź, czy pozycja jest w granicach grida
      if (gridCol >= 0 && gridCol < cols && gridRow >= 0 && gridRow < rows) {
        const dx = gridCol * cellWidth;
        const dy = gridRow * cellHeight;

        // Narysuj puzzle w wybranym miejscu
        const puzzleImg = document.querySelector(`img[data-index="${index}"]`);
        if (puzzleImg) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, dx, dy, cellWidth, cellHeight);
            puzzleImg.remove();
          };
          img.src = puzzleImg.src;
        }
      }
    });
})
}

