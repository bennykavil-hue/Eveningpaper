let DB = null;
let LANG = "ml";

function getNavigationSection(newsItem) {

    const sections =
        DB?.settings?.navigationSections || [];

    const category =
        newsItem?.category?.ml || "";

    return sections.find(function (section) {

        return section.category === category;

    }) || null;
}


async function init() {
    try {

        const response = await fetch("news.json", {
            cache: "no-store"
        });

        if (!response.ok) {

            throw new Error(
                "news.json could not be loaded. HTTP " +
                response.status
            );

        }

        DB = await response.json();

        LANG =
            DB.settings?.defaultLanguage || "ml";

        render();

    } catch (error) {

        document.body.innerHTML = `
            <div style="font:16px Arial; padding:30px;">

                <h2>E-Paper Loading Error</h2>

                <p>
                    ${escapeHTML(error.message)}
                </p>

            </div>
        `;
    }
}


/*
    Get bilingual value from JSON.
*/
function t(object, key) {

    const value = object?.[key];

    if (typeof value === "string") {
        return value;
    }

    return value?.[LANG] ?? value?.ml ?? "";
}


/*
    Prevent HTML injection.
*/
function escapeHTML(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        function (character) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[character];

        }
    );
}


/*
    Create image HTML.
*/
function imageHTML(src, alt) {

    if (!src) {
        return "";
    }

    return `
        <img
            src="${escapeHTML(src)}"
            alt="${escapeHTML(alt)}"
            onerror="this.style.display='none'"
        >
    `;
}


/*
    Create a normal news card.
*/
function card(
    newsItem,
    sectionId,
    nextArticleId
) {

    const title =
        t(newsItem, "title");

    return `

        <article
            class="news-card"
            ${sectionId
            ? `id="${escapeHTML(sectionId)}"`
            : ""
        }
        >
            ${imageHTML(
            newsItem.image,
            title
        )}

            <div class="kicker">
                ${escapeHTML(
            t(newsItem, "category")
        )}
            </div>


            <h2>
                ${escapeHTML(title)}

            </h2>


            <p>
                ${t(newsItem, "summary")}
            </p>


            ${newsItem.link
            ? `
                    <a
                        class="read"
                        href="${escapeHTML(
                newsItem.link
            )}"
                    >
                        ${LANG === "en"
                ? "Read more →"
                : "തുടർന്ന് വായിക്കുക →"
            }
                    </a>
                  `
            : ""
        }


            ${nextArticleId
            ? `
                    <a
                        class="category-next"
                        href="#${escapeHTML(
                nextArticleId
            )}"
                    >
                        ${LANG === "en"
                ? "Next →"
                : "അടുത്തത് →"
            }
                    </a>
                  `
            : ""
        }

        </article>

    `;
}


/*
    Style for Next article link.
*/
function addCategoryNextStyle() {

    if (
        document.getElementById(
            "categoryNextStyle"
        )
    ) {
        return;
    }

    const style =
        document.createElement("style");

    style.id =
        "categoryNextStyle";

    style.textContent = `

        .category-next {

            display: inline-block;

            margin-top: 6px;

            font-size: 0.9em;

        }

    `;

    document.head.appendChild(style);
}


