// License: AGPL
// **No warranty**
// **BACKUP Zotero library before use**


// customExportAsJSON
//   provides a lightweight export of select data in JSON (or other) format
//   alter code to match the fields required
//
// Instructions:
// select items you want to export in main Zotero pane
// copy this code into Zotero > Tools > Developer > Run Javascript
function customExportAsJSON() {
    var items = Zotero.getActiveZoteroPane().getSelectedItems();
    var result = {'withField' : 0, 'withFieldTestPassed' : 0, 'results' : {}};
    for (i = 0; i < items.length; i++) {
        if (items[i].getField('creators') != null && items[i].getField('title') != "") {
            new_result = {};
            var creators = items[i].getCreators();
            var creatorsExport = [];
            for (let j = 0; j < creators.length; j++) {
                creatorsExport.push(creators[j]['lastName']);
            }
            new_result['title'] = items[i].getField('title');
            new_result['creators'] = creatorsExport;
            new_result['ISBN'] = items[i].getField('ISBN');
            new_result['doi'] = items[i].getField('DOI');
            new_result['year'] = items[i].getField('year');
            result['results'][items[i].key] = new_result;
        }
    }
    return result;
}

customExportAsJSON();  // use this to preview the results in the right hand pane
//JSON.stringify(customExportAsJSON());    // use this to get JSON which you can save to a file
