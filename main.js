const commands = require("commands");

function textToColumns(selection) {

    var obj = selection.items[0];
    var substr = obj.text.split(" ");

    var columns = 2;
    var gutter = 32;

    var chunkSize = (substr.length / columns);
    for (let i = 0; i < substr.length; i += chunkSize) {
        var chunk = substr.slice(i, i + chunkSize).toString().replace(/,/g," ");
        if(i <= 0) {
            obj.text = chunk;
            obj.resize((obj.localBounds.width / columns) - (gutter / columns), obj.localBounds.height);
        } else {
            commands.duplicate();
            var clone = obj, {width} = clone.localBounds;
            clone.text = chunk;
            clone.moveInParentCoordinates(width + gutter, 0);
        }
    }
    
}

module.exports = {
    commands: {
        textToColumns: textToColumns
    }
};