/*
    Main rendering function.
*/
function render() {
    document.getElementById("dailyHits").textContent = "TEST 123";
    addCategoryNextStyle();

    const settings =
        DB.settings || {};

    const publicationDate =
        settings.publicationDate ||
        new Date()
            .toISOString()
            .slice(0, 10);

    const date =
        new Date(
            publicationDate +
            "T18:00:00"
        );

    updateMetaTitle(publicationDate);
    const branding =
        DB.branding || {};

    const labels =
        DB.labels?.[LANG] || {};

    /* counter function */
    trackDailyHit(
        settings.publicationDate
    );

    /*
        ----------------------------------------
        FOOTER
        ----------------------------------------
    */

    document.getElementById(
        "footerNotice"
    ).textContent =
        t(settings, "footerNotice");

    /*
        ----------------------------------------
        BRANDING
        ----------------------------------------
    */

    document.getElementById(
        "paperName"
    ).textContent =
        t(branding, "name");


    document.getElementById(
        "tagline"
    ).textContent =
        t(branding, "tagline");


    document.getElementById(
        "motto"
    ).innerHTML =
        escapeHTML(
            t(branding, "motto")
        ).replace(
            /\n/g,
            "<br>"
        );


    document.getElementById(
        "edition"
    ).textContent =
        t(settings, "edition");


    document.getElementById(
        "footerName"
    ).textContent =
        t(branding, "name");


    /* document.getElementById(
         "copyright"
     ).textContent =
         t(settings, "copyright");
 
 
     /*
         ----------------------------------------
         DATE
         ----------------------------------------
     */

    //const publicationDate = getPublicationDate();

    /* const date = new Date(
         publicationDate + "T18:00:00"
     );*/

    document.getElementById(
        "day"
    ).textContent =
        date.getDate();


    document.getElementById(
        "monthYear"
    ).textContent =
        date.toLocaleDateString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "malayalamDate"
    ).textContent =
        t(
            settings,
            "malayalamDate"
        );


    document.getElementById(
        "hijriDate"
    ).textContent =
        t(
            settings,
            "hijriDate"
        );


    /*
        ----------------------------------------
        VOLUME / ISSUE
        ----------------------------------------
    */

    document.getElementById(
        "volumeIssue"
    ).innerHTML =

        LANG === "en"

            ? `Volume ${settings.volume}<br>
           Issue ${settings.issue}`

            : `വാല്യം ${settings.volume}<br>
           ലക്കം ${settings.issue}`;


    /*
        Complete publication date.
    */

    document.getElementById(
        "dateText"
    ).textContent =

        date.toLocaleDateString(
            LANG === "en"
                ? "en-IN"
                : "ml-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    /*
        ----------------------------------------
        SPECIAL DAY
        ----------------------------------------
    */

    const specialDayElement =
        document.getElementById(
            "specialDay"
        );


    if (specialDayElement) {

        specialDayElement.textContent =
            t(
                settings,
                "specialDay"
            );

    }


    /*
        ----------------------------------------
        BREAKING NEWS
        ----------------------------------------
    */

    document.getElementById(
        "breakingLabel"
    ).textContent =
        labels.breaking ||
        "BREAKING";


    document.getElementById(
        "breakingNews"
    ).textContent =

        (DB.breakingNews || [])

            .map(function (item) {

                return t(
                    item,
                    "title"
                );

            })

            .join(" • ");


    /*
        ----------------------------------------
        NAVIGATION
        ----------------------------------------
    */

    document.getElementById(
        "nav"
    ).innerHTML =

        (DB.navigation || [])

            .map(function (item) {

                return `

                <a
                    href="${escapeHTML(
                    item.link || "#"
                )}"
                >

                    ${escapeHTML(
                    t(
                        item,
                        "label"
                    )
                )}

                </a>

            `;

            })

            .join("");/*
    ----------------------------------------
    NAVIGATION
    ----------------------------------------
*/

    document.getElementById(
        "nav"
    ).innerHTML =

        (DB.navigation || [])

            .map(function (item) {

                return `

                <a
                    href="${escapeHTML(
                    item.link || "#"
                )}"
                >

                    ${escapeHTML(
                    t(
                        item,
                        "label"
                    )
                )}

                </a>

            `;

            })

            .join("");/*
    ----------------------------------------
    NAVIGATION
    ----------------------------------------
*/

    document.getElementById(
        "nav"
    ).innerHTML =

        (DB.navigation || [])

            .map(function (item) {

                return `

                <a
                    href="${escapeHTML(
                    item.link || "#"
                )}"
                >

                    ${escapeHTML(
                    t(
                        item,
                        "label"
                    )
                )}

                </a>

            `;

            })

            .join("");/*
    ----------------------------------------
    NAVIGATION
    ----------------------------------------
*/

    document.getElementById(
        "nav"
    ).innerHTML =

        (DB.navigation || [])

            .map(function (item) {

                return `

                <a
                    href="${escapeHTML(
                    item.link || "#"
                )}"
                >

                    ${escapeHTML(
                    t(
                        item,
                        "label"
                    )
                )}

                </a>

            `;

            })

            .join("");

    /*
        ----------------------------------------
        GET ALL NEWS
        ----------------------------------------
    */

    const allNews =

        (DB.news || [])

            .slice()

            .sort(function (a, b) {

                return (
                    (a.order ?? 999) -
                    (b.order ?? 999)
                );

            });


    /*
        ----------------------------------------
        FIND LEAD STORY
        ----------------------------------------
    */

    const leadStory =

        allNews.find(function (item) {

            return item.type === "lead";

        }) || allNews[0];


    /*
        Remaining stories.
    */

    const normalNews =

        allNews.filter(function (item) {

            return item !== leadStory;

        });


    /*
        ----------------------------------------
        DISPLAY LEAD STORY
        ----------------------------------------
    */

    if (leadStory) {

        document.getElementById(
            "leadArea"
        ).innerHTML = `

            <article class="lead">

                <div>

                    ${imageHTML(
            leadStory.image,
            t(
                leadStory,
                "title"
            )
        )}

                </div>


                <div>

                    <div class="kicker">

                        ${escapeHTML(
            t(
                leadStory,
                "category"
            )
        )}

                    </div>


                    <h1>

                        ${escapeHTML(
            t(
                leadStory,
                "title"
            )
        )}

                    </h1>


                    <p>
                        ${t(
            leadStory,
            "summary"
        )}
                    </p>


                    <a
                        class="read"
                        href="${escapeHTML(
            leadStory.link || "#"
        )}"
                    >

                        ${LANG === "en"
                ? "Read more →"
                : "തുടർന്ന് വായിക്കുക →"
            }

                    </a>

                </div>

            </article>

        `;

    } else {

        document.getElementById(
            "leadArea"
        ).innerHTML = "";

    }


    /*
        ----------------------------------------
        AUTOMATIC 3-COLUMN DISTRIBUTION
        ----------------------------------------
    */

    const columns = [
        [],
        [],
        []
    ];


    normalNews.forEach(
        function (
            newsItem,
            index
        ) {

            const columnNumber =
                index % 3;

            columns[
                columnNumber
            ].push(
                newsItem
            );

        }
    );


    /*
        Column headings.
    */

    const columnTitles =

        DB.columnTitles?.[LANG] ||

        [
            "പ്രധാന വാർത്തകൾ",
            "വാർത്തകൾ",
            "കേരളം • ഇന്ത്യ • ലോകം"
        ];


    /*
        ----------------------------------------
        UNIQUE ARTICLE ANCHORS
        ----------------------------------------

        First Kerala article:

        #kerala

        Second:

        #kerala-2

        Third:

        #kerala-3
    */

    const articleAnchorMap =
        new Map();


    const categoryCounters =
        new Map();


    normalNews.forEach(
        function (newsItem) {

            const section =
                getNavigationSection(
                    newsItem
                );


            if (!section) {
                return;
            }


            const currentCount =

                (
                    categoryCounters.get(
                        section.id
                    ) || 0
                ) + 1;


            categoryCounters.set(
                section.id,
                currentCount
            );


            const articleId =

                currentCount === 1

                    ? section.id

                    : `${section.id}-${currentCount}`;


            articleAnchorMap.set(
                newsItem.id,
                articleId
            );

        }
    );


    /*
        ----------------------------------------
        FIND NEXT ARTICLE
        ----------------------------------------
    */

    const nextArticleMap =
        new Map();


    normalNews.forEach(
        function (
            newsItem,
            index
        ) {

            const section =
                getNavigationSection(
                    newsItem
                );


            if (!section) {
                return;
            }


            const nextArticle =

                normalNews

                    .slice(index + 1)

                    .find(
                        function (item) {

                            const nextSection =
                                getNavigationSection(
                                    item
                                );


                            return (

                                nextSection &&

                                nextSection.id ===
                                section.id

                            );

                        }
                    );


            if (nextArticle) {

                nextArticleMap.set(

                    newsItem.id,

                    articleAnchorMap.get(
                        nextArticle.id
                    )

                );

            }

        }
    );


    /*
        ----------------------------------------
        RENDER THREE COLUMNS
        ----------------------------------------
    */

    const columnIDs = [

        "col1",
        "col2",
        "col3"

    ];


    columnIDs.forEach(
        function (
            columnID,
            index
        ) {

            document.getElementById(
                columnID
            ).innerHTML = `

                <h2
                    class="section-title"
                >

                    ${escapeHTML(
                columnTitles[index]
            )}

                </h2>


                ${columns[index]

                    .map(
                        function (
                            newsItem
                        ) {

                            const section =
                                getNavigationSection(
                                    newsItem
                                );


                            const sectionId =

                                articleAnchorMap.get(
                                    newsItem.id
                                ) || "";


                            const nextArticleId =

                                nextArticleMap.get(
                                    newsItem.id
                                ) || "";


                            return card(

                                newsItem,

                                sectionId,

                                nextArticleId

                            );

                        }
                    )

                    .join("")

                }

            `;

        }
    );
    /* counter function
    fetching apk*/
    async function trackDailyHit(publicationDate) {

        if (!publicationDate) {
            return;
        }

        const counterKey =
            "epaper-" +
            publicationDate.replace(/-/g, "");

        const namespace =
            "geocities.ws/e-paper";

        const action =
            "view";

        const apiURL =
            "https://counterapi.com/api/" +
            encodeURIComponent(namespace) +
            "/" +
            encodeURIComponent(action) +
            "/" +
            encodeURIComponent(counterKey);

        try {

            const response =
                await fetch(apiURL);

            if (!response.ok) {
                throw new Error("Counter API error");
            }

            const data =
                await response.json();

            console.log(
                "Today's e-paper hits:",
                data.value
            );

            const hitsElement =
                document.getElementById("dailyHits");

            if (hitsElement) {

                hitsElement.textContent =
                    "👁 Today's Views: " +
                    data.value;
            }

        } catch (error) {

            console.error(
                "Daily hit counter error:",
                error
            );
        }
    }
}

function getPublicationDate() {

    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    return `${year}-${month}-${day}`;
}
/*
 Update meta tage and 
 publication date
*/


function updateMetaTitle(publicationDate) {

    if (!publicationDate) {
        return;
    }

    const parts =
        publicationDate.split("-");

    if (parts.length !== 3) {
        return;
    }

    const formattedDate =
        parts[2] + "/" +
        parts[1] + "/" +
        parts[0];

    const meta =
        document.querySelector(
            'meta[property="og:title"]'
        );

    if (meta) {

        meta.setAttribute(
            "content",
            "Evening News " + formattedDate
        );

    }
}
/*
    ----------------------------------------
    START E-PAPER
    ----------------------------------------
*/

init();