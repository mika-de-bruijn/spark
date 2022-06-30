let { selection, Text } = require("scenegraph");
let commands = require("commands");
let application = require("application");

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

module.exports = makeColumns;