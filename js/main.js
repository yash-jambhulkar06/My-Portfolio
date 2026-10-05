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
                theme === "dark" ? "#080f19" : "#f4f7fb"
            );
        }
    }

    try {
        const savedTheme =
            localStorage.getItem("portfolio-theme");

        if (
            savedTheme === "dark" ||
            savedTheme === "light"
        ) {
            root.setAttribute(
                "data-theme",
                savedTheme
            );
            updateMetaThemeColor(savedTheme);
        } else {
            const prefersDark =
                window.matchMedia("(prefers-color-scheme: dark)").matches;
            updateMetaThemeColor(prefersDark ? "dark" : "light");
        }
    } catch (error) {}

    function toggleTheme() {
        const current =
            root.getAttribute("data-theme");

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;

        const isDark =
            current === "dark" ||
            (!current && prefersDark);

        const next =
            isDark ? "light" : "dark";

        root.setAttribute(
            "data-theme",
            next
        );

        updateMetaThemeColor(next);

        try {
            localStorage.setItem(
                "portfolio-theme",
                next
            );
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
                    '<span class="output green">Opening resume... </span><a href="assets/resume.pdf" target="_blank" rel="noopener">[Click here if it didn\'t open]</a>';
                window.open("assets/resume.pdf", "_blank");
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
                    '". Type <span class="green">help</span> to see available commands.</span>';
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
                hero.style.background =
                    "radial-gradient(" +
                    "420px circle at " +
                    (event.clientX - rect.left) +
                    "px " +
                    (event.clientY - rect.top) +
                    "px, " +
                    "rgba(255,212,59,.09), " +
                    "transparent 70%)";
            });
        });

        hero.addEventListener("pointerleave", function () {
            if (rafId) cancelAnimationFrame(rafId);
            hero.style.background = "none";
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
       YEAR
    ------------------------------------------------------- */

    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

})();
