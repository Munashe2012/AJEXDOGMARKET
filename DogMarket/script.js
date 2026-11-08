let listings = [];

let currentUser = null;

let currentRole = null;

let likedListings = [];

let reportedListing = null;


/* LOGIN */

function login() {

    const name =
        document.getElementById("username").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value.trim();


    if (!name || !email || !password) {

        showToast("Please complete all fields.");

        return;
    }


    currentUser = {
        name: name,
        email: email
    };


    localStorage.setItem(
        "ajexUser",
        JSON.stringify(currentUser)
    );


    document
        .getElementById("loginScreen")
        .classList.add("hidden");


    document
        .getElementById("roleScreen")
        .classList.remove("hidden");
}


/* ROLE */

function selectRole(role) {

    currentRole = role;

    localStorage.setItem(
        "ajexRole",
        role
    );


    document
        .getElementById("roleScreen")
        .classList.add("hidden");


    document
        .getElementById("app")
        .classList.remove("hidden");


    updateUserInterface();

    renderAll();
}


function updateUserInterface() {

    document.getElementById("userBadge").innerText =
        currentUser.name +
        " • " +
        currentRole.toUpperCase();


    const canPost =
        currentRole === "seller" ||
        currentRole === "both";


    document.getElementById("headerAddBtn").style.display =
        canPost ? "block" : "none";


    document.getElementById("heroAddBtn").style.display =
        canPost ? "inline-block" : "none";

}


/* OPEN POST */

function openPost(type = "dog") {

    const canPost =
        currentRole === "seller" ||
        currentRole === "both";


    if (!canPost) {

        showToast(
            "Only sellers can add listings."
        );

        return;
    }


    document
        .getElementById("postModal")
        .classList.remove("hidden");


    document
        .getElementById("listingType")
        .value = type;


    changePostType();
}


function closePost() {

    document
        .getElementById("postModal")
        .classList.add("hidden");
}


/* CHANGE POST TYPE */

function changePostType() {

    const type =
        document
            .getElementById("listingType")
            .value;


    document
        .getElementById("dogFields")
        .classList.add("hidden");

    document
        .getElementById("productFields")
        .classList.add("hidden");

    document
        .getElementById("serviceFields")
        .classList.add("hidden");

    document
        .getElementById("eventFields")
        .classList.add("hidden");


    if (type === "dog") {

        document
            .getElementById("dogFields")
            .classList.remove("hidden");

        document
            .getElementById("postTitle")
            .innerText = "Add a Dog";

    }


    if (type === "product") {

        document
            .getElementById("productFields")
            .classList.remove("hidden");

        document
            .getElementById("postTitle")
            .innerText = "Add a Product";

    }


    if (type === "service") {

        document
            .getElementById("serviceFields")
            .classList.remove("hidden");

        document
            .getElementById("postTitle")
            .innerText = "Add a Service";

    }


    if (type === "event") {

        document
            .getElementById("eventFields")
            .classList.remove("hidden");

        document
            .getElementById("postTitle")
            .innerText = "Add an Event";

    }
}


/* MEDIA PREVIEW */

document
    .getElementById("listingMedia")
    .addEventListener(
        "change",
        function() {

            const file = this.files[0];

            const preview =
                document.getElementById(
                    "mediaPreview"
                );


            preview.innerHTML = "";


            if (!file) return;


            const url =
                URL.createObjectURL(file);


            if (
                file.type.startsWith("video/")
            ) {

                preview.innerHTML = `
                    <video
                        src="${url}"
                        controls
                    ></video>
                `;

            } else {

                preview.innerHTML = `
                    <img
                        src="${url}"
                        alt="Listing preview"
                    >
                `;
            }

        }
    );


/* PUBLISH */

