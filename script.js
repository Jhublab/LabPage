const templateSelect = document.getElementById('templateSelect');
const textInputs = document.getElementById('textInputs');
const wifiInputs = document.getElementById('wifiInputs');
const urlInputs = document.getElementById('urlInputs');
const emailInputs = document.getElementById('emailInputs');
const phoneInputs = document.getElementById('phoneInputs');
const vcardInputs = document.getElementById('vcardInputs');
const textInput = document.getElementById('textInput');
const wifiSSID = document.getElementById('wifiSSID');
const wifiPassword = document.getElementById('wifiPassword');
const wifiEncryption = document.getElementById('wifiEncryption');
const urlInput = document.getElementById('urlInput');
const emailInput = document.getElementById('emailInput');
const phoneInput = document.getElementById('phoneInput');
const vcardName = document.getElementById('vcardName');
const vcardEmail = document.getElementById('vcardEmail');
const vcardPhone = document.getElementById('vcardPhone');
const colorInput = document.getElementById('colorInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrCodeDiv = document.getElementById('qrCode');

let currentDataUrl = '';

// Rodyti/slėpti įvesties laukus pagal pasirinktą šabloną
function updateInputFields() {
  const template = templateSelect.value;
  document.querySelectorAll('.template-inputs').forEach(div => {
    div.style.display = div.id === `${template}Inputs` ? 'block' : 'none';
  });
  generateBtn.disabled = !isValidInput();
}

// Tikrinti, ar įvestis yra tinkama
function isValidInput() {
  const template = templateSelect.value;
  switch (template) {
    case 'text':
      return textInput.value.trim() !== '';
    case 'wifi':
      return wifiSSID.value.trim() !== '' && wifiPassword.value.trim() !== '';
    case 'url':
      return urlInput.value.trim() !== '';
    case 'email':
      return emailInput.value.trim() !== '';
    case 'phone':
      return phoneInput.value.trim() !== '';
    case 'vcard':
      return vcardName.value.trim() !== '' || vcardEmail.value.trim() !== '' || vcardPhone.value.trim() !== '';
    default:
      return false;
  }
}

function updateButtonState() {
  generateBtn.disabled = !isValidInput();
}

// Formatuoti QR tekstą
function formatQRText() {
  const template = templateSelect.value;
  switch (template) {
    case 'text':
      return textInput.value.trim();
    case 'wifi':
      return `WIFI:S:${wifiSSID.value};T:${wifiEncryption.value};P:${wifiPassword.value};;`;
    case 'url':
      return urlInput.value.trim();
    case 'email':
      return `mailto:${emailInput.value.trim()}`;
    case 'phone':
      return `tel:${phoneInput.value.trim()}`;
    case 'vcard':
      return `BEGIN:VCARD\nVERSION:3.0\nN:${vcardName.value.trim()}\nEMAIL:${vcardEmail.value.trim()}\nTEL:${vcardPhone.value.trim()}\nEND:VCARD`;
    default:
      return '';
  }
}

// Nauja teisinga QR generavimo funkcija
function generateQRCode() {
  const text = formatQRText();
  const color = colorInput.value;

  if (!text) {
    alert('Įveskite reikiamą informaciją!');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Generuojama...';
  qrCodeDiv.innerHTML = '';

  // Sukuriam QR objektą
  const qr = new QRCode(qrCodeDiv, {
    text: text,
    width: 256,
    height: 256,
    colorDark: color,
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  setTimeout(() => {
    const canvas = qrCodeDiv.querySelector('canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.font = '12px sans-serif';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Zybsnis QR', 250, 250);
      currentDataUrl = canvas.toDataURL('image/png');
      downloadBtn.disabled = false;
    } else {
      alert('Nepavyko sugeneruoti QR kodo.');
    }

    generateBtn.disabled = false;
    generateBtn.textContent = 'Generuoti QR';
  }, 300);
}

// Atsisiuntimo funkcija
downloadBtn.addEventListener('click', () => {
  if (!currentDataUrl) return;

  const a = document.createElement('a');
  a.href = currentDataUrl;
  a.download = 'zybsnis-qr.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Įvykių klausytojai
templateSelect.addEventListener('change', updateInputFields);
textInput.addEventListener('input', updateButtonState);
wifiSSID.addEventListener('input', updateButtonState);
wifiPassword.addEventListener('input', updateButtonState);
urlInput.addEventListener('input', updateButtonState);
emailInput.addEventListener('input', updateButtonState);
phoneInput.addEventListener('input', updateButtonState);
vcardName.addEventListener('input', updateButtonState);
vcardEmail.addEventListener('input', updateButtonState);
vcardPhone.addEventListener('input', updateButtonState);
generateBtn.addEventListener('click', generateQRCode);

// Inicializacija
updateInputFields();

