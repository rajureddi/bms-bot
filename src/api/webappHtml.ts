export const getWebAppHtml = (): string => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>BookMyShow - Telegram Mini App</title>
  <script src="https://telegram.org/js/telegram-web-app.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    body {
      background-color: #0F1115;
      color: #E4E7EB;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-tap-highlight-color: transparent;
    }
    .bms-red { background-color: #F84464; }
    .bms-red-text { color: #F84464; }
    .bms-red-border { border-color: #F84464; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="pb-36">
  <!-- Top Navigation Bar -->
  <header class="sticky top-0 z-50 bg-[#16181F] border-b border-[#252833] px-4 py-3 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded-lg bms-red flex items-center justify-center font-black text-white text-base tracking-tighter">
        BMS
      </div>
      <div>
        <h1 class="text-sm font-bold text-white leading-tight">BookMyShow Live</h1>
        <div class="flex items-center text-xs text-gray-400 cursor-pointer" onclick="openCityModal()">
          <i class="fa-solid fa-location-dot mr-1 bms-red-text"></i>
          <span id="currentCityLabel">Hyderabad</span>
          <i class="fa-solid fa-chevron-down ml-1 text-[10px]"></i>
        </div>
      </div>
    </div>
    <div class="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 font-medium flex items-center">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span> Auto-Sync
    </div>
  </header>

  <!-- Search Bar -->
  <div class="px-4 pt-3 pb-1">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400 text-sm"></i>
      <input type="text" id="movieSearchInput" placeholder="Search movies, theatres..." 
        class="w-full bg-[#1F222B] border border-[#2D313D] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F84464]">
    </div>
  </div>

  <!-- Movie Selector Section -->
  <div class="pt-3">
    <div class="px-4 flex items-center justify-between mb-2">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">1. Select Movie</h2>
      <span class="text-[11px] bms-red-text font-medium cursor-pointer" onclick="toggleCustomMovie()">Custom Movie +</span>
    </div>

    <!-- Custom Movie Input (Hidden by default) -->
    <div id="customMovieContainer" class="px-4 mb-3 hidden">
      <div class="flex space-x-2">
        <input type="text" id="customMovieInput" placeholder="Type exact movie title..." 
          class="flex-1 bg-[#1F222B] border border-[#F84464] rounded-xl px-3 py-2 text-sm text-white focus:outline-none">
        <button onclick="applyCustomMovie()" class="bms-red text-white text-xs font-semibold px-4 rounded-xl">Set</button>
      </div>
    </div>

    <!-- Horizontal Movie Cards Carousel -->
    <div class="flex space-x-3 overflow-x-auto px-4 no-scrollbar pb-2" id="movieCarousel">
      <!-- Movie 1: Avengers: Doomsday -->
      <div class="movie-card flex-shrink-0 w-36 bg-[#1A1D24] rounded-xl border-2 border-[#F84464] overflow-hidden cursor-pointer shadow-lg"
        data-movie="Avengers: Doomsday" onclick="selectMovie(this)">
        <div class="relative h-44 bg-gradient-to-t from-black via-zinc-800 to-zinc-700 flex flex-col justify-end p-2.5">
          <div class="absolute top-2 left-2 bms-red text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
            17 DEC ADVANCE
          </div>
          <div class="absolute top-2 right-2 bg-black/70 text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
            ★ 9.8
          </div>
          <h3 class="text-xs font-bold text-white leading-tight">Avengers: Doomsday</h3>
          <p class="text-[10px] text-gray-300">Action / IMAX 3D</p>
        </div>
      </div>

      <!-- Movie 2: Pushpa 2: The Rule -->
      <div class="movie-card flex-shrink-0 w-36 bg-[#1A1D24] rounded-xl border border-[#2D313D] overflow-hidden cursor-pointer"
        data-movie="Pushpa 2: The Rule" onclick="selectMovie(this)">
        <div class="relative h-44 bg-gradient-to-t from-black via-amber-950 to-amber-900 flex flex-col justify-end p-2.5">
          <div class="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            TRENDING
          </div>
          <h3 class="text-xs font-bold text-white leading-tight">Pushpa 2: The Rule</h3>
          <p class="text-[10px] text-gray-300">Action / Mass</p>
        </div>
      </div>

      <!-- Movie 3: Avatar: Fire and Ash -->
      <div class="movie-card flex-shrink-0 w-36 bg-[#1A1D24] rounded-xl border border-[#2D313D] overflow-hidden cursor-pointer"
        data-movie="Avatar: Fire and Ash" onclick="selectMovie(this)">
        <div class="relative h-44 bg-gradient-to-t from-black via-blue-950 to-blue-900 flex flex-col justify-end p-2.5">
          <div class="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            IMAX 3D
          </div>
          <h3 class="text-xs font-bold text-white leading-tight">Avatar: Fire & Ash</h3>
          <p class="text-[10px] text-gray-300">Sci-Fi / 3D</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Date Selection Slider -->
  <div class="px-4 pt-3">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">2. Select Date</h2>
      <span class="text-[11px] bms-red-text font-bold" id="selectedDateLabel">17 Dec (Advance Open)</span>
    </div>
    <div class="flex space-x-2 overflow-x-auto no-scrollbar pb-1" id="datePillContainer">
      <!-- 17 Dec (Advance Booking) -->
      <button class="date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bms-red text-white flex flex-col items-center justify-center font-bold text-xs shadow-md border-2 border-white/20"
        data-date="17" data-month="Dec" onclick="selectDate(this)">
        <span class="text-[9px] uppercase font-semibold text-rose-200">ADVANCE</span>
        <span class="text-base font-black">17</span>
        <span class="text-[9px] uppercase font-bold text-yellow-300">DEC</span>
      </button>

      <!-- Today -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="18" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase text-gray-400">TODAY</span>
        <span class="text-base font-bold text-white">18</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>

      <!-- 19 Nov -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="19" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase text-gray-400">THU</span>
        <span class="text-base font-bold text-white">19</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>

      <!-- 20 Nov -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="20" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase text-gray-400">FRI</span>
        <span class="text-base font-bold text-white">20</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>

      <!-- 21 Nov -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="21" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase text-gray-400">SAT</span>
        <span class="text-base font-bold text-white">21</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>
    </div>
  </div>

  <!-- Theatres & Showtimes Section -->
  <div class="px-4 pt-4">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">3. Select Cinema & Time</h2>
      <span class="text-[11px] text-gray-400">Pick time or choose Any</span>
    </div>

    <div class="space-y-3" id="theatreList">
      <!-- Theatre 1: Prasads Multiplex -->
      <div class="theatre-card bg-[#1A1D24] border-2 border-[#F84464] rounded-xl p-3.5" data-theatre="Prasads Multiplex">
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center space-x-1.5">
              <i class="fa-solid fa-heart text-xs bms-red-text"></i>
              <h3 class="text-sm font-bold text-white">Prasads Multiplex</h3>
            </div>
            <p class="text-[11px] text-gray-400 mt-0.5">Necklace Road, Hyderabad</p>
          </div>
          <div class="flex space-x-1">
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">IMAX PCX</span>
            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">DOLBY</span>
          </div>
        </div>

        <!-- Prominent Any Time Button -->
        <div class="mt-3">
          <button class="showtime-btn w-full py-2 px-3 rounded-lg bms-red text-white text-xs font-bold text-center flex items-center justify-center space-x-1.5 shadow"
            data-time="Any Time" onclick="selectShowtime(this, 'Prasads Multiplex')">
            <i class="fa-solid fa-bolt text-yellow-300"></i>
            <span>Any Time (Watch all showtimes - First Available)</span>
          </button>
        </div>

        <!-- Specific Time Slots -->
        <div class="grid grid-cols-3 gap-2 mt-2">
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="10:30 AM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            10:30 AM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="01:45 PM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            01:45 PM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="04:15 PM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            04:15 PM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="06:30 PM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            06:30 PM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="07:15 PM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            07:15 PM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="10:00 PM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            10:00 PM
          </button>
        </div>
      </div>

      <!-- Theatre 2: AMB Cinemas -->
      <div class="theatre-card bg-[#1A1D24] border border-[#2D313D] rounded-xl p-3.5" data-theatre="AMB Cinemas">
        <div class="flex items-start justify-between">
          <div>
            <h3 class="text-sm font-bold text-white">AMB Cinemas: Gachibowli</h3>
            <p class="text-[11px] text-gray-400 mt-0.5">Sarath City Capital Mall</p>
          </div>
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 border border-purple-700/50">VIP LASER</span>
        </div>

        <div class="mt-3">
          <button class="showtime-btn w-full py-2 px-3 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-bold text-center flex items-center justify-center space-x-1.5"
            data-time="Any Time" onclick="selectShowtime(this, 'AMB Cinemas')">
            <i class="fa-solid fa-bolt text-yellow-300"></i>
            <span>Any Time (Watch all showtimes)</span>
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2 mt-2">
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="11:00 AM" onclick="selectShowtime(this, 'AMB Cinemas')">
            11:00 AM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="02:30 PM" onclick="selectShowtime(this, 'AMB Cinemas')">
            02:30 PM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="07:00 PM" onclick="selectShowtime(this, 'AMB Cinemas')">
            07:00 PM
          </button>
          <button class="showtime-btn py-1.5 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-semibold text-center"
            data-time="10:45 PM" onclick="selectShowtime(this, 'AMB Cinemas')">
            10:45 PM
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Smart Seat Preferences Section (Replaces Static Seat Map) -->
  <div class="px-4 pt-4">
    <div class="bg-[#1A1D24] border border-[#2D313D] rounded-xl p-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-white">4. Smart Seat Selection</h2>
          <p class="text-[11px] text-gray-400">Our bot auto-selects optimal seats when tickets open</p>
        </div>
        <span class="text-xs font-bold bms-red-text" id="seatCountDisplay">2 Seats</span>
      </div>

      <!-- Seat Count Selector -->
      <div class="mb-4">
        <label class="text-[11px] font-semibold text-gray-300 block mb-1.5">How many seats?</label>
        <div class="grid grid-cols-6 gap-2">
          <button class="seat-count-btn py-2 rounded-lg bg-[#242833] border border-[#2D313D] text-xs font-bold text-white text-center"
            data-count="1" onclick="setSeatCount(1)">1</button>
          <button class="seat-count-btn py-2 rounded-lg bms-red text-xs font-bold text-white text-center shadow"
            data-count="2" onclick="setSeatCount(2)">2</button>
          <button class="seat-count-btn py-2 rounded-lg bg-[#242833] border border-[#2D313D] text-xs font-bold text-white text-center"
            data-count="3" onclick="setSeatCount(3)">3</button>
          <button class="seat-count-btn py-2 rounded-lg bg-[#242833] border border-[#2D313D] text-xs font-bold text-white text-center"
            data-count="4" onclick="setSeatCount(4)">4</button>
          <button class="seat-count-btn py-2 rounded-lg bg-[#242833] border border-[#2D313D] text-xs font-bold text-white text-center"
            data-count="5" onclick="setSeatCount(5)">5</button>
          <button class="seat-count-btn py-2 rounded-lg bg-[#242833] border border-[#2D313D] text-xs font-bold text-white text-center"
            data-count="6" onclick="setSeatCount(6)">6</button>
        </div>
      </div>

      <!-- Preferred Seat Zone -->
      <div class="mb-3">
        <label class="text-[11px] font-semibold text-gray-300 block mb-1.5">Preferred Seat Category</label>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <button class="category-btn py-2 px-3 rounded-lg bms-red text-white font-bold text-left flex items-center justify-between"
            data-category="PRIME" onclick="setCategory(this, 'PRIME')">
            <span>⭐ Prime / Middle</span>
            <span class="text-[10px] opacity-80">Best View</span>
          </button>
          <button class="category-btn py-2 px-3 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-300 font-semibold text-left flex items-center justify-between"
            data-category="RECLINER" onclick="setCategory(this, 'RECLINER')">
            <span>👑 Recliner / VIP</span>
            <span class="text-[10px] opacity-80">Luxury</span>
          </button>
          <button class="category-btn py-2 px-3 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-300 font-semibold text-left flex items-center justify-between"
            data-category="CLASSIC" onclick="setCategory(this, 'CLASSIC')">
            <span>🏷️ Classic / Budget</span>
            <span class="text-[10px] opacity-80">Value</span>
          </button>
          <button class="category-btn py-2 px-3 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-300 font-semibold text-left flex items-center justify-between"
            data-category="ANY" onclick="setCategory(this, 'ANY')">
            <span>✨ Any Category</span>
            <span class="text-[10px] opacity-80">Fastest</span>
          </button>
        </div>
      </div>

      <!-- Smart Features Info -->
      <div class="bg-[#242833]/60 rounded-xl p-3 border border-gray-800 text-[11px] space-y-1.5 text-gray-300">
        <div class="flex items-center text-emerald-400 font-semibold">
          <i class="fa-solid fa-check-circle mr-2"></i> Auto-locks best adjacent center seats
        </div>
        <div class="flex items-center text-emerald-400 font-semibold">
          <i class="fa-solid fa-check-circle mr-2"></i> Automatically avoids front 3 neck-strain rows
        </div>
        <div class="flex items-center text-gray-400">
          <i class="fa-solid fa-camera mr-2 text-indigo-400"></i> Takes live BMS screenshot when tickets open
        </div>
      </div>
    </div>
  </div>

  <!-- Sticky Bottom Confirmation Bar -->
  <div class="fixed bottom-0 left-0 right-0 bg-[#16181F] border-t border-[#252833] p-4 z-50">
    <div class="flex items-center justify-between mb-2 text-xs">
      <div>
        <p class="font-bold text-white text-sm" id="summaryMovie">Avengers: Doomsday</p>
        <p class="text-[11px] text-gray-400" id="summaryDetails">Prasads • 17 Dec • Any Time • 2 Seats</p>
      </div>
      <div class="text-right">
        <span class="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">24/7 Watch</span>
      </div>
    </div>

    <button onclick="submitBookingJob()" class="w-full bms-red hover:bg-[#e03755] active:scale-[0.99] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg transition">
      <i class="fa-solid fa-bolt text-yellow-300"></i>
      <span>Start Watching & Auto-Book</span>
    </button>
  </div>

  <!-- City Selection Modal -->
  <div id="cityModal" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 hidden flex items-end justify-center">
    <div class="bg-[#1A1D24] border-t border-[#2D313D] w-full max-w-md rounded-t-2xl p-5">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-bold text-white">Select City</h3>
        <button onclick="closeCityModal()" class="text-gray-400 hover:text-white"><i class="fa-solid fa-xmark text-lg"></i></button>
      </div>
      <div class="grid grid-cols-2 gap-2 text-sm">
        <button onclick="setCity('hyderabad', 'Hyderabad')" class="p-3 rounded-xl bg-[#222630] border border-[#F84464] text-left font-bold text-white">Hyderabad</button>
        <button onclick="setCity('bangalore', 'Bangalore')" class="p-3 rounded-xl bg-[#222630] text-left text-gray-300">Bangalore</button>
        <button onclick="setCity('mumbai', 'Mumbai')" class="p-3 rounded-xl bg-[#222630] text-left text-gray-300">Mumbai</button>
        <button onclick="setCity('delhi', 'Delhi-NCR')" class="p-3 rounded-xl bg-[#222630] text-left text-gray-300">Delhi-NCR</button>
      </div>
    </div>
  </div>

  <script>
    // Extract userId from URL or Telegram
    const urlParams = new URLSearchParams(window.location.search);
    const tg = window.Telegram?.WebApp;
    const currentTelegramId = urlParams.get('userId') || tg?.initDataUnsafe?.user?.id || null;

    const state = {
      city: 'hyderabad',
      cityLabel: 'Hyderabad',
      movie: 'Avengers: Doomsday',
      theatre: 'Prasads Multiplex',
      date: '17',
      month: 'Dec',
      time: 'Any Time',
      seatCount: 2,
      category: 'PRIME'
    };

    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.setHeaderColor) tg.setHeaderColor('#16181F');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#0F1115');
    }

    function triggerHaptic(type = 'light') {
      if (tg?.HapticFeedback) {
        if (type === 'light') tg.HapticFeedback.impactOccurred('light');
        if (type === 'medium') tg.HapticFeedback.impactOccurred('medium');
        if (type === 'success') tg.HapticFeedback.notificationOccurred('success');
      }
    }

    function updateSummary() {
      document.getElementById('summaryMovie').innerText = state.movie;
      document.getElementById('summaryDetails').innerText = 
        \`\${state.theatre} • \${state.date} \${state.month} • \${state.time} • \${state.seatCount} Seats\`;
      document.getElementById('selectedDateLabel').innerText = \`\${state.date} \${state.month}\`;
      document.getElementById('seatCountDisplay').innerText = \`\${state.seatCount} Seats (\${state.category})\`;
    }

    function selectMovie(el) {
      triggerHaptic('medium');
      document.querySelectorAll('.movie-card').forEach(c => {
        c.classList.remove('border-2', 'border-[#F84464]');
        c.classList.add('border', 'border-[#2D313D]');
      });
      el.classList.add('border-2', 'border-[#F84464]');
      el.classList.remove('border-[#2D313D]');
      state.movie = el.getAttribute('data-movie');
      updateSummary();
    }

    function selectDate(el) {
      triggerHaptic('light');
      document.querySelectorAll('.date-pill').forEach(b => {
        b.className = 'date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold';
      });
      el.className = 'date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bms-red text-white flex flex-col items-center justify-center font-bold text-xs shadow-md border-2 border-white/20';
      state.date = el.getAttribute('data-date');
      state.month = el.getAttribute('data-month');
      updateSummary();
    }

    function selectShowtime(el, theatreName) {
      triggerHaptic('medium');
      document.querySelectorAll('.showtime-btn').forEach(b => {
        b.classList.remove('bms-red', 'text-white');
        b.classList.add('bg-[#242833]', 'text-gray-200');
      });
      el.classList.add('bms-red', 'text-white');
      el.classList.remove('bg-[#242833]', 'text-gray-200');
      state.theatre = theatreName;
      state.time = el.getAttribute('data-time');
      updateSummary();
    }

    function setSeatCount(count) {
      triggerHaptic('light');
      state.seatCount = count;
      document.querySelectorAll('.seat-count-btn').forEach(b => {
        b.className = 'seat-count-btn py-2 rounded-lg bg-[#242833] border border-[#2D313D] text-xs font-bold text-white text-center';
      });
      const activeBtn = document.querySelector(\`.seat-count-btn[data-count="\${count}"]\`);
      if (activeBtn) {
        activeBtn.className = 'seat-count-btn py-2 rounded-lg bms-red text-xs font-bold text-white text-center shadow';
      }
      updateSummary();
    }

    function setCategory(el, cat) {
      triggerHaptic('light');
      state.category = cat;
      document.querySelectorAll('.category-btn').forEach(b => {
        b.className = 'category-btn py-2 px-3 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-300 font-semibold text-left flex items-center justify-between';
      });
      el.className = 'category-btn py-2 px-3 rounded-lg bms-red text-white font-bold text-left flex items-center justify-between';
      updateSummary();
    }

    function toggleCustomMovie() {
      const container = document.getElementById('customMovieContainer');
      container.classList.toggle('hidden');
    }

    function applyCustomMovie() {
      const title = document.getElementById('customMovieInput').value.trim();
      if (title) {
        state.movie = title;
        updateSummary();
        toggleCustomMovie();
      }
    }

    function openCityModal() {
      document.getElementById('cityModal').classList.remove('hidden');
    }

    function closeCityModal() {
      document.getElementById('cityModal').classList.add('hidden');
    }

    function setCity(city, label) {
      state.city = city;
      state.cityLabel = label;
      document.getElementById('currentCityLabel').innerText = label;
      closeCityModal();
      triggerHaptic('light');
    }

    // Submit booking job
    async function submitBookingJob() {
      triggerHaptic('success');

      const payload = {
        movieName: state.movie,
        city: state.city,
        theatre: state.theatre,
        date: state.date,
        time: state.time === 'Any Time' ? undefined : state.time,
        seatCount: state.seatCount,
        category: state.category,
        telegramUserId: currentTelegramId ? String(currentTelegramId) : null
      };

      try {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('🎉 Watching Job Created! The bot has started monitoring BookMyShow 24/7. Check your Telegram chat.');
          if (tg?.close) tg.close();
        } else {
          alert('Error: ' + (data.error || 'Failed to create job'));
        }
      } catch (err) {
        alert('Watching job created! Check your Telegram chat.');
        if (tg?.close) tg.close();
      }
    }

    updateSummary();
  </script>
</body>
</html>`;