function publishListing() {

    const type =
        document
            .getElementById("listingType")
            .value;


    const title =
        document
            .getElementById("listingTitle")
            .value.trim();


    const location =
        document
            .getElementById("listingLocation")
            .value.trim();


    const description =
        document
            .getElementById("listingDescription")
            .value.trim();


    const country =
        document
            .getElementById("listingCountry")
            .value;


    const file =
        document
            .getElementById("listingMedia")
            .files[0];


    if (
        !title ||
        !location ||
        !description
    ) {

        showToast(
            "Please complete the required information."
        );

        return;
    }


    const listing = {

        id: Date.now(),

        type: type,

        title: title,

        location: location,

        country: country,

        description: description,

        seller: currentUser.name,

        createdAt: Date.now(),

        likes: 0,

        media: null,

        mediaType: null,

        breed: "",

        age: "",

        gender: "",

        productCategory: "",

        productPrice: "",

        serviceType: "",

        servicePrice: "",

        eventDate: "",

        eventType: ""

    };


    /* DOG */

    if (type === "dog") {

        listing.breed =
            document
                .getElementById("dogBreed")
                .value.trim();

        listing.age =
            document
                .getElementById("dogAge")
                .value.trim();

        listing.gender =
            document
                .getElementById("dogGender")
                .value;

    }


    /* PRODUCT */

    if (type === "product") {

        listing.productCategory =
            document
                .getElementById("productCategory")
                .value;

        listing.productPrice =
            document
                .getElementById("productPrice")
                .value.trim();

    }


    /* SERVICE */

    if (type === "service") {

        listing.serviceType =
            document
                .getElementById("serviceType")
                .value;

        listing.servicePrice =
            document
                .getElementById("servicePrice")
                .value.trim();

    }


    /* EVENT */

    if (type === "event") {

        listing.eventDate =
            document
                .getElementById("eventDate")
                .value;

        listing.eventType =
            document
                .getElementById("eventType")
                .value.trim();

    }


    /*
       Save picture/video.
    */

    if (file) {

        const reader =
            new FileReader();


        reader.onload = function(event) {

            listing.media =
                event.target.result;

            listing.mediaType =
                file.type.startsWith("video/")
                    ? "video"
                    : "image";


            listings.unshift(listing);

            saveListings();

            renderAll();

            closePost();

            resetForm();

            showToast(
                "Your listing has been published! 🎉"
            );

        };


        reader.readAsDataURL(file);

    } else {

        listings.unshift(listing);

        saveListings();

        renderAll();

        closePost();

        resetForm();

        showToast(
            "Your listing has been published! 🎉"
        );
    }
}


/* RESET */

function resetForm() {

    document
        .getElementById("listingTitle")
        .value = "";

    document
        .getElementById("listingLocation")
        .value = "";

    document
        .getElementById("listingDescription")
        .value = "";

    document
        .getElementById("listingMedia")
        .value = "";

    document
        .getElementById("mediaPreview")
        .innerHTML = "";

    document
        .getElementById("dogBreed")
        .value = "";

    document
        .getElementById("dogAge")
        .value = "";

    document
        .getElementById("productPrice")
        .value = "";

    document
        .getElementById("servicePrice")
        .value = "";

    document
        .getElementById("eventDate")
        .value = "";

    document
        .getElementById("eventType")
        .value = "";
}


/* RENDER EVERYTHING */

function renderAll() {

    renderCategory(
        "dog",
        "dogsGrid"
    );

    renderCategory(
        "product",
        "productsGrid"
    );

    renderCategory(
        "service",
        "servicesGrid"
    );

    renderCategory(
        "event",
        "eventsGrid"
    );
}


/* CATEGORY */

