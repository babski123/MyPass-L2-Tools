export async function getUnsubscribers(appKey, utoken) {
    const response = await fetch(`https://api.yotpo.com/apps/${appKey}/unsubscribers?utoken=${utoken}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
  
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Failed to retrieve unsubscribers');
    }
  }