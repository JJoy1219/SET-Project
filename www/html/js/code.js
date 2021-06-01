var urlBase = 'http://cop4331-group1.xyz/LAMPAPI';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var login = "";
var password = "";

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

				window.location.href = "color.html";

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

	var jsonPayload = '{"firstname" : "' + firstName + '", "lastname" : "' + lastName + '", "login" : "' + login + '", "password" : "' + password + '"}';

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
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
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
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addColor()
{
	var newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	var jsonPayload = '{"color" : "' + newColor + '", "userId" : ' + userId + '}';
	var url = urlBase + '/AddColor.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}

}

function searchColor()
{
	var srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	var colorList = "";

	var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchColors.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}

}
