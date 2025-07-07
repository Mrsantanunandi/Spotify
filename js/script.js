console.log("Lets write js")
let currentsong = new Audio();
let songs;
let currFolder;
async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/").pop());
        }
    }

    // Show all the songs in the playlist
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML +
            `<li>
        <img class="invert" src="img/music.svg" alt="">
        <div class="info ">
            <div>${song}</div>
            <div>Santanu</div>
        </div>
        <div class="playnow">
            <span>play now</span>
            <img class="invert" src="img/play.svg" alt="">
        </div>
    </li>`;
    }
    //attach an eventlistner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
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
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folders = (e.href.split("/").slice(-2)[0]);
            //console.log(folders);
            //get the meta data of the folders
            let a = await fetch(`http://127.0.0.1:3000/songs/${folders}/info.json`)
            let response = await a.json();
            //console.log(response);
            cardcontainer.innerHTML = cardcontainer.innerHTML +
                `<div data-folder="${folders}" class="card">
                <div class="play">
                <img src="img/ppp.svg" alt="play">
                </div>
                <img class="brd1" 
                src="/songs/${folders}/cover.jpg" 
                alt="">
                <p class="font mall underline">${response.title}</p>
                <p class="mall font1 underline">${response.description}</p>
                </div>`
        }
    }
    //Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            document.querySelector('.before-login').style.display = 'none';
            document.querySelector('.after-login').style.display = 'block';
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        })
    })
}

async function displayArtist() {
    let a = await fetch("http://127.0.0.1:3000/artist/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardcontainer = document.querySelector(".cardcontainer1");
    let anchors = div.getElementsByTagName("a");
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/artist")) {
            let folders = (e.href.split("/").slice(-2)[0]);
            //console.log(folders);
            let a = await fetch(`http://127.0.0.1:3000/artist/${folders}/info.json`)
            let response = await a.json();
            //console.log(response);
            cardcontainer.innerHTML +=
                `<div class="card">
                        <div class="play">
                             <img src="img/ppp.svg" alt="play">
                        </div>
                        <img class="brd" src="/artist/${folders}/cover.jpg" alt="">
                        <p class="font mall underline">${response.title}</p>
                        <p class="mall font1 underline">${response.description}</p>
                </div>`
        }
    }
}


//display album and play songs
async function displayAlbums() {
    let a = await fetch("http://127.0.0.1:3000/album/")
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer2")
    let array = Array.from(anchors);
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/album")) {
            let folders = (e.href.split("/").slice(-2)[0]);
            //console.log(folders);
            //get the meta data of the folders
            let a = await fetch(`http://127.0.0.1:3000/album/${folders}/info.json`)
            let response = await a.json();
            //console.log(response);
            cardcontainer.innerHTML = cardcontainer.innerHTML +
                `<div data-folder="${folders}" class="card-album">
            <div class="play">
            <img src="img/ppp.svg" alt="play">
            </div>
            <img class="brd1" 
            src="/album/${folders}/cover.jpg" 
            alt="">
            <p class="font mall underline">${response.title}</p>
            <p class="mall font1 underline">${response.description}</p>
            </div>`
        }
    }
    //Load the playlist when the card is clicked
    Array.from(document.getElementsByClassName("card-album")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            document.querySelector('.before-login').style.display = 'none';
            document.querySelector('.after-login').style.display = 'block';
            songs = await getsongs(`album/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        })
    })

}

async function main() {
    //get songs
    songs = await getsongs("songs/cs");
    playmusic(songs[0], true);
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
    document.querySelector(".volume img").addEventListener("click",e=>{
        if(e.target.src.includes("img/volume.svg"))
        {
            e.target.src=e.target.src.replace("img/volume.svg","img/muted.svg");
            currentsong.volume=0;
        }
        else
        {
            e.target.src=e.target.src.replace("img/muted.svg","img/volume.svg");
            currentsong.volume=0.5;
        }
    })
}

main();