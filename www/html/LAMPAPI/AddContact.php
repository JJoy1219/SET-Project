<?php
	$inData = getRequestInfo();

	$contactName = $inData["ContactName"];
	$contactLastname = $inData["ContactLastName"];
	$phoneNumber = $inData["PhoneNumber"];
	$email = $inData["Email"];
	$contactCreated = $inData["ContactCreated"];
	$userId = $inData["UserId"];

	$conn = new mysqli("localhost", "admin", "password", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (ContactName,ContactLastName,PhoneNumber,Email,ContactCreated,UserID) VALUES(?,?,?,?,?,?)");
		$stmt->bind_param("ssssss", $contactName, $contactLastname, $phoneNumber, $email, $contactCreated, $userId);
		$stmt->execute();
		$stmt->close();
		$conn->close();
	  returnWithError("");
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
