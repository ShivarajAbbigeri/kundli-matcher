const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
];

// -------------------------
// API
// -------------------------

const API_KEY =
    "Vp1hI2roUN29ptPl8xMAD4IxbjDPS1evalsmPC7L";

const API_URL =
    "https://json.freeastrologyapi.com/match-making/ashtakoot-score";

// -------------------------
// INIT
// -------------------------

window.onload = function () {

    populateDOBDropdowns();

    populateDistrictDropdowns();

    setupGroomForm();

    setupCandidateForm();

    setupEditProfileButton();

    initializeProfileUI();

};

// -------------------------
// DOB
// -------------------------

function populateDOBDropdowns() {

    populateDays("groom-day");
    populateMonths("groom-month");
    populateYears("groom-year");

    populateDays("candidate-day");
    populateMonths("candidate-month");
    populateYears("candidate-year");

}

function populateDays(selectId) {

    const select =
        document.getElementById(selectId);

    for (let day = 1; day <= 31; day++) {

        const option =
            document.createElement("option");

        option.value = day;

        option.textContent = day;

        select.appendChild(option);

    }

}

function populateMonths(selectId) {

    const select =
        document.getElementById(selectId);

    MONTHS.forEach((month, index) => {

        const option =
            document.createElement("option");

        option.value = index + 1;

        option.textContent = month;

        select.appendChild(option);

    });

}

function populateYears(selectId) {

    const select =
        document.getElementById(selectId);

    const currentYear =
        new Date().getFullYear();

    for (
        let year = currentYear;
        year >= 1950;
        year--
    ) {

        const option =
            document.createElement("option");

        option.value = year;

        option.textContent = year;

        select.appendChild(option);

    }

}

// -------------------------
// DISTRICTS
// -------------------------

function populateDistrictDropdowns() {

    populateDistricts("groom-district");

    populateDistricts("candidate-district");

}

function populateDistricts(selectId) {

    const select =
        document.getElementById(selectId);

    KARNATAKA_DISTRICTS.forEach(
        (district) => {

            const option =
                document.createElement("option");

            option.value = district.name;

            option.textContent =
                district.name;

            select.appendChild(option);

        }
    );

    select.value = "Bengaluru Urban";

}

function getDistrictData(districtName) {

    return KARNATAKA_DISTRICTS.find(
        district =>
            district.name === districtName
    );

}

// -------------------------
// PROFILE
// -------------------------

function buildProfile(prefix) {

    const districtName =
        document.getElementById(
            `${prefix}-district`
        ).value || "Bengaluru Urban";

    const districtData =
        getDistrictData(districtName);

    return {

        name:
            document.getElementById(
                `${prefix}-name`
            ).value || "",

        day:
            parseInt(
                document.getElementById(
                    `${prefix}-day`
                ).value
            ),

        month:
            parseInt(
                document.getElementById(
                    `${prefix}-month`
                ).value
            ),

        year:
            parseInt(
                document.getElementById(
                    `${prefix}-year`
                ).value
            ),

        hour:
            parseInt(
                document.getElementById(
                    `${prefix}-hour`
                ).value
            ),

        minute:
            parseInt(
                document.getElementById(
                    `${prefix}-minute`
                ).value
            ),

        district: districtName,

        lat: districtData.lat,

        lon: districtData.lon,

        timezone: 5.5

    };

}

function validateProfile(profile) {

    if (
        !profile.day ||
        !profile.month ||
        !profile.year
    ) {

        return false;

    }

    if (
        profile.hour === null ||
        profile.hour === undefined ||
        isNaN(profile.hour)
    ) {

        return false;

    }

    if (
        profile.minute === null ||
        profile.minute === undefined ||
        isNaN(profile.minute)
    ) {

        return false;

    }

    return true;

}

// -------------------------
// GROOM
// -------------------------

function setupGroomForm() {

    const form =
        document.getElementById(
            "groom-form"
        );

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            saveGroomProfile();

        }
    );

}

