<?php
	$inData = getRequestInfo();


	$phoneNumber = $inData["PhoneNumber"];
	$email = $inData["Email"];
	$contactId = $inData["ContactID"];

	$conn = new mysqli("localhost", "admin", "password", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
   if(mysqli_num_rows(mysqli_query($conn, "SELECT * FROM Contacts WHERE ID=$contactId")) == 0) 
   {
     returnWithError("ID Does Not exist!");
   }
   else
   {
		$stmt = $conn->prepare("UPDATE Contacts set PhoneNumber=?, Email=? where ID =?");
		//update Colors set Name = 'Yellow' , UserID = '3' where ID = '1';
		$stmt->bind_param("sss", $phoneNumber, $email, $contactId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
   }
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

?>
