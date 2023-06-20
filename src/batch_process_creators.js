// License: AGPL
// **No warranty**
// **BACKUP Zotero library before use**
// **Always preview results (using makeEdits=false) first**


// batchProcessCreators(targetCreatorType, testFunc, processFunc, makeEdits)
//     get info on and batch process creators
//
// targetCreatorType - the creator type ID to work on; -1 means all creators
// testFunc - a function that is passed the creators object for any given item
//            if it returns true, then code moves to the processing stage; otherwise 
//            this item is skipped
// processFunc(resultDict, creators, targetCreatorType) - 
//            a function which is passed a dictionary to store result in, a deep copy 
//            of the creators dict for the current item, and the targetCreatorType which
//            user wants to operate on.
//            this function should process the creators as needed; the results will be stored
//            in resultDict['creatorsModified']
// makeEdits - boolean; edits will only be saved/committed if this is true
//
// Instructions:
// * Backup Zotero DB
// * Turn off automatic syncing
// * Copy code into Zotero > Tools > Developer > Run Javascript
// * Select a few items to test on
// * Inspect results using the preview mode
//
// Useful information:
// fieldMode:
//  0 - lastName, firstName as separate entries
//  1 - full name in lastName field
// creatorTypeIDs:
//  8 - Author
// 10 - Editor
// 13 - Book Author
class Creator
{
    constructor(creator_entry) {
        this.type = creator_entry['creatorTypeID'];
        this.fieldMode = creator_entry['fieldMode'];
        if (this.fieldMode == 0) {
            this.firstName = creator_entry['firstName'].trim();
            this.firstNameT = this.firstName.replace(/([a-zA-Z]{2,})[\.,]$/, "$1");
            this.lastName = creator_entry['lastName'].trim();
            this.lastNameT = this.lastName.replace(/[\.,]$/, "");
            this.fullName = this.firstName + ' ' + this.lastName;
            this.fullNameT = this.firstNameT + ' ' + this.lastNameT;
            this.fullNameNoInitial = this.firstName.replace(/([a-zA-Z])+( [a-zA-Z]\.)?/, "$1");
            this.fullNameNoInitial += " " + this.lastName;
        } else {
            this.fullName = creator_entry['lastName'].trim();
            if (this.fullName.toLowerCase() != "jr." && this.fullName.toLowerCase() != "sr.") {
                this.fullNameT = this.fullName.replace(/[\.,]$/, "");
            } else {
                this.fullNameT = this.fullName;
            }
            this.fullNameNoInitial = this.fullName.replace(/([a-zA-Z])+ ([a-zA-Z]\. )?([a-zA-Z]+)/, "$1 $2");
        }
    }
    
    wasTrimDestructive() {
        return this.fullName != this.fullNameT;
    }
    
    isTrimmedSameAs(other_creator) {
        return this.type == other_creator.type 
               && this.fullNameT == other_creator.fullNameT;
    }
    
    isSameAs(other_creator) {
        return this.type == other_creator.type 
               && this.fullName == other_creator.fullName;
    }
    
    isSameNoInitial(other_creator) {
        return this.type == other_creator.type
                && this.fullNameNoInitial == other_creator.fullNameNoInitial;
    }
}

function batchProcessCreators(targetCreatorType, testFunc, processFunc, makeEdits) {
    let items = Zotero.getActiveZoteroPane().getSelectedItems();
    let result = {'withCreators' : 0, 
                  'withCreatorsTestPassed' : 0, 
                  'withCreatorsProcessModified' : 0,
                  'totalItemsSelected' : items.length,
                  results : []};
    for (i = 0; i < items.length; i++) {
        creators = items[i].getCreators();
        if (creators.length > 0) {
            result['withCreators']++;
            if (testFunc != null) {
                if (testFunc(creators)) {
                    result['withCreatorsTestPassed']++;
                    let thisResult = {'item key': items[i]['key'], 
                                      'title': items[i].getField('title'),
                                      'creators' : creators
                    };                    
                    if (processFunc != null) {
                        let creatorsModified = processFunc(thisResult, JSON.parse(JSON.stringify(creators)), targetCreatorType);
                        if (JSON.stringify(thisResult['creators']) != JSON.stringify(creatorsModified)) {
                            result['withCreatorsProcessModified']++;
                            thisResult['creatorsModified'] = creatorsModified;
                            result['results'].push(thisResult);
                            if (makeEdits) {
                                items[i].setCreators(creatorsModified);
                                items[i].saveTx();
                            }        
                        }
                    }
                }
            }
        }
    }
    return result;
}



// Examples:

// 1. Remove trailing fullstops, commas and dashes on first name, but leaving fullstops on initials
// on all creator types

