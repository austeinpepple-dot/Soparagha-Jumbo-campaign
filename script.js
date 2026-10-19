
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


/* ==========================================
   SOPARAGHA SOBERE JUMBO CAMPAIGN
   DYNAMIC NEWS MANAGEMENT
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    const newsSection = document.querySelector(
      "#updates .notice-panel"
    );

    if (!newsSection) {
      return;
    }

    try {

      // GET CAMPAIGN NEWS FROM JSON FILE

      const response = await fetch(
        "/data/news.json",
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load campaign news"
        );
      }

      const newsData = await response.json();

      if (!Array.isArray(newsData)) {
        throw new Error(
          "Campaign news must be an array"
        );
      }

      // DISPLAY ONLY APPROVED ARTICLES

      const publishedNews = newsData
        .filter(function (article) {

          return (
            article &&
            article.published === true &&
            typeof article.title === "string" &&
            article.title.trim() !== ""
          );

        })
        .sort(function (a, b) {

          return String(b.date || "").localeCompare(
            String(a.date || "")
          );

        });

      // KEEP PLACEHOLDER IF THERE IS NO NEWS

      if (publishedNews.length === 0) {
        return;
      }

      // CREATE NEWS CONTAINER

      const newsContainer = document.createElement(
        "div"
      );

      newsContainer.className = "news-list";

      // CREATE AN ARTICLE CARD FOR EACH REPORT

      publishedNews.forEach(function (article) {

        const card = document.createElement(
          "article"
        );

        card.className = "notice-panel news-card";

        // PUBLICATION DATE

        if (article.date) {

          const date = document.createElement(
            "p"
          );

          date.className = "info-index";

          date.textContent = String(article.date);

          card.appendChild(date);

        }

        // NEWS HEADLINE

        const title = document.createElement(
          "h3"
        );

        title.textContent = article.title;

        card.appendChild(title);

        // NEWS PHOTOGRAPH

        if (
          typeof article.image === "string" &&
          article.image.trim()
        ) {

          const imagePath = article.image.trim();

          const normalizedPath =
            imagePath.startsWith("media/")
              ? "/" + imagePath
              : imagePath;

          if (
            normalizedPath.startsWith("/media/") &&
            !normalizedPath.includes("..")
          ) {

            const image = document.createElement(
              "img"
            );

            image.src = normalizedPath;
            image.alt = article.title;
            image.loading = "lazy";

            image.style.width = "100%";
            image.style.height = "auto";
            image.style.marginTop = "15px";
            image.style.borderRadius = "8px";

            card.appendChild(image);

          }

        }

        // NEWS SUMMARY

        if (
          typeof article.summary === "string" &&
          article.summary.trim()
        ) {

          const summary = document.createElement(
            "p"
          );

          summary.textContent = article.summary;

          card.appendChild(summary);

        }

        // FULL ARTICLE

        if (
          typeof article.body === "string" &&
          article.body.trim()
        ) {

          const details = document.createElement(
            "details"
          );

          const readMore = document.createElement(
            "summary"
          );

          readMore.textContent = "Read full article";

          readMore.style.cursor = "pointer";
          readMore.style.fontWeight = "bold";
          readMore.style.marginTop = "15px";

          const fullReport = document.createElement(
            "p"
          );

          fullReport.textContent = article.body;
          fullReport.style.whiteSpace = "pre-line";
          fullReport.style.marginTop = "15px";

          details.appendChild(readMore);
          details.appendChild(fullReport);

          card.appendChild(details);

        }

        newsContainer.appendChild(card);

      });

      // REPLACE THE COMING SOON MESSAGE

      newsSection.replaceWith(
        newsContainer
      );

    } catch (error) {

      console.error(
        "Campaign news loading error:",
        error
      );

    }

  }
);


/* ==========================================
   SOPARAGHA SOBERE JUMBO CAMPAIGN
   DYNAMIC PHOTO GALLERY
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    // FIND THE PHOTO GALLERY SECTION

    const gallerySection = document.querySelector(
      "#gallery"
    );

    if (!gallerySection) {
      return;
    }

    const galleryPlaceholder =
      gallerySection.querySelector(
        ".notice-panel"
      );

    if (!galleryPlaceholder) {
      console.warn(
        "Gallery placeholder not found"
      );
      return;
    }

    try {

      // LOAD PHOTOGRAPHS FROM JSON

      const response = await fetch(
        "/data/gallery.json",
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load campaign gallery"
        );
      }

      const galleryData = await response.json();

      if (!Array.isArray(galleryData)) {
        throw new Error(
          "Gallery data must be an array"
        );
      }

      // VALIDATE MEDIA PATHS

      function getImagePath(value) {

        if (typeof value !== "string") {
          return null;
        }

        const path = value.trim();

        if (
          !path ||
          path.includes("..") ||
          path.includes("\\") ||
          path.startsWith("//")
        ) {
          return null;
        }

        const normalized = path.startsWith("/")
          ? path
          : "/" + path;

        if (!normalized.startsWith("/media/")) {
          return null;
        }

        return normalized;
      }

      // SELECT APPROVED PHOTOGRAPHS

      const publishedPhotos = galleryData
        .filter(function (photo) {

          return (
            photo &&
            photo.published === true &&
            getImagePath(photo.image) !== null
          );

        })
        .sort(function (a, b) {

          return String(b.date || "").localeCompare(
            String(a.date || "")
          );

        });

      // KEEP COMING SOON MESSAGE IF EMPTY

      if (publishedPhotos.length === 0) {
        return;
      }

      // CREATE RESPONSIVE PHOTO GRID

      const galleryGrid = document.createElement(
        "div"
      );

      galleryGrid.className = "campaign-gallery-grid";

      galleryGrid.style.display = "grid";

      galleryGrid.style.gridTemplateColumns =
        "repeat(auto-fit, minmax(min(100%, 250px), 1fr))";

      galleryGrid.style.gap = "24px";

      galleryGrid.style.marginTop = "30px";

      // CREATE EACH PHOTO CARD

      publishedPhotos.forEach(function (photo) {

        const card = document.createElement(
          "figure"
        );

        card.className = "gallery-card";

        card.style.margin = "0";
        card.style.background = "#FFFFFF";
        card.style.borderRadius = "10px";
        card.style.overflow = "hidden";
        card.style.boxShadow =
          "0 4px 18px rgba(0,0,0,0.08)";

        // CREATE IMAGE

        const image = document.createElement(
          "img"
        );

        image.src = getImagePath(photo.image);

        image.alt =
          photo.caption ||
          photo.event ||
          "Campaign photograph";

        image.loading = "lazy";

        image.style.width = "100%";
        image.style.height = "240px";
        image.style.objectFit = "cover";
        image.style.display = "block";

        card.appendChild(image);

        // CREATE PHOTO DETAILS

        const details = document.createElement(
          "figcaption"
        );

        details.style.padding = "18px";

        // EVENT NAME

        if (
          typeof photo.event === "string" &&
          photo.event.trim()
        ) {

          const eventName = document.createElement(
            "h3"
          );

          eventName.textContent = photo.event;

          eventName.style.color = "#078C4A";
          eventName.style.marginBottom = "10px";

          details.appendChild(eventName);

        }

        // PHOTO CAPTION

        if (
          typeof photo.caption === "string" &&
          photo.caption.trim()
        ) {

          const caption = document.createElement(
            "p"
          );

          caption.textContent = photo.caption;

          caption.style.color = "#333333";
          caption.style.marginBottom = "10px";

          details.appendChild(caption);

        }

        // EVENT DATE

        if (photo.date) {

          const date = document.createElement(
            "p"
          );

          date.textContent = String(photo.date);

          date.style.fontSize = "13px";
          date.style.color = "#666666";

          details.appendChild(date);

        }

        card.appendChild(details);

        galleryGrid.appendChild(card);

      });

      // SHOW APPROVED PHOTOGRAPHS

      galleryPlaceholder.replaceWith(
        galleryGrid
      );

    } catch (error) {

      console.error(
        "Campaign gallery loading error:",
        error
      );

    }

  }
);


