// Import HTML elements
const hexInputBox = document.getElementById('hex-input');
const rgbInputBox = document.getElementById('rgb-input');
const hslInputBox = document.getElementById('hsl-input');

// this is a comment

// Add events
document.getElementById('colorInput').addEventListener('input', pickerUpdateColor);
hexInputBox.addEventListener('input', handleHexInputUpdate);
rgbInputBox.addEventListener('input', handleRgbInputUpdate);
hslInputBox.addEventListener('input', handleHslInputUpdate);
document.getElementById('copy-hex').addEventListener('click', () => copyToClipboard('hex-input'));
document.getElementById('copy-rgb').addEventListener('click', () => copyToClipboard('rgb-input'));
document.getElementById('copy-hsl').addEventListener('click', () => copyToClipboard('hsl-input'));

// Event functions

function pickerUpdateColor() {
  const color = document.getElementById('colorInput').value;
  document.getElementById('sample-box').style.backgroundColor = color;
  document.getElementById('hex-input').value = color;

  const rgb = hexToRgb(color);
  if (rgb) {
    document.getElementById('rgb-input').value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById('hsl-input').value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
  }
}

function handleHexInputUpdate() {
  const hex = hexInputBox.value;
  if (!/^#?([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/.test(hex)) {
    alert("Invalid hex color format");
    return;
  }
  
  document.getElementById('sample-box').style.backgroundColor = hex;
  const rgb = hexToRgb(hex);
  if (rgb) {
    document.getElementById('rgb-input').value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById('hsl-input').value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
  }
}

function handleRgbInputUpdate() {
  try {
    const rgb = rgbStringConvert(rgbInputBox.value);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    document.getElementById('sample-box').style.backgroundColor = hex;
    document.getElementById('hex-input').value = hex;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById('hsl-input').value = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`;
  } catch (e) {
    alert("Invalid RGB format. Please enter in format: 'R, G, B'");
  }
}

function handleHslInputUpdate() {
  try {
    const hsl = hslStringConvert(hslInputBox.value);
    const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    document.getElementById('sample-box').style.backgroundColor = hex;
    document.getElementById('hex-input').value = hex;
    document.getElementById('rgb-input').value = `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  } catch (e) {
    alert("Invalid HSL format. Please enter in format: 'H, S%, L%'");
  }
}

// Helper functions
function copyToClipboard(elementId) {
    const input = document.getElementById(elementId);
    input.select();
    input.setSelectionRange(0, 99999); // For mobile devices
    document.execCommand("copy");

    // Optional: Alert the copied value or show a message
    alert(`Copied: ${input.value}`);
}

function rgbStringConvert(rgbString) {
  const [r, g, b] = rgbString.split(",").map(num => parseInt(num.trim(), 10));
  if ([r, g, b].some(num => isNaN(num) || num < 0 || num > 255)) {
    throw new Error("Invalid RGB values");
  }
  return { r, g, b };
}

function hslStringConvert(hslString) {
  const [h, s, l] = hslString.replace(/%/g, '').split(',').map(num => parseInt(num.trim(), 10));
  if ([h, s, l].some(num => isNaN(num)) || h < 0 || h >= 360 || s < 0 || s > 100 || l < 0 || l > 100) {
    throw new Error("Invalid HSL values");
  }
  return { h, s, l };
}

function hexToRgb(hex) {
  if (hex.startsWith("#")) hex = hex.slice(1);
  let r, g, b;

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else {
    return null;
  }

  return { r, g, b };
}

function rgbToHex(r, g, b) {
  const toHex = (value) => {
    const hex = Math.max(0, Math.min(255, value)).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hueToRgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hueToRgb(p, q, h + 1 / 3);
    g = hueToRgb(p, q, h);
    b = hueToRgb(p, q, h - 1 / 3);
  }

  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}