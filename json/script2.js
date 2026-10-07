let newspaperData = null;
let knowledgeTips = [];          // declare once (remove other declarations)

fetch("https://bennykavil-hue.github.io/Eveningpaper/json/knowledgeTips.json")
    .then(response => {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
    })
    .then(data => {
        newspaperData = data;
        knowledgeTips = data.knowledgeTips || [];
        console.log("Tips loaded:", knowledgeTips.length);  // should say 365
        displayDailyKnowledgeTip();
    })
    .catch(error => console.error("Error fetching data:", error));

function getDailyKnowledgeTip() {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((today - startOfYear) / (1000 * 60 * 60 * 24));
    return knowledgeTips[dayOfYear % knowledgeTips.length];
}

function displayDailyKnowledgeTip() {
    if (!knowledgeTips.length) return;
    const tip = getDailyKnowledgeTip();

    document.getElementById("knowledgeTipCategory").textContent = tip.category;
    document.getElementById("knowledgeTipIcon").textContent = tip.icon;
    document.getElementById("knowledgeTipTitle").textContent = tip.title;
    document.getElementById("knowledgeTipDescription").textContent = tip.tip;
    document.getElementById("knowledgeTipWhy").textContent = tip.why;
    document.getElementById("knowledgeTipNumber").textContent = "Tip #" + tip.id;
}