function saveGroomProfile() {

    const profile =
        buildProfile("groom");

    if (!validateProfile(profile)) {

        showProfileStatus(
            "Please complete details",
            "error"
        );

        return;

    }

    localStorage.setItem(
        "groomProfile",
        JSON.stringify(profile)
    );

    showProfileStatus(
        "Profile Saved"
    );

    showProfileSummary(profile);

}

function loadSavedProfile() {

    const saved =
        localStorage.getItem(
            "groomProfile"
        );

    if (!saved) {
        return;
    }

    const profile =
        JSON.parse(saved);

    document.getElementById(
        "groom-name"
    ).value = profile.name || "";

    document.getElementById(
        "groom-day"
    ).value = profile.day;

    document.getElementById(
        "groom-month"
    ).value = profile.month;

    document.getElementById(
        "groom-year"
    ).value = profile.year;

    document.getElementById(
        "groom-hour"
    ).value = profile.hour;

    document.getElementById(
        "groom-minute"
    ).value = profile.minute;

    document.getElementById(
        "groom-district"
    ).value = profile.district;

}

// -------------------------
// PROFILE UI
// -------------------------

function initializeProfileUI() {

    const saved =
        localStorage.getItem(
            "groomProfile"
        );

    if (saved) {

        const profile =
            JSON.parse(saved);

        loadSavedProfile();

        showProfileSummary(profile);

    } else {

        showProfileForm();

    }

}

function showProfileForm() {

    document
        .getElementById("groom-form")
        .classList.remove("hidden");

    document
        .getElementById("profile-summary")
        .classList.add("hidden");

}

function hideProfileForm() {

    document
        .getElementById("groom-form")
        .classList.add("hidden");

}

function showProfileSummary(profile) {

    hideProfileForm();

    document
        .getElementById("profile-summary")
        .classList.remove("hidden");

    document.getElementById(
        "summary-name"
    ).textContent =
        profile.name || "Unnamed";

    document.getElementById(
        "summary-dob"
    ).textContent =
        `${profile.day} ${MONTHS[profile.month - 1]} ${profile.year}`;

    document.getElementById(
        "summary-time"
    ).textContent =
        `${profile.hour}:${profile.minute}`;

    document.getElementById(
        "summary-district"
    ).textContent =
        profile.district;

}

function setupEditProfileButton() {

    document
        .getElementById(
            "edit-profile-btn"
        )
        .addEventListener(
            "click",
            function () {

                showProfileForm();

            }
        );

}

// -------------------------
// CANDIDATE
// -------------------------

function setupCandidateForm() {

    const form =
        document.getElementById(
            "candidate-form"
        );

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            handleCandidateMatch();

        }
    );

}

async function handleCandidateMatch() {

    const candidate =
        buildProfile("candidate");

    if (!validateProfile(candidate)) {

        showCandidateStatus(
            "Please complete details",
            "error"
        );

        return;

    }

    const saved =
        localStorage.getItem(
            "groomProfile"
        );

    if (!saved) {

        showCandidateStatus(
            "Please save your profile first",
            "error"
        );

        return;

    }

    const groom =
        JSON.parse(saved);

    try {

        setLoadingState(true);

        const result =
            await matchHoroscope(
                groom,
                candidate
            );

        renderMatchResult(result);

        showCandidateStatus(
            "Match calculated"
        );

    } catch (error) {

        console.error(error);

        showCandidateStatus(
            "API request failed",
            "error"
        );

    } finally {

        setLoadingState(false);

    }

}

// -------------------------
// API CALL
// -------------------------

function profileToAPIPayload(profile) {

    return {

        year: profile.year,

        month: profile.month,

        date: profile.day,

        hours: profile.hour,

        minutes: profile.minute,

        seconds: 0,

        latitude: profile.lat,

        longitude: profile.lon,

        timezone: profile.timezone

    };

}