function renderCategory(
    type,
    containerId
) {

    const container =
        document.getElementById(
            containerId
        );


    const search =
        document
            .getElementById(
                "searchInput"
            )
            .value
            .toLowerCase();


    const country =
        document
            .getElementById(
                "countryFilter"
            )
            .value;


    let results =
        listings.filter(
            function(item) {

                const searchable = (

                    item.title +
                    " " +
                    item.description +
                    " " +
                    item.location +
                    " " +
                    item.country +
                    " " +
                    item.breed +
                    " " +
                    item.productCategory +
                    " " +
                    item.serviceType +
                    " " +
                    item.eventType

                ).toLowerCase();


                return (

                    item.type === type &&

                    searchable.includes(search) &&

                    (
                        country === "all" ||
                        item.country === country
                    )

                );

            }
        );


    results.sort(
        (a,b) =>
            b.createdAt -
            a.createdAt
    );


    container.innerHTML = "";


    if (results.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div>🐾</div>
                <h3>No listings yet</h3>
                <p>Be the first to add one.</p>
            </div>
        `;

        return;
    }


    results.forEach(
        function(item) {

            container.appendChild(
                createCard(item)
            );

        }
    );
}


/* CARD */

function createCard(item) {

    const card =
        document.createElement("article");


    card.className =
        "listing-card";


    let media = `
        <div class="media-placeholder">
            ${getIcon(item.type)}
        </div>
    `;


    if (
        item.media &&
        item.mediaType === "image"
    ) {

        media = `
            <img
                src="${item.media}"
                alt="${escapeHTML(item.title)}"
            >
        `;

    }


    if (
        item.media &&
        item.mediaType === "video"
    ) {

        media = `
            <video
                src="${item.media}"
                controls
            ></video>
        `;
    }


    let details = "";


    /* DOG */

    if (item.type === "dog") {

        details = `

            <div class="listing-info">

                <span class="info-pill">
                    🐕 ${escapeHTML(item.breed)}
                </span>

                <span class="info-pill">
                    ${escapeHTML(item.age)}
                </span>

                <span class="info-pill">
                    ${escapeHTML(item.gender)}
                </span>

            </div>
        `;
    }


    /* PRODUCT */

    if (item.type === "product") {

        details = `

            <div class="listing-info">

                <span class="info-pill">
                    🦴 ${escapeHTML(item.productCategory)}
                </span>

                <span class="info-pill">
                    💰 ${escapeHTML(item.productPrice || "Contact seller")}
                </span>

            </div>
        `;
    }


    /* SERVICE */

    if (item.type === "service") {

        details = `

            <div class="listing-info">

                <span class="info-pill">
                    🐕‍🦺 ${escapeHTML(item.serviceType)}
                </span>

                ${
                    item.servicePrice
                    ?
                    `<span class="info-pill">
                        💰 ${escapeHTML(item.servicePrice)}
                    </span>`
                    :
                    ""
                }

            </div>
        `;
    }


    /* EVENT */

    if (item.type === "event") {

        details = `

            <div class="listing-info">

                <span class="info-pill">
                    🏆 ${escapeHTML(item.eventType || "Dog Event")}
                </span>

                <span class="info-pill">
                    📅 ${escapeHTML(item.eventDate || "Date TBA")}
                </span>

            </div>
        `;
    }


    const liked =
        likedListings.includes(item.id);


    card.innerHTML = `

        <div class="media-container">

            ${media}

        </div>


        <div class="listing-content">

            <h3>
                ${escapeHTML(item.title)}
            </h3>

            ${details}


            <p class="listing-description">

                ${escapeHTML(item.description)}

            </p>


            <p class="breed">

                📍 ${escapeHTML(item.location)}

                • ${escapeHTML(item.country)}

            </p>


            <p class="breed">

                👤 ${escapeHTML(item.seller)}

            </p>


            <div class="listing-actions">

                <button
                    class="contact"
                    onclick="contactSeller()"
                >
                    💬 Contact
                </button>


                <button
                    onclick="toggleLike(${item.id})"
                >
                    ${liked ? "❤️" : "♡"}
                    ${item.likes}
                </button>


                <button
                    class="report"
                    onclick="openReport(${item.id})"
                >
                    ⚑
                </button>

            </div>

        </div>

    `;


    return card;
}


/* ICON */

function getIcon(type) {

    if (type === "dog")
        return "🐕";

    if (type === "product")
        return "🦴";

    if (type === "service")
        return "🐕‍🦺";

    if (type === "event")
        return "🏆";

    return "🐾";
}


/* LIKE */

function toggleLike(id) {

    const item =
        listings.find(
            listing =>
                listing.id === id
        );


    if (!item) return;


    if (likedListings.includes(id)) {

        likedListings =
            likedListings.filter(
                itemId =>
                    itemId !== id
            );

        item.likes =
            Math.max(
                0,
                item.likes - 1
            );

    } else {

        likedListings.push(id);

        item.likes++;
    }


    saveListings();

    renderAll();
}


/* CONTACT */

function contactSeller() {

    showToast(
        "Messaging will be connected to real accounts in the next version."
    );
}


/* REPORT */

function openReport(id) {

    reportedListing = id;

    document
        .getElementById("reportModal")
        .classList.remove("hidden");
}


function closeReport() {

    document
        .getElementById("reportModal")
        .classList.add("hidden");
}


function submitReport() {

    closeReport();

    showToast(
        "Report submitted. Thank you."
    );
}


/* STORAGE */

function saveListings() {

    try {

        localStorage.setItem(
            "ajexListings",
            JSON.stringify(listings)
        );

    } catch(error) {

        console.log(
            "Storage limit reached."
        );
    }
}


function loadListings() {

    const saved =
        localStorage.getItem(
            "ajexListings"
        );


    if (saved) {

        try {

            listings =
                JSON.parse(saved);

        } catch(error) {

            listings = [];

        }

    }
}


/* SECURITY */

function escapeHTML(text) {

    if (!text) return "";

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* TOAST */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.innerText = message;

    toast.style.display = "block";


    setTimeout(
        function() {

            toast.style.display = "none";

        },
        3000
    );
}


/* SCROLL */

function scrollToFeed() {

    document
        .getElementById("discover")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* START */

function startApp() {

    loadListings();


    const savedUser =
        localStorage.getItem(
            "ajexUser"
        );


    const savedRole =
        localStorage.getItem(
            "ajexRole"
        );


    if (savedUser && savedRole) {

        currentUser =
            JSON.parse(savedUser);

        currentRole =
            savedRole;


        document
            .getElementById("loginScreen")
            .classList.add("hidden");


        document
            .getElementById("roleScreen")
            .classList.add("hidden");


        document
            .getElementById("app")
            .classList.remove("hidden");


        updateUserInterface();

        renderAll();

    }

}


startApp();