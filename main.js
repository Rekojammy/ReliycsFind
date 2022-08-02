const form = document.querySelector("form");
const search = document.getElementById("search-input");
const result = document.getElementById("result");
const btn = document.getElementById("btn");
const err = document.getElementById("err");
const contain = document.querySelector(".contain");

const apiURL = "https://api.lyrics.ovh";

// Get Search Value
form.addEventListener("submit", e => {
    console.log('clicked');
    e.preventDefault();
    searchValue = search.value.trim();

    if (!searchValue) {
        err.innerHTML = "Please enter a search word!";
        setTimeout(() => {
            err.innerHTML = "";
        }, 2000);
    } else {
        err.innerHTML = "Searching...";
        err.style.fontStyle = "italic";
        setTimeout(() => {
            err.innerHTML = "";
            result.style.display = "block";
        }, 4000);
        beginSearch(searchValue);
    }
});

// Search function
async function beginSearch(searchValue) {
    const searchResult = await fetch(`${apiURL}/suggest/${searchValue}`);
    const data = await searchResult.json();

    displayData(data);
}

// Display Search Result
function displayData(data) {
    contain.style.display = "block";
    result.innerHTML = `
    <ul class="songs">
      ${data.data
        .map(song=> `
        <li>
            <div>
                <strong>${song.artist.name}</strong> -${song.title} 
            </div>
            <button class="btn btn-danger" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        </li>`
        )
        .join('')}
    </ul>
  `;
}

//event listener in get lyrics button
result.addEventListener('click', e=>{
    const clickedElement = e.target;

    //checking clicked elemet is button or not
    if (clickedElement.tagName === 'BUTTON'){
        const artist = clickedElement.getAttribute('data-artist');
        const songTitle = clickedElement.getAttribute('data-songtitle');
        err.innerHTML = "Searching...";
        err.style.fontStyle = "italic";
        setTimeout(() => {
            err.innerHTML = "";
        }, 4000);
        
        getLyrics(artist, songTitle)
    }
})

// Get lyrics for song
async function getLyrics(artist, songTitle) {
    const response = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
    const data = await response.json();
  
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
  
    result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
    <p>${lyrics}</p>`;
  
  }