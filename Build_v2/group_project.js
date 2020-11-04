// group_project.js

// Group Project Part 3 
// Mobile Applications CSCI2356
// Theresa Clarke A00429814
// James Heading A00438459
// Shannon Power A00271744

// Server URL for Port 3017
var SERVER_URL = "http://140.184.230.209:3017";

// Client-side server setup
// Database insert callback
function insertCallback(data) {
    console.log('Data saved to database: ' + data);
}
// Database error callback
function errorCallback(err) {
    console.log(err.responseText);
}

// Administrator Links
function adminLinkToCompose() {
    savePage(separateFileName(window.location.href)); // save previous page
    window.location.href = "admin_compose.html";
}

function adminLinkToSentItems() {
    savePage(separateFileName(window.location.href)); // save previous page
    window.location.href = "admin_sent.html";
}

function adminLinkToInbox() {
    savePage(separateFileName(window.location.href)); // save previous page
    window.location.href = "admin_inbox.html";
}

function adminLinkToViewSent(i) {
	// saves email index to local storage
    try {
        savePage(separateFileName(window.location.href)); // save previous page
		localStorage.setItem("adminViewEmailIndex", JSON.stringify(i)); 
        window.location.href = "admin_view_sent.html";
	} 
	catch (localStorageError) {
		console.log("Error Name:" + localStorageError.name + "\n"
		          + "Error Message: " + localStorageError.msg);
	}	
}

function adminLinkToViewInbox(i) {
	// saves email index to local storage
    try {
        savePage(separateFileName(window.location.href)); // save previous page
		localStorage.setItem("adminViewEmailIndex", JSON.stringify(i)); 
        window.location.href = "admin_view_inbox.html";
	}
	catch (localStorageError) {
		console.log("Error Name:" + localStorageError.name + "\n"
		          + "Error Message: " + localStorageError.msg);
	}
}

//Student Links
function stLinkToCompose() {
    savePage(separateFileName(window.location.href)); // save previous page
    window.location.href = "student_compose.html";
}

function stLinkToSentItems() {
    savePage(separateFileName(window.location.href)); // save previous page
    window.location.href = "student_sent.html";
}

function stLinkToInbox() {
    savePage(separateFileName(window.location.href)); // save previous page
    window.location.href = "student_inbox.html";
}

function stLinkToViewSent(i) {
	// saves email index to local storage
    try {
        savePage(separateFileName(window.location.href)); // save previous page
		localStorage.setItem("studentViewEmailIndex", JSON.stringify(i)); 
	    window.location.href = "student_view_sent.html";
	}
    catch (localStorageError) {
		console.log("Error Name:" + localStorageError.name + "\n"
		          + "Error Message: " + localStorageError.msg);
	}
}

function stLinkToViewInbox(i) {
	// saves email index to local storage
    try {
        savePage(separateFileName(window.location.href)); // save previous page
		localStorage.setItem("studentViewEmailIndex", JSON.stringify(i)); 
        window.location.href = "student_view_inbox.html";
	}
	catch (localStorageError) {
		console.log("Error Name:" + localStorageError.name + "\n"
		          + "Error Message: " + localStorageError.msg);
	}
}

// Saves page to db before moving to next page
function savePage(page) {
    try {
        localStorage.setItem("last-page", JSON.stringify(page));
    }
    catch (localStorageError) {
        console.log("Error Name: " + localStorageError.name + "\n"
        + "Error Message: " + localStorageError.msg);
    }
}

// Gets last page from db and returns to url
function goBack() {
    try {
        var lastPage = JSON.parse(localStorage.getItem('last-page'));
        window.location.href = lastPage;
    }
    catch (localStorageError) {
        console.log("Error Name: " + localStorageError.name + "\n"
        + "Error Message: " + localStorageError.msg);
    }
}

// Arrays that store the emails sent and received by the student and the admin
var studentSentEmailsArray = [];
var studentReceivedEmailsArray = [];
var adminSentEmailsArray = [];
var adminReceivedEmailsArray = [];

