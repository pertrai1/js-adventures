const resultNav = document.getElementById('results-nav');
const favoritesNav = document.getElementById('favorites-nav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 10;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let loadedPhotos = [];
let favorites = {};

const displayPhotos = (mode = 'results') => {
  if (mode === 'favorites' && localStorage.getItem('nasaPhotos')) {
    favorites = JSON.parse(localStorage.getItem('nasaPhotos'));
  }
  imagesContainer.textContent = '';
  mode === 'results' ? updateDOM('results') : updateDOM('favorites');
  loader.classList.add('hidden');
}
const fetchPhotos = async() => {
  try {
    const response = await fetch(apiURL);
    // const data = await response.json(); 
    loadedPhotos = await response.json();
    displayPhotos('results');
  } catch (err) {
    console.log(err);
  }
}

function saveFavorites(photoUrl) {
  const selectedPhoto = loadedPhotos.find(photo => photo.url.includes(photoUrl) && !favorites[photoUrl]);
  if (selectedPhoto) {
    favorites[photoUrl] = selectedPhoto;
    saveConfirmed.hidden = false;
    setTimeout(() => saveConfirmed.hidden = true, 2000);
    localStorage.setItem('nasaPhotos', JSON.stringify(favorites));
  }
}

function removeFavorite(photoUrl) {
  if (favorites[photoUrl]) {
    delete favorites[photoUrl];
    localStorage.setItem('nasaPhotos', JSON.stringify(favorites));
  }
  displayPhotos('favorites');
}

function updateDOM(page) {
  const pageResults = page === 'results' ? loadedPhotos : Object.values(favorites);
  pageResults.map(photo => {
    const image = document.createElement('img');
    image.setAttribute('src', photo.hdurl);
    image.setAttribute('alt', photo.title);
    image.setAttribute('loading', 'lazy');
    image.classList.add('card-img-top');
    
    const link = document.createElement('a');
    link.appendChild(image);
    link.setAttribute('href', photo.url);
    link.setAttribute('title', 'View Image in New Tab');
    link.setAttribute('target', '_blank');

    
    const footer = document.createElement('span')
    footer.classList.add('text-muted');
    const dateSpan = document.createElement('strong');
    dateSpan.textContent = photo.date;
    const copyright = document.createElement('span');
    const copyrightResult = photo.copyright ?? '';
    // copyright.textContent = ` ${photo.copyright ? photo.copyright : ''}`;
    copyright.textContent = ` ${copyrightResult}`;
    footer.append(dateSpan, copyright);

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = photo.title;

    const favorites = document.createElement('p');
    favorites.classList.add('clickable');
    if (page === 'results') {
      favorites.textContent = 'Add to Favorites';
      favorites.setAttribute('onclick', `saveFavorites('${photo.url}')`);
    } else {
      favorites.textContent = 'Remove from Favorites';
      favorites.setAttribute('onclick', `removeFavorite('${photo.url}')`);
    }

    const text = document.createElement('p');
    text.classList.add('card-text');
    text.textContent = photo.explanation;

    cardBody.append(cardTitle, favorites, text, footer);

    const card = document.createElement('div');
    card.classList.add('card');
    card.append(link, cardBody);
    
    imagesContainer.appendChild(card);
  });
}

fetchPhotos();
