const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isNext: false,
  isPrev: false,
  songs: [
    {
      name: "Love's Our Mistake",
      singer: "Swaroop",
      path: "./Love's Our Mistake.mp3",
      image: "./images/Mistake Cover.jpg",
    },{
      name: "Whispers in the Moonlight",
      singer: "Swaroop",
      path: "./moonlight.mp3",
      image: "./images/Moonlight Cover.jpg",
    },
  ],

  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
            <div class="thumb"
                style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
    `;
    });
    playlist.innerHTML = htmls.join("");
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents: function () {
    const _this = this;

    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    (document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      // cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      // cd.style.opacity = newCdWidth / cdWidth;
    }),
      (playBtn.onclick = function () {
        if (_this.isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      });

    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = progressPercent;
        progress.style.setProperty("--progress-value", `${progressPercent}%`);
      }
    };

    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    nextBtn.onmousedown = function () {
      _this.isNext = !_this.isNext;
      nextBtn.classList.toggle("active", _this.isNext);
    };
    nextBtn.onmouseup = function () {
      _this.isNext = !_this.isNext;
      nextBtn.classList.remove("active", _this.isNext);
      _this.nextSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    prevBtn.onmousedown = function () {
      _this.isPrev = !_this.isPrev;
      prevBtn.classList.toggle("active", _this.isPrev);
    };
    prevBtn.onmouseup = function () {
      _this.isPrev = !_this.isPrev;
      prevBtn.classList.remove("active", _this.isPrev);
      _this.prevSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".options")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
          _this.render();
        }
        if (e.target.closest(".options")) {
        }
      }
    };
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 100);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function () {
    this.currentIndex++;

    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },

  start: function () {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