// Send student's written emails to student's sent items storage and admin's inbox storage 
function sendStudent() {
    var studentEmail = {
        to: $("#to").val(), cc: $("#cc").val(), bcc: $("#bcc").val(), subject: $("#sb").val(), emailtext: $("#emailtext").val()
        };
    var adminEmail = {
        from: "student@autismns.ca", cc: $("#cc").val(), subject: $("#sb").val(), emailtext: $("#emailtext").val(), wasSeen: false, checked: false
        }; // from field hardcoded with email address string
	
    // Send emails to db to create or add to array objects
    try {
        // enter student email array into db
        var studentData = { key: "studentSentEmails", value: studentEmail };
        $.post(SERVER_URL + '/doSetArray', studentData, insertCallback).fail(errorCallback);
        console.log(studentData.key + " added to db!");

        // enter admin email inbox array into db
        var adminData = { key: "adminInboxEmails", value: adminEmail };
        $.post(SERVER_URL + '/doSetArray', adminData, insertCallback).fail(errorCallback);
        console.log(adminData.key + " added to db!");
    }
	catch (localStorageError) {
	    console.log("Error Name:" + localStorageError.name + "\n"
            + "Error Message: " + localStorageError.msg);
	}    
} 

// Send admin's written emails to admin's sent items storage and student's inbox storage 
function sendAdmin() {
    var adminEmail = {
        to: $("#to").val(), from: $("#from").val(), cc: $("#cc").val(), subject: $("#sb").val(), emailtext: $("#emailtext").val()
        };
    var studentEmail = {
        from: $("#from").val(), cc: $("#cc").val(), subject: $("#sb").val(), emailtext: $("#emailtext").val(), wasSeen: false, checked: false
        };
	
	// Send emails to db to create or add to array objects
	try {
        // Enter admin email array to db
        var adminData = { key: "adminSentEmails", value: adminEmail };
        $.post(SERVER_URL + '/doSetArray', adminData, insertCallback).fail(errorCallback);
        console.log(adminData.key + " added to db!");

	    // Enter student received emails into db
        var studentData = { key: "studentInboxEmails", value: studentEmail };
        $.post(SERVER_URL + '/doSetArray', studentData, insertCallback).fail(errorCallback);
        console.log(studentData.key + " added to db!");
	}
	catch (localStorageError) {
		console.log("Error Name:" + localStorageError.name + "\n"
		          + "Error Message: " + localStorageError.msg);
	}
}

// Display the student's emails in their inbox
function displayStudentInboxEmails() {
    var data = { key: "studentInboxEmails"};
    console.log("studentInboxEmails: " + data.key);
    // Get email array from database and display emails
    $.post(SERVER_URL + '/doGet', data, function (dataArr) {
        console.log("displayStudentInboxEmails got data", dataArr);
        for (var i = 0; i < dataArr.length; i++) {
            // Get email in position i
            var currentEmail = dataArr[i];

			// Create string with html tags surrounding the to and subject fields
			// String edited to reflect new CSS stylings - BW
            if (currentEmail.wasSeen == 'false') {
                console.log("new email");
                var appendText = "<div class = 'email-container unread'><div class='email email-list unread'><a class='from' " +
                    "onclick = 'stLinkToViewInbox(" + i + ")'>"
                    + currentEmail.from + "</a><a class='subject' " +
                    "onclick = 'stLinkToViewInbox(" + i + ")'>"
					+ currentEmail.subject + "</a></div><div class = 'star'><input type='checkbox' class='star-with-label' id='checkbox"
					+ i + "s' onchange='checkboxSaveFtn(" + i + ", \"s\")'" +
					(currentEmail.checked == "true" ? " checked >" : ">") +
					"<label class='star-label' for='checkbox" + i + "s'><i class='fas fa-star'></i></label></div>" +
					"<a class='delete' onclick = 'deleteConfirm(deleteStudentInboxEmail," 
					+ i + ")'><i class='far fa-trash-alt'></i></a></div>";
            }
            else {
                console.log("viewed email");
                var appendText = "<div class = 'email-container'><div class='email email-list read'><a class='from' " +
                    "onclick = 'stLinkToViewInbox(" + i + ")'>"
                    + currentEmail.from + "</a><a class='subject' " +
                    "onclick = 'stLinkToViewInbox(" + i + ")'>"
					+ currentEmail.subject + "</a></div><div class = 'star'><input type='checkbox' class='star-with-label' id='checkbox"
					+ i + "s' onchange='checkboxSaveFtn(" + i + ", \"s\")'" +
					(currentEmail.checked == "true" ? " checked >" : ">") +
					"<label class='star-label' for='checkbox" + i + "s'><i class='fas fa-star'></i></label></div>" +
					"<a class='delete' onclick = 'deleteConfirm(deleteStudentInboxEmail," 
					+ i + ")'><i class='far fa-trash-alt'></i></a></div>";

            }
            // Prepend into html
            $(".studentInboxEmails").prepend(appendText);
        }
    }).fail(errorCallback);
}

