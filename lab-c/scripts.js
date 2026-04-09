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
