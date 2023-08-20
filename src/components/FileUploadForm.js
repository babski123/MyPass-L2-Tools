import React, { useState, useRef } from "react";
import { VStack, Button, Text, Input, Select, Spinner, Center } from "@chakra-ui/react";
import { FiUpload } from "react-icons/fi";
import Papa from "papaparse";
import { getToken } from "../services/getToken";
import { batchUnsubscribe, batchResubscribe } from "../services/unsubresub";
import ConfirmModal from "./ConfirmModal";
import ProgressModal from "./ProgressModal";
import ResultsModal from "./ResultsModal";
import UnsubscribersModal from "./UnsubscribersModal";

const FileUploadForm = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [fileDetails, setFileDetails] = useState("");
  const [appKey, setAppKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [action, setAction] = useState("unsub"); // Default action is Unsubscribe
  const [parsedFile, setParsedFile] = useState({});
  const [emails, setEmails] = useState([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); //modal for the confirmation message of wether to proceed with the action
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false); //modal for the progress of the action
  const [progressModalMessage, setProgressModalMessage] = useState(""); //the content of the modal
  const [barProgress, setBarProgress] = useState(0); //the progress of the progress bar inside the progress modal
  const [isProgressVisible, setIsProgressVisible] = useState(false); //indicates the visibility of the progress bar inside the progress modal
  const [progressCaption, setProgressCaption] = useState(""); //the caption below the progress bar of the progress modal
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false); //indicates if the results modal is open or not
  const [successCalls, setSuccessCalls] = useState([]); //successfull api calls
  const [successCallsWithErr, setSuccessCallsWithErr] = useState([]);
  const [failedCalls, setFailedCalls] = useState([]);
  const fileInputRef = useRef(null);
  const [isUnsubscribersModalOpen, setIsUnsubscribersModalOpen] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check if the file is CSV
    if (file && file.name.endsWith(".csv")) {
      setErrorMessage("");

      const reader = new FileReader();
      reader.onload = async (e) => {
        const contents = e.target.result;
        const { data } = Papa.parse(contents, {
          header: false,
          skipEmptyLines: true
        });
        setParsedFile(data);

        // Check the number of columns in the CSV file
        if (data.length > 0) {
          const numColumns = data[0].length;
          if (numColumns > 1) {
            setSelectedFile(null);
            setErrorMessage("CSV file should have only one column.");
          } else {
            setSelectedFile(file);
            setFileDetails(`${data.length} rows detected`);
          }
        }
      };

      reader.readAsText(file);
    } else {
      setSelectedFile(null);
      setErrorMessage("Invalid file type selected.");
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setErrorMessage("Please select a file first.");
      return;
    }

    if (!appKey || !secretKey) {
      setErrorMessage("App key and Secret key cannot be empty.");
      return;
    }

    console.log("App Key:", appKey);
    console.log("Secret Key:", secretKey);
    console.log("Action:", action);

    setErrorMessage("");
    setIsConfirmModalOpen(true);

    //list the emails
    let emails = [];
    for (let i = 0; i < parsedFile.length; i++) {
      emails.push(parsedFile[i][0]);
    }
    setEmails(emails);
  };

  const handleConfirmModalClose = () => {
    setIsConfirmModalOpen(false);
  };

  const handleConfirmModalProceed = async () => {
    console.log("Proceed!");
    setIsProgressModalOpen(true);
    setProgressModalMessage(
      <>
        <Text align="center">Retrieving authentication token...</Text>
        <br />
        <Center>
          <Spinner size="lg" />
        </Center>
      </>
    );
    setIsConfirmModalOpen(false);

    try {
      // Retrieve utoken
      const data = await getToken(appKey, secretKey);

      const batches = [];
      for (let i = 0; i < emails.length; i += 150) {
        const batch = emails.slice(i, i + 150);
        batches.push(batch);
      }

      setProgressModalMessage(
        <>
          <Text fontSize="sm" align="center">Auth token: {data}</Text>
          <Text fontSize="sm" align="center">Number of emails: {emails.length}</Text>
          <Text fontSize="sm" align="center">Number of batches: {batches.length}</Text>
          <br />
        </>
      );

      setIsProgressVisible(true); //show the progress bar inside the progress bar modal
      let batchUnsubscribeResults = {};
      //execute the batch API requests
      if (action === "unsub") {
        batchUnsubscribeResults = await batchUnsubscribe(
          appKey,
          data,
          batches,
          setBarProgress,
          setProgressCaption,
          3 //maximum number of retries if the API request fails
        );
      } else if (action === "resub") {
        batchUnsubscribeResults = await batchResubscribe(
          appKey,
          data,
          batches,
          setBarProgress,
          setProgressCaption,
          3 //maximum number of retries if the API request fails
        );
      }

      //batch aPI requests has finished, hide the progress bar
      setIsProgressVisible(false);

      //change the progress modal message
      setProgressModalMessage(
        <>
          <Text align="center">Successful requests: {batchUnsubscribeResults.success_calls.length}</Text>
          <Text align="center">Successful requests with errors: {batchUnsubscribeResults.errors.length}</Text>
          <Text align="center">Failed requests: {batchUnsubscribeResults.failed_calls.length}</Text>
          <Center mt={3}>
            <Button onClick={function () {
              setIsProgressModalOpen(false); //hide the progress modal, we're done using it :D
              setIsResultsModalOpen(true); //show the results modal
            }} colorScheme="blue" variant="solid">Check Results</Button>
          </Center>
        </>
      );

      //update our successCalls, successCallsWithErr, and failedCalls react variables
      setSuccessCalls(batchUnsubscribeResults.success_calls);
      setSuccessCallsWithErr(batchUnsubscribeResults.errors);
      setFailedCalls(batchUnsubscribeResults.failed_calls);

    } catch (error) {
      setProgressModalMessage(
        <Text align="center">{error.message}. Please refresh the page and try again.</Text>
      );
    }
  };

  return (
    <>
      <UnsubscribersModal
        isOpen={isUnsubscribersModalOpen}
        modalData={{
          appKey: appKey,
          secretKey: secretKey
        }}
        setIsUnsubscribersModalOpen={setIsUnsubscribersModalOpen}
      />
      <ResultsModal
        isOpen={isResultsModalOpen}
        modalData={{
          success_calls: successCalls,
          success_calls_with_errors: successCallsWithErr,
          failed_calls: failedCalls
        }}
        setIsResultsModalOpen={setIsResultsModalOpen}
      />
      <ProgressModal
        isOpen={isProgressModalOpen}
        modalData={{
          message: progressModalMessage,
          progressValue: barProgress,
          progressVisibility: isProgressVisible,
          progressCaption: progressCaption
        }}
      />
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={handleConfirmModalClose}
        onProceed={handleConfirmModalProceed}
        modalData={{
          title: (action === "unsub") ? "Unsubscribe" : "Resubscribe",
          message: `Are you sure you want to ${(action === "unsub") ? "add" : "remove"} ${emails.length} emails to the unsubscribers list?`
        }} />
      <VStack spacing={4} align="center" py={2}>
        {errorMessage && <Text color="red">{errorMessage}</Text>}
        {selectedFile ? (
          <>
            <Text fontSize="lg">Selected file: {selectedFile.name}</Text>
            <Text color="green" fontSize="sm">{fileDetails}</Text>
          </>
        ) : (
          <Text fontSize="lg">Select a file</Text>
        )}

        <Button leftIcon={<FiUpload />} colorScheme="blue" variant="outline" onClick={handleChooseFile}>
          Choose File
          <input
            ref={fileInputRef}
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </Button>

        <Input
          type="text"
          placeholder="App Key"
          value={appKey}
          onChange={(e) => setAppKey(e.target.value)}
        />

        <Input
          type="text"
          placeholder="Secret Key"
          value={secretKey}
          onChange={(e) => setSecretKey(e.target.value)}
        />

        <Select value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="unsub">Unsubscribe</option>
          <option value="resub">Resubscribe</option>
        </Select>

        <Button
          onClick={handleFileUpload}
          colorScheme="blue"
          isDisabled={!selectedFile || !appKey || !secretKey}
        >
          Submit
        </Button>
        <Button
          onClick={() => setIsUnsubscribersModalOpen(true)}
          colorScheme="blue"
          variant="outline"
          isDisabled={!appKey || !secretKey}>
          View unsubscribers
        </Button>
      </VStack>
    </>
  );
};

export default FileUploadForm;