// Display the admin's emails in their inbox
function displayAdminInboxEmails() {
    var data = { key: "adminInboxEmails"};
    // Get email array from database and display emails
    $.post(SERVER_URL + '/doGet', data, function (dataArr) {
        console.log("displaying emails: ", dataArr);
        for (var i = 0; i < dataArr.length; i++) {
            // Get email in position i
           
            var currentEmail = dataArr[i];
	    
			// Create string with html tags surrounding the to and subject fields
			//Modified to fit new stylings by BW
            if (currentEmail.wasSeen == 'false') {
                console.log("new email");
                var appendText = "<div class='email'><a data-role='button' class='btn mybtnpoint' " +
                    "onclick = 'adminLinkToViewInbox(" + i + ")'><span class='unread'>"
                    + currentEmail.from + "</span></a><a data-role='button' class='btn mybtnpoint' " +
                    "onclick = 'adminLinkToViewInbox(" + i + ")'><span class='unread'>"
                    + currentEmail.subject + "</span></a></span><input type='checkbox' id='checkbox" 
					+ i + "a' onchange='checkboxSaveFtn(" + i + ", \"a\")'" + 
					(currentEmail.checked == "true" ? " checked >" : ">")
					+ "<a data-role='button' class='xbtn' onclick = 'deleteConfirm(deleteAdminInboxEmail," 
					+ i + ")'><span>X</span></a>";

            } else {
                console.log("viewed email");
                var appendText = "<span class='email'><a data-role='button' class='btn mybtnpoint from' " +
                    "onclick = 'adminLinkToViewInbox(" + i + ")'>"
                    + currentEmail.from + "</a><a data-role='button' class='btn mybtnpoint subject' " +
                    "onclick = 'adminLinkToViewInbox(" + i + ")'>"
                    + currentEmail.subject + "</a></div><input type='checkbox' id='checkbox" 
					+ i + "a' onchange='checkboxSaveFtn(" + i + ", \"a\")'" + 
					(currentEmail.checked == "true" ? " checked >" : ">")
					+ "<a data-role='button' class='xbtn' onclick = 'deleteConfirm(deleteAdminInboxEmail," 
					+ i + ")'><span>X</span></a>";
            }
            // Prepend into html
            $(".adminInboxEmails").prepend(appendText);
        }
    }).fail(errorCallback);
}

// Display the student's emails in their sent items
function displayStudentSentEmails() {
    var data = { key: "studentSentEmails"};
    // Get email array from database and display emails
    $.post(SERVER_URL + '/doGet', data, function (dataArr) {
        for (var i = 0; i < dataArr.length; i++) {
            // Get email in position i
            var currentEmail = dataArr[i];

            // Create string with html tags surrounding the to and subject fields
            var appendText = "<span class='email'><a data-role='button' class='btn mybtnpoint' " +
                "onclick = 'stLinkToViewSent(" + i + ")'><span>"
                + currentEmail.to + "</span></a><a data-role='button' class='btn mybtnpoint' " +
                "onclick = 'stLinkToViewSent(" + i + ")'><span>"
                + currentEmail.subject + "</span></a></span> <a data-role='button' class='xbtn' " +
                "onclick = 'deleteConfirm(deleteStudentSentEmail," + i + ")'><span>X</span></a>";

            // Prepend into html
            $(".studentSentEmails").prepend(appendText);
        }
    }).fail(errorCallback);
}

