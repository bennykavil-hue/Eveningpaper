fetch("https://bennykavil-hue.github.io/Eveningpaper/json/knowledgeTips.json")
    .then(response => response.json())
    .then(data => {

        newspaperData = data;

        // Knowledge tips from JSON
        knowledgeTips = data.knowledgeTips || [];

        // Pick ONE tip for today
        displayDailyKnowledgeTip();

        // Your existing newspaper code continues here
    })
    .catch(error => {
        // 2. Handles network errors, custom throws, and JSON parsing errors
        console.error('Error fetching data:', error);
    });

function getDailyKnowledgeTip() {

    const today = new Date();

    const startOfYear = new Date(
        today.getFullYear(),
        0,
        1
    );

    const dayOfYear = Math.floor(
        (today - startOfYear) /
        (1000 * 60 * 60 * 24)
    );

    const tipIndex =
        dayOfYear % knowledgeTips.length;

    return knowledgeTips[tipIndex];
}
function displayDailyKnowledgeTip() {

    if (!knowledgeTips || knowledgeTips.length === 0) {
        return;
    }

    const tip = getDailyKnowledgeTip();

    document.getElementById("knowledgeTipCategory").textContent =
        tip.category;

    document.getElementById("knowledgeTipIcon").textContent =
        tip.icon;

    document.getElementById("knowledgeTipTitle").textContent =
        tip.title;

    document.getElementById("knowledgeTipDescription").textContent =
        tip.tip;

    document.getElementById("knowledgeTipWhy").textContent =
        tip.why;

    document.getElementById("knowledgeTipNumber").textContent =
        "Tip #" + tip.id;
}
function getDailyKnowledgeTip() {

    const today = new Date();

    const startOfYear = new Date(
        today.getFullYear(),
        0,
        1
    );

    const dayOfYear = Math.floor(
        (today - startOfYear) /
        (1000 * 60 * 60 * 24)
    );

    const tipIndex =
        dayOfYear % knowledgeTips.length;

    return knowledgeTips[tipIndex];
}