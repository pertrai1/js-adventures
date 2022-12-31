const category = 'random';
const count = 5;
const apiKey = 'YOUR_API_KEY';
const apiURL = `https://api.unsplash.com/photos/${category}/?client_id=${apiKey}&count=${count}`;

const imageContainer = document.querySelector('[data-image-container]');
const loader = document.querySelector('[data-loader]');

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;

const displayPhotosInContainer = async photos => {
  imageContainer.innerHTML = await photos.map(({links, urls, alt_description}) => {
    return `
      <a href="${links.html}">
        <img src="${urls.regular}" alt="${alt_description}" title="${alt_description}">
      </a>
    `;
  }).join('');
}

const createDOMElement = (node, attributes) => {
  const element = document.createElement(node);
  for (const key of Object.keys(attributes)) {
    element.setAttribute(key, attributes[key]);
  }
  return element;
}

const imageLoaded = () => {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

const appendPhotosToContainer = ({element, items}) => {
  imagesLoaded = 0;
  totalImages = items.length;

  return items.map(photo => {
    const item = createDOMElement('a', {
      href: photo.links.html,
      target: '_blank'
    });

    const image = createDOMElement('img', {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    });

    image.addEventListener('load', imageLoaded);

    item.appendChild(image);
    element.appendChild(item);
  })
}

async function getPhotos() {
  try {
    const response = await fetch(apiURL);
    const photos = await response.json();

    appendPhotosToContainer({
      element: imageContainer,
      items: photos
    });

  } catch (err) {
    console.log(err);
  }
}

window.addEventListener('scroll', () => {
  if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 1000) && ready) {
    ready = false;
    getPhotos();
  }
});

getPhotos();
