(function () {
  "use strict";

  var pages = [
    {
      image: "../../../assets/read-aloud/book1/page-01.jpg",
      audio: "../../../assets/read-aloud/book1/page-01.mp3",
      alt: "第1ページ。森の高い木の上にある、灯りのともったフウの家"
    },
    {
      image: "../../../assets/read-aloud/book1/page-02.jpg",
      audio: "../../../assets/read-aloud/book1/page-02.mp3",
      alt: "第2ページ。風の強い夜、窓辺で眠れずにいるフウ"
    },
    {
      image: "../../../assets/read-aloud/book1/page-03.jpg",
      audio: "../../../assets/read-aloud/book1/page-03.mp3",
      alt: "第3ページ。布団にもぐっても風の音が気になるフウ"
    }
  ];

  var pageImage = document.getElementById("pageImage");
  var narration = document.getElementById("narration");
  var pageCounter = document.getElementById("pageCounter");
  var statusText = document.getElementById("statusText");
  var progress = document.getElementById("audioProgress");
  var currentTime = document.getElementById("currentTime");
  var duration = document.getElementById("duration");
  var prevButton = document.getElementById("prevButton");
  var playButton = document.getElementById("playButton");
  var pauseButton = document.getElementById("pauseButton");
  var replayButton = document.getElementById("replayButton");
  var nextButton = document.getElementById("nextButton");
  var completionCard = document.getElementById("completionCard");

  if (!pageImage || !narration) return;

  var currentPage = 0;
  var started = false;
  var completed = false;
  var startedAt = 0;
  var completedPages = {};

  function track(eventName, parameters) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", eventName, parameters);
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    var minutes = Math.floor(seconds / 60);
    var remaining = String(Math.floor(seconds % 60)).padStart(2, "0");
    return minutes + ":" + remaining;
  }

  function updateProgress() {
    var total = narration.duration;
    var elapsed = narration.currentTime;
    progress.value = Number.isFinite(total) && total > 0 ? elapsed / total : 0;
    currentTime.textContent = formatTime(elapsed);
    duration.textContent = formatTime(total);
  }

  function setStatus(message) {
    statusText.textContent = message;
  }

  function updateButtons() {
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === pages.length - 1;
    pauseButton.disabled = narration.paused;
  }

  function showPage(index) {
    narration.pause();
    narration.currentTime = 0;
    currentPage = Math.max(0, Math.min(index, pages.length - 1));
    var page = pages[currentPage];

    pageImage.src = page.image;
    pageImage.alt = page.alt;
    narration.src = page.audio;
    narration.load();
    pageCounter.textContent = (currentPage + 1) + " / " + pages.length;
    progress.value = 0;
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";
    setStatus((currentPage + 1) + "ページ目を表示しています");
    updateButtons();
  }

  function playNarration(options) {
    var shouldRestart = options && options.restart;
    if (shouldRestart || narration.ended) narration.currentTime = 0;

    narration.play().then(function () {
      if (!started) {
        started = true;
        startedAt = Date.now();
        track("read_aloud_start", {
          book_id: "book1",
          book_title: "まよなかのあかり",
          sample_pages: pages.length
        });
      }
      setStatus((currentPage + 1) + "ページ目を読み聞かせ中");
      updateButtons();
    }).catch(function () {
      setStatus("再生できませんでした。もう一度お試しください");
      updateButtons();
    });
  }

  function pauseNarration() {
    narration.pause();
    setStatus("一時停止しました");
    updateButtons();
  }

  prevButton.addEventListener("click", function () { showPage(currentPage - 1); });
  nextButton.addEventListener("click", function () { showPage(currentPage + 1); });
  playButton.addEventListener("click", function () { playNarration(); });
  pauseButton.addEventListener("click", pauseNarration);
  replayButton.addEventListener("click", function () { playNarration({ restart: true }); });

  narration.addEventListener("loadedmetadata", updateProgress);
  narration.addEventListener("timeupdate", updateProgress);
  narration.addEventListener("play", updateButtons);
  narration.addEventListener("pause", updateButtons);
  narration.addEventListener("ended", function () {
    var pageNumber = currentPage + 1;
    setStatus(pageNumber + "ページ目の読み聞かせが終わりました");

    if (!completedPages[pageNumber]) {
      completedPages[pageNumber] = true;
      track("read_aloud_page_complete", {
        book_id: "book1",
        page_number: pageNumber,
        sample_pages: pages.length
      });
    }

    if (currentPage === pages.length - 1) {
      completionCard.hidden = false;
    }

    if (Object.keys(completedPages).length === pages.length && !completed) {
      completed = true;
      track("read_aloud_complete", {
        book_id: "book1",
        book_title: "まよなかのあかり",
        sample_pages: pages.length,
        elapsed_seconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0
      });
    }

    updateButtons();
  });

  narration.addEventListener("error", function () {
    setStatus("音声を読み込めませんでした。通信状況をご確認ください");
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft" && currentPage > 0) showPage(currentPage - 1);
    if (event.key === "ArrowRight" && currentPage < pages.length - 1) showPage(currentPage + 1);
    if (event.key === " " && event.target === document.body) {
      event.preventDefault();
      if (narration.paused) playNarration();
      else pauseNarration();
    }
  });

  pages.slice(1).forEach(function (page) {
    var image = new Image();
    image.src = page.image;
  });

  showPage(0);
})();
