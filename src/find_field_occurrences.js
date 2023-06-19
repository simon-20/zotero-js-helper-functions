// License: AGPL
// **No warranty**
// **BACKUP Zotero library before use**


// howManyRecordsUseField(fieldName, testFunc, includeTestFieldInOutput)
//   find out how many records use the field called `fieldName`
//
// fieldName: the field to search for
// testFunc: a function which takes the field as input and should return true/false
//           depending on whether it should be counted
// includeTestFieldInOutput: bool indicating whether to include field in output
function howManyRecordsUseField(fieldName, testFunc, includeTestFieldInOutput) {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    var result = {'withNonEmptyField' : 0, 'withFieldTestPassed' : 0, results : []};
    for (i = 0; i < items.length; i++) {
        if (items[i].getField(fieldName) != "") {
            result['withNonEmptyField']++;
            if (testFunc != null) {
                if (testFunc(items[i].getField(fieldName))) {
                    result['withFieldTestPassed']++;
                    let itemResult = {};
                    itemResult['key'] = items[i]['key'];
                    if (includeTestFieldInOutput) {
                        itemResult['field value'] = items[i].getField(fieldName);
                    }
                    result['results'].push(itemResult);                    
                }
            }
        }
    }
    return result;
}

// Examples:

// Find out how many items have an abstract, don't show abstract in results
//howManyRecordsUseField('abstractNote', function (p) { return p.length > 0;}, false);

// Find out how many items have an abstract, show abstract in results
// howManyRecordsUseField('abstractNote', function (p) { return p.length > 0; }, true);

// Find out how many items have an abstract of less than 50 characters; show abstract in results
// howManyRecordsUseField('abstractNote', function (p) { return p.length < 50; }, true);

// Find out how many items have a title with the string ' : ' in it 
//      (i.e., there is an extra space before colon separating title from subtitle)
// howManyRecordsUseField('title', function (p) { return p.indexOf(" : ") != -1 }, true);