// Display the admin's emails in their sent items using database call
function displayAdminSentEmails() {
	if(document.getElementById("searchItem").value === "") {
		var data = { key: "adminSentEmails"};
		console.log("adminSentEmails: " + data.key);
		// Get email array from database and display emails
		$.post(SERVER_URL + '/doGet', data, function (dataArr) {
			for (var i = 0; i < dataArr.length; i++) {
				// Get email in position i
				var currentEmail = dataArr[i];

				// Create string with html tags surrounding the to and subject fields
				var appendText = "<span class='email'><a data-role='button' class='btn mybtnpoint' " +
					"onclick = 'adminLinkToViewSent(" + i + ")'><span>"
					+ currentEmail.to + "</span></a><a data-role='button' class='btn mybtnpoint' " +
					"onclick = 'adminLinkToViewSent(" + i + ")'><span>"
					+ currentEmail.subject + "</span></a></span><a data-role='button' class='xbtn' " +
					"onclick = 'deleteConfirm(deleteAdminSentEmail," + i + ")'><span>X</span></a>";

				// Prepend into html
				$(".adminSentEmails").prepend(appendText);
			}
		}).fail(errorCallback);
	}
}

// Displays the selected sent email
function viewSentItem(user) {  
	var i;
	var currentEmail;
	// If the user is 0, then it is the student, otherwise it is the admin
	switch (user)
	{
		case 0:
			// Get the email array index from local storage
			try {
			    i = localStorage.getItem("studentViewEmailIndex");
			    // call db to find email
			    var data = { key: "studentSentEmails" };
			    $.post(SERVER_URL + '/doGet', data, function (dataArr) {
			        // Get email in position i
			        var currentEmail = dataArr[i];
			        // Display the email content in the appropriate text boxes
			        $("#studentSentTo").val(currentEmail.to);
			        $("#studentSentCc").val(currentEmail.cc);
					$("#studentSentBcc").val(currentEmail.bcc);
			        $("#studentSentSubject").val(currentEmail.subject);
			        $("#studentSentBody").val(currentEmail.emailtext);
			    }).fail(errorCallback);
			}
			catch (localStorageError) {
				console.log("Error Name:" + localStorageError.name + "\n"
						  + "Error Message: " + localStorageError.msg);
			}

			break;

		default:
			// Get the email array index from local storage
		    try {
		        i = localStorage.getItem("adminViewEmailIndex");
                // call db to find email
		        var data = { key: "adminSentEmails" };
		        $.post(SERVER_URL + '/doGet', data, function (dataArr) {
		            // Get email in position i
		            var currentEmail = dataArr[i];
		            // Display the email content in the appropriate text boxes
		            $("#adminSentTo").val(currentEmail.to);
		            $("#adminSentCc").val(currentEmail.cc);
		            $("#adminSentSubject").val(currentEmail.subject);
		            $("#adminSentBody").val(currentEmail.emailtext);
		        }).fail(errorCallback);
		    }
			catch (localStorageError) {
				console.log("Error Name:" + localStorageError.name + "\n"
						  + "Error Message: " + localStorageError.msg);
			}
			break;
	}
}

// Displays the selected received email
function viewReceivedItem(user) {
	var i;
	var currentEmail;
	// If the user is 0, then it is the student, otherwise it is the admin
	switch (user)
	{
        case 0:
            console.log("view student inbox email");
			// Get the email array index from local storage
            try {
                i = localStorage.getItem("studentViewEmailIndex");
                // call db to find email
                var data = { key: "studentInboxEmails" };
                $.post(SERVER_URL + '/doGet', data, function (dataArr) {
                    // Get email in position i
                    var currentEmail = dataArr[i];
                    // Display the email content in the appropriate text boxes
                    $("#studentReceivedTo").val(currentEmail.from);
                    $("#studentReceivedCc").val(currentEmail.cc);
                    $("#studentReceivedSubject").val(currentEmail.subject);
                    $("#studentReceivedBody").val(currentEmail.emailtext);
                    currentEmail.wasSeen = true;
                    var propertyData = {
                        property: String("studentInboxEmails." + i + ".wasSeen"), 
                        value: true
                    };
                    $.post(SERVER_URL + '/doSetProperty', propertyData); // update was seen 
                }).fail(errorCallback);
            }
			catch (localStorageError) {
				console.log("Error Name:" + localStorageError.name + "\n"
						  + "Error Message: " + localStorageError.msg);
			}
			break;

		default:
			// Get the email array index from local storage
            try {
                i = localStorage.getItem("adminViewEmailIndex");
                // call db to find email
                var data = { key: "adminInboxEmails" };
                $.post(SERVER_URL + '/doGet', data, function (dataArr) {
                    // Get email in position i
                    var currentEmail = dataArr[i];
                    // Display the email content in the appropriate text boxes
                    $("#adminReceivedTo").val(currentEmail.from);
                    $("#adminReceivedCc").val(currentEmail.cc);
                    $("#adminReceivedSubject").val(currentEmail.subject);
                    $("#adminReceivedBody").val(currentEmail.emailtext);
                    currentEmail.wasSeen = true;
                    var propertyData = {
                        property: String("adminInboxEmails." + i + ".wasSeen"),
                        value: true
                    };
                    $.post(SERVER_URL + '/doSetProperty', propertyData); // update was seen 
                }).fail(errorCallback);
            }
			catch (localStorageError) {
				console.log("Error Name:" + localStorageError.name + "\n"
						  + "Error Message: " + localStorageError.msg);
			}
			break;
	}
}

