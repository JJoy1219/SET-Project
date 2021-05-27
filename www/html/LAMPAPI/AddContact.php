<?php
	$inData = getRequestInfo();

	$contactName = $inData["ContactName"];
	$contactLastname = $inData["contactLastname"];
	$phoneNumber = $inData["phoneNumber"];
	$email = $inData["email"];
	$contactCreated = $inData["contactCreated"];
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheUser", "Password1", "COP4331");
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
