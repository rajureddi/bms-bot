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

  <!-- Dynamic Date Selection Section -->
  <div class="px-4 pt-3">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center space-x-2">
        <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">2. Select Date</h2>
        <span class="text-[11px] bms-red-text font-bold" id="selectedDateLabel">Select Date</span>
      </div>
      <!-- Native Calendar Date Picker -->
      <label class="flex items-center space-x-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 cursor-pointer hover:border-[#F84464] active:scale-95 transition shadow-sm">
        <i class="fa-regular fa-calendar-days text-[#F84464]"></i>
        <span>Calendar</span>
        <input type="date" id="calendarPicker" class="sr-only" onchange="pickCalendarDate(this.value)">
      </label>
    </div>

    <!-- Quick Date Filter Chips -->
    <div class="flex items-center space-x-1.5 mb-2.5 overflow-x-auto no-scrollbar text-[11px]">
      <button type="button" class="date-chip px-2.5 py-0.5 rounded-full bg-[#242833] text-gray-300 font-semibold border border-[#2D313D] hover:border-gray-500 whitespace-nowrap active:bg-[#F84464]" onclick="filterDateRange('today')">Today</button>
      <button type="button" class="date-chip px-2.5 py-0.5 rounded-full bg-[#242833] text-gray-300 font-semibold border border-[#2D313D] hover:border-gray-500 whitespace-nowrap active:bg-[#F84464]" onclick="filterDateRange('this_week')">This Week</button>
      <button type="button" class="date-chip px-2.5 py-0.5 rounded-full bg-[#242833] text-gray-300 font-semibold border border-[#2D313D] hover:border-gray-500 whitespace-nowrap active:bg-[#F84464]" onclick="filterDateRange('next_week')">Next Week</button>
      <button type="button" class="date-chip px-2.5 py-0.5 rounded-full bg-[#242833] text-gray-300 font-semibold border border-[#2D313D] hover:border-gray-500 whitespace-nowrap active:bg-[#F84464]" onclick="filterDateRange('december')">December (Advance)</button>
      <button type="button" class="date-chip px-2.5 py-0.5 rounded-full bg-[#242833] text-gray-300 font-semibold border border-[#2D313D] hover:border-gray-500 whitespace-nowrap active:bg-[#F84464]" onclick="filterDateRange('all')">View All (60 Days)</button>
    </div>

    <!-- Dynamically Rendered Date Strip -->
    <div class="flex space-x-2 overflow-x-auto no-scrollbar pb-1" id="datePillContainer">
      <!-- Populated dynamically via initDateStrip() -->
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
    function getTelegramUserId() {
      const fromParam = urlParams.get('userId');
      if (fromParam && fromParam !== 'null' && fromParam !== 'undefined' && fromParam.trim() !== '') {
        return fromParam.trim();
      }
      const fromTg = tg?.initDataUnsafe?.user?.id;
      if (fromTg && String(fromTg) !== 'null' && String(fromTg) !== 'undefined') {
        return String(fromTg);
      }
      return '647187240';
    }
    const currentTelegramId = getTelegramUserId();

    const state = {
      city: 'hyderabad',
      cityLabel: 'Hyderabad',
      movie: 'Avengers: Doomsday',
      theatre: 'Prasads Multiplex: Hyderabad',
      date: '17',
      month: 'Dec',
      fullDate: null,
      time: 'Any Time',
      seatCount: 2,
      category: 'PRIME',
      screen: 'PCX'
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
      var dateDisplay = state.date === 'any' ? 'Any Date' : (state.date + ' ' + state.month);
      document.getElementById('summaryDetails').innerText = 
        state.theatre + ' • ' + dateDisplay + ' • ' + state.time + ' • ' + state.seatCount + ' Seats';
      document.getElementById('selectedDateLabel').innerText = dateDisplay;
      document.getElementById('seatCountDisplay').innerText = state.seatCount + ' Seats (' + state.category + ')';
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

    // Dynamic Date Strip Generation (No Hardcoded Dates)
    function initDateStrip() {
      var container = document.getElementById('datePillContainer');
      if (!container) return;
      container.innerHTML = '';

      // 1. Any Date Option
      var anyPill = document.createElement('button');
      anyPill.type = 'button';
      anyPill.className = 'date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold cursor-pointer hover:border-gray-500 transition';
      anyPill.setAttribute('data-date', 'any');
      anyPill.setAttribute('data-month', '');
      anyPill.innerHTML = '<span class="text-[9px] uppercase text-gray-400">ANY</span>' +
        '<span class="text-base font-bold text-white"><i class="fa-solid fa-infinity text-xs text-yellow-300"></i></span>' +
        '<span class="text-[9px] uppercase text-gray-400">DATE</span>';
      anyPill.onclick = function() { selectDate(anyPill, 'any', 'Any Date', null); };
      container.appendChild(anyPill);

      var today = new Date();
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

      // Generate next 60 days dynamically from real clock
      for (var i = 0; i < 60; i++) {
        var d = new Date(today);
        d.setDate(today.getDate() + i);

        var dayNum = d.getDate().toString();
        var monthStr = monthNames[d.getMonth()];
        var dayOfWeek = i === 0 ? 'TODAY' : (i === 1 ? 'TMRW' : dayNames[d.getDay()]);
        var mNum = (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1);
        var dtNum = (d.getDate() < 10 ? '0' : '') + d.getDate();
        var yyyymmdd = d.getFullYear() + '-' + mNum + '-' + dtNum;

        var isDefault = (monthStr === 'Dec' && (dayNum === '17' || dayNum === '18')) || (i === 0 && state.month !== 'Dec');

        var pill = document.createElement('button');
        pill.type = 'button';
        pill.id = 'date-pill-' + yyyymmdd;
        pill.setAttribute('data-date', dayNum);
        pill.setAttribute('data-month', monthStr);
        pill.setAttribute('data-full-date', yyyymmdd);
        pill.className = 'date-pill flex-shrink-0 px-3.5 py-2 rounded-xl ' +
          (isDefault ? 'bms-red text-white shadow-md border-2 border-white/20' : 'bg-[#1A1D24] border border-[#2D313D] text-gray-300') +
          ' flex flex-col items-center justify-center text-xs font-semibold cursor-pointer hover:border-gray-500 transition';

        pill.innerHTML = '<span class="text-[9px] uppercase ' + (isDefault ? 'text-white/80 font-bold' : 'text-gray-400') + '">' + dayOfWeek + '</span>' +
          '<span class="text-base font-bold text-white">' + dayNum + '</span>' +
          '<span class="text-[9px] uppercase font-bold ' + (isDefault ? 'text-yellow-300' : 'text-gray-400') + '">' + monthStr + '</span>';

        (function(targetPill, targetDay, targetMonth, targetYmd) {
          targetPill.onclick = function() { selectDate(targetPill, targetDay, targetMonth, targetYmd); };
        })(pill, dayNum, monthStr, yyyymmdd);

        container.appendChild(pill);

        if (isDefault && !state.fullDate) {
          state.date = dayNum;
          state.month = monthStr;
          state.fullDate = yyyymmdd;
        }
      }
    }

    function selectDate(el, day, month, fullDate) {
      triggerHaptic('light');
      document.querySelectorAll('.date-pill').forEach(b => {
        b.className = 'date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold cursor-pointer hover:border-gray-500 transition';
      });
      el.className = 'date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bms-red text-white flex flex-col items-center justify-center font-bold text-xs shadow-md border-2 border-white/20 cursor-pointer';
      
      state.date = day;
      state.month = month;
      state.fullDate = fullDate;
      updateSummary();
    }

    // Pick date from native calendar
    function pickCalendarDate(val) {
      if (!val) return;
      triggerHaptic('medium');
      var parts = val.split('-');
      var monthIdx = parseInt(parts[1], 10) - 1;
      var day = parseInt(parts[2], 10).toString();
      var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var monthStr = monthNames[monthIdx];

      state.date = day;
      state.month = monthStr;
      state.fullDate = val;

      document.querySelectorAll('.date-pill').forEach(b => {
        b.className = 'date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold cursor-pointer hover:border-gray-500 transition';
      });

      var existingPill = document.getElementById('date-pill-' + val);
      if (!existingPill) {
        var container = document.getElementById('datePillContainer');
        existingPill = document.createElement('button');
        existingPill.type = 'button';
        existingPill.id = 'date-pill-' + val;
        existingPill.setAttribute('data-date', day);
        existingPill.setAttribute('data-month', monthStr);
        existingPill.setAttribute('data-full-date', val);
        existingPill.innerHTML = '<span class="text-[9px] uppercase text-rose-200 font-bold">PICKED</span>' +
          '<span class="text-base font-bold text-white">' + day + '</span>' +
          '<span class="text-[9px] uppercase font-bold text-yellow-300">' + monthStr + '</span>';
        (function(customPill, cDay, cMonth, cVal) {
          customPill.onclick = function() { selectDate(customPill, cDay, cMonth, cVal); };
        })(existingPill, day, monthStr, val);
        container.insertBefore(existingPill, container.children[1] || null);
      }

      existingPill.className = 'date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bms-red text-white flex flex-col items-center justify-center font-bold text-xs shadow-md border-2 border-white/20 cursor-pointer';
      existingPill.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });

      updateSummary();
    }

    // Filter range jumping
    function filterDateRange(range) {
      triggerHaptic('light');
      const container = document.getElementById('datePillContainer');
      if (!container) return;

      if (range === 'today' || range === 'all') {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (range === 'this_week') {
        const firstPill = container.children[1];
        if (firstPill) firstPill.scrollIntoView({ behavior: 'smooth', inline: 'start' });
      } else if (range === 'next_week') {
        const nextWeekPill = container.children[8];
        if (nextWeekPill) nextWeekPill.scrollIntoView({ behavior: 'smooth', inline: 'start' });
      } else if (range === 'december') {
        const decPill = Array.from(container.querySelectorAll('.date-pill')).find(p => p.getAttribute('data-month') === 'Dec');
        if (decPill) {
          decPill.scrollIntoView({ behavior: 'smooth', inline: 'start' });
          decPill.click();
        }
      }
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
        month: state.month,
        fullDate: state.fullDate,
        time: state.time === 'Any Time' ? undefined : state.time,
        seatCount: state.seatCount,
        category: state.category,
        screen: state.screen || 'PCX',
        telegramUserId: getTelegramUserId()
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
        console.error('Job creation error:', err);
        alert('❌ Failed to create job: Could not reach bot server. Please verify the Railway server is online or click Apply Changes in Railway dashboard.');
      }
    }

    initDateStrip();
    updateSummary();
  </script>
</body>
</html>`;