/* 
   Upon loading the compose screen, stops the user from composing email if
   recipient's inbox is full or sender's sent items is full
*/
function checkComposeFull(i) {
	var maxEmails = 10;
	var data;
	// if i = 0, admin
	if (i == 0) {
		// check admin sent items
		data = { key: "adminSentEmails" };
		console.log("adminSentEmails: " + data.key);
		$.post(SERVER_URL + '/doGet', data, function (dataArr) {
			console.log("Arr length: " + dataArr.length);
			if (dataArr.length >= maxEmails)
			{
				alert("Your sent items is full.");
				goBack();
			}
		}).fail(errorCallback);
		
		// check student inbox
		data = { key: "studentInboxEmails" };
		console.log("studentInboxEmails: " + data.key);
		$.post(SERVER_URL + '/doGet', data, function (dataArr) {
			console.log("Arr length: " + dataArr.length);
			if (dataArr.length >= maxEmails)
			{
				alert("Recipient’s inbox is full.");
				goBack();
			}
		}).fail(errorCallback);
	}
	// else, student
	else {
		// check student sent items
		data = { key: "studentSentEmails" };
		console.log("studentSentEmails: " + data.key);
		$.post(SERVER_URL + '/doGet', data, function (dataArr) {
			console.log("Arr length: " + dataArr.length);
			if (dataArr.length == maxEmails)
			{
				alert("Your sent items is full.");
				goBack();
			}
		}).fail(errorCallback);
		
		// check admin inbox
		data = { key: "adminInboxEmails" };
		console.log("adminInboxEmails: " + data.key);
		$.post(SERVER_URL + '/doGet', data, function (dataArr) {
			console.log("Arr length: " + dataArr.length);
			if (dataArr.length == maxEmails)
			{
				alert("Recipient’s inbox is full.");
				goBack();
			}
		}).fail(errorCallback);
	}
}

// Handles saving the states of the checkboxes to the database
function checkboxSaveFtn(i, user) {
	var data;
	var checkboxId = "#checkbox" + i + user;
	var currentEmail;
	console.log("checkboxFtn");
	// check if student or admin
	if (user == 'a') {
		console.log($(checkboxId).is(':checked'));
		if ($(checkboxId).is(':checked')) {
			console.log("CHECKBOX " + checkboxId + " CHECKED");
			// Get array
			data = { key: "adminInboxEmails" };
			$.post(SERVER_URL + '/doGet', data, function (dataArr) {
				currentEmail = dataArr[i];
				currentEmail.checked = true;
				var propertyData = {
                    property: String("adminInboxEmails." + i + ".checked"), 
                    value: true
                };
                $.post(SERVER_URL + '/doSetProperty', propertyData); // update was seen 
            }).fail(errorCallback);
		} else {
			console.log("CHECKBOX " + checkboxId + " UNCHECKED");
			// Get array
			data = { key: "adminInboxEmails" };
			$.post(SERVER_URL + '/doGet', data, function (dataArr) {
				currentEmail = dataArr[i];
				currentEmail.checked = false;
				var propertyData = {
                        property: String("adminInboxEmails." + i + ".checked"), 
                        value: false
                    };
                    $.post(SERVER_URL + '/doSetProperty', propertyData); // update was seen 
            }).fail(errorCallback);
		}
	} else { // student
		console.log($(checkboxId).is(':checked'));
		if ($(checkboxId).is(':checked')) {
			console.log("CHECKBOX " + checkboxId + " CHECKED");
			// Get array
			data = { key: "studentInboxEmails" };
			$.post(SERVER_URL + '/doGet', data, function (dataArr) {
				currentEmail = dataArr[i];
				currentEmail.checked = true;
				var propertyData = {
                    property: String("studentInboxEmails." + i + ".checked"), 
                    value: true
                };
                $.post(SERVER_URL + '/doSetProperty', propertyData); // update was seen 
            }).fail(errorCallback);
		} else {
			console.log("CHECKBOX " + checkboxId + " UNCHECKED");
			// Get array
			data = { key: "studentInboxEmails" };
			$.post(SERVER_URL + '/doGet', data, function (dataArr) {
				currentEmail = dataArr[i];
				currentEmail.checked = false;
				var propertyData = {
                        property: String("studentInboxEmails." + i + ".checked"), 
                        value: false
                    };
                    $.post(SERVER_URL + '/doSetProperty', propertyData); // update was seen 
            }).fail(errorCallback);
		}
	}
}

