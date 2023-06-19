// License: AGPL
// **No warranty**
// **BACKUP Zotero library before use**


// moveField(fieldSource, fieldDest, funcTest, overwriteDest, makeEdits)
//   moves one data field to another
// fieldSource: source field / field to move
// fieldDest: destination field 
// funcTest: a function accepting one parameter which should return true or false
//           if returns true, the move will be done; otherwise not
//           this allows for a selective move of the contents of one field to another
// overwriteDest: if true, destination field will be overwritten if it is not empty
// makeEdits: if true, changes will be save; otherwise, changes will be previewed in pane

function moveField(fieldSource, fieldDest, funcTest, overwriteDest, makeEdits) {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    var result = { 'with' : 0, 
                   'withDestNotEmpty' : 0,
                   'itemsChanged' : []
    };
    for (i = 0; i < items.length; i++) {
        if (items[i].getField(fieldSource) != "") {
            result['with']++;
            if (items[i].getField(fieldDest) != "") {
                result['withDestNotEmpty']++;
            }
            if (funcTest(items[i].getField(fieldSource)) && (items[i].getField(fieldDest) == "" || overwriteDest)) {
                var new_item = {};
                new_item['key'] = items[i].key;
                new_item['item title'] = items[i].getField('title');
                new_item['field value'] = items[i].getField(fieldSource);
                new_item['source'] = fieldSource;
                new_item['destination'] = fieldDest;
                result['itemsChanged'].push(new_item);
                if (makeEdits) {
                    items[i].setField(fieldDest, items[i].getField(fieldSource));
                    items[i].setField(fieldSource, "");
                    items[i].saveTx();
                }
            }
        }
    }
    return result;
}


// Examples

// 1. Move contents of 'url' field to 'libraryCatalog' field if url matches the value
//    (used to e.g. move local institution records for an item to library field, 
//    keeping external URLs for other items)

moveField("url", 
          "libraryCatalog", 
          function (p) { return p.indexOf("https://--my-institutions-library-record/exlibris") != -1; },
          false,
          false)

