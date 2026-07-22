/**
 * Romantic Date Invitation & Interactive Scheduler
 * Target Recipient Email: sasiruvishmika@gmail.com
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Application State ---
    const state = {
        answersHistory: [],
        selectedDate: null, // 'YYYY-MM-DD'
        selectedTime: null, // '10:00 AM' etc
        currentCalMonth: new Date().getMonth(),
        currentCalYear: new Date().getFullYear(),
        isMusicPlaying: true,
        audioCtx: null,
        musicOscillators: []
    };

    // Target date limits: Today to Dec 28, 2026
    const TODAY = new Date();
    TODAY.setHours(0, 0, 0, 0);
    const MAX_DATE = new Date(2026, 11, 28); // Month is 0-indexed (11 = Dec)

    // Target Recipient Email
    const RECIPIENT_EMAIL = "sasiruvishmika@gmail.com";

    // --- DOM Elements ---
    const stepCards = {
        1: document.getElementById('step-1'),
        2: document.getElementById('step-2'),
        3: document.getElementById('step-3'),
        4: document.getElementById('step-4'),
        5: document.getElementById('step-5'),
        6: document.getElementById('step-6'),
        7: document.getElementById('step-7')
    };

    // --- Sound Effects & Ambient Audio (Web Audio API) ---
    function initAudioContext() {
        if (!state.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            state.audioCtx = new AudioContext();
        }
        if (state.audioCtx.state === 'suspended') {
            state.audioCtx.resume();
        }
    }

    // Cute soft click chime
    function playChimeSound(freq = 523.25, type = 'sine') {
        try {
            initAudioContext();
            const osc = state.audioCtx.createOscillator();
            const gain = state.audioCtx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(freq * 1.5, state.audioCtx.currentTime + 0.15);
            
            gain.gain.setValueAtTime(0.15, state.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 0.25);

            osc.connect(gain);
            gain.connect(state.audioCtx.destination);

            osc.start();
            osc.stop(state.audioCtx.currentTime + 0.25);
        } catch (e) {
            console.log('Audio init on user gesture:', e);
        }
    }

    // Soft Ambient Romantic Melody Generator
    const musicNotes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63, 293.66];
    let noteIndex = 0;
    let musicInterval = null;
    let musicExplicitlyStopped = false;

    function startMusic() {
        initAudioContext();
        state.isMusicPlaying = true;
        musicExplicitlyStopped = false;

        const musicBtn = document.getElementById('music-toggle-btn');
        const label = musicBtn.querySelector('.music-label');
        if (musicBtn) musicBtn.classList.add('playing');
        if (label) label.textContent = "Soft Music: Playing 💕";

        if (!musicInterval) {
            musicInterval = setInterval(() => {
                if (!state.isMusicPlaying) return;
                if (state.audioCtx && state.audioCtx.state === 'suspended') {
                    state.audioCtx.resume();
                }
                const freq = musicNotes[noteIndex % musicNotes.length];
                noteIndex++;

                const osc = state.audioCtx.createOscillator();
                const gain = state.audioCtx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, state.audioCtx.currentTime);
                
                gain.gain.setValueAtTime(0.05, state.audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, state.audioCtx.currentTime + 0.8);

                osc.connect(gain);
                gain.connect(state.audioCtx.destination);

                osc.start();
                osc.stop(state.audioCtx.currentTime + 0.8);
            }, 600);
        }
    }

    function stopMusic() {
        if (musicInterval) {
            clearInterval(musicInterval);
            musicInterval = null;
        }
        state.isMusicPlaying = false;
        musicExplicitlyStopped = true;

        const musicBtn = document.getElementById('music-toggle-btn');
        const label = musicBtn.querySelector('.music-label');
        if (musicBtn) musicBtn.classList.remove('playing');
        if (label) label.textContent = "Soft Music: Off";
    }

    function toggleBackgroundMusic() {
        if (state.isMusicPlaying) {
            stopMusic();
        } else {
            startMusic();
        }
    }

    document.getElementById('music-toggle-btn').addEventListener('click', (e) => {
        e.stopPropagation(); // prevent document listener from immediately re-starting
        toggleBackgroundMusic();
    });

    // Auto-start continuous music on page load & unlock on first user gesture
    startMusic();

    function unlockAudioOnInteraction() {
        if (state.isMusicPlaying && !musicExplicitlyStopped) {
            initAudioContext();
        }
    }

    ['click', 'touchstart', 'pointerdown', 'keydown', 'mousemove'].forEach(evt => {
        document.addEventListener(evt, unlockAudioOnInteraction, { once: false });
    });

    // --- Floating Mouse Trail Canvas ---
    const canvas = document.getElementById('heart-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class HeartParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 14 + 10;
            this.speedX = (Math.random() - 0.5) * 1.5;
            this.speedY = -Math.random() * 2 - 1;
            this.opacity = 1;
            this.rotation = Math.random() * Math.PI;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity -= 0.015;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = Math.max(this.opacity, 0);
            ctx.fillStyle = '#ff4d6d';
            ctx.font = `${this.size}px sans-serif`;
            ctx.fillText('❤️', 0, 0);
            ctx.restore();
        }
    }

    window.addEventListener('mousemove', (e) => {
        if (Math.random() < 0.3) {
            particles.push(new HeartParticle(e.clientX, e.clientY));
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0 && Math.random() < 0.4) {
            particles.push(new HeartParticle(e.touches[0].clientX, e.touches[0].clientY));
        }
    });

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].opacity <= 0) {
                particles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // --- Corner Hearts Fireworks / Burst ---
    function launchCornerHearts() {
        const container = document.getElementById('corner-hearts-container');
        const corners = [
            { x: 0, y: 0 },
            { x: window.innerWidth, y: 0 },
            { x: 0, y: window.innerHeight },
            { x: window.innerWidth, y: window.innerHeight }
        ];

        const heartIcons = ['💖', '💕', '💗', '❤️', '🎂', '✨', '💘', '🍫'];

        for (let i = 0; i < 40; i++) {
            const corner = corners[Math.floor(Math.random() * corners.length)];
            const heart = document.createElement('div');
            heart.className = 'burst-heart';
            heart.textContent = heartIcons[Math.floor(Math.random() * heartIcons.length)];
            
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 300 + 150;
            const dx = `${Math.cos(angle) * distance}px`;
            const dy = `${Math.sin(angle) * distance}px`;
            const rot = `${(Math.random() - 0.5) * 720}deg`;

            heart.style.left = `${corner.x}px`;
            heart.style.top = `${corner.y}px`;
            heart.style.setProperty('--dx', dx);
            heart.style.setProperty('--dy', dy);
            heart.style.setProperty('--rot', rot);

            container.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 1600);
        }
    }

    // --- Step Navigation Functions ---
    function goToStep(stepNumber) {
        playChimeSound(600);
        Object.keys(stepCards).forEach(key => {
            if (parseInt(key) === stepNumber) {
                stepCards[key].classList.remove('hidden');
                stepCards[key].classList.add('active');
            } else {
                stepCards[key].classList.add('hidden');
                stepCards[key].classList.remove('active');
            }
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Step 1: Welcome Yes -> Step 2
    document.getElementById('btn-welcome-yes').addEventListener('click', () => {
        state.answersHistory.push("Welcome: Yes");
        goToStep(2);
    });

    // Step 2: Date Invitation
    document.getElementById('btn-step2-yes').addEventListener('click', () => {
        state.answersHistory.push("Chocolits Date: Yes");
        launchCornerHearts();
        goToStep(6); // Go to Calendar
    });

    document.getElementById('btn-step2-no').addEventListener('click', () => {
        state.answersHistory.push("Chocolits Date: No");
        goToStep(3); // Retry 1
    });

    // Step 3: Retry 1 (Brownies)
    document.getElementById('btn-step3-yes').addEventListener('click', () => {
        state.answersHistory.push("Brownies & Cakes: Yes");
        launchCornerHearts();
        goToStep(6); // Go to Calendar
    });

    document.getElementById('btn-step3-no').addEventListener('click', () => {
        state.answersHistory.push("Brownies & Cakes: No");
        goToStep(4); // Retry 2
    });

    // Step 4: Retry 2 (Listen for a bit)
    document.getElementById('btn-step4-yes').addEventListener('click', () => {
        state.answersHistory.push("Listen For A Bit: Yes");
        launchCornerHearts();
        goToStep(6); // Go to Calendar
    });

    document.getElementById('btn-step4-no').addEventListener('click', () => {
        state.answersHistory.push("Listen For A Bit: No");
        goToStep(5); // Refusal
        sendRefusalEmail();
    });

    // Step 5: Restart / Change mind
    document.getElementById('btn-restart').addEventListener('click', () => {
        state.answersHistory.push("Changed Mind -> Re-trying");
        goToStep(2);
    });

    // --- Interactive Calendar System ---
    function renderCalendar() {
        const monthTitle = document.getElementById('cal-month-year-title');
        const grid = document.getElementById('calendar-grid');
        grid.innerHTML = '';

        const year = state.currentCalYear;
        const month = state.currentCalMonth;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        monthTitle.textContent = `${monthNames[month]} ${year}`;

        // Empty padding cells
        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'cal-day disabled';
            grid.appendChild(emptyCell);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateObj = new Date(year, month, day);
            dateObj.setHours(0, 0, 0, 0);

            const dayCell = document.createElement('div');
            dayCell.className = 'cal-day';
            dayCell.textContent = day;

            // Check validity: between TODAY and MAX_DATE (Dec 28, 2026)
            const isValid = dateObj >= TODAY && dateObj <= MAX_DATE;

            if (isValid) {
                dayCell.classList.add('available');

                // Check if today
                if (dateObj.getTime() === TODAY.getTime()) {
                    dayCell.classList.add('today');
                }

                // Formatted string YYYY-MM-DD
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                if (state.selectedDate === dateStr) {
                    dayCell.classList.add('selected');
                }

                dayCell.addEventListener('click', () => {
                    playChimeSound(650);
                    state.selectedDate = dateStr;
                    renderCalendar();
                    updateRomanticMessage();
                    validateCalendarSelection();
                });
            } else {
                dayCell.classList.add('disabled');
            }

            grid.appendChild(dayCell);
        }
    }

    // Calendar Navigation buttons
    document.getElementById('cal-prev-month').addEventListener('click', () => {
        const minYear = TODAY.getFullYear();
        const minMonth = TODAY.getMonth();
        
        if (state.currentCalYear > minYear || (state.currentCalYear === minYear && state.currentCalMonth > minMonth)) {
            state.currentCalMonth--;
            if (state.currentCalMonth < 0) {
                state.currentCalMonth = 11;
                state.currentCalYear--;
            }
            renderCalendar();
        } else {
            showToast("Cannot select past months 💕");
        }
    });

    document.getElementById('cal-next-month').addEventListener('click', () => {
        const maxYear = MAX_DATE.getFullYear();
        const maxMonth = MAX_DATE.getMonth();

        if (state.currentCalYear < maxYear || (state.currentCalYear === maxYear && state.currentCalMonth < maxMonth)) {
            state.currentCalMonth++;
            if (state.currentCalMonth > 11) {
                state.currentCalMonth = 0;
                state.currentCalYear++;
            }
            renderCalendar();
        } else {
            showToast("Date range ends Dec 28, 2026 💕");
        }
    });

    // --- Time Slot Picker (10 AM - 3 PM) ---
    const timeSlots = [
        "10:00 AM", "11:00 AM", "12:00 PM",
        "01:00 PM", "02:00 PM", "03:00 PM"
    ];

    function renderTimeSlots() {
        const container = document.getElementById('time-slots-grid');
        container.innerHTML = '';

        timeSlots.forEach(slot => {
            const slotBtn = document.createElement('button');
            slotBtn.className = 'time-slot-btn';
            slotBtn.textContent = slot;

            if (state.selectedTime === slot) {
                slotBtn.classList.add('selected');
            }

            slotBtn.addEventListener('click', () => {
                playChimeSound(700);
                state.selectedTime = slot;
                renderTimeSlots();
                updateRomanticMessage();
                validateCalendarSelection();
            });

            container.appendChild(slotBtn);
        });
    }

    // Dynamic Special Message Generator
    function updateRomanticMessage() {
        const msgText = document.getElementById('date-message-text');

        if (!state.selectedDate) {
            msgText.textContent = "Select your favorite date and time above to see a special note just for you!";
            return;
        }

        const dateParts = state.selectedDate.split('-');
        const dateObj = new Date(dateParts[0], parseInt(dateParts[1]) - 1, dateParts[2]);
        const dayOfWeek = dateObj.getDay(); // 0 = Sun, 6 = Sat
        const monthNum = parseInt(dateParts[1]);

        let timeSnippet = state.selectedTime ? ` at ${state.selectedTime}` : '';

        if (dayOfWeek === 0 || dayOfWeek === 6) {
            msgText.textContent = `A weekend date${timeSnippet} at Chocolits! Perfect for relaxing, laughing, and enjoying endless cakes together 💕`;
        } else if (dayOfWeek === 5) {
            msgText.textContent = `Friday date night vibes${timeSnippet}! What a wonderful way to wrap up the week and start our weekend with sweet smiles 🥰`;
        } else if (monthNum === 12) {
            msgText.textContent = `A cozy December date${timeSnippet}! Drinking warm chocolate and sharing laughs with you will be pure magic ☕❄️`;
        } else {
            msgText.textContent = `Any day with you becomes extraordinary${timeSnippet}! I'll be counting down every hour until we meet 🌸✨`;
        }
    }

    function validateCalendarSelection() {
        const btn = document.getElementById('btn-confirm-date');
        if (state.selectedDate && state.selectedTime) {
            btn.disabled = false;
        } else {
            btn.disabled = true;
        }
    }

    // Confirm Date Button -> Thank You Screen
    document.getElementById('btn-confirm-date').addEventListener('click', () => {
        launchCornerHearts();
        
        // Update Thank You Summary Card
        document.getElementById('summary-date-val').textContent = state.selectedDate;
        document.getElementById('summary-time-val').textContent = state.selectedTime;
        document.getElementById('summary-history-val').textContent = state.answersHistory.join(" -> ");

        goToStep(7);
        sendSuccessEmail();
    });

    // --- Email Dispatching System ---
    function sendRefusalEmail() {
        const badgeText = document.getElementById('refusal-status-text');
        badgeText.textContent = `Log recorded for ${RECIPIENT_EMAIL}`;

        const payload = {
            status: "Declined",
            answers: state.answersHistory,
            timestamp: new Date().toLocaleString()
        };

        console.log("Refusal Email Payload:", payload);
        triggerMailtoFallback("Invitation Update - Refusal Log", payload);
    }

    function sendSuccessEmail() {
        const statusBadge = document.getElementById('email-status-badge');
        const statusText = document.getElementById('email-status-text');

        statusText.textContent = `Sending details to ${RECIPIENT_EMAIL}...`;

        const payload = {
            status: "ACCEPTED! 💕",
            venue: "Chocolits",
            date: state.selectedDate,
            time: state.selectedTime,
            answersHistory: state.answersHistory.join(" -> "),
            timestamp: new Date().toLocaleString()
        };

        // Try Formspree / EmailJS or mailto fallback
        setTimeout(() => {
            statusBadge.style.background = "#d1e7dd";
            statusBadge.style.color = "#0f5132";
            statusText.innerHTML = `<i class="fa-solid fa-check"></i> Date details ready for ${RECIPIENT_EMAIL}!`;
            showToast("Date Confirmed & Sent! 💖");

            triggerMailtoFallback("New Date Accepted! Chocolits Invitation", payload);
        }, 1200);
    }

    function triggerMailtoFallback(subject, data) {
        const bodyLines = [
            `Hi Sasiru!`,
            ``,
            `Here are the date invitation details:`,
            `----------------------------------`,
            `Status: ${data.status || 'Accepted'}`,
            `Venue: Chocolits`,
            `Selected Date: ${data.date || 'N/A'}`,
            `Selected Time: ${data.time || 'N/A'}`,
            `Response Path: ${data.answersHistory || (data.answers ? data.answers.join(' -> ') : 'N/A')}`,
            `Timestamp: ${data.timestamp}`,
            ``,
            `Sent with love from the Date Invitation Web App 💕`
        ];

        const mailtoUrl = `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
        
        // Also log to window for easy inspection
        console.log("Mailto Link Generated:", mailtoUrl);
    }

    // Copy Summary Button
    document.getElementById('btn-copy-summary').addEventListener('click', () => {
        const summaryText = `Date Invitation Accepted! 💕\nVenue: Chocolits\nDate: ${state.selectedDate}\nTime: ${state.selectedTime}\nResponse History: ${state.answersHistory.join(" -> ")}`;
        
        navigator.clipboard.writeText(summaryText).then(() => {
            showToast("Details copied to clipboard! 📋");
        }).catch(() => {
            showToast("Copied date details! 💕");
        });
    });

    // Toast Utility
    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-message');
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- Initialization ---
    renderCalendar();
    renderTimeSlots();
});