// Deletes email at index i from the student's inbox and reloads the page
function deleteStudentInboxEmail(i) {
    var dbkey = { key: "studentInboxEmails", index: i };
    $.post(SERVER_URL + '/doDeleteArrayItem', dbkey, function (data) {
        location.reload();
    }).fail(errorCallback);
}

// Deletes email at index i from the admin's inbox and reloads the page
function deleteAdminInboxEmail(i) {
    var dbkey = { key: "adminInboxEmails", index: i };
    $.post(SERVER_URL + '/doDeleteArrayItem', dbkey, function (data) {
        location.reload();
    }).fail(errorCallback);
}

// Deletes email at index i from the student's sent items and reloads the page
function deleteStudentSentEmail(i) {
    var dbkey = { key: "studentSentEmails", index: i };
    $.post(SERVER_URL + '/doDeleteArrayItem', dbkey, function(data) {
        location.reload();
    }).fail(errorCallback);
}

// Deletes email at index i from the admin's sent items and reloads the page
function deleteAdminSentEmail(i) {
    var dbkey = { key: "adminSentEmails", index: i };
    $.post(SERVER_URL + '/doDeleteArrayItem', dbkey, function (data) {
        location.reload();
    }).fail(errorCallback);
}

/*
   This is the base method for implementation of the other methods below.
   It takes an anchor tag argument in this case, but it could potentially take any element tag
 */
function composeConfirmBack(aTagElement) {

	// Grabs the name of the button being clicked
	var buttonName = aTagElement.innerHTML;
	
	// Checks if the from field is null then returns its length if not
	var fromFieldEmpty = checkNullLength("from");
	
	// When the cancel button is selected, prompt a confirmation box
	if (buttonName == "Cancel") {
		// If they are sure of their selection go back to previous page
		confirmChoice(goBack,"Are you sure you want to cancel?"); //**JH this is where goBack() is implemented */

	// When the send button is selected, check if the from field is empty,
	// if not, then get a confirmation box for sending the email
	} else if (buttonName == "Send")
	{
		/* TC - Added an if statement around this to check who's sending. If it's the admin, it just sends.
		If it's the student, it pops up the overlay, and then the functions that the overlay uses take it from there. */
		var currentFileName = separateFileName(window.location.href); 
		if (currentFileName == "admin_compose.html") {
			if (confirm("Are you sure you want to send?")) {
				fileNameSend(currentFileName);
				goBack();
			}
		} else {
			if (fromFieldEmpty == 0)
			{
				alert('"From" field is blank');
			} else {
				$('#overlay').fadeIn(200);
			}
		}
	}
}

// Help Windows - opens small help windows on-click for Composing, View Inbox Item, View Sent Item
function openHelpWindow(element) {
    var spanVal = element.innerHTML;
    // converts spanVal to string and lowercase, so formatting does not affect the comparison
    var spanCompare = String(spanVal).toLowerCase();
    // if the element in string form matches the keywords, then open a window with that specific link.
    switch (spanCompare) {
        case "to":
            window.open("help_window_to.html", "", "height=200px, width=480px");
            break;

        case "cc":
            window.open("help_window_cc.html", "", "height=200px, width=480px");
            break;

        case "subject":
            window.open("help_window_subject.html", "", "height=200px, width=480px");
            break;

        case "body":
            window.open("help_window_body.html", "", "height=200px, width=480px");
            break;
        default:
            return false;
    }
}

