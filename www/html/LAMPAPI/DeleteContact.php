<?php
	$inData = getRequestInfo();

	$id = $inData["ID"];
	$conn = new mysqli("localhost", "admin", "password", "COP4331");
	if ($conn->connect_error)
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE ID = $id");
		$stmt->bind_param("sss", $contactName, $contactLastname, $userId);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			$stmt = $conn->prepare("DELETE from Contacts where ID = $id");
			$stmt->execute();
			$stmt->close();
			$conn->close();
			returnWithError("");
		}
		else
    {
	 		returnWithError("Contact Does Not exist!");
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
