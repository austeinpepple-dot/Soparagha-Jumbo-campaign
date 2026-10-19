
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
         
        image.style.height = "auto";
         
        image.style.objectFit = "contain";

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


/* ==========================================
   SOPARAGHA SOBERE JUMBO CAMPAIGN
   DYNAMIC VIDEO MANAGEMENT
========================================== */

document.addEventListener(
  "DOMContentLoaded",
  async function () {

    // FIND CAMPAIGN VIDEOS SECTION

    const videoSection = document.querySelector(
      "#videos"
    );

    if (!videoSection) {
      return;
    }

    // EXTRACT A VALID YOUTUBE VIDEO ID

    function getYouTubeId(link) {

      if (typeof link !== "string") {
        return null;
      }

      try {

        const url = new URL(link.trim());
        const host = url.hostname.toLowerCase();

        if (url.protocol !== "https:") {
          return null;
        }

        let videoId = null;

        if (
          host === "youtu.be" ||
          host === "www.youtu.be"
        ) {

          videoId = url.pathname.split("/")[1];

        } else if (
          host === "youtube.com" ||
          host === "www.youtube.com" ||
          host === "m.youtube.com"
        ) {

          const parts = url.pathname.split("/");

          if (url.pathname === "/watch") {

            videoId = url.searchParams.get("v");

          } else if (
            ["shorts", "live", "embed"].includes(
              parts[1]
            )
          ) {

            videoId = parts[2];

          }

        }

        if (
          videoId &&
          /^[a-zA-Z0-9_-]{11}$/.test(videoId)
        ) {
          return videoId;
        }

        return null;

      } catch (error) {

        return null;

      }

    }

    try {

      // LOAD VIDEO INFORMATION

      const response = await fetch(
        "/data/videos.json",
        {
          cache: "no-store"
        }
      );

      if (!response.ok) {
        throw new Error(
          "Unable to load campaign videos"
        );
      }

      const videoData = await response.json();

      if (!Array.isArray(videoData)) {
        throw new Error(
          "Video data must be an array"
        );
      }

      // FILTER APPROVED VIDEOS

      const publishedVideos = videoData
        .filter(function (video) {

          return (
            video &&
            video.published === true &&
            typeof video.title === "string" &&
            video.title.trim() !== "" &&
            getYouTubeId(video.youtubeUrl)
          );

        })
        .sort(function (a, b) {

          return String(b.date || "").localeCompare(
            String(a.date || "")
          );

        });

      // KEEP COMING SOON MESSAGE IF EMPTY

      if (publishedVideos.length === 0) {
        return;
      }

      // CREATE RESPONSIVE VIDEO GRID

      const videoGrid = document.createElement(
        "div"
      );

      videoGrid.className =
        "campaign-video-grid";

      videoGrid.style.display = "grid";

      videoGrid.style.gridTemplateColumns =
        "repeat(auto-fit, minmax(min(100%, 320px), 1fr))";

      videoGrid.style.gap = "24px";

      videoGrid.style.marginTop = "30px";

      videoGrid.style.marginBottom = "30px";

      // CREATE VIDEO CARDS

      publishedVideos.forEach(function (video) {

        const videoId = getYouTubeId(
          video.youtubeUrl
        );

        const card = document.createElement(
          "article"
        );

        card.className = "campaign-video-card";

        card.style.background = "#FFFFFF";
        card.style.borderRadius = "12px";
        card.style.overflow = "hidden";
        card.style.boxShadow =
          "0 5px 20px rgba(0,0,0,0.12)";

        // VIDEO PLAYER

        const player = document.createElement(
          "iframe"
        );

        player.src =
          "https://www.youtube-nocookie.com/embed/" +
          videoId;

        player.title = video.title;

        player.loading = "lazy";

        player.allow =
          "accelerometer; autoplay; clipboard-write; " +
          "encrypted-media; gyroscope; picture-in-picture; " +
          "web-share";

        player.allowFullscreen = true;

        player.referrerPolicy =
          "strict-origin-when-cross-origin";

        player.style.width = "100%";
        player.style.aspectRatio = "16 / 9";
        player.style.border = "0";
        player.style.display = "block";

        card.appendChild(player);

        // VIDEO INFORMATION

        const details = document.createElement(
          "div"
        );

        details.style.padding = "20px";

        // VIDEO TITLE

        const title = document.createElement(
          "h3"
        );

        title.textContent = video.title;
        title.style.color = "#087D42";
        title.style.marginBottom = "12px";

        details.appendChild(title);

        // VIDEO DESCRIPTION

        if (
          typeof video.description === "string" &&
          video.description.trim()
        ) {

          const description = document.createElement(
            "p"
          );

          description.textContent =
            video.description;

          description.style.color = "#333333";
          description.style.marginBottom = "12px";

          details.appendChild(description);

        }

        // PUBLICATION DATE

        if (video.date) {

          const date = document.createElement(
            "p"
          );

          date.textContent = String(video.date);

          date.style.fontSize = "13px";
          date.style.color = "#666666";

          details.appendChild(date);

        }

        card.appendChild(details);

        videoGrid.appendChild(card);

      });

      // FIND EXISTING COMING SOON MESSAGE

      const placeholderTitle = Array.from(
        videoSection.querySelectorAll(
          "h2, h3, h4, p"
        )
      ).find(function (element) {

        return element.textContent.trim()
          .toLowerCase() === "videos coming soon";

      });

      const placeholder = placeholderTitle
        ? (
            placeholderTitle.closest(
              ".video-placeholder, .video-panel, " +
              ".video-frame, .notice-panel"
            ) || placeholderTitle.parentElement
          )
        : null;

      if (
        placeholder &&
        placeholder !== videoSection
      ) {

        placeholder.replaceWith(videoGrid);

      } else {

        videoSection.appendChild(videoGrid);

      }

    } catch (error) {

      console.error(
        "Campaign video loading error:",
        error
      );

    }

  }
);



