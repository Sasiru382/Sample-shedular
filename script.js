// Hello World App Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial State & Data
    let clickCount = 0;
    const languages = [
        { name: 'JavaScript', filename: 'hello.js', code: 'console.log("Hello, World!");' },
        { name: 'Python', filename: 'hello.py', code: 'print("Hello, World!")' },
        { name: 'HTML', filename: 'index.html', code: '<h1>Hello, World!</h1>' },
        { name: 'TypeScript', filename: 'hello.ts', code: 'const message: string = "Hello, World!";\nconsole.log(message);' },
        { name: 'C++', filename: 'hello.cpp', code: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}' },
        { name: 'Java', filename: 'Hello.java', code: 'public class Hello {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
        { name: 'Go', filename: 'hello.go', code: 'package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}' },
        { name: 'Rust', filename: 'hello.rs', code: 'fn main() {\n    println!("Hello, World!");\n}' }
    ];

    const greetings = [
        { lang: 'English', text: 'Hello, World!' },
        { lang: 'Spanish', text: '¡Hola, Mundo!' },
        { lang: 'French', text: 'Bonjour le Monde!' },
        { lang: 'German', text: 'Hallo Welt!' },
        { lang: 'Japanese', text: 'こんにちは、世界！' },
        { lang: 'Sinhala', text: 'හෙලෝ ලෝකය!' },
        { lang: 'Italian', text: 'Ciao Mondo!' },
        { lang: 'Chinese', text: '你好，世界！' }
    ];

    let currentGreetingIndex = 0;

    // Elements
    const dynamicGreeting = document.getElementById('dynamic-greeting');
    const greetingLangStat = document.getElementById('greeting-lang');
    const liveTime = document.getElementById('live-time');
    const clickCounter = document.getElementById('click-counter');
    const interactiveBtn = document.getElementById('interactive-btn');
    const currentYear = document.getElementById('current-year');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const langTabs = document.getElementById('lang-tabs');
    const codeFilename = document.getElementById('code-filename');
    const codeSnippet = document.getElementById('code-snippet');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const userNameInput = document.getElementById('user-name-input');
    const greetUserBtn = document.getElementById('greet-user-btn');
    const themeAccentBtn = document.getElementById('theme-accent-btn');
    const colorDots = document.querySelectorAll('.color-dot');

    // 2. Set Current Year
    currentYear.textContent = new Date().getFullYear();

    // 3. Live Clock Update
    function updateClock() {
        const now = new Date();
        liveTime.textContent = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 4. Toast Notification
    function showToast(message) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // 5. Dynamic Greeting Cycle
    interactiveBtn.addEventListener('click', () => {
        clickCount++;
        clickCounter.textContent = clickCount;

        currentGreetingIndex = (currentGreetingIndex + 1) % greetings.length;
        const current = greetings[currentGreetingIndex];

        dynamicGreeting.style.opacity = '0';
        setTimeout(() => {
            dynamicGreeting.textContent = current.text;
            greetingLangStat.textContent = current.lang;
            dynamicGreeting.style.opacity = '1';
        }, 200);

        showToast(`Greeting changed to ${current.lang}!`);
    });

    // 6. Custom User Greeting
    greetUserBtn.addEventListener('click', () => {
        const name = userNameInput.value.trim();
        if (name) {
            clickCount++;
            clickCounter.textContent = clickCount;
            dynamicGreeting.style.opacity = '0';
            setTimeout(() => {
                dynamicGreeting.textContent = `Hello, ${name}!`;
                greetingLangStat.textContent = 'Custom';
                dynamicGreeting.style.opacity = '1';
            }, 200);
            showToast(`Hello ${name}! Welcome to the app.`);
        } else {
            showToast('Please enter your name first.');
        }
    });

    // 7. Languages Tabs & Code Snippet
    function renderLangTabs() {
        langTabs.innerHTML = '';
        languages.forEach((lang, index) => {
            const tab = document.createElement('button');
            tab.className = `lang-tab ${index === 0 ? 'active' : ''}`;
            tab.textContent = lang.name;
            tab.addEventListener('click', () => {
                document.querySelectorAll('.lang-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                codeFilename.textContent = lang.filename;
                codeSnippet.textContent = lang.code;
            });
            langTabs.appendChild(tab);
        });
        // Initial setup
        codeFilename.textContent = languages[0].filename;
        codeSnippet.textContent = languages[0].code;
    }
    renderLangTabs();

    // Copy Code Button
    copyCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(codeSnippet.textContent).then(() => {
            showToast('Code snippet copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy code.');
        });
    });

    // 8. Theme Accent Changer
    const themes = ['purple', 'cyan', 'emerald', 'rose', 'amber'];
    let currentThemeIdx = 0;

    function setTheme(themeName) {
        if (themeName === 'purple') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', themeName);
        }
        colorDots.forEach(dot => {
            if (dot.dataset.color === themeName) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    colorDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const color = dot.dataset.color;
            setTheme(color);
            showToast(`Theme changed to ${color.toUpperCase()}`);
        });
    });

    themeAccentBtn.addEventListener('click', () => {
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        setTheme(themes[currentThemeIdx]);
        showToast(`Theme preset: ${themes[currentThemeIdx].toUpperCase()}`);
    });

    // 9. Interactive Particle Background Canvas
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
});
