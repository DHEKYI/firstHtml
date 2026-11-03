// 1. Select the DOM elements
const minutesDisplay = document.getElementById("minutes");
const secondsDisplay = document.getElementById("seconds");
const startButton = document.getElementById("start-btn");
const resetButton = document.getElementById("reset-btn");
const modeButtons = document.querySelectorAll(".mode-btn");

// 2. Define state variables
let timeLeft = 3000; // 50 minutes in seconds (50 * 60)
let timerId = null;  // Keeps track of the interval so we can pause/clear it
let isRunning = false;

modeButtons.forEach(button =>{
    button.addEventListener("click", function(){
        clearInterval(timerId);
        isRunning = false;
        startButton.textContent = "Start";
        modeButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        const seconds = parseInt(this.getAttribute("data-time"));
        timeLeft = seconds;
        updateDisplay();
    });
});

// 3. Helper function to update the HTML display
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formattedMinutes = String(minutes).padStart(2, "0");
    const formattedSeconds = String(seconds).padStart(2, "0");

    // Only trigger the bounce on seconds if the number actually changes
    if (secondsDisplay.textContent !== formattedSeconds) {
        secondsDisplay.textContent = formattedSeconds;
        
        // Restart the CSS animation
        secondsDisplay.classList.remove("bounce");
        void secondsDisplay.offsetWidth; // Force a browser reflow/repaint to restart animation
        secondsDisplay.classList.add("bounce");
    }

    // Only trigger the bounce on minutes when a full minute flips
    if (minutesDisplay.textContent !== formattedMinutes) {
        minutesDisplay.textContent = formattedMinutes;
        
        minutesDisplay.classList.remove("bounce");
        void minutesDisplay.offsetWidth;
        minutesDisplay.classList.add("bounce");
    }
}

// 4. Function to handle the countdown tick
function startTimer() {
    if (isRunning) return; // Prevent multiple intervals from stacking if clicked twice

    isRunning = true;
    startButton.textContent = "PAUSE"; // Optional: Change button text

    timerId = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay();
        } else {
            clearInterval(timerId);
            isRunning = false;
            alert("Pomodoro session complete!");
            startButton.textContent = "START";
        }
    }, 1000); // Runs every 1000ms (1 second)
}

// 5. Attach the event listener to the Start button
startButton.addEventListener("click", function() {
    if (!isRunning) {
        startTimer();
    } else {
        // Simple pause functionality
        clearInterval(timerId);
        isRunning = false;
        startButton.textContent = "START";
    }
});
resetButton.addEventListener("click", function() {
    clearInterval(timerId);            // Stop any active countdown loop
    isRunning = false;                 // Mark the timer as not running
    timeLeft = 3000;                   // Reset time back to 25 minutes (1500 seconds)
    updateDisplay();                   // Refresh the screen numbers
    startButton.textContent = "START";   // Reset the start button text
});

// Initialize the display on page load
updateDisplay();
