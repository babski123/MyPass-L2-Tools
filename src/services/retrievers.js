export async function getUnsubscribers(appKey, utoken, count, page) {
    if (count > 5000) count = 5000;
    const response = await fetch(`https://api.yotpo.com/apps/${appKey}/unsubscribers?utoken=${utoken}&count=${count}&page=${page}`, {
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