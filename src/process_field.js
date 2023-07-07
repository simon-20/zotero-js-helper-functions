// License: AGPL
// **No warranty**
// **BACKUP Zotero library before use**


// processField(fieldSource, funcTest, funcManipulate, makeEdits)
//   performs an arbitrary operation on a field
// fieldSource: source field to act on
// funcTest: a function accepting one parameter (the field in question)
//           which should return true or false if returns true, the
//           processing will be done; otherwise not
//           allows for more selective processing
// funcManipulate: a function which should manipulate the field in some way, returning
//           the value to be saved back to the field.
// makeEdits: if true, changes will be save; otherwise, changes will be previewed in pane

function processField(fieldSource, funcTest, funcManipulate, makeEdits) {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    var result = { 'with' : 0, 
                   'itemsChanged' : []
    };
    for (i = 0; i < items.length; i++) {
        if (items[i].getField(fieldSource) != "") {
            result['resultsWithTargetField']++;

            if (funcTest(items[i].getField(fieldSource))) {
                var new_item = {};
                new_item['key'] = items[i].key;
                new_item['item_title'] = items[i].getField('title');
                new_item['source'] = fieldSource;
                new_item['field_value'] = items[i].getField(fieldSource);
                new_item['new_field_value'] = funcManipulate(items[i].getField(fieldSource));
                result['itemsChanged'].push(new_item);
                if (makeEdits) {
                    var res = funcManipulate(items[i].getField(fieldSource));
                    items[i].setField(fieldSource, res);
                    items[i].saveTx();
                }
            }
        }
    }
    return result;
}


// Examples

// 1. Fix capitalisation for any articles that have been published in 'Religious Studies'

// processField("publicationTitle", 
//          function (p) { return p.toLowerCase() == "religious studies"; },
//          function (p) { return "Religious Studies"; },
//          false);

// 2. Unify the format of editions

// processField("edition", 
//       function (p) { return p.startsWith('1'); },
//       function (p) { return '1'; },
//      false);

// 3. Remove spurious space before colon in Book Titles of Book Chapter entries
//      (for use with books that have subtitles)

// processField("bookTitle", 
//       function (p) { return p.indexOf(' : ') != -1; },
//       function (p) { return p.replace(' : ', ': '); },
//       false);