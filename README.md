# zotero-js-helper-functions
Javascript helper functions to analyse and batch edit your Zotero library.

# License

These helper functions are released under the same license as Zotero, and come with absolutely no warranty.

# Usage

1. Open the Zotero client
2. Backup your Zotero library
3. Turn off automatic syncing (Edit > Preferences > Sync > Sync Automatically)
4. Select the items you want the script to operate on.
5. Open the Zotero > Developer > Run Javascript window
6. Copy the JS code from the desired function into the window
7. Edit as required
8. Run the code with `makeEdits` false to preview results
9. If preview looks okay, run the code with `madeEdits` true

**Note 1**: The last parameter on functions that may make changes is called `makeEdits`; when this is false, the changes that will be made are shown in the right hand panel when the code is run, but the changes will not actually be made. The changes will only be made when the `makeEdits` flag is set to true.

It is recommended to test the function on a few items, before using it to process lots of items.

**Note 2**: If you run these functions on thousands of items, it will likely take some time to complete, and there is no progress bar--you just need to let it finish, do not interrupt it.
