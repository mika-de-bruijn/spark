let { selection, Text} = require("scenegraph");
let commands = require("commands");
let application = require("application");
let panel;

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
        application.editDocument((selection) => {
            try {

                var obj = selection.items[0];
                var columns = parseInt(panel.querySelector('#columns').value);
                var gutter = parseInt(panel.querySelector('#gutter').value);
                var newWidth = (obj.localBounds.width / columns) - (gutter * (columns - 1) / columns);
                
                // if (obj instanceof Text) {
                //     var substr = obj.text.split(" ");
                //     var chunkSize = (substr.length / columns);
                //     var chunkCount = 1;
                //     for (let i = 0; i < substr.length; i += chunkSize) {
                //         var chunk = substr.slice(i, i + chunkSize).toString().replace(/,/g," ");
                //         if(chunkCount <= 1) {
                //             obj.text = chunk;
                //             obj.resize(newWidth, obj.localBounds.height);
                //         } else {
                //             commands.duplicate();
                //             var clone = obj;
                //             clone.text = chunk;
                //             clone.moveInParentCoordinates(newWidth + gutter, 0);
                //         }
                //         chunkCount++;
                //     }
                // }

                if (obj instanceof Text) {
                    var substr = obj.text.split(" ");
                    var chunkSize = (substr.length / columns);
                    for (let i = 0; i < columns; i++){
                        if(i == 0) {
                            continue;
                        } else {
                            var chunkPos = (chunkSize * i);
                            var chunk = substr.slice(chunkPos, chunkPos + chunkSize).toString().replace(/,/g," ");
                            console.log(chunkPos + " | " + i)
                            if(i == 1) {
                                obj.text = chunk;
                                obj.resize(newWidth, obj.localBounds.height);
                            } else if(i > 1) {
                                commands.duplicate();
                                obj.text = chunk;
                                obj.moveInParentCoordinates((newWidth + gutter) * i, 0);
                                selection.items = obj;
                            }
                        }
                    };
                }
                
                else {
                    for (let i = 0; i < columns + 1; i++){
                        if(i <= 1) {
                            obj.resize(newWidth, obj.localBounds.height);
                        } else {
                            commands.duplicate();
                            obj.moveInParentCoordinates(newWidth + gutter, 0);
                            selection.items = obj;
                        }
                    };
                }

            } catch (ex) {
                console.log("Failed", ex); 
            }
        });
    });
  }
}

module.exports = {
    panels: {
        columnsPanel: { show }
    }
};