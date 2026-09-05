const DATA_URL = "archive.json";

function formatDate(value) {
    const date = new Date(value + "T12:00:00");

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function escapeHTML(value) {
    return String(value ?? "").replace(
        /[&<>"']/g,
        function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        }
    );
}

function issueCard(issue, latest = false) {

    const link = issue.path;

    return `
        <article class="issue-card ${latest ? "latest" : ""}">
            <div class="issue-number">
                Issue ${escapeHTML(issue.issue)}
            </div>

            <div class="issue-date">
                ${escapeHTML(formatDate(issue.date))}
            </div>

            <a href="#"
               onclick="openEdition('${escapeHTML(link)}'); return false;">
                Open E-Paper →
            </a>
        </article>
    `;
}

function issueRow(issue) {

    return `
        <div class="issue-row">

            <div>
                <span class="number">
                    ${escapeHTML(issue.issue)}
                </span>

                <span class="date">
                    — ${escapeHTML(formatDate(issue.date))}
                </span>
            </div>

            <a href="#"
               onclick="openEdition('${escapeHTML(issue.path)}'); return false;">
                Open →
            </a>

        </div>
    `;
}
function render(data, filter = "") {
    const issues = (data.issues || [])
        .slice()
        .sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

    const search = filter.trim().toLowerCase();

    const filtered = issues.filter(issue => {
        if (!search) return true;

        return (
            String(issue.issue).includes(search) ||
            issue.date.includes(search)
        );
    });

    const latestCount =
        Number(data.settings?.latestCount || 6);

    const latest = filtered.slice(0, latestCount);

    document.getElementById("latest").innerHTML =
        latest.length
            ? latest.map(issue => issueCard(issue, true)).join("")
            : `<p class="empty">No matching editions.</p>`;

    const grouped = {};

    filtered.forEach(issue => {
        const year = issue.date.slice(0, 4);

        if (!grouped[year]) {
            grouped[year] = [];
        }

        grouped[year].push(issue);
    });

    const years = Object.keys(grouped).sort(
        (a, b) => Number(b) - Number(a)
    );

    document.getElementById("archive").innerHTML =
        years.length
            ? years.map(year => `
                <section class="year-block">
                    <h3 class="year-title">${year}</h3>

                    <div class="issue-list">
                        ${grouped[year]
                    .map(issueRow)
                    .join("")}
                    </div>
                </section>
            `).join("")
            : `<p class="empty">No matching editions.</p>`;
}

async function init() {
    try {
        const response = await fetch(DATA_URL, {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(
                "archive.json could not be loaded."
            );
        }

        const data = await response.json();

        render(data);

        document
            .getElementById("search")
            .addEventListener("input", function () {
                render(data, this.value);
            });

        document.getElementById("year").textContent =
            new Date().getFullYear();

    } catch (error) {
        document.getElementById("archive").innerHTML = `
            <p class="empty">
                Unable to load the archive.
            </p>
        `;
        console.error(error);
    }
}

async function openEdition(path) {

    try {

        const pagePath =
            path.endsWith("/")
                ? path + "index.html"
                : path + "/index.html";

        const response = await fetch(pagePath, {
            method: "GET",
            cache: "no-store"
        });

        if (response.ok) {

            window.location.href = path;

        } else {

            window.location.href =
                "https://www.geocities.ws/e-paper/archive/comingsoon.html";

        }

    } catch (error) {

        window.location.href =
            "https://www.geocities.ws/e-paper/archive/comingsoon.html";

    }
}
init();