// Help button function
function helpButton() {
    // Gets the file name at end of URL
    var currentPage = separateFileName(window.location.href);

    // These statements check which page the user is on, then gives the associated alert message.alert-dark
    if (currentPage == "student_compose.html" || currentPage == "admin_compose.html") {
        alert("The purpose of the page is creating emails that you want to send to someone.");
    }
    else if (currentPage == "student_inbox.html" || currentPage == "admin_inbox.html") {
        alert("The purpose of the page is to list emails people have sent you.");
    }
    else if (currentPage == "student_sent.html" || currentPage == "admin_sent.html") {
        alert("The purpose of the page is to list emails that you have sent to people");
    }
    else if (currentPage == "student_view_inbox.html" || currentPage == "admin_view_inbox.html") {
        alert("The purpose of the page is seeing the content of an email someone has sent you.");
    }
    else if (currentPage == "student_view_sent.html" || currentPage == "admin_view_sent.html") {
        alert("The purpose of the page is seeing the content of an email you have sent.");
    }
	else if (currentPage == "student_settings.html") {
        alert("The purpose of the page is to change the system settings.");
    }
}

/*
   This method takes input in the form of a html file name
   Once matched, it then sends the corresponding email
*/
function fileNameSend(htmlName) { //NOTE: Since this method uses the "this" keyword, it needs the corresponding methods to be in same file
	switch(htmlName) {
		case "admin_compose.html":
			this.sendAdmin();
			break;
		case "student_compose.html":
			this.sendStudent()
			break;
		default:
			return false;
	}
}

/*
   This method takes an ID tag name input and checks
   if it's null. If it's not null, then return it's length.
   Otherwise, it returns true that the id name is null.
*/
function checkNullLength(idName) {
	
	if(document.getElementById(idName) != null) {
		return document.getElementById(idName).value.length;
	} else {
		return true;
	}
}

/*
   This takes an URL as input. Uses a REGEX to find the end of the url.(file Name)
   Then returns that file name.
*/
function separateFileName(url) {
	var regPattern = /\w*\.html$/gm;
	
	return String(url.match(regPattern));
	
}

/*
   These methods take a function and some text based input for the message
   of a confirmation box.
   deleteConfirm(Function name only, Argument in the function)
   confirmChoice(Function name only, Confirm message text)
*/

//The message is hard coded to save complexity when used starting on line 204, then the other associated methods
function deleteConfirm(func, count) {
	if(confirm("Are you sure you want to delete this?")) { // When confirm is true then implement the given function
		func(count);
	} else {
		return false;
	}
}
// Only for function with no parameters
function confirmChoice(func, msg) {
	if(confirm(msg)) {
		func();
	} else {
		return false;
	}
}

/* Handles the overlay prompt for the compose screen
   Theresa C */
function sendConfirmation(aTagElement) {
	var buttonName = aTagElement.innerHTML;

	if(buttonName == "Back") {
		$('#overlay').fadeOut(200);
	} else {
		/* 
		The checkbox state persists even if you hit back because they don't
		actually leave when you hit back, the overlay just fades out. I don't think
		it matters at all, it just confused me the first time I saw it so I figured
		I'd mention it. 
		*/
		
		var checked;

		checked = cBoxCheck($("#sendConfirmCheckbox1").prop('checked'), $("#sendConfirmCheckbox2").prop('checked'),
			            $("#sendConfirmCheckbox3").prop('checked'), $("#sendConfirmCheckbox4").prop('checked'));
		console.log("Checked Var:" + checked);				
		//Send the email if the checkboxes are checked
		if (checked == true) {

			var currentFileName = separateFileName(window.location.href);
			fileNameSend(currentFileName);
			console.log("Checkbox1:" + $("#sendConfirmCheckbox1").prop('checked'));
                        location.reload();
			goBack();
		}
		else {
			alert("Email not sent, need to check all the checkboxes");
						
        }
	}
}

/*
 * Checks if the input checkboxes are...checked.
 * 
 * Arguements: must be in the form of $("#checkboxid").prop('checked'),
 *             can have any number of arguments in this form.
 * 
 * returns true if all the given checkboxes are checked
 *
 * James H
*/
function cBoxCheck() {
	
	for (let argCount = 0; argCount < arguments.length; argCount++) {

		if (arguments[argCount] == false) {
			return false;
		}
	}

	return true;
}

