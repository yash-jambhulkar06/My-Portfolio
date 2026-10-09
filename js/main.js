/* =========================================================
   PORTFOLIO JAVASCRIPT
========================================================= */

(function () {

    "use strict";

    const root = document.documentElement;

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* -------------------------------------------------------
       THEME & META THEME-COLOR
    ------------------------------------------------------- */

    const themeButton =
        document.getElementById("themeButton");

    function updateMetaThemeColor(theme) {
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) {
            meta.setAttribute(
                "content",
                theme === "dark" ? "#090d16" : "#f8fafc"
            );
        }
    }

    try {
        const savedTheme = localStorage.getItem("portfolio-theme");
        const initialTheme = (savedTheme === "dark" || savedTheme === "light") ? savedTheme : "dark";
        root.setAttribute("data-theme", initialTheme);
        updateMetaThemeColor(initialTheme);
    } catch (error) {}

    function toggleTheme() {
        const current = root.getAttribute("data-theme") || "dark";
        const next = current === "dark" ? "light" : "dark";

        root.setAttribute("data-theme", next);
        updateMetaThemeColor(next);

        try {
            localStorage.setItem("portfolio-theme", next);
        } catch (error) {}

        return next;
    }

    if (themeButton) {
        themeButton.addEventListener("click", toggleTheme);
    }


    /* -------------------------------------------------------
       MOBILE MENU
    ------------------------------------------------------- */

    const menuButton =
        document.getElementById("menuButton");

    const navLinks =
        document.getElementById("navLinks");

    function toggleMenu(open) {
        if (!navLinks || !menuButton) return;

        navLinks.classList.toggle(
            "open",
            open
        );

        menuButton.setAttribute(
            "aria-expanded",
            String(open)
        );
    }

    if (menuButton && navLinks) {
        menuButton.addEventListener(
            "click",
            function () {
                const open =
                    !navLinks.classList.contains("open");

                toggleMenu(open);
            }
        );

        navLinks.addEventListener(
            "click",
            function (event) {
                if (event.target.tagName === "A") {
                    toggleMenu(false);
                }
            }
        );

        document.addEventListener("click", function (event) {
            if (navLinks && navLinks.classList.contains("open") && !navLinks.contains(event.target) && !menuButton.contains(event.target)) {
                toggleMenu(false);
            }
        });
    }


    /* -------------------------------------------------------
       TERMINAL (INTRO ANIMATION + INTERACTIVE CLI)
    ------------------------------------------------------- */

    const terminal =
        document.getElementById("terminalBody");

    const commands = [
        {
            type: "command",
            text: "from yash import developer"
        },
        {
            type: "command",
            text: "developer.role"
        },
        {
            type: "output",
            text: "'Full Stack Python Developer'"
        },
        {
            type: "command",
            text: "developer.stack"
        },
        {
            type: "output green",
            text: "['Python', 'Django', 'MySQL', 'JavaScript']"
        },
        {
            type: "command",
            text: "developer.projects"
        },
        {
            type: "output",
            text: "['Room Buddies', 'Resume AI']"
        },
        {
            type: "command",
            text: "developer.ai"
        },
        {
            type: "output green",
            text: "'Groq API'"
        },
        {
            type: "command",
            text: "developer.status"
        },
        {
            type: "output",
            text: "'Building + Learning'"
        }
    ];

    const cursor =
        document.createElement("span");
    cursor.className = "cursor";

    function createTerminalLine(item) {
        if (!terminal) return null;

        const line =
            document.createElement("div");
        line.className =
            "terminal-line";

        if (item.type === "command") {
            const prompt =
                document.createElement("span");
            prompt.className = "prompt";
            prompt.textContent = ">>> ";
            line.appendChild(prompt);
        }

        const text =
            document.createElement("span");

        if (item.type.startsWith("output")) {
            text.className = item.type;
        } else {
            text.className = "command";
        }

        line.appendChild(text);
        terminal.appendChild(line);

        return text;
    }

    function delay(milliseconds) {
        return new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    milliseconds
                )
        );
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    /* Interactive Terminal Support */
    function enableInteractiveTerminal() {
        if (!terminal) return;

        // Interactive Hint
        const hint = document.createElement("div");
        hint.className = "terminal-hint";
        hint.innerHTML = '💡 Interactive terminal active! Try typing <span>"help"</span>, <span>"projects"</span>, <span>"skills"</span>, <span>"resume"</span>, or <span>"clear"</span>.';
        terminal.appendChild(hint);

        // Interactive Input Line
        const inputLine = document.createElement("div");
        inputLine.className = "terminal-line terminal-interactive-line";
        inputLine.innerHTML = `
            <span class="prompt">&gt;&gt;&gt;&nbsp;</span>
            <div class="terminal-input-wrap">
                <input type="text"
                       class="terminal-input"
                       id="terminalInput"
                       autocomplete="off"
                       spellcheck="false"
                       aria-label="Interactive terminal command input"
                       placeholder="type here...">
                <span class="cursor"></span>
            </div>
        `;
        terminal.appendChild(inputLine);

        const input = inputLine.querySelector("#terminalInput");
        const liveCursor = inputLine.querySelector(".cursor");

        terminal.classList.add("terminal-interactive");
        terminal.addEventListener("click", function () {
            input.focus();
        });

        input.addEventListener("input", function () {
            if (input.value.length > 0) {
                liveCursor.style.display = "none";
            } else {
                liveCursor.style.display = "inline-block";
            }
        });

        const commandHistory = [];
        let historyIndex = -1;

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                const rawCommand = input.value.trim();
                if (!rawCommand) return;

                commandHistory.push(rawCommand);
                historyIndex = commandHistory.length;

                // Print entered command
                const executedLine = document.createElement("div");
                executedLine.className = "terminal-line";
                executedLine.innerHTML =
                    '<span class="prompt">&gt;&gt;&gt;&nbsp;</span><span class="command">' +
                    escapeHtml(rawCommand) +
                    '</span>';
                terminal.insertBefore(executedLine, hint);

                // Run command
                executeCommand(rawCommand, hint);

                input.value = "";
                liveCursor.style.display = "inline-block";
                terminal.scrollTop = terminal.scrollHeight;
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                if (commandHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    input.value = commandHistory[historyIndex];
                    liveCursor.style.display = "none";
                }
            } else if (event.key === "ArrowDown") {
                event.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    input.value = commandHistory[historyIndex];
                } else {
                    historyIndex = commandHistory.length;
                    input.value = "";
                    liveCursor.style.display = "inline-block";
                }
            }
        });
    }

    function executeCommand(cmd, hintEl) {
        const clean = cmd.trim().toLowerCase();
        const outputLine = document.createElement("div");
        outputLine.className = "terminal-line";

        switch (clean) {
            case "help":
                outputLine.innerHTML = `
<span class="output green">Available commands:</span>
  <span class="output">about</span>      - Learn more about Yash
  <span class="output">skills</span>     - View tech stack & tools
  <span class="output">projects</span>   - View featured projects & links
  <span class="output">resume</span>     - View / download resume PDF
  <span class="output">contact</span>    - Show contact details & links
  <span class="output">theme</span>      - Switch dark / light mode
  <span class="output">date</span>       - Current timestamp
  <span class="output">clear</span>      - Clear terminal screen
                `.trim().replace(/\n/g, "<br>");
                break;

            case "about":
                outputLine.innerHTML =
                    '<span class="output">Yash Dhanraj Jambhulkar — Full Stack Python Developer & Diploma in Computer Technology student. Focused on Django, MySQL, JavaScript, and AI API integrations.</span>';
                break;

            case "skills":
                outputLine.innerHTML = `
<span class="output green">Languages:</span> Python, C, JavaScript, HTML, CSS<br>
<span class="output green">Backend:</span> Django, REST APIs, OOP, Python<br>
<span class="output green">Databases & AI:</span> MySQL, Groq API, Git, GitHub
                `.trim();
                break;

            case "projects":
                outputLine.innerHTML = `
1. <a href="https://resumeai-zwez.onrender.com" target="_blank" rel="noopener">Resume AI</a> — AI Resume Analyzer with Groq API & Django (Live)<br>
2. <a href="https://github.com/yash-jambhulkar06" target="_blank" rel="noopener">Room Buddies</a> — Accommodation & services platform (In development)
                `.trim();
                break;

            case "resume":
                outputLine.innerHTML =
                    '<span class="output green">Resume ready: </span><a href="assets/resume.pdf" target="_blank" rel="noopener" style="text-decoration: underline; font-weight: 600;">[Click here to view / download resume.pdf]</a>';
                try {
                    const tempA = document.createElement("a");
                    tempA.href = "assets/resume.pdf";
                    tempA.target = "_blank";
                    tempA.rel = "noopener";
                    tempA.click();
                } catch(e) {}
                break;

            case "contact":
                outputLine.innerHTML = `
<span class="output">Email:</span> <a href="mailto:jambhulkarn6@gmail.com">jambhulkarn6@gmail.com</a><br>
<span class="output">GitHub:</span> <a href="https://github.com/yash-jambhulkar06" target="_blank" rel="noopener">github.com/yash-jambhulkar06</a><br>
<span class="output">LinkedIn:</span> <a href="https://www.linkedin.com/in/yash-jambhulkar-6092663b6" target="_blank" rel="noopener">linkedin.com/in/yash-jambhulkar</a>
                `.trim();
                break;

            case "theme":
                const newTheme = toggleTheme();
                outputLine.innerHTML =
                    '<span class="output green">Theme switched to ' + newTheme + ' mode.</span>';
                break;

            case "clear":
                const allLines = terminal.querySelectorAll(".terminal-line:not(.terminal-interactive-line)");
                allLines.forEach(l => l.remove());
                const inEl = document.getElementById("terminalInput");
                if (inEl) inEl.focus();
                return;

            case "whoami":
                outputLine.innerHTML =
                    '<span class="output">guest@yash-portfolio ~ welcome!</span>';
                break;

            case "sudo":
                outputLine.innerHTML =
                    '<span class="output">Permission denied: you don\'t need sudo to hire me :)</span>';
                break;

            case "date":
                outputLine.innerHTML =
                    '<span class="output">' + new Date().toLocaleString() + '</span>';
                break;

            default:
                outputLine.innerHTML =
                    '<span class="output" style="color: var(--red);">Command not recognized: "' +
                    escapeHtml(cmd) +
                    '". Type <span class="output green">help</span> to see available commands.</span>';
                break;
        }

        terminal.insertBefore(outputLine, hintEl);
    }

    async function runTerminal() {
        if (!terminal) return;

        for (const item of commands) {
            const text = createTerminalLine(item);
            if (!text) continue;

            if (item.type === "command") {
                text.parentNode.appendChild(cursor);

                for (const character of item.text) {
                    text.textContent += character;
                    await delay(22 + Math.random() * 32);
                }

                await delay(280);
            } else {
                text.textContent = item.text;
                await delay(200);
            }
        }

        if (cursor.parentNode) {
            cursor.parentNode.removeChild(cursor);
        }

        enableInteractiveTerminal();

        // Terminal Tab clicks
        const terminalTabs = document.querySelectorAll(".terminal-tab");
        terminalTabs.forEach(tab => {
            tab.addEventListener("click", function() {
                terminalTabs.forEach(t => t.classList.remove("active"));
                this.classList.add("active");
                const termTitle = document.querySelector(".terminal-title");
                if (termTitle) {
                    termTitle.textContent = this.textContent.trim() === "bash" ? "bash 5.2 (zsh)" : "Python 3.12 (venv)";
                }
            });
        });

    }

    function showTerminalInstantly() {
        if (!terminal) return;

        commands.forEach(function (item) {
            const text = createTerminalLine(item);
            if (text) text.textContent = item.text;
        });

        enableInteractiveTerminal();
    }

    if (reduceMotion) {
        showTerminalInstantly();
    } else {
        setTimeout(runTerminal, 700);
    }


    /* -------------------------------------------------------
       SCROLL REVEAL
    ------------------------------------------------------- */

    const revealElements =
        document.querySelectorAll(".reveal");

    if (
        "IntersectionObserver" in window &&
        !reduceMotion
    ) {
        const observer =
            new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add("visible");
                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -50px 0px"
                }
            );

        revealElements.forEach(element => observer.observe(element));
    } else {
        revealElements.forEach(element => element.classList.add("visible"));
    }


    /* -------------------------------------------------------
       SCROLL PROGRESS
    ------------------------------------------------------- */

    const progress =
        document.getElementById("progressBar");

    function updateProgress() {
        if (!progress) return;

        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;

        const value =
            scrollable > 0 ? window.scrollY / scrollable : 0;

        progress.style.transform = "scaleX(" + value + ")";
    }

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();


    /* -------------------------------------------------------
       ACTIVE NAVIGATION
    ------------------------------------------------------- */

    const navigation =
        Array.from(document.querySelectorAll(".nav-links a"));

    const sections =
        navigation
            .map(link => {
                const href = link.getAttribute("href");
                if (href && href.startsWith("#")) {
                    return document.querySelector(href);
                }
                return null;
            })
            .filter(Boolean);

    function updateActiveNav() {
        let current = -1;

        sections.forEach(function (section, index) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.38) {
                current = index;
            }
        });

        navigation.forEach(function (link, index) {
            link.classList.toggle("active", index === current);
        });
    }

    window.addEventListener("scroll", updateActiveNav, { passive: true });
    updateActiveNav();


    /* -------------------------------------------------------
       HERO POINTER GLOW (THROTTLED WITH RAF)
    ------------------------------------------------------- */

    const hero = document.querySelector(".hero");

    if (
        hero &&
        window.matchMedia("(hover: hover)").matches &&
        !reduceMotion
    ) {
        let rafId = null;

        hero.addEventListener("pointermove", function (event) {
            if (rafId) cancelAnimationFrame(rafId);

            rafId = requestAnimationFrame(function () {
                const rect = hero.getBoundingClientRect();
                const isDark = root.getAttribute("data-theme") !== "light";
                const glowColor = isDark ? "rgba(99,102,241,.15)" : "rgba(79,70,229,.10)";
                hero.style.background =
                    "radial-gradient(" +
                    "440px circle at " +
                    (event.clientX - rect.left) +
                    "px " +
                    (event.clientY - rect.top) +
                    "px, " +
                    glowColor + ", " +
                    "transparent 70%)";
            });
        });

        hero.addEventListener("pointerleave", function () {
            if (rafId) cancelAnimationFrame(rafId);
            hero.style.background = "";
        });
    }


    /* -------------------------------------------------------
       COPY EMAIL & TOAST NOTIFICATION
    ------------------------------------------------------- */

    const copyEmailBtn = document.getElementById("copyEmailBtn");
    const toast = document.getElementById("toast");
    let toastTimer;

    function showToast(message) {
        if (!toast) return;
        const textSpan = toast.querySelector("span");
        if (textSpan) textSpan.textContent = message;

        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2600);
    }

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener("click", function () {
            const emailAddress = "jambhulkarn6@gmail.com";

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emailAddress)
                    .then(function () {
                        showToast("Email copied to clipboard!");
                    })
                    .catch(function () {
                        fallbackCopy(emailAddress);
                    });
            } else {
                fallbackCopy(emailAddress);
            }
        });
    }

    function fallbackCopy(text) {
        try {
            const tempInput = document.createElement("input");
            tempInput.value = text;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            showToast("Email copied to clipboard!");
        } catch (e) {
            showToast("Failed to copy. Email: " + text);
        }
    }


    /* -------------------------------------------------------
       BACK TO TOP WITH CIRCULAR SCROLL PROGRESS
    ------------------------------------------------------- */

    const backToTopBtn = document.getElementById("backToTop");
    const progressCircle = document.querySelector(".progress-ring-bar");
    const radius = 18;
    const circumference = 2 * Math.PI * radius; // ~113.1

    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }

    function updateBackToTop() {
        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight;
        const scrollY = window.scrollY;

        if (backToTopBtn) {
            if (scrollY > 320) {
                backToTopBtn.classList.add("visible");
            } else {
                backToTopBtn.classList.remove("visible");
            }
        }

        if (progressCircle && scrollable > 0) {
            const fraction = Math.min(1, Math.max(0, scrollY / scrollable));
            const offset = circumference - fraction * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
    }

    window.addEventListener("scroll", updateBackToTop, { passive: true });
    updateBackToTop();

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* -------------------------------------------------------
       DYNAMIC CONTENT HYDRATION (FROM DATA/PORTFOLIO.JSON OR ADMIN DRAFT)
    ------------------------------------------------------- */

    async function hydrateDynamicContent() {
        try {
            let data = null;
            const draft = localStorage.getItem("portfolio_draft_data");
            if (draft) {
                try {
                    data = JSON.parse(draft);
                } catch (e) {}
            }

            if (!data) {
                const res = await fetch("data/portfolio.json");
                if (res.ok) data = await res.json();
            }

            if (!data) return;

            // 1. Profile Hydration
            if (data.profile) {
                const p = data.profile;

                // Name
                const nameEl = document.querySelector(".hero-content h1");
                if (nameEl && p.firstName && p.lastName) {
                    nameEl.innerHTML = `${escapeHtml(p.firstName)} <span class="name-gradient">${escapeHtml(p.lastName)}</span>`;
                }

                // Availability
                const availText = document.querySelector(".availability span:last-child");
                if (availText && p.availabilityText) {
                    availText.textContent = p.availabilityText;
                }

                const availWrap = document.querySelector(".availability");
                if (availWrap && p.isAvailable === false) {
                    availWrap.style.display = "none";
                } else if (availWrap) {
                    availWrap.style.display = "inline-flex";
                }

                // Roles
                const rolesWrap = document.querySelector(".hero-roles");
                if (rolesWrap && p.roles && p.roles.length) {
                    rolesWrap.innerHTML = p.roles
                        .map(r => `<span class="role-pill">${escapeHtml(r)}</span>`)
                        .join("");
                }

                // Hero Description
                const heroDesc = document.querySelector(".hero-description");
                if (heroDesc && p.heroDescription) {
                    heroDesc.innerHTML = p.heroDescription;
                }

                // About Main
                const aboutMain = document.querySelector(".about-main");
                if (aboutMain && p.aboutMain) {
                    aboutMain.innerHTML = p.aboutMain;
                }

                // About Note
                const aboutNote = document.querySelector(".about-note");
                if (aboutNote && p.aboutNote) {
                    aboutNote.textContent = p.aboutNote;
                }

                // Email links
                if (p.email) {
                    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
                    emailLinks.forEach(el => {
                        el.setAttribute("href", `mailto:${p.email}`);
                        if (el.classList.contains("email")) {
                            el.textContent = p.email;
                        }
                    });
                }

                // Resume Link
                if (p.resumeUrl) {
                    const resumeLinks = document.querySelectorAll('a[href$=".pdf"]');
                    resumeLinks.forEach(el => el.setAttribute("href", p.resumeUrl));
                }
            }

            // 2. Stats Hydration
            if (data.stats && Array.isArray(data.stats) && data.stats.length) {
                const statsWrap = document.querySelector(".stats");
                if (statsWrap) {
                    statsWrap.innerHTML = data.stats.map((s, idx) => `
                        <div class="stat reveal ${idx > 0 ? 'delay-' + idx : ''} visible">
                            <strong>${escapeHtml(s.value)}</strong>
                            <span>${escapeHtml(s.label)}</span>
                        </div>
                    `).join("");
                }
            }

            // 3. Skills Categories Hydration
            if (data.skillsCategories && Array.isArray(data.skillsCategories) && data.skillsCategories.length) {
                const skillsWrap = document.querySelector(".skills-category-wrap");
                if (skillsWrap) {
                    const catIcons = [
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--cyan)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--amber)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
                        `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>`
                    ];

                    skillsWrap.innerHTML = data.skillsCategories.map((cat, idx) => `
                        <div class="skill-category-card reveal ${idx > 0 ? 'delay-' + (idx % 4) : ''} visible">
                            <h3>
                                ${catIcons[idx % catIcons.length]}
                                ${escapeHtml(cat.name)}
                            </h3>
                            <div class="skill-chips">
                                ${(cat.skills || []).map(sk => `
                                    <span class="skill-chip">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v4m0 12v4m10-10h-4M6 12H2"/></svg>
                                        ${escapeHtml(sk)}
                                    </span>
                                `).join("")}
                            </div>
                        </div>
                    `).join("");
                }
            }

            // 4. Projects Hydration
            if (data.projects && Array.isArray(data.projects) && data.projects.length) {
                const projectGrid = document.querySelector(".project-grid");
                if (projectGrid) {
                    projectGrid.innerHTML = data.projects.map((proj, idx) => `
                        <article class="project-card ${proj.id === 'resume-ai' ? 'resume' : ''} reveal ${idx > 0 ? 'delay-1' : ''} visible">
                            <div class="project-top project-image-top">
                                <img src="${escapeHtml(proj.image || 'assets/images/resume_ai_preview.jpg')}"
                                     alt="${escapeHtml(proj.title)} Preview"
                                     class="project-img"
                                     loading="lazy"
                                     onerror="this.onerror=null;this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22240%22%20viewBox%3D%220%200%20400%20240%22%3E%3Crect%20fill%3D%22%2309111d%22%20width%3D%22400%22%20height%3D%22240%22%2F%3E%3Ctext%20fill%3D%22%236366f1%22%20font-family%3D%22monospace%22%20font-size%3D%2220%22%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%3E${encodeURIComponent(proj.title)}%3C%2Ftext%3E%3C%2Fsvg%3E'">
                                <div class="project-overlay"></div>
                                <div class="status ${proj.isLive ? 'live' : ''}">
                                    <span class="status-dot"></span>
                                    ${escapeHtml(proj.status || (proj.isLive ? 'Live' : 'In development'))}
                                </div>
                            </div>
                            <div class="project-body">
                                <span class="project-meta">${escapeHtml(proj.meta || '')}</span>
                                <h3>${escapeHtml(proj.title)}</h3>
                                <p>${escapeHtml(proj.description || '')}</p>
                                ${proj.highlights && proj.highlights.length ? `
                                    <ul class="project-highlights">
                                        ${proj.highlights.map(h => `<li>${escapeHtml(h)}</li>`).join("")}
                                    </ul>
                                ` : ''}
                                ${proj.tags && proj.tags.length ? `
                                    <ul class="project-tags">
                                        ${proj.tags.map(t => `<li>${escapeHtml(t)}</li>`).join("")}
                                    </ul>
                                ` : ''}
                                <div class="project-actions">
                                    ${proj.liveUrl ? `
                                        <a class="button button-primary" href="${escapeHtml(proj.liveUrl)}" target="_blank" rel="noopener" aria-label="View live demo of ${escapeHtml(proj.title)}">
                                            Live Demo
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M7 17 17 7"/>
                                                <path d="M7 7h10v10"/>
                                            </svg>
                                        </a>
                                    ` : ''}
                                    ${proj.githubUrl ? `
                                        <a class="button button-secondary" href="${escapeHtml(proj.githubUrl)}" target="_blank" rel="noopener" aria-label="View ${escapeHtml(proj.title)} on GitHub">
                                            GitHub Code
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M7 17 17 7"/>
                                                <path d="M7 7h10v10"/>
                                            </svg>
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        </article>
                    `).join("");
                }
            }

            // 5. Education Hydration
            if (data.education && Array.isArray(data.education) && data.education.length) {
                const timeline = document.querySelector(".timeline");
                if (timeline) {
                    timeline.innerHTML = data.education.map(edu => `
                        <div class="timeline-item reveal visible">
                            <span class="timeline-date">${escapeHtml(edu.date || '')}</span>
                            <h3>${escapeHtml(edu.degree || '')}</h3>
                            <p>${escapeHtml(edu.description || '')}</p>
                        </div>
                    `).join("");
                }
            }

        } catch (err) {
            console.warn("Hydration skipped, using static HTML fallback:", err);
        }
    }

    hydrateDynamicContent();

    /* -------------------------------------------------------
       YEAR
    ------------------------------------------------------- */

    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

})();
