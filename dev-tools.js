// Developer Tools Suite
class DevTools {
    constructor() {
        this.activeTab = 'calculator';
        this.init();
    }
    
    init() {
        this.setupTabSwitching();
        this.setupCalculator();
        this.setupColorPicker();
        this.setupUnitConverter();
        this.setupBase64Tool();
    }
    
    setupTabSwitching() {
        const tabs = document.querySelectorAll('.tool-tab');
        const contents = document.querySelectorAll('.tool-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === `${tabId}-tool`) {
                        content.classList.add('active');
                    }
                });
                
                this.activeTab = tabId;
            });
        });
    }
    
    setupCalculator() {
        const display = document.getElementById('calc-display');
        const buttons = document.querySelectorAll('.calc-btn');
        let currentInput = '0';
        let operator = null;
        let previousInput = null;
        let waitingForInput = false;
        
        const updateDisplay = () => {
            display.textContent = currentInput;
        };
        
        const calculate = (prev, current, op) => {
            const a = parseFloat(prev);
            const b = parseFloat(current);
            
            switch(op) {
                case '+': return a + b;
                case '-': return a - b;
                case '*': return a * b;
                case '/': return a / b;
                default: return b;
            }
        };
        
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.dataset.value;
                
                if (value >= '0' && value <= '9' || value === '.') {
                    if (waitingForInput) {
                        currentInput = value;
                        waitingForInput = false;
                    } else {
                        currentInput = currentInput === '0' ? value : currentInput + value;
                    }
                } else if (['+', '-', '*', '/'].includes(value)) {
                    if (operator && !waitingForInput) {
                        const result = calculate(previousInput, currentInput, operator);
                        currentInput = result.toString();
                        updateDisplay();
                    }
                    operator = value;
                    previousInput = currentInput;
                    waitingForInput = true;
                } else if (value === '=') {
                    if (operator && previousInput && !waitingForInput) {
                        const result = calculate(previousInput, currentInput, operator);
                        currentInput = result.toString();
                        operator = null;
                        previousInput = null;
                        waitingForInput = true;
                    }
                } else if (value === 'C') {
                    currentInput = '0';
                    operator = null;
                    previousInput = null;
                    waitingForInput = false;
                } else if (value === '±') {
                    currentInput = (parseFloat(currentInput) * -1).toString();
                }
                
                updateDisplay();
            });
        });
        
        updateDisplay();
    }
    
    setupColorPicker() {
        const colorInput = document.getElementById('color-input');
        const colorPreview = document.getElementById('color-preview');
        const hexValue = document.getElementById('hex-value');
        const rgbValue = document.getElementById('rgb-value');
        const hslValue = document.getElementById('hsl-value');
        
        const updateColorInfo = (color) => {
            colorPreview.style.backgroundColor = color;
            hexValue.textContent = color;
            
            // Convert hex to RGB
            const r = parseInt(color.substr(1, 2), 16);
            const g = parseInt(color.substr(3, 2), 16);
            const b = parseInt(color.substr(5, 2), 16);
            rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
            
            // Convert RGB to HSL
            const hsl = this.rgbToHsl(r, g, b);
            hslValue.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        };
        
        colorInput.addEventListener('input', (e) => {
            updateColorInfo(e.target.value);
        });
        
        // Copy to clipboard functionality
        [hexValue, rgbValue, hslValue].forEach(element => {
            element.addEventListener('click', () => {
                navigator.clipboard.writeText(element.textContent).then(() => {
                    element.style.background = '#00ff00';
                    setTimeout(() => {
                        element.style.background = '';
                    }, 200);
                });
            });
        });
        
        updateColorInfo(colorInput.value);
    }
    
    setupUnitConverter() {
        const lengthFrom = document.getElementById('length-from');
        const lengthTo = document.getElementById('length-to');
        const lengthInput = document.getElementById('length-input');
        const lengthResult = document.getElementById('length-result');
        
        const lengthUnits = {
            mm: 1,
            cm: 10,
            m: 1000,
            km: 1000000,
            in: 25.4,
            ft: 304.8,
            yd: 914.4,
            mi: 1609344
        };
        
        const convertLength = () => {
            const value = parseFloat(lengthInput.value) || 0;
            const fromUnit = lengthFrom.value;
            const toUnit = lengthTo.value;
            
            const mmValue = value * lengthUnits[fromUnit];
            const result = mmValue / lengthUnits[toUnit];
            
            lengthResult.textContent = result.toFixed(6).replace(/\.?0+$/, '');
        };
        
        [lengthFrom, lengthTo, lengthInput].forEach(element => {
            element.addEventListener('change', convertLength);
            element.addEventListener('input', convertLength);
        });
        
        convertLength();
    }
    
    setupBase64Tool() {
        const base64Input = document.getElementById('base64-input');
        const base64Output = document.getElementById('base64-output');
        const encodeBtn = document.getElementById('encode-btn');
        const decodeBtn = document.getElementById('decode-btn');
        
        encodeBtn.addEventListener('click', () => {
            try {
                const encoded = btoa(base64Input.value);
                base64Output.value = encoded;
            } catch (error) {
                base64Output.value = 'Error: Invalid input for encoding';
            }
        });
        
        decodeBtn.addEventListener('click', () => {
            try {
                const decoded = atob(base64Input.value);
                base64Output.value = decoded;
            } catch (error) {
                base64Output.value = 'Error: Invalid Base64 string';
            }
        });
    }
    
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        
        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }
        
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DevTools();
});