
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/projects/spotify/song/`)
    let respone = await a.text()
    // console.log(respone)

    let div = document.createElement("div")
    div.innerHTML = respone;
    let ancors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(ancors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];



        if (e.href.includes("/song")) {
            let folder = (e.href.split("/").slice(-1)[0])
            //get the meta data of the folder
            let a = await fetch(`http://127.0.0.1:5500/projects/spotify/song/${folder}/info.json`)
            let respone = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="cs" class="card">
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
    }
    // load the libary when ever card is click
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            console.log(item, item.currentTarget.dataset)

            songs = await getsongs(`projects/spotify/song/${item.currentTarget.dataset.folder}`)

        })
    })

}


async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/projects/spotify/song/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/song") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-1)[0]
            // Get the metadata of the folder
            let a = await fetch(`/projects/spotify/song/${folder}/info.json`)
            let response = await a.json(); 
            .innerHTML = cardContainer.innerHTML + ` <div data-folder="cs" class="card">
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
                        <h2>${response.title}</h2>
                        <p>${response.descripation}</p>

                    </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`projects/spotify/song/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}















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
