<?php
    $inData = getRequestInfo();

    // IMPORTANT: change these values depending on the server and database in use!
    $databaseName = "COP4331";
    $databaseUser = "admin";
    $databasePassword = "password";

    $id = 0;
  	$firstName = "";
  	$lastName = "";
    $username = "";
    $password = "";

  	$conn = new mysqli("localhost", $databaseUser, $databasePassword, $databaseName);
    if( $conn->connect_error )
  	{
  		returnWithError( $conn->connect_error );
  	}
    else
    {
      // Source: https://www.w3schools.com/php/php_mysql_prepared_statements.asp
      // Note: $conn->prepare is a prepared statement, great for reducing repeated statements while
      //       improving efficiency
      $stmt = $conn->prepare("SELECT ID,firstName,lastName FROM Users WHERE Login=? AND Password =?");

      // Note: "ss" refers to two inputted values from the variables initiated by code.js located
      //       in line 14 and 15
      // i - integer
      // d - double
      // s - string
      // b - BLOB
  		$stmt->bind_param("ss", $inData["login"], $inData["password"]);

      // Note: executes the prepared statement with the binded parameters and store the result into
      //       a variable
  		$stmt->execute();
  		$result = $stmt->get_result();

      // Purpose: in the event that the user is trying to register an existing account in the
      //          database
  		if( $row = $result->fetch_assoc()  )
  		{
  			returnWithError("User already exists, please use LOGIN");
  		}
      else
      {
        // Note: we again utilize the prepared statements but now we are inserting the new user into
        //       the database
        $stmt = $conn->prepare("insert into Users (FirstName,LastName,Login,Password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $inData["firstname"], $inData["lastname"], $inData["login"], $inData["password"]);
        $stmt->execute();

        // Source: https://www.w3schools.com/php/php_mysql_insert_lastid.asp
        // Note: gets the ID value from the last inserted user
        $last_id = $conn->insert_id;
        returnWithInfo( $inData['firstname'], $inData['lastname'], $last_id, $inData["login"], $inData["password"] );
      }

      $stmt->close();
  		$conn->close();
    }

    function getRequestInfo()
  	{
      // Source: https://www.geeksforgeeks.org/how-to-receive-json-post-with-php/
      //       php://input = This is a read-only stream that allows us to read raw data
      //                     from the request body. It returns all the raw data after
      //                     the HTTP-headers of the request, regardless of the content type.
      //
      //       file_get_contents() =  This function in PHP is used to read a file into a string.
      //
      //       json_decode() = This function takes a JSON string and converts it into a PHP
      //                       variable that may be an array or an object.
  		return json_decode(file_get_contents('php://input'), true);
  	}

  	function sendResultInfoAsJson( $obj )
  	{
      // Source: https://stackoverflow.com/questions/35284986/the-usage-of-headercontent-typeapplication-json
      // purpose: sends http json header to the web browser to inform the application of the type of data it
      //          is expecting.
      // default content-type: text/html
  		header('Content-type: application/json');

      // echo = similar printf statement
  		echo $obj;
  	}

  	function returnWithError( $err )
  	{
  		$retValue = '{"id":0,"firstName":"","lastName":"","username":"","password":"","error":"' . $err . '"}';
  		sendResultInfoAsJson( $retValue );
  	}

  	function returnWithInfo( $firstName, $lastName, $id, $username, $password )
  	{
  		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","username":"' . $username . '","password":"' . $password . '","error":""}';
  		sendResultInfoAsJson( $retValue );
  	}
?>
