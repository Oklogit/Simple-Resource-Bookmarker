let createButton = document.getElementById("button");
let modalOverlay = document.getElementById("modal-overlay");
let closeModalIcon = document.getElementById("close-modal-icon");
let nameOfWebsite = document.getElementById("nameOfWebsite");
let resourceForm = document.getElementById("resource-form");
let linkOfWebsite = document.getElementById("linkOfWebsite");
let descriptionOfWebsite = document.getElementById("descriptionOfWebsite");
let resourcesSection = document.getElementById("resources-section");

function revealModalOverlay() {
    modalOverlay.classList.remove("modal-overlay");
    modalOverlay.classList.add("modal-overlay-visible");
    nameOfWebsite.focus();
}
createButton.addEventListener("click", revealModalOverlay);

function closeBackModalOverlay() {
    if (modalOverlay.classList.contains("modal-overlay-visible")) {
        modalOverlay.classList.remove("modal-overlay-visible");
        modalOverlay.classList.add("modal-overlay");
    }
}
closeModalIcon.addEventListener("click", closeBackModalOverlay);

let resources = [];

function printResourcesOnUI() {
    resourcesSection.innerHTML = "";

    resources.forEach(function (resource, index) {
        let printSiteName = resource.siteName;
        let printSiteLink = resource.siteLink;
        let printSiteDescription = resource.siteDescription;

        let resourceDIV = document.createElement("div");
        resourceDIV.classList.add("resource");

        let nameOfWebsiteDiv = document.createElement("div");
        nameOfWebsiteDiv.classList.add("nameOfWebsite");

        let nameOfWebsiteText = document.createElement("a");
        nameOfWebsiteText.setAttribute("href", printSiteLink);
        nameOfWebsiteText.setAttribute("target", "_blank");
        nameOfWebsiteText.setAttribute("rel", "noopener noreferrer"); // Security improvement
        
        if (printSiteName === "" || printSiteName.trim() === "") {
            nameOfWebsiteText.textContent = printSiteLink;
        } else {
            nameOfWebsiteText.textContent = printSiteName;
        }

        // Fixed: Use button instead of h2 for better semantics and accessibility
        let deleteIcon = document.createElement("button");
        deleteIcon.classList.add("delete-btn", "fa", "fa-trash", "fa-xs");
        deleteIcon.setAttribute("type", "button");
        deleteIcon.setAttribute("aria-label", `Delete ${printSiteName || printSiteLink}`);
        
        // Fixed: Use data attribute and event listener instead of onclick for security
        deleteIcon.dataset.resourceIndex = index;
        deleteIcon.addEventListener("click", function() {
            deleteResByIndex(parseInt(this.dataset.resourceIndex));
        });

        let descriptionOfWebsiteDiv = document.createElement("div");
        descriptionOfWebsiteDiv.classList.add("description-of-website");

        let descriptionText = document.createElement("p");
        descriptionText.textContent = printSiteDescription;

        descriptionOfWebsiteDiv.append(descriptionText);
        nameOfWebsiteDiv.append(nameOfWebsiteText);
        resourceDIV.append(
            deleteIcon,
            nameOfWebsiteDiv,
            descriptionOfWebsiteDiv
        );
        resourcesSection.append(resourceDIV);
    });
}

// Fixed: More reliable delete function using index
function deleteResByIndex(index) {
    if (index >= 0 && index < resources.length) {
        resources.splice(index, 1);
        saveResources();
        fetchResources();
    }
}

// Alternative: Delete by URL (your original approach, but improved)
function deleteResByURL(siteLink) {
    const index = resources.findIndex(resource => resource.siteLink === siteLink);
    if (index !== -1) {
        resources.splice(index, 1);
        saveResources();
        fetchResources();
    }
}

// Fixed: Added error handling for localStorage
function saveResources() {
    try {
        localStorage.setItem("resources", JSON.stringify(resources));
    } catch (error) {
        console.error("Failed to save resources to localStorage:", error);
        alert("Failed to save resources. Storage might be full.");
    }
}

function fetchResources() {
    try {
        if (localStorage.getItem("resources")) {
            resources = JSON.parse(localStorage.getItem("resources"));
        }
    } catch (error) {
        console.error("Failed to load resources from localStorage:", error);
        resources = []; // Reset to empty array if corrupted
    }

    printResourcesOnUI();
}

// Fixed: Better URL validation
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Fixed: Check for duplicate URLs
function isDuplicateURL(url) {
    return resources.some(resource => resource.siteLink === url);
}

linkOfWebsite.oninvalid = () => {
    linkOfWebsite.setCustomValidity("Please enter a valid URL");
};

// Reset custom validity on input
linkOfWebsite.oninput = () => {
    linkOfWebsite.setCustomValidity("");
};

resourceForm.addEventListener("submit", handleForm);

function handleForm(event) {
    event.preventDefault();

    let websiteName = nameOfWebsite.value.trim();
    let websiteURL = linkOfWebsite.value.trim();
    let description = descriptionOfWebsite.value.trim();

    // Fixed: Add proper validation
    if (!websiteURL) {
        alert("Please enter a website URL");
        linkOfWebsite.focus();
        return;
    }

    // Add http:// if no protocol specified
    if (!websiteURL.startsWith('http://') && !websiteURL.startsWith('https://')) {
        websiteURL = 'https://' + websiteURL;
    }

    if (!isValidURL(websiteURL)) {
        alert("Please enter a valid URL");
        linkOfWebsite.focus();
        return;
    }

    if (isDuplicateURL(websiteURL)) {
        alert("This URL already exists in your resources!");
        linkOfWebsite.focus();
        return;
    }

    const newResource = {
        siteName: websiteName,
        siteLink: websiteURL,
        siteDescription: description,
    };

    resources.push(newResource);
    saveResources();
    fetchResources();
    resourceForm.reset();
    closeBackModalOverlay();
}

// Initialize the app
fetchResources();
