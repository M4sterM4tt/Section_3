//global variables

var filetext  = "";
var fileBinding;
var fileEntry;
var filename = "text.txt";

console.log("setting up events");


// Setup event listeners
$(document).on("pagecreate","#pageone", onPageCreated);


// Setup listener for device API load
document.addEventListener("deviceready", onDeviceReady, false);


// Once jQuery page 'pageone' has been created 
function onPageCreated() {
    
     console.log("page created");
    
    
	// Setup buttons
	$('#writeFile').on("click", writeFile);
	$('#deleteFile').on("click", deleteFile);
	
    
	// Setup RactiveJS binding

	// Binding between variable 'filetext' and the template 
	fileBinding = new Ractive({
		el: 'container',
		template: '#template',
		data: { filename: filename, filetext: filetext}
	});

 
	// Detects changes in the text box and updates the 'filetext' value with the new value
    fileBinding.observe( 'filename', function ( newValue, oldValue ) {
  		filename = newValue; 
	});
    
	fileBinding.observe( 'filetext', function ( newValue, oldValue ) {
  		filetext = newValue; 
	});
    
}


function onDeviceReady() {
	console.log("device ready");
	// Setup access to filesystem
	// Window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    window.resolveLocalFileSystemURL(cordova.file.externalDataDirectory, gotFS, fail);
}




// Get access to file and CREATE if does not exists
function gotFS(fileSystem) { 
 	fileSystem.getFile(filename + ".txt", {create: true, exclusive: false}, gotFileEntry, fail);
}

// Get file entry
function gotFileEntry(fileEntry) {
	console.log("got file entry");
	this.fileEntry = fileEntry
	fileEntry.file(gotFile, fail);
}

// Get file itself
function gotFile(file){
    console.log("got file");
	readAsText(file);
}





// READ text from file - assumes that the file contains 
function readAsText(file) {
    console.log("readAsText");
	
	var reader = new FileReader();
	
	// Assigns a callback function to be run once the file has been completely read
	reader.onloadend = function(evt) {
	
		// Store the new string in 'filetext'
		filetext = evt.target.result;
		
		// Update the binding 
		fileBinding.set({ filetext: filetext });
    };
	
	// Begin reading the file
   	reader.readAsText(file);
}




// UPDATE file contents - called when submit button is pressed
function writeFile() {
    console.log("writeFile: "  + fileEntry.fullPath);
    
	fileEntry.createWriter(
		function (writer) { 
			writer.write(filetext);
		}, 
		fail
	);
}





// DELETE file
function deleteFile() {
    console.log("deleteFile");
	
	fileEntry.remove(
		function () {
			alert("File deleted");
		}, 
		fail
	);
	
	// Reload file system
  	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
}





function fail(error) {
	alert("Cannot use file: " + error.message);
}


