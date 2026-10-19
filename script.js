
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
