export async function batchUnsubscribe(appKey, utoken, batches, setProgressBarValue, setProgressCaption, maxRetries) {
  return new Promise(async (resolve) => {
    let errors = []; // store error data in an  array
    let success_calls = []; // store success call data in an array
    let failed_calls = []; // Store failed call data in an array

    for (let i = 0; i < batches.length; i++) {
      let retries = 0;
      let requestSuccessful = false;

      setProgressCaption(`Processing batch ${i}`);
      while (!requestSuccessful && retries < maxRetries) {
        try {
          const response = await fetch(`https://api.yotpo.com/apps/${appKey}/unsubscribers/mass_create`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email_list: {
                "1": batches[i]
              },
              utoken: utoken,
              async: true,
              validate_data: true
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.response) {
              errors.push({ batchNumber: i + 1, errors: data.response.errors });
            } else {
              success_calls.push({ batchNumber: i + 1, data: data, emails: batches[i] });
            }
            requestSuccessful = true;
          } else {
            retries++;
            const errorData = await response.json(); // Get error data from the response
            setProgressCaption(`Batch ${i + 1} request failed. Retrying (${retries}/${maxRetries})...`);
            if (retries === maxRetries) {
              failed_calls.push({ batchNumber: i + 1, errorData: errorData, emails: batches[i] }); // Store error data in the array
            }
          }
        } catch (error) {
          retries++;
          setProgressCaption(`Batch ${i + 1} failed. Retrying (${retries}/${maxRetries})...`);
          if (retries === maxRetries) {
            failed_calls.push({ batchNumber: i + 1, errorData: error, emails: batches[i] }); // Store error data in the array
          }
        }
      }

      setProgressBarValue(Math.ceil((i / batches.length) * 100) + 1);
    }

    resolve({ success_calls: success_calls, failed_calls: failed_calls, errors: errors });
  });
}

export async function batchResubscribe(appKey, utoken, batches, setProgressBarValue, setProgressCaption, maxRetries) {
  return new Promise(async (resolve) => {
    let errors = []; // store error data in an  array
    let success_calls = []; // store success call data in an array
    let failed_calls = []; // Store failed call data in an array

    for (let i = 0; i < batches.length; i++) {
      let retries = 0;
      let requestSuccessful = false;

      setProgressCaption(`Processing batch ${i}`);
      while (!requestSuccessful && retries < maxRetries) {
        try {
          const response = await fetch(`https://api.yotpo.com/apps/${appKey}/unsubscribers/mass_delete`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email_list: {
                "1": batches[i]
              },
              utoken: utoken,
              async: true,
              validate_data: true
            }),
          });

          if (response.ok) {
            const data = await response.json();
            if (data.response) {
              errors.push({ batchNumber: i + 1, errors: data.response.errors });
            } else {
              success_calls.push({ batchNumber: i + 1, data: data, emails: batches[i] });
            }
            requestSuccessful = true;
          } else {
            retries++;
            const errorData = await response.json(); // Get error data from the response
            setProgressCaption(`Batch ${i + 1} request failed. Retrying (${retries}/${maxRetries})...`);
            if (retries === maxRetries) {
              failed_calls.push({ batchNumber: i + 1, errorData: errorData, emails: batches[i] }); // Store error data in the array
            }
          }
        } catch (error) {
          retries++;
          setProgressCaption(`Batch ${i + 1} failed. Retrying (${retries}/${maxRetries})...`);
          if (retries === maxRetries) {
            failed_calls.push({ batchNumber: i + 1, errorData: error, emails: batches[i] }); // Store error data in the array
          }
        }
      }

      setProgressBarValue(Math.ceil((i / batches.length) * 100) + 1);
    }

    resolve({ success_calls: success_calls, failed_calls: failed_calls, errors: errors });
  });
}