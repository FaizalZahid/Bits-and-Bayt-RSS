document.addEventListener('DOMContentLoaded', async () => {
  const feedContainer = document.getElementById('feed-container');
  const optionsButton = document.getElementById('options');

  optionsButton.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  try {
    const result = await chrome.storage.local.get(['rssFeeds']);
    const feeds = result.rssFeeds || [];

    if (feeds.length === 0) {
      feedContainer.innerHTML = "<p>No RSS feeds added yet. Click 'Add/Remove Feeds' to start.</p>";
      return;
    }

    feedContainer.innerHTML = '';

    for (const feedUrl of feeds) {
      try {
        const response = await fetch(feedUrl);
        const text = await response.text();
        const xml = new DOMParser().parseFromString(text, "text/xml");

        const feedTitle = xml.querySelector('title')?.textContent || feedUrl;
        const items = xml.querySelectorAll('item');

        const feedSection = document.createElement('div');
        feedSection.innerHTML = `<h2>${feedTitle}</h2>`;

        items.forEach((item, index) => {
          if (index >= 5) return; // limit to 5 items per feed
          const title = item.querySelector('title')?.textContent || 'No title';
          const link = item.querySelector('link')?.textContent || '#';
          const description = item.querySelector('description')?.textContent || '';

          const feedItem = document.createElement('div');
          feedItem.innerHTML = `
            <h3><a href="${link}" target="_blank">${title}</a></h3>
            <p>${description}</p>
            <hr style="height: 2px; background-color: #fcbf47; border: none;">

          `;
          feedSection.appendChild(feedItem);
        });

        feedContainer.appendChild(feedSection);

      } catch (err) {
        console.error(`Failed to fetch ${feedUrl}:`, err);
        const errorDiv = document.createElement('div');
        errorDiv.textContent = `Failed to load feed: ${feedUrl}`;
        errorDiv.style.color = 'red';
        feedContainer.appendChild(errorDiv);
      }
    }

  } catch (err) {
    console.error('Error loading RSS feeds:', err);
    feedContainer.innerHTML = "<p style='color:red'>Error loading feeds.</p>";
  }
});