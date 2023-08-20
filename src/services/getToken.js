export async function getToken(appKey, secretKey) {
    const response = await fetch('https://api.yotpo.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: appKey.trim(),
        client_secret: secretKey.trim(),
        grant_type: 'client_credentials'
      }),
    });
  
    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    } else {
      throw new Error('Failed to retrieve utoken');
    }
  }