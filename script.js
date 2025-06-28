const textInput = document.getElementById('textInput');
const colorInput = document.getElementById('colorInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrCodeDiv = document.getElementById('qrCode');

let currentDataUrl = '';

function generateQRCode() {
  const text = textInput.value.trim();
  const color = colorInput.value;

  if (!text) {
    alert('Įveskite tekstą!');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generuojama...';

  QRCode.toCanvas(text, {
    color: {
      dark: color,
      light: '#121212'  // tamsus fonas QR fone
    },
    margin: 2,
    width: 256
  }, function (err, canvas) {
    if (err) {
      generateBtn.disabled = false;
      generateBtn.textContent = 'Generuoti QR';
      alert('Klaida generuojant QR kodą.');
      return;
    }

    // Add watermark
    const ctx = canvas.getContext('2d');
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'; // Semi-transparent white for watermark
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText('Zybsnis QR', 250, 250); // Position in bottom-right corner

    // Convert canvas to data URL
    currentDataUrl = canvas.toDataURL('image/png');
    
    // Display the QR code
    qrCodeDiv.innerHTML = `<img src="${currentDataUrl}" alt="QR kodas" />`;
    
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generuoti QR';
    downloadBtn.disabled = false;
  });
}

generateBtn.addEventListener('click', generateQRCode);

downloadBtn.addEventListener('click', () => {
  if (!currentDataUrl) return;

  const a = document.createElement('a');
  a.href = currentDataUrl;
  a.download = 'zybsnis-qr.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});