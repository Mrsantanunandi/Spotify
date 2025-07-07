console.log("Lets write js")
let currentsong = new Audio();
let songs;
let currFolder;

let metadata = {};
async function loadMetadata() {
    const a = await fetch('/all.json');
    metadata = await a.json();
}

async function getsongs(folder) {
    currFolder = folder;
    const parts = folder.split('/');
    const type = parts[0];
    const name = parts[1]; 

    // Get song list from metadata
    const entry = metadata[type][name];
    if (!entry || !entry.files) return [];
    // Extract only the file names (like "song.mp3")

    songs = entry.files.map(filePath => filePath.split('/').pop());
    // Show songs in the song list area
    let songul = document.querySelector(".songlist ul");
    songul.innerHTML = "";
    songs.forEach(song => {
        songul.innerHTML += `
      <li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info">
          <div>${song}</div>
          <div>Santanu</div>
        </div>
        <div class="playnow">
          <span>play now</span>
          <img class="invert" src="img/play.svg" alt="">
        </div>
      </li>
    `;
    });

    // Add click event to each song
    Array.from(songul.children).forEach(item => {
        item.addEventListener("click", () => {
            let track = item.querySelector(".info div").textContent.trim();
            playmusic(track);
        });
    });
    return songs;
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    const formattedSec = sec < 10 ? "0" + sec : sec;
    return `${min}:${formattedSec}`;
}

const playmusic = (track, pause = false) => {
    //let audio=new Audio("/songs/" + track)
    currentsong.src = `/${currFolder}/` + track
    if (!pause) {
        currentsong.play();
        play.src = "img/pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".first-time").innerHTML = "00:00";
    document.querySelector(".second-time").innerHTML = "00:00";
}

async function displaysongs() {
    let cardcontainer = document.querySelector(".cardcontainer");
    for (const folder in metadata.songs) {
        const entry = metadata.songs[folder];
        console.log(entry)
        //if (!entry.files || entry.files.length === 0) continue;
        const res = await fetch(entry.info);
        const info = await res.json();
        cardcontainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <img src="img/ppp.svg" alt="play">
                </div>
                <img class="brd1" src="${entry.cover}" alt="">
                <p class="font mall underline">${info.title}</p>
                <p class="mall font1 underline">${info.description}</p>
            </div>
        `;
    }

    // Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");
            document.querySelector('.before-login').style.display = 'none';
            document.querySelector('.after-login').style.display = 'block';
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        });
    });
}

//diplay artist
async function displayArtist() {
    let cardcontainer = document.querySelector(".cardcontainer1");

    for (const folder in metadata.artist) {
        const entry = metadata.artist[folder];

        const res = await fetch(entry.info);
        const info = await res.json();

        cardcontainer.innerHTML += `
            <div class="card">
                <div class="play">
                    <img src="img/ppp.svg" alt="play">
                </div>
                <img class="brd" src="${entry.cover}" alt="">
                <p class="font mall underline">${info.title}</p>
                <p class="mall font1 underline">${info.description}</p>
            </div>
        `;
    }
}

//display album and play songs
async function displayAlbums() {
    let cardcontainer = document.querySelector(".cardcontainer2");

    for (const folder in metadata.album) {
        const entry = metadata.album[folder];
        const res = await fetch(entry.info);
        const info = await res.json();

        cardcontainer.innerHTML += `
            <div data-folder="${folder}" class="card-album">
                <div class="play">
                    <img src="img/ppp.svg" alt="play">
                </div>
                <img class="brd1" src="${entry.cover}" alt="">
                <p class="font mall underline">${info.title}</p>
                <p class="mall font1 underline">${info.description}</p>
            </div>
        `;
    }

    Array.from(document.getElementsByClassName("card-album")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs");
            document.querySelector('.before-login').style.display = 'none';
            document.querySelector('.after-login').style.display = 'block';
            songs = await getsongs(`album/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        });
    });
}

async function main() {
    await loadMetadata();
    //get songs
    songs = await getsongs("songs/cs");
    if (songs.length > 0) {
        playmusic(songs[0], true);
    }
    //display all the album on the page
    displaysongs();
    displayArtist();
    displayAlbums();

    //attach an eventlistner for play,previous,next
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentsong.pause();
            play.src = "img/play.svg"
        }
    })
    //add an event listner for time
    currentsong.addEventListener("timeupdate", () => {
        //console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".first-time").innerHTML = `${formatTime(currentsong.currentTime)}`;
        document.querySelector(".second-time").innerHTML = `${formatTime(currentsong.duration)}`;
        document.querySelector(".circle").style.left = ((currentsong.currentTime / currentsong.duration) * 100) + "%";
        if (currentsong.currentTime === currentsong.duration) {
            play.src = "img/play.svg";
        }
    })
    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        //console.log(e.target.getBoundingClientRect().width, e.offsetX);
        let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100)
        document.querySelector(".circle").style.left = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    //add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0 + "%";
    })
    //add an event listner for crossbar
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = -100 + "%";
    })
    //add an event listner for prev & next button
    previous.addEventListener("click", () => {
        console.log("previous clicked")
        // console.log(currentsong.src)
        //console.log(currentsong.src.split("/songs/")[1])
        let index = songs.indexOf((currentsong.src.split(`/${currFolder}/`)[1]))
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {
        console.log("next clicked")
        let index = songs.indexOf((currentsong.src.split(`/${currFolder}/`)[1]))
        if ((index + 1) < songs.length) {
            console.log(index + 1, songs.length)
            playmusic(songs[index + 1])
        }
        else {
            playmusic(songs[index]);
        }
    })
    //add an event to change input volume
    document.querySelector(".timevol").getElementsByTagName("input")[0].addEventListener("change", e => {
        currentsong.volume = parseInt(e.target.value) / 100;
        if (currentsong.volume === 0) {
            document.querySelector(".volume img").src = "img/muted.svg";
        }
        else {
            document.querySelector(".volume img").src = "img/volume.svg";
        }
    })
    //add event listner to volume image
    document.querySelector(".volume img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/muted.svg");
            currentsong.volume = 0;
        }
        else {
            e.target.src = e.target.src.replace("img/muted.svg", "img/volume.svg");
            currentsong.volume = 0.5;
        }
    })
}

main();