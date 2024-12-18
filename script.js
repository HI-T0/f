// Show Emoji Gallery
function showEmojiGallery() {
    const gallery = document.querySelector('.emoji-gallery');
    gallery.style.display = gallery.style.display === 'grid' ? 'none' : 'grid';
}

// Add a new habit card
function addHabit(emoji, title) {
    const habitCard = document.createElement('div');
    habitCard.classList.add('habit-card');
    
    habitCard.innerHTML = `
        <div class="emoji">${emoji}</div>
        <div class="habit-title">${title}</div>
        <div class="habit-setup">
            <label for="duration">Duration (in months):</label>
            <input type="number" id="duration" value="1" min="1">
            <button onclick="setupHabit(this, '${emoji}', '${title}')">Create Habit</button>
        </div>
    `;

    const dashboard = document.querySelector('.dashboard');
    dashboard.appendChild(habitCard);

    const setupButton = habitCard.querySelector('button');
    setupButton.onclick = () => setupHabit(habitCard, emoji, title);
}

// Setup habit with selected duration
function setupHabit(habitCard, emoji, title) {
    const durationInput = habitCard.querySelector('#duration');
    const duration = parseInt(durationInput.value);
    const habitSetup = habitCard.querySelector('.habit-setup');
    habitSetup.style.display = 'none';

    createHabitBoxes(habitCard, emoji, title, duration);
}

// Create habit boxes based on the selected duration
function createHabitBoxes(habitCard, emoji, title, duration) {
    const boxesContainer = document.createElement('div');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    const progressBarFill = document.createElement('div');
    progressBarFill.classList.add('progress-bar-fill');
    progressBar.appendChild(progressBarFill);

    const streak = document.createElement('div');
    streak.classList.add('streak');
    streak.innerHTML = `Streak: 0`;

    habitCard.appendChild(streak);
    habitCard.appendChild(progressBar);

    let currentMonth = 0;

    // Create boxes for the selected number of months
    const allMonths = [];

    for (let month = 1; month <= duration; month++) {
        const monthBox = document.createElement('div');
        monthBox.classList.add('month-box');
        monthBox.innerHTML = `<span>Month ${month}</span>`;

        const daysInMonth = new Date(2024, month, 0).getDate(); // Get days in the month
        const dayContainer = document.createElement('div');
        const dayCheckboxes = [];

        // Create checkboxes for each day in the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCheckbox = document.createElement('input');
            dayCheckbox.type = 'checkbox';
            dayCheckbox.classList.add(`month-${month}`);
            dayCheckbox.addEventListener('change', () => {
                updateProgressBar(habitCard, currentMonth);
            });
            dayCheckboxes.push(dayCheckbox);
            dayContainer.appendChild(dayCheckbox);
        }

        monthBox.appendChild(dayContainer);
        allMonths.push(monthBox);
    }

    // Add all months to the card, but only show the first one initially
    allMonths.forEach((monthBox, index) => {
        if (index !== currentMonth) {
            monthBox.style.display = 'none'; // Hide the other months
        }
        boxesContainer.appendChild(monthBox);
    });

    habitCard.appendChild(boxesContainer);

    // Add logic to show the next month when the current one is completed
    const checkCompletion = (monthIndex) => {
        const currentMonthBox = allMonths[monthIndex];
        const checkboxes = currentMonthBox.querySelectorAll('input');
        const checkedBoxes = currentMonthBox.querySelectorAll('input:checked').length;

        if (checkedBoxes === checkboxes.length) {
            // All boxes checked for the current month
            if (monthIndex + 1 < allMonths.length) {
                // Hide current month and show the next one
                allMonths[monthIndex].style.display = 'none';
                allMonths[monthIndex + 1].style.display = 'block';
                currentMonth++; // Move to the next month
            }
        }
    };

    // Update the progress bar based on the checkboxes
    function updateProgressBar(habitCard, currentMonth) {
        const totalBoxes = habitCard.querySelectorAll(`.month-${currentMonth + 1}`).length;
        const checkedBoxes = habitCard.querySelectorAll(`.month-${currentMonth + 1}:checked`).length;
        const progress = (checkedBoxes / totalBoxes) * 100;

        const progressBarFill = habitCard.querySelector('.progress-bar-fill');
        progressBarFill.style.width = `${progress}%`;

        const streak = habitCard.querySelector('.streak');
        streak.innerHTML = `Streak: ${checkedBoxes}`;

        checkCompletion(currentMonth);
    }
}

// Example: Adding habits with emojis
document.querySelector('.add-habit-btn').addEventListener('click', showEmojiGallery);
