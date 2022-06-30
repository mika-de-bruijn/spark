let panel;
let makeColumns = require('./src/columns');

function create() {
    const HTML = `<style>
            .break {
                flex-wrap: wrap;
            }
            label.row.input-group {
                flex-direction: column;
                align-items: flex-start;
                margin-top: 12px;
            }
            label.row > * {
                margin: 3px 0;
            }
            label.row > .icon {
                color: #8E8E8E;
                margin-right: 8px;
                text-align: right;
                font-size: 9px;
            }
            label.row > .label {
                font-size: 10px;
            }
            form footer > * {
                position: relative;
                left: 8px;
            }

        </style>
        <form method="panel" id="main">
            <div class="row break">
                <label class="row input-group">
                    <span class="label">Columns</span>
                    <input type="number" uxp-quiet="true" id="columns" value="2" min="1" max="12" placeholder="Amount of columns" />
                </label>
                <label class="row input-group">
                    <span class="label">Gutter</span>
                    <input type="number" uxp-quiet="true" id="gutter" value="32" placeholder="Gutter size" />
                </label>
            </div>
            <footer><button id="ok" type="submit" uxp-variant="cta">Apply</button></footer>
        </form>
        `;

    panel = document.createElement("div");
    panel.innerHTML = HTML;

    return panel;
}

function show(event) {
  if (!panel) {
    panel = create();
    event.node.appendChild(panel);

    panel.querySelector('form').addEventListener("submit", () => {
        makeColumns(panel);
    });
  }
}

module.exports = {
    panels: {
        columnsPanel: { show }
    }
};