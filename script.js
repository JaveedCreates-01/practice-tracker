// ==================================================
// MY PERSONAL PRACTICE TRACKER
// ==================================================


// ==================================================
// LOAD DATA
// ==================================================

let data =
    JSON.parse(
        localStorage.getItem("practiceTracker")
    ) || {

        // Student can add their own skills

        practices: [],

        // Stores completed days

        completed: {},

        // Stores daily notes

        notes: {},

        // Stores monthly goals

        goals: []

    };



// ==================================================
// CURRENT MONTH
// ==================================================

let currentDate = new Date();

currentDate.setDate(1);



// ==================================================
// SAVE DATA
// ==================================================

function saveData() {

    localStorage.setItem(
        "practiceTracker",
        JSON.stringify(data)
    );

}



// ==================================================
// DATE KEY
// ==================================================

function getDateKey(
    year,
    month,
    day
) {

    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

}



// ==================================================
// DAYS IN MONTH
// ==================================================

function getDaysInMonth(
    year,
    month
) {

    return new Date(
        year,
        month + 1,
        0
    ).getDate();

}



// ==================================================
// DISPLAY MONTH
// ==================================================

function displayMonth() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();


    const title =
        currentDate.toLocaleString(
            "en-IN",
            {
                month: "long",
                year: "numeric"
            }
        );


    document.getElementById(
        "monthTitle"
    ).textContent = title;

}



// ==================================================
// CREATE TABLE
// ==================================================

function createTable() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

    const days =
        getDaysInMonth(
            year,
            month
        );


    const header =
        document.getElementById(
            "tableHeader"
        );


    const body =
        document.getElementById(
            "tableBody"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    // Clear previous table

    header.innerHTML = `
        <th>
            Skill / Practice
        </th>
    `;


    body.innerHTML = "";



    // ==============================================
    // NO SKILLS
    // ==============================================

    if (
        data.practices.length === 0
    ) {

        emptyMessage.style.display =
            "block";

        document.getElementById(
            "trackerTable"
        ).style.display =
            "none";

        return;

    }


    emptyMessage.style.display =
        "none";


    document.getElementById(
        "trackerTable"
    ).style.display =
        "table";



    // ==============================================
    // CREATE DAY HEADERS
    // ==============================================

    for (
        let day = 1;
        day <= days;
        day++
    ) {

        const th =
            document.createElement(
                "th"
            );


        th.textContent =
            day;


        header.appendChild(th);

    }



    // ==============================================
    // CREATE SKILL ROWS
    // ==============================================

    data.practices.forEach(
        practice => {


            const row =
                document.createElement(
                    "tr"
                );



            // ======================================
            // SKILL NAME CELL
            // ======================================

            const nameCell =
                document.createElement(
                    "td"
                );


            const skillContainer =
                document.createElement(
                    "div"
                );


            skillContainer.className =
                "skill-name";



            const skillTitle =
                document.createElement(
                    "span"
                );


            skillTitle.className =
                "skill-title";


            skillTitle.textContent =
                practice.name;



            // ======================================
            // DELETE BUTTON
            // ======================================

            const deleteButton =
                document.createElement(
                    "button"
                );


            deleteButton.className =
                "delete-skill";


            deleteButton.textContent =
                "✕";


            deleteButton.title =
                "Delete skill";



            deleteButton.addEventListener(
                "click",
                function(event) {

                    // IMPORTANT:
                    // Don't trigger table cell click

                    event.stopPropagation();


                    deleteSkill(
                        practice.id
                    );

                }
            );



            skillContainer.appendChild(
                skillTitle
            );


            skillContainer.appendChild(
                deleteButton
            );


            nameCell.appendChild(
                skillContainer
            );


            row.appendChild(
                nameCell
            );



            // ======================================
            // CREATE DAILY CELLS
            // ======================================

            for (
                let day = 1;
                day <= days;
                day++
            ) {


                const cell =
                    document.createElement(
                        "td"
                    );


                cell.classList.add(
                    "practice-cell"
                );



                const dateKey =
                    getDateKey(
                        year,
                        month,
                        day
                    );



                const completionKey =
                    `${practice.id}-${dateKey}`;



                // =================================
                // IF COMPLETED
                // =================================

                if (
                    data.completed[
                        completionKey
                    ]
                ) {

                    cell.classList.add(
                        "completed"
                    );

                    cell.textContent =
                        "✓";

                }



                // =================================
                // HIGHLIGHT TODAY
                // =================================

                const today =
                    new Date();


                if (

                    today.getFullYear()
                    === year

                    &&

                    today.getMonth()
                    === month

                    &&

                    today.getDate()
                    === day

                ) {

                    cell.classList.add(
                        "today-cell"
                    );

                }



                // =================================
                // CLICK DAY
                // =================================

                cell.addEventListener(
                    "click",
                    function() {

                        togglePractice(
                            completionKey
                        );

                    }
                );



                row.appendChild(
                    cell
                );

            }


            body.appendChild(
                row
            );

        }
    );

}



