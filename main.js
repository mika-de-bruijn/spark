let panel;
let { makeColumns, createColumnsPanel } = require('./src/columns');
let { createContrastPanel, getColors } = require('./src/contrast');

function create(panelId) {
    if(panelId === "columnsPanel") {
        panel = createColumnsPanel();
        panel.querySelector('form').addEventListener("submit", () => {
            makeColumns(panel);
        });  
    } else if (panelId === "contrastPanel") {
        panel = createContrastPanel();
        panel.querySelector('form').addEventListener("submit", () => {
            getColors();
        });  
    }
    return panel;
}

function show(event) {
    event.node.appendChild(create(this._manifestPanel.panelId));
}

function hide(event) {
    event.node.firstChild.remove();
}

function update() {
    getColors();
}

module.exports = {
    panels: {
        columnsPanel: { show, hide },
        contrastPanel: { show, hide, update }
    }
};