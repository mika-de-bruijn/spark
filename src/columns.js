let panel;
let { selection, Text } = require("scenegraph");
let commands = require("commands");
let application = require("application");

function createColumnsPanel() {
    const HTML = `<style>
            .break {
                flex-wrap: wrap;
            }
            label.row.input-group {
                flex-direction: column;
                align-items: flex-start;
                margin-top: 12px;
                margin-left: 0;
            }
            label.row > .label {
                font-size: 10px;
                margin-bottom: 0;
            }
            label.row > input {
                width: 80%;
            }
        </style>
        <form method="panel" id="main">
            <h3>Columns generator</h3>
            <hr class="small" />
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

function makeColumns(panel) {
    application.editDocument((selection) => {
        try {

            var obj = selection.items[0];
            var columns = parseInt(panel.querySelector('#columns').value);
            var gutter = parseInt(panel.querySelector('#gutter').value);
            var newWidth = (obj.localBounds.width / columns) - (gutter * (columns - 1) / columns);
                        
            if (obj instanceof Text) {
                var substr = obj.text.split(" ");
                var chunkSize = (substr.length / columns);
            }
            
            for (let i = 0; i < columns + 1; i++){
                if (i === 0) { continue; }
                if (obj instanceof Text) {
                    var chunkPos = (chunkSize * (i - 1));
                    var chunk = substr.slice(chunkPos, chunkPos + chunkSize).toString().replace(/,/g," ");
                }
                if(i <= 1) {
                    if (obj instanceof Text) {
                        obj.text = chunk;
                    }
                    obj.resize(newWidth, obj.localBounds.height);
                } else {
                    commands.duplicate();
                    if (obj instanceof Text) {
                        obj.text = chunk;
                    }
                    obj.moveInParentCoordinates(newWidth + gutter, 0);
                    selection.items = obj;
                }
            };

        } catch (ex) {
            console.log("Failed", ex); 
        }
    });
};

module.exports = {
    makeColumns,
    createColumnsPanel
};