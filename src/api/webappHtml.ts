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
    .seat {
      width: 22px;
      height: 22px;
      font-size: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
      transition: all 0.15s ease;
    }
    .seat-available { border: 1.5px solid #1EA83C; color: #1EA83C; background: rgba(30,168,60,0.08); }
    .seat-selected { background-color: #F84464 !important; border-color: #F84464 !important; color: white !important; font-weight: bold; transform: scale(1.1); }
    .seat-occupied { background-color: #2D3139; color: #535965; border: 1.5px solid transparent; cursor: not-allowed; }
  </style>
</head>
<body class="pb-32">
  <!-- Top Navigation Bar -->
  <header class="sticky top-0 z-50 bg-[#16181F] border-b border-[#252833] px-4 py-3 flex items-center justify-between">
    <div class="flex items-center space-x-2">
      <div class="w-8 h-8 rounded-lg bms-red flex items-center justify-center font-black text-white text-base tracking-tighter">
        BMS
      </div>
      <div>
        <h1 class="text-sm font-bold text-white leading-tight">BookMyShow</h1>
        <div class="flex items-center text-xs text-gray-400 cursor-pointer" onclick="openCityModal()">
          <i class="fa-solid fa-location-dot mr-1 bms-red-text"></i>
          <span id="currentCityLabel">Hyderabad</span>
          <i class="fa-solid fa-chevron-down ml-1 text-[10px]"></i>
        </div>
      </div>
    </div>
    <div class="text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 font-medium flex items-center">
      <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span> Live Bot
    </div>
  </header>

  <!-- Search Bar -->
  <div class="px-4 pt-3 pb-1">
    <div class="relative">
      <i class="fa-solid fa-magnifying-glass absolute left-3 top-3 text-gray-400 text-sm"></i>
      <input type="text" id="movieSearchInput" placeholder="Search movies, theatres..." 
        class="w-full bg-[#1F222B] border border-[#2D313D] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#F84464]">
    </div>
  </div>

  <!-- Movie Selector Section -->
  <div class="pt-3">
    <div class="px-4 flex items-center justify-between mb-2">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">Select Movie</h2>
      <span class="text-[11px] bms-red-text font-medium cursor-pointer" onclick="toggleCustomMovie()">Custom Title +</span>
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
        <div class="relative h-48 bg-gradient-to-t from-black via-zinc-800 to-zinc-700 flex flex-col justify-end p-2.5">
          <div class="absolute top-2 left-2 bms-red text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow">
            ADVANCE 17 DEC
          </div>
          <div class="absolute top-2 right-2 bg-black/70 text-yellow-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center">
            ★ 9.8
          </div>
          <h3 class="text-xs font-bold text-white leading-tight">Avengers: Doomsday</h3>
          <p class="text-[10px] text-gray-300">Action / Sci-Fi</p>
        </div>
      </div>

      <!-- Movie 2: Pushpa 2: The Rule -->
      <div class="movie-card flex-shrink-0 w-36 bg-[#1A1D24] rounded-xl border border-[#2D313D] overflow-hidden cursor-pointer"
        data-movie="Pushpa 2: The Rule" onclick="selectMovie(this)">
        <div class="relative h-48 bg-gradient-to-t from-black via-amber-950 to-amber-900 flex flex-col justify-end p-2.5">
          <div class="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            TRENDING
          </div>
          <h3 class="text-xs font-bold text-white leading-tight">Pushpa 2: The Rule</h3>
          <p class="text-[10px] text-gray-300">Action / Drama</p>
        </div>
      </div>

      <!-- Movie 3: Avatar: Fire and Ash -->
      <div class="movie-card flex-shrink-0 w-36 bg-[#1A1D24] rounded-xl border border-[#2D313D] overflow-hidden cursor-pointer"
        data-movie="Avatar: Fire and Ash" onclick="selectMovie(this)">
        <div class="relative h-48 bg-gradient-to-t from-black via-blue-950 to-blue-900 flex flex-col justify-end p-2.5">
          <div class="absolute top-2 left-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
            IMAX 3D
          </div>
          <h3 class="text-xs font-bold text-white leading-tight">Avatar: Fire & Ash</h3>
          <p class="text-[10px] text-gray-300">Sci-Fi / Adventure</p>
        </div>
      </div>

      <!-- Movie 4: Kalki 2898 AD -->
      <div class="movie-card flex-shrink-0 w-36 bg-[#1A1D24] rounded-xl border border-[#2D313D] overflow-hidden cursor-pointer"
        data-movie="Kalki 2898 AD" onclick="selectMovie(this)">
        <div class="relative h-48 bg-gradient-to-t from-black via-slate-900 to-slate-800 flex flex-col justify-end p-2.5">
          <h3 class="text-xs font-bold text-white leading-tight">Kalki 2898 AD</h3>
          <p class="text-[10px] text-gray-300">Mythology / Sci-Fi</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Date Selection Slider -->
  <div class="px-4 pt-3">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">Select Date</h2>
      <span class="text-[11px] text-gray-400" id="selectedDateLabel">17 Dec (Advance)</span>
    </div>
    <div class="flex space-x-2 overflow-x-auto no-scrollbar pb-1" id="datePillContainer">
      <!-- Advance booking button: 17 Dec (Pre-selected) -->
      <button class="date-pill flex-shrink-0 px-3.5 py-2 rounded-xl bms-red text-white flex flex-col items-center justify-center font-bold text-xs shadow-md border-2 border-white/20"
        data-date="17" data-month="Dec" onclick="selectDate(this)">
        <span class="text-[9px] uppercase font-semibold text-rose-200">WED</span>
        <span class="text-base font-black">17</span>
        <span class="text-[9px] uppercase font-bold text-yellow-300">DEC</span>
      </button>

      <!-- Today -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="18" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase font-normal text-gray-400">TODAY</span>
        <span class="text-base font-bold text-white">18</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>

      <!-- Day + 1 -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="19" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase font-normal text-gray-400">THU</span>
        <span class="text-base font-bold text-white">19</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>

      <!-- Day + 2 -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="20" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase font-normal text-gray-400">FRI</span>
        <span class="text-base font-bold text-white">20</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>

      <!-- Day + 3 -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="21" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase font-normal text-gray-400">SAT</span>
        <span class="text-base font-bold text-white">21</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>

      <!-- Day + 4 -->
      <button class="date-pill flex-shrink-0 px-3 py-2 rounded-xl bg-[#1A1D24] border border-[#2D313D] text-gray-300 flex flex-col items-center justify-center text-xs font-semibold"
        data-date="22" data-month="Nov" onclick="selectDate(this)">
        <span class="text-[9px] uppercase font-normal text-gray-400">SUN</span>
        <span class="text-base font-bold text-white">22</span>
        <span class="text-[9px] uppercase text-gray-400">NOV</span>
      </button>
    </div>
  </div>

  <!-- Theatres & Showtimes Section -->
  <div class="px-4 pt-4">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-xs font-bold uppercase tracking-wider text-gray-400">Cinemas & Showtimes</h2>
      <span class="text-[11px] text-gray-400">Tap time to pick</span>
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

        <div class="grid grid-cols-3 gap-2 mt-3">
          <button class="showtime-btn py-2 px-2 rounded-lg bg-[#242833] border border-emerald-500/50 text-emerald-400 text-xs font-bold text-center flex flex-col items-center"
            data-time="10:30 AM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            <span>10:30 AM</span>
            <span class="text-[9px] font-normal text-gray-400">Screen 6</span>
          </button>
          <button class="showtime-btn py-2 px-2 rounded-lg bms-red text-white text-xs font-bold text-center flex flex-col items-center shadow"
            data-time="02:00 PM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            <span>02:00 PM</span>
            <span class="text-[9px] font-medium text-rose-200">IMAX PCX</span>
          </button>
          <button class="showtime-btn py-2 px-2 rounded-lg bg-[#242833] border border-emerald-500/50 text-emerald-400 text-xs font-bold text-center flex flex-col items-center"
            data-time="06:30 PM" onclick="selectShowtime(this, 'Prasads Multiplex')">
            <span>06:30 PM</span>
            <span class="text-[9px] font-normal text-gray-400">Screen 6</span>
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

        <div class="grid grid-cols-3 gap-2 mt-3">
          <button class="showtime-btn py-2 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-bold text-center flex flex-col items-center"
            data-time="11:00 AM" onclick="selectShowtime(this, 'AMB Cinemas')">
            <span>11:00 AM</span>
            <span class="text-[9px] font-normal text-gray-400">Screen 1</span>
          </button>
          <button class="showtime-btn py-2 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-bold text-center flex flex-col items-center"
            data-time="07:00 PM" onclick="selectShowtime(this, 'AMB Cinemas')">
            <span>07:00 PM</span>
            <span class="text-[9px] font-normal text-gray-400">Laser 4K</span>
          </button>
          <button class="showtime-btn py-2 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-bold text-center flex flex-col items-center"
            data-time="10:45 PM" onclick="selectShowtime(this, 'AMB Cinemas')">
            <span>10:45 PM</span>
            <span class="text-[9px] font-normal text-gray-400">Late Night</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Interactive Seat Selection Map -->
  <div class="px-4 pt-4">
    <div class="bg-[#1A1D24] border border-[#2D313D] rounded-xl p-4">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h2 class="text-xs font-bold uppercase tracking-wider text-white">Live Seat Layout</h2>
          <p class="text-[11px] text-gray-400">Tap seats to pick optimal spots</p>
        </div>
        <div class="flex items-center space-x-2 text-[10px]">
          <div class="flex items-center"><span class="w-3 h-3 rounded seat-available mr-1"></span> Avail</div>
          <div class="flex items-center"><span class="w-3 h-3 rounded seat-selected mr-1"></span> Picked</div>
          <div class="flex items-center"><span class="w-3 h-3 rounded seat-occupied mr-1"></span> Sold</div>
        </div>
      </div>

      <!-- Curved Screen Line -->
      <div class="my-4 text-center">
        <div class="h-1.5 w-3/4 mx-auto bg-gradient-to-r from-transparent via-[#F84464] to-transparent rounded-full shadow-[0_0_12px_#F84464]"></div>
        <p class="text-[9px] font-bold uppercase tracking-widest text-gray-500 mt-1.5">SCREEN THIS WAY</p>
      </div>

      <!-- Seats Grid Container -->
      <div class="overflow-x-auto no-scrollbar py-2">
        <div class="min-w-[280px] flex flex-col items-center space-y-2" id="seatGrid">
          <!-- Prime Tier (Row D) -->
          <div class="text-[10px] text-gray-400 font-semibold w-full text-left border-b border-gray-800 pb-1">PRIME - ₹295</div>
          <div class="flex items-center space-x-1.5">
            <span class="text-[10px] text-gray-400 font-bold w-3">D</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'D1')">1</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'D2')">2</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'D3')">3</span>
            <span class="w-2"></span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'D4')">4</span>
            <span class="seat seat-selected" onclick="toggleSeat(this, 'D5')">5</span>
            <span class="seat seat-selected" onclick="toggleSeat(this, 'D6')">6</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'D7')">7</span>
            <span class="w-2"></span>
            <span class="seat seat-occupied">8</span>
            <span class="seat seat-occupied">9</span>
          </div>

          <!-- Prime Tier (Row E) -->
          <div class="flex items-center space-x-1.5">
            <span class="text-[10px] text-gray-400 font-bold w-3">E</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E1')">1</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E2')">2</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E3')">3</span>
            <span class="w-2"></span>
            <span class="seat seat-occupied">4</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E5')">5</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E6')">6</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E7')">7</span>
            <span class="w-2"></span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E8')">8</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'E9')">9</span>
          </div>

          <!-- Classic Tier (Row F) -->
          <div class="text-[10px] text-gray-400 font-semibold w-full text-left border-b border-gray-800 pt-2 pb-1">CLASSIC - ₹175</div>
          <div class="flex items-center space-x-1.5">
            <span class="text-[10px] text-gray-400 font-bold w-3">F</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'F1')">1</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'F2')">2</span>
            <span class="seat seat-occupied">3</span>
            <span class="w-2"></span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'F4')">4</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'F5')">5</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'F6')">6</span>
            <span class="seat seat-available" onclick="toggleSeat(this, 'F7')">7</span>
            <span class="w-2"></span>
            <span class="seat seat-occupied">8</span>
            <span class="seat seat-occupied">9</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sticky Bottom Confirmation Bar -->
  <div class="fixed bottom-0 left-0 right-0 bg-[#16181F] border-t border-[#252833] p-4 z-50">
    <div class="flex items-center justify-between mb-2 text-xs">
      <div>
        <p class="font-bold text-white text-sm" id="summaryMovie">Avengers: Doomsday</p>
        <p class="text-[11px] text-gray-400" id="summaryDetails">Prasads • 17 Dec • 02:00 PM • <span id="summarySeats">2 Seats (D5, D6)</span></p>
      </div>
      <div class="text-right">
        <span class="text-xs text-gray-400">Total</span>
        <p class="text-base font-black text-white" id="summaryPrice">₹590</p>
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
    // State management
    const state = {
      city: 'hyderabad',
      cityLabel: 'Hyderabad',
      movie: 'Avengers: Doomsday',
      theatre: 'Prasads Multiplex',
      date: '17',
      month: 'Dec',
      time: '02:00 PM',
      seats: ['D5', 'D6'],
      seatCount: 2,
      pricePerSeat: 295
    };

    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp;
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
        \`\${state.theatre} • \${state.date} \${state.month} • \${state.time} • \${state.seats.length} Seats (\${state.seats.join(', ') || 'Auto'})\`;
      const total = state.seats.length * state.pricePerSeat;
      document.getElementById('summaryPrice').innerText = total > 0 ? \`₹\${total}\` : '₹0';
      document.getElementById('selectedDateLabel').innerText = \`\${state.date} \${state.month}\`;
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
        b.className = 'showtime-btn py-2 px-2 rounded-lg bg-[#242833] border border-[#2D313D] text-gray-200 text-xs font-bold text-center flex flex-col items-center';
      });
      el.className = 'showtime-btn py-2 px-2 rounded-lg bms-red text-white text-xs font-bold text-center flex flex-col items-center shadow';
      state.theatre = theatreName;
      state.time = el.getAttribute('data-time');
      updateSummary();
    }

    function toggleSeat(el, seatId) {
      triggerHaptic('light');
      const idx = state.seats.indexOf(seatId);
      if (idx > -1) {
        state.seats.splice(idx, 1);
        el.className = 'seat seat-available';
      } else {
        state.seats.push(seatId);
        el.className = 'seat seat-selected';
      }
      state.seatCount = state.seats.length || 2;
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

    // Submit booking job directly back to Telegram or backend API
    async function submitBookingJob() {
      triggerHaptic('success');

      const payload = {
        movieName: state.movie,
        city: state.city,
        theatre: state.theatre,
        date: state.date,
        time: state.time,
        seatCount: state.seats.length || 2,
        seats: state.seats,
        telegramUser: tg?.initDataUnsafe?.user || null
      };

      // If running inside Telegram WebApp
      if (tg && tg.sendData) {
        tg.sendData(JSON.stringify(payload));
        return;
      }

      // Fallback: Post to API
      try {
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert('Booking Job Created Successfully! Returning to Bot...');
          if (tg?.close) tg.close();
        } else {
          alert('Could not create job: ' + (data.error || 'Unknown error'));
        }
      } catch (err) {
        alert('Created job for watching! (Check Telegram bot chat for updates)');
      }
    }

    updateSummary();
  </script>
</body>
</html>`;