// ==================================================
// DELETE SKILL
// ==================================================

function deleteSkill(
    skillId
) {


    const skill =
        data.practices.find(
            practice =>
                practice.id === skillId
        );


    if (!skill) {

        return;

    }



    const confirmDelete =
        confirm(
            `Delete "${skill.name}"?\n\nAll progress for this skill will also be removed.`
        );


    if (!confirmDelete) {

        return;

    }



    // ==============================================
    // REMOVE SKILL
    // ==============================================

    data.practices =
        data.practices.filter(
            practice =>
                practice.id !== skillId
        );



    // ==============================================
    // REMOVE OLD COMPLETION DATA
    // ==============================================

    Object.keys(
        data.completed
    ).forEach(
        key => {

            if (
                key.startsWith(
                    `${skillId}-`
                )
            ) {

                delete data.completed[
                    key
                ];

            }

        }
    );



    saveData();

    render();

}



// ==================================================
// COMPLETE / UNCOMPLETE PRACTICE
// ==================================================

function togglePractice(
    key
) {


    if (
        data.completed[key]
    ) {

        delete data.completed[key];

    }

    else {

        data.completed[key] =
            true;

    }


    saveData();

    render();

}



// ==================================================
// ADD SKILL
// ==================================================

document
    .getElementById("addPractice")
    .addEventListener(
        "click",
        addSkill
    );



document
    .getElementById("practiceInput")
    .addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter"
            ) {

                addSkill();

            }

        }
    );



function addSkill() {


    const input =
        document.getElementById(
            "practiceInput"
        );


    const skillName =
        input.value.trim();



    // ==============================================
    // EMPTY CHECK
    // ==============================================

    if (!skillName) {

        alert(
            "Please enter a skill."
        );

        input.focus();

        return;

    }



    // ==============================================
    // DUPLICATE CHECK
    // ==============================================

    const alreadyExists =
        data.practices.some(
            practice =>
                practice.name.toLowerCase()
                ===
                skillName.toLowerCase()
        );


    if (alreadyExists) {

        alert(
            "This skill already exists."
        );

        input.focus();

        return;

    }



    // ==============================================
    // ADD SKILL
    // ==============================================

    data.practices.push({

        id:
            Date.now(),

        name:
            skillName

    });



    input.value = "";



    saveData();

    render();

    input.focus();

}



// ==================================================
// DAILY NOTES
// ==================================================