/* Changes the content of the help popups on the student side, according 
   to input given on admin's Settings page.
   Theresa C */
function changeStudentHelpPopups() {
	var popupInfo = {
        to: $("#toPopup").val(), cc: $("#ccPopup").val(), bcc: $("#bccPopup").val(), subject: $("#subjectPopup").val(), body: $("#bodyPopup").val()
        };
    
	var popupData = { key: "popupData", value: popupInfo };
	$.post(SERVER_URL + '/doSet', popupData, insertCallback).fail(errorCallback);

}

/* Collects help popup text from database and inserts into help popups
   on load of the student's Compose page */
function displayStudentHelpPopups() {
	var popupData = { key: "popupData" };
	    $.post(SERVER_URL + '/doGet', popupData, function (data) {
        document.getElementById("popupto").innerText = data.to;
        document.getElementById("popupcc").innerText = data.cc;
	document.getElementById("popupbcc").innerText = data.bcc;
        document.getElementById("popupsubject").innerText = data.subject;
        document.getElementById("popupbody").innerText = data.body;
    }).fail(errorCallback);
	
}

/* Resets the student help popups to the default messages.
   Theresa C */
function resetStudentHelpPopups() {
	var popupInfo = {
        to: "Who do you need to send an email to?\nHow many people do you need to send this email to?", 
	cc: "Is there anyone you need to copy on this email?\nThe person you're sending the email to will be able to see people you copy here.", 
	bcc: "Is there anyone you need to copy on this email?\nThe person you're sending the email to will not be able to see people you copy here.", 
	subject: "What is this email about?\nWhy are you sending this email?\nRemember to keep this short and concise.", 
	body: "How should you greet the person you are emailing?\nDo you need to ask any questions?\nDoes the person you are emailing need to know any information about you?"
        };
    
	var popupData = { key: "popupData", value: popupInfo };
	$.post(SERVER_URL + '/doSet', popupData, insertCallback).fail(errorCallback);
}


/*
 * Searches the database for the input value in the search field
 * 
 * James H
 * 
 * TODO connect the searchItem variable to the text input into the search bar
 */
function searchRequest() {
	var currentPageName = separateFileName(window.location.href);
	var searchResult;
	var data;

		switch (currentPageName) {
			case "student_inbox.html":
				data = { key: "studentInboxEmails" };

				$.post(SERVER_URL + '/doSetArray', data, function (searchRet) {
					searchResult = searchRet;
				}
				).fail(errorCallback);

				break;

			case "student_sent.html":
				data = { key: "studentSentEmails" };

				$.post(SERVER_URL + '/doSetArray', data, function (searchRet) {
					searchResult = searchRet;
				}
				).fail(errorCallback);

				break;

			case "admin_inbox.html":
				data = { key: "adminInboxEmails" };

				$.post(SERVER_URL + '/doFind', searchItem, function (searchRet) {
					searchResult = searchRet;
				}
				).fail(errorCallback);

				break;

			case "admin_sent.html":
				data = { key: "adminSentEmails", searchItem: document.getElementById("searchItem").value };

				$.post(SERVER_URL + '/doFind', data, function (dataArr) {
					if(dataArr.length != 0) {
					$(".adminSentEmails").empty();
						for (var i = 0; i < dataArr.length; i++)
						{
							// Get email in position i
							var currentEmail = dataArr[i];

							// Create string with html tags surrounding the to and subject fields
							var appendText = "<span class='email'><a data-role='button' class='btn mybtnpoint' " +
								"onclick = 'adminLinkToViewSent(" + i + ")'><span>"
								+ currentEmail.to + "</span></a><a data-role='button' class='btn mybtnpoint' " +
								"onclick = 'adminLinkToViewSent(" + i + ")'><span>"
								+ currentEmail.subject + "</span></a></span><a data-role='button' class='xbtn' " +
								"onclick = 'deleteConfirm(deleteAdminSentEmail," + i + ")'><span>X</span></a>";
				
							// Prepend into html
							$(".adminSentEmails").prepend(appendText);
						}
					}
				}).fail(errorCallback);
				break;
    }
}