// batchProcessCreators(-1, // all creator types
//     function (creators) { return creators.length > 0; }, 
//     function (creators, targetCreatorTypeID) {
//        for (let i = 0; i < creators.length; i++) {
//            if (creators[i]['fieldMode'] == 0 && (targetCreatorTypeID == -1 || targetCreatorTypeID == creators[i]['creatorTypeID'])) {
//                if (creators[i]['firstName'].match(/[a-zA-Z]{2,}[\.,-]$/) != null) {
//                    creators[i]['firstName'] = creators[i]['firstName'].replace(/([a-zA-Z]{2,})[\.,-]$/, "$1");
//                }
//            }
//         }
//         return creators;
//     }, 
//     false);


// 2. Remove trailing fullstops, commas and dashes on first name, but leaving fullstops on initials
// but only for authors

// batchProcessCreators(8, // just authors types
//     function (creators) { return creators.length > 0; }, 
//     function (creators, targetCreatorTypeID) {
//        for (let i = 0; i < creators.length; i++) {
//            if (creators[i]['fieldMode'] == 0 && (targetCreatorTypeID == -1 || targetCreatorTypeID == creators[i]['creatorTypeID'])) {
//                if (creators[i]['firstName'].match(/[a-zA-Z]{2,}[\.,-]$/) != null) {
//                    creators[i]['firstName'] = creators[i]['firstName'].replace(/([a-zA-Z]{2,})[\.,-]$/, "$1");
//                }
//            }
//         }
//         return creators;
//     }, 
//     false);


// 3. Remove trailing fullstops, commas and dashs from last names
//

// batchProcessCreators(-1, // all creator types
//     function (creators) { return creators.length > 0; }, 
//     function (creators, targetCreatorTypeID) {
//        for (let i = 0; i < creators.length; i++) {
//            if ((targetCreatorTypeID == -1 || targetCreatorTypeID == creators[i]['creatorTypeID'])) {
//                if (creators[i]['lastName'].toLowerCase().endsWith("jr.") 
//                      || creators[i]['lastName'].toLowerCase().endsWith("sr.")) {
//                    continue;
//                }
//                if (creators[i]['lastName'].match(/[a-zA-Z]{2,}[\.,-]$/) != null) {
//                    creators[i]['lastName'] = creators[i]['lastName'].replace(/([a-zA-Z]{2,})[\.,-]$/, "$1");
//                }
//            }
//         }
//         return creators;
//     }, 
//     false);


// 4. Remove eds., ed., (ed), (eds), (ed.), (eds.) from editor last name
//

// batchProcessCreators(-1, // editors only
//     function (creators) { return creators.length > 0; }, 
//     function (creators, targetCreatorTypeID) {
//        for (let i = 0; i < creators.length; i++) {
//            if ((targetCreatorTypeID == -1 || targetCreatorTypeID == creators[i]['creatorTypeID'])) {
//                if (creators[i]['lastName'].toLowerCase().match(/ \(?[Ee]ds?\.?\)?$/)) {
//                     creators[i]['lastName'] = creators[i]['lastName'].replace(/ +\(?[Ee]ds?\.?\)?$/, "");
//                }
//            }
//         }
//         return creators;
//     }, 
//     false);


// 5. Remove duplicate creators
//

// batchProcessCreators(-1,  // all creator types
//                      function (creators) { return creators.length > 1; }, 
//                      function (result, creators) {
//                          let indices_to_remove = [];
//                          for (let j = 0; j < creators.length; j++) {
//                             let creator = new Creator(creators[j]);
//                             for (let k = j+1; k < creators.length; k++) {
//                                 let other_creator = new Creator(creators[k]);
//                                 if (creator.isSameAs(other_creator) 
//                                     || creator.isTrimmedSameAs(other_creator)
//                                     || creator.isSameNoInitial(other_creator)) {
//                                     indices_to_remove.push(k);
//                                     break;
//                                 }
//                             }
//                         }
//                         result['removingIndices'] = indices_to_remove;
//                         for (let c = indices_to_remove.length-1; c > -1; c--) {
//                             creators.splice(indices_to_remove[c], 1);
//                         }
//                         return creators;
//                      }, 
//                      false);


// 6. Convert "Firstname Lastname" format to "Lastname, Firstname" format
//

// batchProcessCreators(-1,  // all creator types
//                      function (creators) { return creators.length > 1; }, 
//                      function (result, creators) {
//                         for (let j = 0; j < creators.length; j++) {
//                             let creator = creators[j];
//                             if (creator['fieldMode'] == 1) {
//                                 creator['firstName'] = creator['lastName'];
//                                 creator['firstName'] = creator['firstName'].replace(/ [a-zA-Z]+$/, "");
//                                 creator['lastName'] = creator['lastName'].replace(/.* ([a-zA-Z]+)( Jr\.)?$/, "$1$2");
//                                 creator['fieldMode'] = 0;
//                             }
//                         }
//                         return creators;
//                      }, 
//                      false);

