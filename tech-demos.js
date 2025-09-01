// Tech Demos & Interactive Features
class TechDemos {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupCodeEditor();
        this.setupCSSPlayground();
        this.setupChallenges();
    }
    
    setupCodeEditor() {
        // Tab switching for code editor
        const editorTabs = document.querySelectorAll('.editor-tab');
        const codeTextareas = document.querySelectorAll('.code-textarea');
        
        editorTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.dataset.lang;
                
                // Update active tab
                editorTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active textarea
                codeTextareas.forEach(textarea => {
                    textarea.classList.remove('active');
                    if (textarea.id === `${lang}-editor`) {
                        textarea.classList.add('active');
                    }
                });
            });
        });
        
        // Run code button
        const runBtn = document.getElementById('run-code-btn');
        const clearBtn = document.getElementById('clear-code-btn');
        const preview = document.getElementById('code-preview');
        
        if (runBtn) {
            runBtn.addEventListener('click', () => {
                this.runCode();
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                const activeTextarea = document.querySelector('.code-textarea.active');
                if (activeTextarea) {
                    activeTextarea.value = '';
                }
                if (preview) {
                    preview.srcdoc = '';
                }
            });
        }
        
        // Auto-run code on load
        setTimeout(() => this.runCode(), 1000);
    }
    
    runCode() {
        const htmlCode = document.getElementById('html-editor').value;
        const cssCode = document.getElementById('css-editor').value;
        const jsCode = document.getElementById('js-editor').value;
        const preview = document.getElementById('code-preview');
        
        if (!preview) return;
        
        const fullCode = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f0f0f0; }
        ${cssCode}
    </style>
</head>
<body>
    ${htmlCode}
    <script>
        try {
            ${jsCode}
        } catch (error) {
            console.error('JavaScript Error:', error);
            document.body.innerHTML += '<p style="color: red;">JavaScript Error: ' + error.message + '</p>';
        }
    </script>
</body>
</html>`;
        
        preview.srcdoc = fullCode;
    }
    
    setupCSSPlayground() {
        const animationSelect = document.getElementById('animation-select');
        const durationSlider = document.getElementById('duration-slider');
        const durationValue = document.getElementById('duration-value');
        const colorSelect = document.getElementById('color-select');
        const sizeSlider = document.getElementById('size-slider');
        const sizeValue = document.getElementById('size-value');
        const animatedElement = document.getElementById('animated-element');
        
        if (!animatedElement) return;
        
        const animations = {
            bounce: 'bounce 2s infinite',
            rotate: 'rotate 2s linear infinite',
            pulse: 'pulse 2s infinite',
            shake: 'shake 2s infinite',
            swing: 'swing 2s infinite'
        };
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-30px); }
                60% { transform: translateY(-15px); }
            }
            @keyframes rotate {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
            @keyframes swing {
                20% { transform: rotate(15deg); }
                40% { transform: rotate(-10deg); }
                60% { transform: rotate(5deg); }
                80% { transform: rotate(-5deg); }
                100% { transform: rotate(0deg); }
            }
        `;
        document.head.appendChild(style);
        
        const updateAnimation = () => {
            const animation = animationSelect?.value || 'none';
            const duration = durationSlider?.value || '2';
            const color = colorSelect?.value || '#3498db';
            const size = sizeSlider?.value || '100';
            
            if (durationValue) durationValue.textContent = duration + 's';
            if (sizeValue) sizeValue.textContent = size + 'px';
            
            animatedElement.style.fontSize = size + 'px';
            animatedElement.style.color = color;
            animatedElement.style.animation = animation === 'none' ? 'none' : 
                animations[animation].replace('2s', duration + 's');
        };
        
        // Event listeners
        [animationSelect, durationSlider, colorSelect, sizeSlider].forEach(element => {
            if (element) {
                element.addEventListener('change', updateAnimation);
                element.addEventListener('input', updateAnimation);
            }
        });
        
        // Initial setup
        updateAnimation();
    }
    
    setupChallenges() {
        // Challenge tab switching
        const challengeTabs = document.querySelectorAll('.challenge-tab');
        const challenges = document.querySelectorAll('.challenge');
        
        challengeTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const challengeId = tab.dataset.challenge;
                
                // Update active tab
                challengeTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active challenge
                challenges.forEach(challenge => {
                    challenge.classList.remove('active');
                    if (challenge.id === `${challengeId}-challenge`) {
                        challenge.classList.add('active');
                    }
                });
            });
        });
    }
}

