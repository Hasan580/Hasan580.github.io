// Terminal Simulator
class TerminalSimulator {
    constructor(container) {
        this.container = container;
        this.output = container.querySelector('.terminal-output');
        this.input = container.querySelector('.terminal-input');
        this.prompt = container.querySelector('.terminal-prompt');
        
        this.commands = {
            help: () => this.showHelp(),
            clear: () => this.clearTerminal(),
            about: () => this.showAbout(),
            skills: () => this.showSkills(),
            projects: () => this.showProjects(),
            contact: () => this.showContact(),
            date: () => new Date().toString(),
            whoami: () => 'Hassan F. Abd-Almuttaleb - Control Engineer & Web Developer',
            pwd: () => '/home/hassan/portfolio',
            ls: () => 'about.txt  skills.txt  projects.txt  contact.txt',
            echo: (args) => args.join(' '),
            cat: (args) => this.catCommand(args[0]),
            neofetch: () => this.showNeofetch(),
            matrix: () => this.startMatrix(),
            fortune: () => this.getFortune()
        };
        
        this.commandHistory = [];
        this.historyIndex = -1;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.addOutput('Welcome to Hassan\'s Interactive Terminal!');
        this.addOutput('Type "help" for available commands.');
        this.addOutput('');
    }
    
    setupEventListeners() {
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.navigateHistory('up');
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.navigateHistory('down');
            }
        });
        
        this.container.addEventListener('click', () => {
            this.input.focus();
        });
    }
    
    executeCommand() {
        const command = this.input.value.trim();
        if (command) {
            this.addOutput(`hassan@portfolio:~$ ${command}`);
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
            
            const parts = command.split(' ');
            const cmd = parts[0].toLowerCase();
            const args = parts.slice(1);
            
            if (this.commands[cmd]) {
                try {
                    const result = this.commands[cmd](args);
                    if (result) {
                        this.addOutput(result);
                    }
                } catch (error) {
                    this.addOutput(`Error: ${error.message}`);
                }
            } else {
                this.addOutput(`Command not found: ${cmd}. Type "help" for available commands.`);
            }
            
            this.addOutput('');
        }
        
        this.input.value = '';
        this.scrollToBottom();
    }
    
    navigateHistory(direction) {
        if (direction === 'up' && this.historyIndex > 0) {
            this.historyIndex--;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex < this.commandHistory.length - 1) {
            this.historyIndex++;
            this.input.value = this.commandHistory[this.historyIndex];
        } else if (direction === 'down' && this.historyIndex === this.commandHistory.length - 1) {
            this.historyIndex = this.commandHistory.length;
            this.input.value = '';
        }
    }
    
    addOutput(text) {
        const line = document.createElement('div');
        line.textContent = text;
        this.output.appendChild(line);
    }
    
    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }
    
    clearTerminal() {
        this.output.innerHTML = '';
    }
    
    showHelp() {
        return `Available commands:
help      - Show this help message
clear     - Clear the terminal
about     - Learn about Hassan
skills    - Show technical skills
projects  - List projects
contact   - Show contact information
date      - Show current date and time
whoami    - Show current user
pwd       - Show current directory
ls        - List files
cat       - Read file content (try: cat about.txt)
echo      - Echo text
neofetch  - Show system information
matrix    - Start matrix effect
fortune   - Get a random quote

Use arrow keys to navigate command history.`;
    }
    
    showAbout() {
        return `Hassan F. Abd-Almuttaleb
========================

I'm a Control Engineer with a passion for technology and creativity.
Alongside my engineering background, I'm also a Web Developer and Designer.
I love building smart systems and bringing ideas to life through clean,
responsive, and visually engaging websites.

Location: Baghdad, Iraq
Email: hassan.f.abdalmuttaleb@gmail.com
Phone: +964 7806804467`;
    }
    
    showSkills() {
        return `Technical Skills:
================
• Computer Technology     • HTML/CSS/JavaScript
• Node.js                • C++ Programming
• Python                 • AutoCAD
• Figma Design           • Adobe Premiere
• Microsoft Office       • Problem Solving
• Windows App Development • Web Development

Engineering Focus:
=================
• Control Systems        • Smart System Design
• Automation            • System Integration`;
    }
    
    showProjects() {
        return `Current Projects:
================
1. Interactive Portfolio Website
   - Modern responsive design
   - Interactive particle system
   - Built-in games and tools
   
2. Snake Game Implementation
   - Classic arcade game in JavaScript
   - Canvas-based graphics
   - Smooth animations
   
3. Developer Tools Suite
   - Multi-purpose utility toolkit
   - Calculator, color picker, converters
   - Base64 encoder/decoder
   
4. Terminal Simulator
   - Interactive command-line interface
   - Command history and navigation
   - Custom commands and responses

More projects coming soon!`;
    }
    
    showContact() {
        return `Contact Information:
===================
Email:     hassan.f.abdalmuttaleb@gmail.com
Phone:     +964 7806804467
GitHub:    https://github.com/Hasan580
LinkedIn:  https://linkedin.com/in/hassan-f-abd-almuttaleb-32aaa0226/
Instagram: https://instagram.com/hsn_fi0/
Telegram:  https://t.me/hassanazawi
Discord:   https://discord.gg/ph8vmCh3`;
    }
    
    catCommand(filename) {
        const files = {
            'about.txt': this.showAbout(),
            'skills.txt': this.showSkills(),
            'projects.txt': this.showProjects(),
            'contact.txt': this.showContact()
        };
        
        if (filename && files[filename]) {
            return files[filename];
        } else {
            return `cat: ${filename || 'filename'}: No such file or directory
Available files: ${Object.keys(files).join(', ')}`;
        }
    }
    
    showNeofetch() {
        return `                    hassan@portfolio
                    =================
      ██████        OS: Portfolio Web v1.0
    ██      ██      Host: GitHub Pages
  ██          ██    Kernel: JavaScript ES6+
██              ██  Uptime: ${Math.floor(Date.now() / 1000 / 60)} minutes
██      ████    ██  Packages: HTML5, CSS3, JS
██    ██    ██  ██  Shell: Terminal Simulator
  ██    ████  ██    Resolution: Responsive
    ██      ██      DE: Modern Web UI
      ██████        WM: CSS Grid & Flexbox
                    Theme: Black & White
                    Icons: Emoji + Custom
                    Terminal: Custom Built
                    CPU: Your Browser
                    Memory: Optimized`;
    }
    
    startMatrix() {
        // Simple matrix effect in terminal
        let chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        let result = '';
        
        for (let i = 0; i < 10; i++) {
            let line = '';
            for (let j = 0; j < 50; j++) {
                line += Math.random() > 0.5 ? chars[Math.floor(Math.random() * chars.length)] : ' ';
            }
            result += line + '\\n';
        }
        
        return `Matrix Effect Activated:
${result}
"There is no spoon" - The Matrix`;
    }
    
    getFortune() {
        const fortunes = [
            "The best way to predict the future is to create it.",
            "Code is poetry written in logic.",
            "Every expert was once a beginner.",
            "The only way to do great work is to love what you do.",
            "Innovation distinguishes between a leader and a follower.",
            "Stay hungry, stay foolish.",
            "The future belongs to those who believe in the beauty of their dreams.",
            "Success is not the key to happiness. Happiness is the key to success.",
            "The greatest glory in living lies not in never falling, but in rising every time we fall.",
            "Life is what happens to you while you're busy making other plans."
        ];
        
        return fortunes[Math.floor(Math.random() * fortunes.length)];
    }
}