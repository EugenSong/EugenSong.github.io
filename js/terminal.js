class Terminal {
    constructor() {
        this.currentInput = '';
        this.history = [];
        this.historyIndex = -1;
        this.commands = {
            'help': this.showHelp,
            'projects': this.showProjects,
            'about': this.showAbout,
            'resume': this.openResume,
            'contact': this.showContact,
            'skills': this.showSkills,
            'clear': this.clearTerminal,
            'exit': this.exitTerminal,
            '1': this.showProjects,
            '2': this.showAbout,
            '3': this.openResume,
            '4': this.showContact,
            '5': this.showSkills,
            '6': this.clearTerminal,
            '7': this.showHelp,
            '8': this.exitTerminal
        };
        
        this.init();
    }

    init() {
        this.userInputElement = document.getElementById('user-input');
        this.terminalContent = document.getElementById('terminal-content');
        this.cursor = document.getElementById('cursor');
        
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        document.addEventListener('click', () => this.focusTerminal());
        
        // Auto-focus terminal
        this.focusTerminal();
    }

    focusTerminal() {
        // Keep terminal focused for typing
        document.body.focus();
    }

    handleKeyPress(e) {
        e.preventDefault();
        
        switch(e.key) {
            case 'Enter':
                this.processCommand();
                break;
            case 'Backspace':
                this.handleBackspace();
                break;
            case 'ArrowUp':
                this.navigateHistory(-1);
                break;
            case 'ArrowDown':
                this.navigateHistory(1);
                break;
            case 'Tab':
                this.handleTab();
                break;
            default:
                if (e.key.length === 1) {
                    this.addCharacter(e.key);
                }
        }
    }

    addCharacter(char) {
        this.currentInput += char;
        this.updateDisplay();
    }

    handleBackspace() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateDisplay();
        }
    }

    updateDisplay() {
        this.userInputElement.textContent = this.currentInput;
    }

    processCommand() {
        const command = this.currentInput.trim().toLowerCase();
        
        // Add to history
        if (command && command !== this.history[this.history.length - 1]) {
            this.history.push(command);
        }
        this.historyIndex = this.history.length;

        // Display the command
        this.addToTerminal(`eugene@portfolio:~$ ${this.currentInput}`);
        
        // Process the command
        if (command in this.commands) {
            this.commands[command].call(this);
        } else if (command === '') {
            // Do nothing for empty command
        } else {
            this.addToTerminal(`Command not found: ${command}. Type 'help' for available commands.`, 'error');
        }
        
        // Reset input
        this.currentInput = '';
        this.updateDisplay();
        this.scrollToBottom();
    }

    addToTerminal(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        
        // Insert before the current input line
        const currentLine = document.querySelector('.current-line');
        currentLine.parentNode.insertBefore(line, currentLine);
    }

    addToTerminalHTML(html) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = html;
        
        const currentLine = document.querySelector('.current-line');
        currentLine.parentNode.insertBefore(line, currentLine);
    }

    scrollToBottom() {
        document.getElementById('terminal-body').scrollTop = document.getElementById('terminal-body').scrollHeight;
    }

    navigateHistory(direction) {
        if (this.history.length === 0) return;
        
        this.historyIndex += direction;
        
        if (this.historyIndex < 0) {
            this.historyIndex = 0;
        } else if (this.historyIndex >= this.history.length) {
            this.historyIndex = this.history.length;
            this.currentInput = '';
        } else {
            this.currentInput = this.history[this.historyIndex];
        }
        
        this.updateDisplay();
    }

    handleTab() {
        const availableCommands = Object.keys(this.commands);
        const matches = availableCommands.filter(cmd => 
            cmd.startsWith(this.currentInput.toLowerCase())
        );
        
        if (matches.length === 1) {
            this.currentInput = matches[0];
            this.updateDisplay();
        }
    }

    showHelp() {
        const helpText = `
Available commands:
  1. projects    - View my portfolio projects
  2. about       - Learn more about me  
  3. resume      - Download my resume
  4. contact     - Get in touch
  5. skills      - View my technical skills
  6. clear       - Clear the terminal
  7. help        - Show this help menu
  8. exit        - Return to original site

You can type the command name or just the number.`;
        
        this.addToTerminal(helpText, 'info');
    }

    showProjects() {
        this.addToTerminal('Loading projects...', 'info');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }

    showAbout() {
        this.addToTerminal('Loading about page...', 'info');
        setTimeout(() => {
            window.location.href = '/about';
        }, 1000);
    }

    openResume() {
        this.addToTerminal('Opening resume...', 'info');
        setTimeout(() => {
            window.open('/assets/css/Eugene_Song_resume.pdf', '_blank');
        }, 1000);
    }

    showContact() {
        const contactInfo = `
Contact Information:
━━━━━━━━━━━━━━━━━━
📧 Email: esong28@outlook.com
💼 LinkedIn: linkedin.com/in/eugenessong
🐙 GitHub: github.com/EugenSong
📝 Medium: medium.com/@esong28

Feel free to reach out for collaboration opportunities!`;
        
        this.addToTerminal(contactInfo, 'info');
    }

    showSkills() {
        const skillsText = `
Technical Skills:
━━━━━━━━━━━━━━━━
💻 Languages: JavaScript, Python, Java, SQL, HTML/CSS
🛠️  Frameworks: React, Node.js, Express, Flask, Spring Boot
☁️  Cloud: AWS (EC2, S3, Lambda, RDS), Docker
🗄️  Databases: PostgreSQL, MongoDB, Redis
🔧 Tools: Git, Jenkins, Postman, VS Code

2+ years of hands-on experience in backend architecture
and cloud infrastructure for healthcare IT applications.`;
        
        this.addToTerminal(skillsText, 'success');
    }

    clearTerminal() {
        const lines = document.querySelectorAll('.terminal-line:not(.current-line)');
        lines.forEach(line => line.remove());
        
        // Re-add welcome message
        const welcomeHTML = `<div class="terminal-output">
                    <pre>
Welcome to Eugene Song's Portfolio Terminal v1.0
Type a command or number to navigate:

Available commands:
  1. projects    - View my portfolio projects
  2. about       - Learn more about me  
  3. resume      - Download my resume
  4. contact     - Get in touch
  5. skills      - View my technical skills
  6. clear       - Clear the terminal
  7. help        - Show this help menu
  8. exit        - Return to original site

                    </pre>
                </div>`;
        
        const currentLine = document.querySelector('.current-line');
        currentLine.parentNode.insertAdjacentHTML('beforebegin', welcomeHTML);
    }

    exitTerminal() {
        this.addToTerminal('Goodbye! Redirecting to main site...', 'warning');
        setTimeout(() => {
            window.location.href = '/original';
        }, 1500);
    }
}

// Initialize terminal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Terminal();
});