function loadNotes() {


    const today =
        new Date();


    const key =
        getDateKey(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    document.getElementById(
        "dailyNotes"
    ).value =
        data.notes[key] || "";

}



document
    .getElementById("dailyNotes")
    .addEventListener(
        "input",
        function(event) {


            const today =
                new Date();


            const key =
                getDateKey(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate()
                );


            data.notes[key] =
                event.target.value;


            saveData();


            document.getElementById(
                "saveMessage"
            ).textContent =
                "Saved ✓";


        }
    );



// ==================================================
// MONTHLY GOALS
// ==================================================

function displayGoals() {


    const container =
        document.getElementById(
            "goalsContainer"
        );


    container.innerHTML = "";



    data.goals.forEach(
        function(goal, index) {


            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "goal";



            // ======================================
            // CHECKBOX
            // ======================================

            const checkbox =
                document.createElement(
                    "input"
                );


            checkbox.type =
                "checkbox";


            checkbox.checked =
                goal.completed;



            // ======================================
            // GOAL INPUT
            // ======================================

            const input =
                document.createElement(
                    "input"
                );


            input.type =
                "text";


            input.value =
                goal.text;


            input.placeholder =
                "Monthly goal...";



            // ======================================
            // DELETE GOAL
            // ======================================

            const remove =
                document.createElement(
                    "button"
                );


            remove.className =
                "remove-goal";


            remove.textContent =
                "×";



            // ======================================
            // COMPLETED STYLE
            // ======================================

            if (
                goal.completed
            ) {

                div.classList.add(
                    "completed"
                );

            }



            // ======================================
            // EVENTS
            // ======================================

            checkbox.addEventListener(
                "change",
                function() {


                    goal.completed =
                        checkbox.checked;


                    saveData();

                    displayGoals();

                }
            );



            input.addEventListener(
                "input",
                function() {


                    goal.text =
                        input.value;


                    saveData();

                }
            );



            remove.addEventListener(
                "click",
                function() {


                    data.goals.splice(
                        index,
                        1
                    );


                    saveData();

                    displayGoals();

                }
            );



            div.appendChild(
                checkbox
            );


            div.appendChild(
                input
            );


            div.appendChild(
                remove
            );


            container.appendChild(
                div
            );

        }
    );

}



// ==================================================
// ADD GOAL
// ==================================================

document
    .getElementById("addGoal")
    .addEventListener(
        "click",
        function() {


            data.goals.push({

                text:
                    "",

                completed:
                    false

            });


            saveData();

            displayGoals();


        }
    );



// ==================================================
// TODAY'S STATISTICS
// ==================================================

function updateStatistics() {


    const today =
        new Date();


    const todayKey =
        getDateKey(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );


    let completed =
        0;



    data.practices.forEach(
        function(practice) {


            const key =
                `${practice.id}-${todayKey}`;


            if (
                data.completed[key]
            ) {

                completed++;

            }

        }
    );



    const total =
        data.practices.length;



    const percentage =
        total === 0
            ? 0
            : Math.round(
                (
                    completed /
                    total
                ) * 100
            );



    document.getElementById(
        "todayProgress"
    ).textContent =
        `${percentage}%`;



    document.getElementById(
        "todayCompleted"
    ).textContent =
        `${completed} / ${total}`;



    updateMonthlyCount();

    updateStreak();

}



// ==================================================
// MONTHLY COMPLETION COUNT
// ==================================================

function updateMonthlyCount() {


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    const days =
        getDaysInMonth(
            year,
            month
        );


    let count =
        0;



    data.practices.forEach(
        function(practice) {


            for (
                let day = 1;
                day <= days;
                day++
            ) {


                const dateKey =
                    getDateKey(
                        year,
                        month,
                        day
                    );


                const key =
                    `${practice.id}-${dateKey}`;


                if (
                    data.completed[key]
                ) {

                    count++;

                }

            }

        }
    );



    document.getElementById(
        "monthlyCompleted"
    ).textContent =
        count;

}



// ==================================================
// CURRENT STREAK
// ==================================================

function updateStreak() {


    if (
        data.practices.length === 0
    ) {

        document.getElementById(
            "currentStreak"
        ).textContent =
            "0 days";

        return;

    }



    let streak =
        0;


    const date =
        new Date();



    while (true) {


        const dateKey =
            getDateKey(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );



        const completedAll =
            data.practices.every(
                function(practice) {


                    return data.completed[
                        `${practice.id}-${dateKey}`
                    ];

                }
            );



        if (!completedAll) {

            break;

        }



        streak++;



        date.setDate(
            date.getDate() - 1
        );



        if (
            streak > 3650
        ) {

            break;

        }

    }



    document.getElementById(
        "currentStreak"
    ).textContent =
        `${streak} days`;

}



// ==================================================
// PROGRESS ANALYSIS
// ==================================================

function updateAnalysis() {


    const year =
        currentDate.getFullYear();


    const month =
        currentDate.getMonth();


    const days =
        getDaysInMonth(
            year,
            month
        );


    const totalPossible =
        data.practices.length *
        days;


    let totalCompleted =
        0;



    // ==============================================
    // COUNT COMPLETED
    // ==============================================

    data.practices.forEach(
        function(practice) {


            for (
                let day = 1;
                day <= days;
                day++
            ) {


                const date =
                    getDateKey(
                        year,
                        month,
                        day
                    );


                const key =
                    `${practice.id}-${date}`;


                if (
                    data.completed[key]
                ) {

                    totalCompleted++;

                }

            }

        }
    );



    const percentage =
        totalPossible === 0
            ? 0
            : Math.round(
                (
                    totalCompleted /
                    totalPossible
                ) * 100
            );



    // ==============================================
    // MAIN MESSAGE
    // ==============================================

    let message;



    if (
        data.practices.length === 0
    ) {

        message =
            "Add the skills you want to learn above and start tracking your practice.";

    }

    else if (
        percentage === 0
    ) {

        message =
            "Start today. Even 30 minutes of practice is progress.";

    }

    else if (
        percentage < 50
    ) {

        message =
            `You completed ${percentage}% of your possible practice sessions. Focus on consistency.`;

    }

    else if (
        percentage < 80
    ) {

        message =
            `You are at ${percentage}%. Your learning routine is developing. Keep going!`;

    }

    else {

        message =
            `Excellent! You completed ${percentage}% of your possible practice sessions this month.`;

    }



    document.getElementById(
        "analysisMessage"
    ).textContent =
        message;



    // ==============================================
    // INDIVIDUAL SKILL ANALYSIS
    // ==============================================

    const container =
        document.getElementById(
            "habitAnalysis"
        );


    container.innerHTML = "";



    data.practices.forEach(
        function(practice) {


            let count =
                0;



            for (
                let day = 1;
                day <= days;
                day++
            ) {


                const date =
                    getDateKey(
                        year,
                        month,
                        day
                    );


                const key =
                    `${practice.id}-${date}`;


                if (
                    data.completed[key]
                ) {

                    count++;

                }

            }



            const percent =
                Math.round(
                    (
                        count /
                        days
                    ) * 100
                );



            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "analysis-item";



            item.innerHTML = `

                <strong>
                    ${escapeHtml(
                        practice.name
                    )}
                </strong>

                <span>
                    ${count} / ${days}
                    days completed
                    (${percent}%)
                </span>

            `;



            container.appendChild(
                item
            );

        }
    );

}



// ==================================================
// SECURITY / HTML TEXT
// ==================================================

function escapeHtml(
    text
) {


    return text.replace(
        /[&<>"']/g,
        function(character) {


            const entities = {

                "&": "&amp;",

                "<": "&lt;",

                ">": "&gt;",

                '"': "&quot;",

                "'": "&#039;"

            };


            return entities[
                character
            ];

        }
    );

}



// ==================================================
// PREVIOUS MONTH
// ==================================================

document
    .getElementById("previousMonth")
    .addEventListener(
        "click",
        function() {


            currentDate.setMonth(
                currentDate.getMonth() - 1
            );


            render();

        }
    );



// ==================================================
// NEXT MONTH
// ==================================================

document
    .getElementById("nextMonth")
    .addEventListener(
        "click",
        function() {


            currentDate.setMonth(
                currentDate.getMonth() + 1
            );


            render();

        }
    );



// ==================================================
// RENDER EVERYTHING
// ==================================================

function render() {


    displayMonth();

    createTable();

    loadNotes();

    displayGoals();

    updateStatistics();

    updateAnalysis();

}



// ==================================================
// START APPLICATION
// ==================================================

render();