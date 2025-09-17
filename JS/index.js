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

    resources.forEach(function (allResourcesFromArray) {
        let printSiteName = allResourcesFromArray.siteName;
        let printSiteLink = allResourcesFromArray.siteLink;
        let printSiteDescription = allResourcesFromArray.siteDescription;

        let resourceDIV = document.createElement("div");
        resourceDIV.classList.add("resource");

        let nameOfWebsiteDiv = document.createElement("div");
        nameOfWebsiteDiv.classList.add("nameOfWebsite"); // Fixed: should be nameOfWebsiteDiv, not nameOfWebsiteText

        let nameOfWebsiteText = document.createElement("a"); // Moved before usage
        nameOfWebsiteText.setAttribute("href", `${printSiteLink}`);
        nameOfWebsiteText.setAttribute("target", "_blank");
        if (printSiteName === "") {
            nameOfWebsiteText.textContent = printSiteLink;
        } else {
            nameOfWebsiteText.textContent = printSiteName;
        }

        let deleteIcon = document.createElement("h2");
        deleteIcon.classList.add("fa", "fa-trash", "fa-xs");
        deleteIcon.setAttribute(`onclick`, `deleteRes('${printSiteLink}')`);

        let descriptionOfWebsiteDiv = document.createElement("div");
        descriptionOfWebsiteDiv.classList.add("description-of-website");

        let descriptionText = document.createElement("p");
        descriptionText.textContent = printSiteDescription;

        descriptionOfWebsiteDiv.append(descriptionText);
        nameOfWebsiteDiv.append(nameOfWebsiteText); // Fixed: added the link to the div
        resourceDIV.append(
            deleteIcon,
            nameOfWebsiteDiv, // Fixed: append the div instead of the text directly
            descriptionOfWebsiteDiv
        );
        resourcesSection.append(resourceDIV);
    });
}

fetchResources();

function deleteRes(printSiteLink) {
    for (let i = resources.length - 1; i >= 0; i--) {
        if (resources[i].siteLink === printSiteLink) {
            resources.splice(i, 1);
            break; // Remove only the first match
        }
    }
    localStorage.setItem("resources", JSON.stringify(resources));
    fetchResources();
}

function fetchResources() {
    if (localStorage.getItem("resources")) {
        resources = JSON.parse(localStorage.getItem("resources"));
    }

    printResourcesOnUI();
}
linkOfWebsite.oninvalid = () => {
    linkOfWebsite.setCustomValidity("please enter the site URL");
};

resourceForm.addEventListener("submit", handleForm);
function handleForm(event) {
    event.preventDefault();

    let websiteName = nameOfWebsite.value;
    let websiteURL = linkOfWebsite.value;
    let description = descriptionOfWebsite.value;

    // if (nameOfWebsite.value === "") {
    // 	nameOfWebsite.style.border = "1px solid red";
    // }

    // if (linkOfWebsite.value === "") {
    // 	linkOfWebsite.style.border = "1px solid red";
    // }

    // if (descriptionOfWebsite.value === "") {
    // 	descriptionOfWebsite.style.border = "1px solid red";
    // }

    const aCreatedResource = {
        siteName: websiteName,
        siteLink: websiteURL,
        siteDescription: description,
    };

    resources.push(aCreatedResource);
    localStorage.setItem("resources", JSON.stringify(resources));
    fetchResources();
    resourceForm.reset();
    closeBackModalOverlay();
}
