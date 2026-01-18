chrome.alarms.create('fetchRSS', { periodInMinutes: 15 });

// Alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'fetchRSS') {
    fetchRSSFeeds();
  }
});

// Main function
async function fetchRSSFeeds() {
  try {
    const result = await chrome.storage.local.get(['rssFeeds']);
    const feeds = result.rssFeeds || [];

    if (feeds.length === 0) {
      console.log('No RSS feeds saved.');
      return;
    }

    for (const feedUrl of feeds) {
      try {
        const response = await fetch(feedUrl);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.text();

        console.log(`Fetched feed from ${feedUrl}:`, data);
      } catch (err) {
        console.error(`Failed to fetch ${feedUrl}:`, err);
      }
    }
  } catch (err) {
    console.error('Error fetching RSS feeds:', err);
  }
}