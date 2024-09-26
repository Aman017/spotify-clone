console.log("let write down js")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
    currFolder= folder;

    let a = await fetch(`/${folder}`)
    let respone = await a.text()
    // console.log(respone)

    let div = document.createElement("div")
    div.innerHTML = respone;
    let as = div.getElementsByTagName("a")
     songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songName = element.textContent.trim().replace(/\d{8}\/\d{1,2}\/\d{4} \d{1,2}:\d{2}:\d{2} [AP]M/g, "").replace(/\(PagalWorld\.com\.sb\)/g, "");
            songs.push(songName);
        }
    }

    // show all the song in playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUl.innerHTML=""
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
        <img src="music.svg" alt="">
        <div class="info">
            <div> ${song.trim()}</div>
            <div>Aman</div>
        </div>
        <div class="palynow">
            <span>Play Now</span>
            <img  src="play.svg" alt="">
        </div>
        </li>`;

    }
    //Attach an event listner
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    });
   
}



let PlayMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    
};

async function displayAlbums(){
    let a = await fetch(`/projects/spotify/song/`)
    let respone = await a.text()
   

    let div = document.createElement("div")
    div.innerHTML = respone;
    let ancors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
   Array.from(ancors).forEach(async e=>{

        if (e.href.includes("/song") && !e.href.includes(".htaccess")) {
           let folder = (e.href.split("/").slice(-1)[1])
           //get the meta data of the folder
           let a = await fetch(`/projects/spotify/song/${folder}/info.json`);

           let respone = await a.json();
           cardContainer.innerHTML= cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div  class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30"
                                fill="none">
                                <circle cx="12" cy="12" r="12" fill="#2E7D32" />

                                <path
                                    d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                                    fill="#000000" />
                            </svg>
                        </div>
                        <img src="/projects/spotify/song/${folder}/cover.jpg"
                            alt="">
                        <h2>${respone.title}</h2>
                        <p>${respone.descripation}</p>

                    </div>`
        //    console.log(respone)
        }
    })
   
// load the libary when ever card is click
Array.from(document.getElementsByClassName("card")).forEach(e=> { 
    console.log(e)
    e.addEventListener("click", async item => {
        console.log(item, item.currentTarget.dataset);
        
        songs = await getsongs(`song/${item.currentTarget.dataset.folder}`)  
       
    })
})

}

async function main() {


 await getsongs("projects/spotify/song/cs")
    PlayMusic(songs[0], true)
    //  console.log(songs)

    // Display all the albums
  displayAlbums();
    

    //Atach a eventlistener fore previous ,play and next

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "play.svg";
        }
    });
    // timeupate lister
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    //Add eventlistner for seekbar
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100
    });

    //Add eventlistner for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })


    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
          PlayMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            PlayMusic(songs[index + 1])
        }
    })


    // Add a eventlistner for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value) / 100
    })
    
// Add a eventlistner for volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target, e.target.value)
    currentSong.volume = parseInt(e.target.value) / 100
})

//add eventlistner for mute
document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
        e.target.src = e.target.src.replace("volume.svg", "mute.svg")
        currentSong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

    }
    else {
        e.target.src = e.target.src.replace("mute.svg", "volume.svg")
        currentSong.volume = .10;
    }

})


}

main()