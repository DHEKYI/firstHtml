document.addEventListener('DOMContentLoaded', () => {
    // Select HTML elements for user name customization
    const pageTitle = document.getElementById('page-title');
    const nameInput = document.getElementById('name-input');
    const saveNameBtn = document.getElementById('save-name-btn');
    const nameContainer = document.getElementById('name-input-container');

    // Select HTML elements for timer functionality
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const modeBtns = document.querySelectorAll('.mode-btn');

    // Timer state variables
    let countdown;
    let timeLeft = 3000; // Default to 50 minutes (in seconds)
    let isRunning = false;

    // --- User Name Feature Logic ---

    // Function to update header text and hide the input container once set
    function applyUserName(name) {
        if (name && name.trim() !== '') {
            pageTitle.textContent = `${name}'s Pomodoro Space`;
            if (nameContainer) {
                nameContainer.style.display = 'none';
            }
        } else {
            pageTitle.textContent = 'Pomodoro Space';
        }
    }

    // 1. Check if a valid name was previously saved (ignoring accidental single letters like "f")
    const savedName = localStorage.getItem('pomodoroUserName');
    if (savedName && savedName.trim().length > 1) {
        applyUserName(savedName);
    } else {
        // Automatically clear out bad or single-letter data from storage
        localStorage.removeItem('pomodoroUserName');
    }

    // 2. When the user clicks "Set Name"
    if (saveNameBtn && nameInput) {
        saveNameBtn.addEventListener('click', () => {
            const enteredName = nameInput.value;
            if (enteredName && enteredName.trim().length > 1) {
                localStorage.setItem('pomodoroUserName', enteredName);
                applyUserName(enteredName);
            } else {
                alert('Please enter a valid name with at least 2 characters.');
            }
        });
    }

    // 3. Optional: Clear name and bring back the input box if a reset button exists
    const resetNameBtn = document.getElementById('reset-name-btn');
    if (resetNameBtn) {
        resetNameBtn.addEventListener('click', () => {
            localStorage.removeItem('pomodoroUserName');
            location.reload();
        });
    }

    // --- Timer Feature Logic ---

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        minutesDisplay.textContent = String(minutes).padStart(2, '0');
        secondsDisplay.textContent = String(seconds).padStart(2, '0');
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startBtn.textContent = 'Pause';
            
            countdown = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateDisplay();
                } else {
                    clearInterval(countdown);
                    isRunning = false;
                    startBtn.textContent = 'Start';
                    alert('Pomodoro session completed!');
                }
            }, 1000);
        } else {
            clearInterval(countdown);
            isRunning = false;
            startBtn.textContent = 'Start';
        }
    }

    function resetTimer() {
        clearInterval(countdown);
        isRunning = false;
        startBtn.textContent = 'Start';
        
        // Find active mode button to reset to the correct duration
        const activeBtn = document.querySelector('.mode-btn.active');
        if (activeBtn) {
            timeLeft = parseInt(activeBtn.getAttribute('data-time'));
        }
        updateDisplay();
    }

    // Event Listeners for Timer Buttons
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);

    // Mode Selector Logic (Switching between Pomodoro and Break)
    modeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            modeBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            clearInterval(countdown);
            isRunning = false;
            startBtn.textContent = 'Start';
            
            timeLeft = parseInt(e.target.getAttribute('data-time'));
            updateDisplay();
        });
    });

    // Initialize display on page load
    updateDisplay();
});