async function matchHoroscope(
    groom,
    candidate
) {

    const payload = {

        female:
            profileToAPIPayload(
                candidate
            ),

        male:
            profileToAPIPayload(
                groom
            ),

        config: {

            observation_point:
                "topocentric",

            language: "en",

            ayanamsha: "lahiri"

        }

    };

    const response =
        await fetch(
            API_URL,
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "x-api-key":
                        API_KEY

                },

                body: JSON.stringify(
                    payload
                )

            }
        );

    if (!response.ok) {

        throw new Error(
            "API request failed"
        );

    }

    return await response.json();

}

// -------------------------
// RESULT UI
// -------------------------

function renderMatchResult(result) {

    const output =
        result.output;

    const score =
        output.total_score;

    const outOf =
        output.out_of;

    document.getElementById(
        "result-score"
    ).textContent =
        `${score} / ${outOf}`;

    const messageElement =
        document.getElementById(
            "result-message"
        );

    let message =
        "Average Match";

    let className =
        "verdict-average";

    if (score >= 28) {

        message =
            "Excellent Match";

        className =
            "verdict-good";

    } else if (score >= 18) {

        message =
            "Good Match";

        className =
            "verdict-good";

    } else if (score >= 10) {

        message =
            "Average Match";

        className =
            "verdict-average";

    } else {

        message =
            "Low Compatibility";

        className =
            "verdict-low";

    }

    messageElement.textContent =
        message;

    messageElement.className =
        className;

    renderDetailedScores(output);

}

function renderDetailedScores(output) {

    const detailsSection =
        document.getElementById(
            "details-section"
        );

    const container =
        document.getElementById(
            "details-container"
        );

    detailsSection.classList.remove(
        "hidden"
    );

    container.innerHTML = "";

    const rows = [

        {
            name: "Varna",
            score:
                output.varna_kootam
                    .score,
            outOf:
                output.varna_kootam
                    .out_of
        },

        {
            name: "Vasya",
            score:
                output.vasya_kootam
                    .score,
            outOf:
                output.vasya_kootam
                    .out_of
        },

        {
            name: "Tara",
            score:
                output.tara_kootam
                    .score,
            outOf:
                output.tara_kootam
                    .out_of
        },

        {
            name: "Yoni",
            score:
                output.yoni_kootam
                    .score,
            outOf:
                output.yoni_kootam
                    .out_of
        },

        {
            name: "Graha Maitri",
            score:
                output
                    .graha_maitri_kootam
                    .score,
            outOf:
                output
                    .graha_maitri_kootam
                    .out_of
        },

        {
            name: "Gana",
            score:
                output.gana_kootam
                    .score,
            outOf:
                output.gana_kootam
                    .out_of
        },

        {
            name: "Rasi",
            score:
                output.rasi_kootam
                    .score,
            outOf:
                output.rasi_kootam
                    .out_of
        },

        {
            name: "Nadi",
            score:
                output.nadi_kootam
                    .score,
            outOf:
                output.nadi_kootam
                    .out_of
        }

    ];

    rows.forEach((row) => {

        const div =
            document.createElement("div");

        div.className =
            "detail-row";

        div.innerHTML = `
            <span>${row.name}</span>
            <span>${row.score} / ${row.outOf}</span>
        `;

        container.appendChild(div);

    });

}

// -------------------------
// LOADING
// -------------------------

function setLoadingState(isLoading) {

    const button =
        document.querySelector(
            "#candidate-form button"
        );

    if (isLoading) {

        button.disabled = true;

        button.textContent =
            "Checking...";

    } else {

        button.disabled = false;

        button.textContent =
            "Check Match";

    }

}

// -------------------------
// STATUS
// -------------------------

function showProfileStatus(
    message,
    type = "success"
) {

    const status =
        document.getElementById(
            "profile-status"
        );

    status.textContent = message;

    status.style.color =
        type === "error"
            ? "crimson"
            : "green";

}

function showCandidateStatus(
    message,
    type = "success"
) {

    const status =
        document.getElementById(
            "candidate-status"
        );

    status.textContent = message;

    status.style.color =
        type === "error"
            ? "crimson"
            : "green";

}