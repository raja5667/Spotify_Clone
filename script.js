let isPlaying = false;
let currentSongIndex = 0;
let audio = null;
let songs = [];
let filteredSongs = []; // To store the filtered song list

// DOM elements
const playPauseButton = document.getElementById("play-pause");
const progressBar = document.getElementById("progress-bar");
const currentTimeElem = document.getElementById("current-time");
const totalTimeElem = document.getElementById("total-time");
const searchBar = document.getElementById("search-bar"); // Search bar element

// DOM elements for the play bar
const songTitleElem = document.querySelector(".song-title");
const artistNameElem = document.querySelector(".artist-name");
const coverArtElem = document.querySelector(".cover-art");

// Fetch the songs from the server
async function getSongs() {
    try {
        let response = await fetch("http://127.0.0.1:5000/songs/");
        if (!response.ok) throw new Error("Failed to fetch songs");

        // Extract song URLs from the response
        let textResponse = await response.text();
        let div = document.createElement("div");
        div.innerHTML = textResponse;
        let as = div.getElementsByTagName("a");

        songs = Array.from(as)
            .filter(a => a.href.endsWith(".mp3")) // Only include .mp3 files
            .map(a => a.href);

        // Initialize filteredSongs with all songs initially
        filteredSongs = songs;

        return songs;
    } catch (error) {
        console.error("Error in getSongs:", error);
        return [];
    }
}

// Main function to initialize the player
async function main() {
    songs = await getSongs();

    if (songs.length > 0) {
        setupSongList();
    } else {
        console.log("No songs found.");
    }
}

// Set up song list in the UI with cover art
function setupSongList() {
    const songUL = document.querySelector(".library-card ul");
    songUL.innerHTML = ""; // Clear any existing list items

    filteredSongs.forEach((songUrl, index) => {
        const songName = decodeURIComponent(songUrl.split('/').pop());

        // Create the list item element
        const li = document.createElement("li");
        li.classList.add("song-item");

        // Create the image element for the cover art (music.svg)
        const coverArt = document.createElement("img");
        coverArt.src = "music.svg"; // Use your SVG file as the cover art
        coverArt.alt = "Cover Art"; // Alt text for the image
        coverArt.classList.add("cover-art"); // Add a class to style it if necessary

        // Create text content for the song name
        const songTitle = document.createElement("span");
        songTitle.textContent = songName;

        // Append the cover art and song name to the list item
        li.appendChild(coverArt);
        li.appendChild(songTitle);

        // Add click event to load and play the song
        li.addEventListener("click", () => loadSong(index));

        // Append the list item to the song list
        songUL.appendChild(li);
    });
}

// Load a song by index
function loadSong(index) {
    if (audio) {
        audio.pause();  // Pause the current song
        audio.currentTime = 0;  // Reset to start
    }

    audio = new Audio(filteredSongs[index]);
    currentSongIndex = index;

    // Set default cover art
    coverArtElem.src = "music.svg";  // Show default cover art
    coverArtElem.alt = "Cover Art";

    // Set song title (decoded to display cleanly)
    const songName = decodeURIComponent(filteredSongs[index].split('/').pop().replace(".mp3", ""));
    songTitleElem.textContent = songName;
    artistNameElem.textContent = "Unknown Artist";  // Set default artist name; update if you have artist data

    // Automatically play the song when loaded
    audio.addEventListener("canplay", () => {
        totalTimeElem.textContent = formatTime(audio.duration);
        playSong();  // Automatically start playing the song
    });

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", playNextSong);
}

// Search function to filter songs
function filterSongs() {
    const searchTerm = searchBar.value.toLowerCase();
    filteredSongs = songs.filter(songUrl => {
        const songName = decodeURIComponent(songUrl.split('/').pop()).toLowerCase();
        return songName.includes(searchTerm);
    });
    setupSongList(); // Update the UI with filtered results
}

// Attach event listener to search bar
searchBar.addEventListener("input", filterSongs);

// Play the current song
function playSong() {
    audio.play().catch(err => console.error("Error playing the song:", err));
    isPlaying = true;
    playPauseButton.src = "pause.svg"; // Change to pause icon
}

// Pause the current song
function pauseSong() {
    audio.pause();
    isPlaying = false;
    playPauseButton.src = "play.svg"; // Change to play icon
}

// Toggle play/pause
function togglePlayPause() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

// Play the next song in the list
function playNextSong() {
    currentSongIndex = (currentSongIndex + 1) % filteredSongs.length;
    loadSong(currentSongIndex);
}

// Play the previous song in the list
function playPreviousSong() {
    currentSongIndex = (currentSongIndex - 1 + filteredSongs.length) % filteredSongs.length;
    loadSong(currentSongIndex);
}

// Update the progress bar as the song plays
function updateProgress() {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTimeElem.textContent = formatTime(audio.currentTime);
}

// Format time from seconds to MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Event listeners for player controls
playPauseButton.addEventListener("click", togglePlayPause);
document.getElementById("next").addEventListener("click", playNextSong);
document.getElementById("prev").addEventListener("click", playPreviousSong);

// Update progress bar when user interacts with it
progressBar.addEventListener("input", () => {
    if (audio) {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
    }
});

// Initialize player
main();

document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
})

document.querySelector(".cross").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-103%"
})

