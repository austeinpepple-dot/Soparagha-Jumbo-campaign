
/* ==========================================
   SOPARAGHA SOBERE JUMBO
   ELECTION CAMPAIGN WEBSITE
   MAIN JAVASCRIPT FILE
========================================== */

document.addEventListener("DOMContentLoaded", function () {

  // MOBILE NAVIGATION

  const menuButton = document.querySelector(".menu-button");

  const navigation = document.querySelector(
    ".primary-navigation"
  );

  if (menuButton && navigation) {

    function closeMenu() {
      navigation.classList.remove("is-open");

      menuButton.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton.setAttribute(
        "aria-label",
        "Open navigation"
      );
    }

    function openMenu() {
      navigation.classList.add("is-open");

      menuButton.setAttribute(
        "aria-expanded",
        "true"
      );

      menuButton.setAttribute(
        "aria-label",
        "Close navigation"
      );
    }

    // Open or close the navigation

    menuButton.addEventListener("click", function () {

      const isOpen = navigation.classList.contains(
        "is-open"
      );

      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }

    });

    // Close navigation after selecting a link

    const navigationLinks = navigation.querySelectorAll("a");

    navigationLinks.forEach(function (link) {

      link.addEventListener("click", function () {
        closeMenu();
      });

    });

    // Close navigation using Escape key

    document.addEventListener("keydown", function (event) {

      if (event.key === "Escape") {
        closeMenu();
      }

    });

    // Close navigation when clicking outside

    document.addEventListener("click", function (event) {

      if (
        !navigation.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }

    });

    // Reset menu when switching to desktop layout

    window.addEventListener("resize", function () {

      if (window.innerWidth > 900) {
        closeMenu();
      }

    });

  }

  // AUTOMATIC COPYRIGHT YEAR

  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});

/* ==========================================
   CAMPAIGN INFORMATION
   LOAD EDITABLE DATA FROM JSON
========================================== */

document.addEventListener("DOMContentLoaded", async function () {

  try {

    const response = await fetch("/data/campaign.json", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Unable to load campaign information");
    }

    const campaign = await response.json();

    // Safely update text on the website

    function updateText(selector, value) {

      if (typeof value !== "string" || !value.trim()) {
        return;
      }

      const element = document.querySelector(selector);

      if (element) {
        element.textContent = value.trim();
      }

    }

    // Update campaign party

    updateText(
      ".hero-party",
      campaign.party
    );

    // Update candidate information

    updateText(
      "#candidate .facts div:nth-child(1) dd",
      campaign.fullName
    );

    updateText(
      "#candidate .facts div:nth-child(2) dd",
      campaign.constituency
    );

    updateText(
      "#candidate .facts div:nth-child(3) dd",
      campaign.office
    );

    // Update candidate biography

    updateText(
      "#candidate .body-copy",
      campaign.biography
    );

    // Update campaign manifesto

    updateText(
      "#campaign .info-card:nth-child(2) p:nth-of-type(2)",
      campaign.manifesto
    );

    // Update contact information when provided

    const contact = document.querySelector(
      "#contact .contact-notice"
    );

    if (contact) {

      const details = [];

      if (campaign.campaignEmail) {
        details.push("Email: " + campaign.campaignEmail);
      }

      if (campaign.phoneNumber) {
        details.push("Phone: " + campaign.phoneNumber);
      }

      if (details.length > 0) {
        contact.textContent = details.join(" | ");
      }

    }

  } catch (error) {

    console.error(
      "Campaign information could not be loaded:",
      error
    );

  }

});
