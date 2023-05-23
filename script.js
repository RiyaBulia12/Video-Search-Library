const myResultsReadyCallback = function (name, q, promos, results, resultsDiv) {

  const makeResultParts = (result) => {
    const anchor = createAnchorElement(result.url);
    const thumbnailCol = createThumbnailColumn(result);
    const videoInfo = createVideoInfo(result);

    anchor.append(thumbnailCol, videoInfo);
    return [anchor];
  };

  function createAnchorElement(url) {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.classList.add('gs_title');
    return anchor;
  }

  function createThumbnailColumn(result) {
    const formattedDuration = result?.richSnippet?.videoobject ? convertDuration(result.richSnippet.videoobject.duration) : '00:00';
    const thumbnailCol = document.createElement('div');
    thumbnailCol.classList.add('thumbnail-column');

    const thumbnail = createThumbnail(result.richSnippet.imageobject.url);
    const videoTime = createVideoTime(formattedDuration);

    thumbnailCol.append(thumbnail, videoTime);
    return thumbnailCol;
  }

  function createThumbnail(url) {
    const thumbnail = document.createElement('img');
    thumbnail.src = url;
    thumbnail.classList.add('gs-image');
    return thumbnail;
  }

  function createVideoTime(duration) {
    const videoTime = document.createElement('span');
    videoTime.innerHTML = ' ' + duration;
    videoTime.classList.add('video-time');
    return videoTime;
  }

  function createVideoInfo(result) {
    const videoInfo = document.createElement('div');
    videoInfo.classList.add('video-info');

    const videoTitle = createVideoTitle(result?.title);
    const videoAuthor = createVideoAuthor(result.richSnippet?.person?.name);
    const videoSubInfo = createVideoSubInfo(result.richSnippet?.metatags?.ogSiteName, result.richSnippet.videoobject ? result.richSnippet.videoobject.interactioncount : '0');

    videoInfo.appendChild(videoTitle);
    videoInfo.appendChild(videoAuthor);
    videoInfo.appendChild(videoSubInfo);

    return videoInfo;
  }

  function createVideoTitle(title) {
    const videoTitle = document.createElement('p');
    videoTitle.innerHTML = ' ' + title;
    videoTitle.classList.add('video-title');
    return videoTitle;
  }

  function createVideoAuthor(author) {
    const videoAuthor = document.createElement('p');
    videoAuthor.innerHTML = ' ' + author;
    videoAuthor.classList.add('video-author');
    return videoAuthor;
  }

  function createVideoSubInfo(platform, interactionCount) {
    const videoSubInfo = document.createElement('div');
    videoSubInfo.classList.add('video-sub-info');

    const videoPlatform = createVideoPlatform(platform);
    const videoStats = createVideoStats(interactionCount);

    videoSubInfo.appendChild(videoPlatform);
    videoSubInfo.appendChild(videoStats);

    return videoSubInfo;
  }

  function createVideoPlatform(platform) {
    const videoPlatformContainer = document.createElement('div');
    videoPlatformContainer.classList.add('video-platform-container');

    const platformImg = document.createElement('img');
    platformImg.src = 'public/icons/youtube.png'
    platformImg.alt = 'youtube icon'
    const videoPlatform = document.createElement('p');
    videoPlatform.innerHTML = ' ' + platform + '.com';
    videoPlatform.classList.add('video-platform');

    videoPlatformContainer.appendChild(platformImg);
    videoPlatformContainer.appendChild(videoPlatform);
    return videoPlatformContainer;
  }

  function createVideoStats(interactionCount) {
    const formattedViews = formatViews(interactionCount);
    const videoStats = document.createElement('p');
    videoStats.innerHTML = ' ' + formattedViews;
    videoStats.classList.add('video-stats');
    return videoStats;
  }

  if (results && resultsDiv) {
    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-container');

    const filteredResults = results.filter(
      (result) =>
        result.richSnippet?.videoobject?.genre === 'Music' &&
        result.richSnippet?.videoobject?.interactioncount
    );
    filteredResults.sort(
      (a, b) =>
        b.richSnippet?.videoobject?.interactioncount -
        a.richSnippet?.videoobject?.interactioncount
    );

    for (const result of filteredResults) {
      const resultContent = document.createElement('div');
      resultContent.classList.add('result-content-container');
      const [anchor] = makeResultParts(result);
      resultContent.appendChild(anchor);
      resultContainer.appendChild(resultContent);
    }

    resultsDiv.appendChild(resultContainer);
  }
  return true;
};

// Converting the long digits into shorter form for views based on interactionCount
function formatViews(interactionCount) {
  if (!interactionCount) {
    return '0 views';
  }

  const views = parseInt(interactionCount, 10);
  const abbreviations = ['', 'k', 'm'];

  let formattedViews = views.toString();
  let abbreviationIndex = 0;

  while (formattedViews.length > 3 && abbreviationIndex < abbreviations.length - 1) {
    formattedViews = (parseFloat(formattedViews) / 1000).toFixed(1);
    abbreviationIndex++;
  }

  formattedViews = parseFloat(formattedViews).toFixed(0);
  formattedViews += abbreviations[abbreviationIndex];

  return formattedViews + ' views';
}

// Converting the 0M0S time into 00:00 format for video duration
function convertDuration(duration) {
  if (!duration) {
    return '';
  }

  const timeRegex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = duration.match(timeRegex);
  let hours = 0, minutes = 0, seconds = 0;

  if (matches) {
    if (matches[1]) {
      hours = parseInt(matches[1].replace('H', ''));
    }
    if (matches[2]) {
      minutes = parseInt(matches[2].replace('M', ''));
    }
    if (matches[3]) {
      seconds = parseInt(matches[3].replace('S', ''));
    }
  }

  return `${hours > 0 ? hours + ':' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

window.__gcse || (window.__gcse = {});
window.__gcse.searchCallbacks = {
  web: {
    ready: myResultsReadyCallback,
  },
};
