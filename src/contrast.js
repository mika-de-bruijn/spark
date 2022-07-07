let panel;
let { selection } = require("scenegraph");

function createContrastPanel() {
    const HTML = `<style>
            #notice {
                font-size: 13px;
                text-align: center;
                opacity: .75;
            }
            .section {
                width: 100%;
                padding: 10px 8px;
            }
            .row {
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
            .row > * {
                width: 48%;
            }
            #contrast_input .color {
                border: 1px solid #E1E1E1;
                padding: 2px 8px 5px;
                border-radius: 6px;
                font-size: 13px;
                display: flex;
                align-items: center;
            }
            #contrast_input .color color {
                width: 15px;
                height: 15px;
                border-radius: 3px;
                margin-right: 6px;
                margin-top: 2px;
            }
            .ui-label {
                font-size: 12px;
                color: #333;
                margin-bottom: 6px;
                font-weight: 500;
            }
            #contrast_result {
                width: 100%;
                margin-top: 15px;
            }
            #contrast_result .result {
                border: 1px solid #E1E1E1;
                padding: 6px;
                border-radius: 6px;
                margin-top: 6px
            }
            #contrast_result .result .ratio,
            #contrast_result .result .text > * {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            #contrast_result .result .ratio {
                padding: 4px;
                border-radius: 4px 4px 0 0;
                background-color: #E9E9E9;
            }
            #contrast_result .contrast-meta {
                font-size: 12px;
                margin-top: 6px;
                margin-left: 0;
                font-weight: 400;
            }
            #contrast_result a {
                margin-top: 6px;
                font-size: 12px;
            }
        </style>
        <form method="panel" id="main">
            <h3>Contrast check</h3>
            <hr class="small" />
            <div class="section">
                <div id="contrast_input" class="row">
                </div>
                <div id="contrast_result">
                    <span id="notice">Select 2 elements</span>
                </div>
            </div>
        </form>`;

    panel = document.createElement("div");
    panel.innerHTML = HTML;

    return panel;
}

function getColors() {
    if(selection.items[0] && selection.items[1]) {
        var fg = selection.items[0].fill.toHex(true).replace('#', '');
        var bg = selection.items[1].fill.toHex(true).replace('#', '');
        checkContrast(fg, bg);
    } else {
        panel.querySelector('#contrast_input').innerHTML = "";
        panel.querySelector('#contrast_result').innerHTML =
        "<span id='notice'>Select 2 elements</span>"
    }
}

function checkContrast(fg, bg) {
    var url = "https://webaim.org/resources/contrastchecker/?fcolor=" + fg + "&bcolor=" + bg + "&api";
    async function getapi(url) {
        try {
            const response = await fetch(url);
            var data = await response.json();
            show(data);
        } catch (ex) {
            console.log("Failed", ex); 
        }
    }
    function show(data) {
        var rating;
        var meta;
        var large_c;
        var general_c;
        if(data.ratio > 12) {
            rating = "Excelent";
            meta = "Great contrast for all text sizes";
            general_c = "--green";
            large_c = "--green";
        } else if(data.ratio > 7) {
            rating = "Very Good";
            meta = "Good contrast for all text sizes";
            general_c = "--green";
            large_c = "--green";
        } else if (data.ratio > 4.5) {
            rating = "Good";
            meta = "Good contrast for bold text below 18px, or normal text above 18px";
            general_c = "--yellow";
            large_c = "--green";
        } else if (data.ratio > 3) {
            rating = "Bad";
            meta = "Bad contrast for all text below 18px";
            general_c = "--red";
            large_c = "--yellow";
        } else {
            rating = "Very Bad";
            meta = "Bad contrast for all text sizes";
            general_c = "--red";
            large_c = "--red";
        }

        panel.querySelector('#contrast_input').innerHTML =
        '<div class="text-color">' +
            '<label class="ui-label">Text color</label>' +
            '<span class="color" id="fg_prev"><color style="background-color:#'+fg+';"></color>#' + fg + '</span>' +
        '</div>' +
        '<div class="background-color">' +
            '<label class="ui-label">Background color</label>' +
            '<span class="color" id="bg_prev"><color style="background-color:#'+bg+';"></color>#' + bg + '</span>' +
        '</div>'

        panel.querySelector('#contrast_result').innerHTML =
        "<label class='ui-label'>Contrast</span>" +
        "<div class='result'>" +
            "<div class='ratio row" + general_c + "'>" + 
                "<span class='value'>Ratio: " + data.ratio + "</span>" +
                "<span class='ratio'>" + rating + "</span>" +
            "</div>" +
            "<div class='text row'>" +
                "<span class='small-text" + general_c + "'><tag>Small text</tag>" + data.AA + "</span>" +
                "<span class='large-text" + large_c + "'><tag>Large text</tag>" + data.AALarge + "</span>" +
            "</div>" +
        "</div>" + 
        "<p class='contrast-meta'>" + meta + "</p>" +
        "<a href='https://en.wikipedia.org/wiki/Web_Content_Accessibility_Guidelines' target='_blank'>Learn more</a>"
    }
    getapi(url);
}

module.exports = {
    createContrastPanel,
    getColors
};