// Challenge runner functions
function runChallenge(type) {
    const codeElement = document.getElementById(`${type}-code`);
    const outputElement = document.getElementById(`${type}-output`);
    
    if (!codeElement || !outputElement) return;
    
    const code = codeElement.value;
    let result = '';
    
    try {
        switch (type) {
            case 'fizzbuzz':
                result = runFizzBuzz(code);
                break;
            case 'palindrome':
                result = runPalindrome(code);
                break;
            case 'fibonacci':
                result = runFibonacci(code);
                break;
            case 'sorting':
                result = runSorting(code);
                break;
        }
        
        outputElement.innerHTML = `<div class="success">✅ ${result}</div>`;
    } catch (error) {
        outputElement.innerHTML = `<div class="error">❌ Error: ${error.message}</div>`;
    }
}

function runFizzBuzz(code) {
    let output = [];
    let originalLog = console.log;
    
    // Capture console.log output
    console.log = function(msg) {
        output.push(msg);
    };
    
    try {
        eval(code);
        console.log = originalLog;
        
        if (output.length === 0) {
            throw new Error('No output generated. Make sure to use console.log() or modify the code to capture output.');
        }
        
        // Check if it's a valid FizzBuzz
        const expected = [];
        for (let i = 1; i <= 100; i++) {
            if (i % 15 === 0) expected.push('FizzBuzz');
            else if (i % 3 === 0) expected.push('Fizz');
            else if (i % 5 === 0) expected.push('Buzz');
            else expected.push(i);
        }
        
        const first10 = output.slice(0, 10);
        const isCorrect = first10.every((val, idx) => val.toString() === expected[idx].toString());
        
        return isCorrect ? 
            `Success! First 10 outputs: ${first10.join(', ')}...` :
            `Output generated but may not be correct. First 10: ${first10.join(', ')}...`;
    } finally {
        console.log = originalLog;
    }
}

function runPalindrome(code) {
    eval(code);
    
    if (typeof isPalindrome !== 'function') {
        throw new Error('Please define a function called "isPalindrome"');
    }
    
    const tests = [
        { input: 'racecar', expected: true },
        { input: 'hello', expected: false },
        { input: 'A man a plan a canal Panama', expected: true },
        { input: 'race a car', expected: false }
    ];
    
    let passed = 0;
    const results = tests.map(test => {
        const normalizedInput = test.input.toLowerCase().replace(/[^a-z0-9]/g, '');
        const result = isPalindrome(normalizedInput);
        const correct = result === test.expected;
        if (correct) passed++;
        return `"${test.input}" → ${result} ${correct ? '✓' : '✗'}`;
    });
    
    return `${passed}/${tests.length} tests passed:\n${results.join('\n')}`;
}

function runFibonacci(code) {
    eval(code);
    
    if (typeof fibonacci !== 'function') {
        throw new Error('Please define a function called "fibonacci"');
    }
    
    const result = fibonacci(10);
    const expected = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34];
    
    if (!Array.isArray(result)) {
        throw new Error('Function should return an array');
    }
    
    const isCorrect = result.length === 10 && 
        result.every((val, idx) => val === expected[idx]);
    
    return isCorrect ? 
        `Success! Result: [${result.join(', ')}]` :
        `Generated: [${result.join(', ')}]\nExpected: [${expected.join(', ')}]`;
}

function runSorting(code) {
    eval(code);
    
    if (typeof sortArray !== 'function') {
        throw new Error('Please define a function called "sortArray"');
    }
    
    const testArray = [64, 34, 25, 12, 22, 11, 90];
    const result = sortArray([...testArray]);
    const expected = [11, 12, 22, 25, 34, 64, 90];
    
    if (!Array.isArray(result)) {
        throw new Error('Function should return an array');
    }
    
    const isCorrect = result.length === expected.length && 
        result.every((val, idx) => val === expected[idx]);
    
    return isCorrect ? 
        `Success! Sorted: [${result.join(', ')}]` :
        `Input: [${testArray.join(', ')}]\nYour result: [${result.join(', ')}]\nExpected: [${expected.join(', ')}]`;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TechDemos();
});