var urlBase = 'http://cop4331-group1.xyz/LAMPAPI';
var extension = 'php';

// User
var userId = 0;
var firstName = "";
var lastName = "";
var login = "";
var password = "";

// Contact
var contactFName = "";
var contactLName = "";
var contactPhoneNum = "";
var contactEmail = "";

function doLogin()
{
	// Debug: check if values were null or not!
	// var str,
	// element = document.getElementById('userName');
	// if (element != null) {
	// 		console.log("NOT NULL");
	//     str = element.value;
	// }
	// else {
	// 		console.log("NULL!");
	//     str = null;
	// }

	login = document.getElementById("loginUsername").value;
	password = document.getElementById("loginPassword").value;
	//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	//	var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
	var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
	var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				if( userId < 1 )
				{
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "contact.html";

			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// Purpose: function to register a new user
function doRegister()
{
	// Note: obtain the values inputted by the user from the index.html file
	firstName = document.getElementById("regFName").value;
	lastName = document.getElementById("regLName").value;
	login = document.getElementById("regUsername").value;
	password = document.getElementById("regPassword").value;

	// Source: https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
	//				 https://stackoverflow.com/questions/4879066/what-innerhtml-is-doing-in-javascript/54477278
	// Note: innerHTML is a property of every element. It tells you what is between
	//			 the starting and ending tags of the element, and it also let you sets
	//			 the content of the element.
	document.getElementById("registerResult").innerHTML = "";

	var jsonPayload = '{"firstname" : "' + firstName
									+ '", "lastname" : "' + lastName
									+ '", "login" : "' + login
									+ '", "password" : "' + password + '"}';

	var url = urlBase + '/Registration.' + extension;

	// Note: saves us from repetition of code
	var xhr = new XMLHttpRequest();

	// Source: https://www.w3schools.com/xml/ajax_xmlhttprequest_send.asp
	// Note: method open() initializes a newly-created request, or re-initializes an existing one.
	//			 To send a request to a server, we use the open() and send() methods
	//
	// Source: https://www.w3schools.com/xml/ajax_xmlhttprequest_send.asp
	// Format: open(method, url, async)
	//
	// Different types of request methods:
	// GET: simpler and faster than POST
	//
	// POST: sending large amount of data and it is more secure
	//
	// Asynchronous (True vs False):
	// True - By sending asynchronously, the JavaScript does not have to wait for the server response,
	//				but can instead: execute other scripts while waiting for server response and deal with
	//				the response after the response is ready
	// False - Used for quick testing. You will also find synchronous requests in older JavaScript code.
	xhr.open("POST", url, true);

	// Format: setRequestHeader(header, value)
	// Note: Adds HTTP headers to the request
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	console.log("Registering User...");

	try
	{
		// Source: https://www.w3schools.com/js/js_ajax_http_response.asp
		// Note: defines a function to be executed when the readyState changes
		xhr.onreadystatechange = function()
		{
			// readyState:
			// 0 - request not initialized
			// 1 - server connection established
			// 2 - request received
			// 3 - processing request
			// 4 - request finished and response is ready
			//
			// status:
			// 200 - "OK"
			// 403 - "Forbidden"
			// 404 - "Page not found"
			// more info: https://www.w3schools.com/tags/ref_httpmessages.asp
			if (this.readyState == 4 && this.status == 200)
			{
				// Source: https://www.w3schools.com/js/js_json_parse.asp
				// Note: When receiving data from a web server, the data is always a string. Parse the data
				//			 with JSON.parse(), and the data becomes a JavaScript object.
				var jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;

				// Note: Registration.php will return 0 if the user already exists!
				if( userId < 1 )
				{
					document.getElementById("registerResult").innerHTML = "User already exists, please use Sign In instead";
					return;
				}

				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();

				window.location.href = "color.html";
			}
		};

		console.log("Success on trying to register User...");
		xhr.send(jsonPayload);
	}

	catch(err)
	{
		console.log("Error on trying to register User...");
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

function saveCookie()
{
	var minutes = 20;
	var date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName
									+ ",lastName=" + lastName
									+ ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	login = "";
	password = "";
	contactFName = "";
	contactLName = "";
	contactPhoneNum = "";
	contactEmail = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Purpose: adds a new contact to user's database
function doAddContact()
{
	// Note: obtain the values inputted by the user from the contact.html file
	contactFName = document.getElementById("newContactFName").value;
	contactLName = document.getElementById("newContactLName").value;
	contactPhoneNum = document.getElementById("newContactPhoneNum").value;
	contactEmail = document.getElementById("newContactEmail").value;
	document.getElementById("contactAddResult").innerHTML = "";

	// Note: Get current date and time
	var currentdate = new Date();
	var datetime = currentdate.getFullYear() + "-"
               + (currentdate.getMonth()+1)  + "-"
               + currentdate.getDate() + " "
               + currentdate.getHours() + ":"
               + currentdate.getMinutes() + ":"
               + currentdate.getSeconds();

	var jsonPayload = '{"ContactName" : "' + contactFName
									+ '", "ContactLastName" : "' + contactLName
									+ '", "PhoneNumber" : "' + contactPhoneNum
									+ '", "Email" : "' + contactEmail
									+ '", "ContactCreated" : "' + datetime
									+ '", "UserId" : "' + userId + '"}';

	var url = urlBase + '/AddContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contacts Updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

// Purpose: searches for contact w/ inputted keyword(s) by user
function doSearchContact()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	var contactList = "";

	var jsonPayload = '{"search" : "' + srch + '","UserId" : ' + userId + '}';
	var url = urlBase + '/SearchContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	console.log("Searching User...");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					// HTML output for Name, Phone Number, Email
					contactList += "<strong>Contact Name: </strong>" + jsonObject.results[i].ContactName + " " + jsonObject.results[i].ContactLastName + "<br />"
											+ "<strong>Phone Number: </strong>" + jsonObject.results[i].PhoneNumber + "<br />"
											+ "<strong>Email: </strong>" + jsonObject.results[i].Email + "<br />";

					// HTML output for Delete Button
					// Note: deleteConfirm to process press OK calls deleteContact else do nothing.
					var temp = jsonObject.results[i].ID;
					contactList += '<button button type="button" onclick="deleteConfirm(' + temp + ');">Delete '
											+ jsonObject.results[i].ContactName
											+ '</button><span id="contactDeleteResult"></span>';

					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br /><br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};

		console.log("Sending");
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Failed!");
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// Purpose: confirms if the user intends to delete contact
function deleteConfirm( deleteID )
{  var a = confirm("Are you sure you want to delete?");
   if(a == true)
   {
     doDeleteContact( deleteID );
   }
}

function doDeleteContact( deleteID )
{
	document.getElementById("contactDeleteResult").innerHTML = "";

	var jsonPayload = '{"ID" : "' + deleteID + '"}';
	var url = urlBase + '/DeleteContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactDeleteResult").innerHTML = "Contact Deleted";
			}
		};
		xhr.send(jsonPayload);
		window.location.href = "contact.html";
	}
	catch(err)
	{
		document.getElementById("contactDeleteResult").innerHTML = err.message;
	}
}

function doEditContact()
{
	// Note: obtain the values inputted by the user from the contact.html file
	contactFName = document.getElementById("editContactFName").value;
	contactLName = document.getElementById("editContactLName").value;
	contactPhoneNum = document.getElementById("editContactPhoneNum").value;
	contactEmail = document.getElementById("editContactEmail").value;
	document.getElementById("contactEditResult").innerHTML = "";

	console.log("FirstName: " + contactFName + " LastName: " + contactLName);

	var jsonPayload = '{"ContactName" : "' + contactFName
									+ '", "ContactLastName" : "' + contactLName
									+ '", "PhoneNumber" : "' + contactPhoneNum
									+ '", "Email" : "' + contactEmail
									+ '", "UserId" : "' + userId + '"}';

	var url = urlBase + '/EditContact.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				console.log("Success: Checkpoint!");
				document.getElementById("contactEditResult").innerHTML = "Contacts Updated";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("Failed: Checkpoint!");
		document.getElementById("contactEditResult").innerHTML = err.message;
	}
}
