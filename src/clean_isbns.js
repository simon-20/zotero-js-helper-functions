// License: AGPL.git
// No warranty **BACKUP Zotero library before use**
//
// cleanISBN(makeEdits)
//   removes extraneous characters from the ISBN field
//   **IMPORTANT**: if the ISBN field contains two ISBNs, only the first is kept
// makeEdits - a toggle to indicate whether to save changes
// usage:
// select items to process in main Zotero window
// paste code into Zotero > Tools > Developer > Run Javascript
// uncomment cleanISBN(false) below
// Click 'Run', the changes that will be made are previed in the right hand pane
// If results look good, change 'false' to 'true' and re-run
function cleanISBN(makeEdits) {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    var result = { 'withISBN' : 0, 
                   'withMalformedISBN' : 0,
                   'itemsWithMalformedISBN' : []
    };
    for (i = 0; i < items.length; i++) {
        if (items[i].getField("ISBN") != "") {
            result['withISBN']++;
            if (!/^[0-9-]+X?$/.test(items[i].getField("ISBN"))) {
                result['withMalformedISBN']++;
                var new_item = {};
                new_item['item key'] = items[i].key;
                new_item['item item'] = items[i].getField('title');
                new_item['old ISBN'] = items[i].getField('ISBN');
                new_item['new ISBN'] = items[i].getField("ISBN").replace(/^[^0-9-]*([0-9-]+X?)[^0-9-X].*$/, "$1");
                result['itemsWithMalformedISBN'].push(new_item);
                if (makeEdits) {
                    items[i].setField('ISBN', new_item['new ISBN']);
                    items[i].saveTx();
                }
            }
        }
    }
    return result;
}

// cleanISBN(false);