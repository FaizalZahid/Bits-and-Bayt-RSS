document.addEventListener('DOMContentLoaded', function() {
  const rssForm = document.getElementById('rssForm');
  const rssUrlInput = document.getElementById('rssUrl');
  const feedList = document.getElementById('feedList');

  async function loadFeeds() {
    const result = await chrome.storage.local.get(['rssFeeds']);
    const feeds = result.rssFeeds || [];
    feedList.innerHTML = '';

    feeds.forEach((feedUrl, index) => {
      const li = document.createElement('li');
      li.textContent = feedUrl + ' ';

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.style.marginLeft = '10px';
      removeButton.addEventListener('click', () => removeFeed(index));

      li.appendChild(removeButton);
      feedList.appendChild(li);
    });
  }

  rssForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    let feedUrl = rssUrlInput.value.trim();
    if (!feedUrl) return;

    const result = await chrome.storage.local.get(['rssFeeds']);
    const feeds = result.rssFeeds || [];

    if (feeds.includes(feedUrl)) {
      alert('Feed already added!');
      rssUrlInput.value = '';
      return;
    }

    feeds.push(feedUrl);
    await chrome.storage.local.set({ rssFeeds: feeds });
    rssUrlInput.value = '';
    loadFeeds();
  });

  async function removeFeed(index) {
    const result = await chrome.storage.local.get(['rssFeeds']);
    const feeds = result.rssFeeds || [];
    feeds.splice(index, 1);
    await chrome.storage.local.set({ rssFeeds: feeds });
    loadFeeds();
  }

  loadFeeds();
});