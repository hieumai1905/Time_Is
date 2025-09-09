// Mapping của quốc gia và tên hiển thị
const countryNames = {
    'Asia/Ho_Chi_Minh': 'Việt Nam',
    'Asia/Bangkok': 'Thái Lan',
    'Asia/Singapore': 'Singapore',
    'Asia/Kuala_Lumpur': 'Malaysia',
    'Asia/Jakarta': 'Indonesia',
    'Asia/Manila': 'Philippines',
    'Asia/Phnom_Penh': 'Campuchia',
    'Asia/Vientiane': 'Lào',
    'Asia/Yangon': 'Myanmar',
    'Asia/Brunei': 'Brunei'
};

// Lấy các elements
const countrySelect = document.getElementById('country-select');
const timeDisplay = document.getElementById('time-display');
const countryNameElement = document.getElementById('country-name');
const timezoneElement = document.getElementById('timezone');
const currentTimeElement = document.getElementById('current-time');
const currentDateElement = document.getElementById('current-date');

let updateInterval;

// Hàm cập nhật thời gian
function updateTime(timezone) {
    try {
        const now = new Date();
        
        // Tạo formatter cho thời gian
        const timeFormatter = new Intl.DateTimeFormat('vi-VN', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        // Tạo formatter cho ngày tháng
        const dateFormatter = new Intl.DateTimeFormat('vi-VN', {
            timeZone: timezone,
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Lấy offset timezone
        const offsetFormatter = new Intl.DateTimeFormat('en', {
            timeZone: timezone,
            timeZoneName: 'longOffset'
        });
        
        const parts = offsetFormatter.formatToParts(now);
        const timeZoneName = parts.find(part => part.type === 'timeZoneName');
        const offset = timeZoneName ? timeZoneName.value : '';
        
        // Cập nhật hiển thị
        currentTimeElement.textContent = timeFormatter.format(now);
        currentDateElement.textContent = dateFormatter.format(now);
        timezoneElement.textContent = `${timezone} (${offset})`;
        
    } catch (error) {
        console.error('Lỗi khi cập nhật thời gian:', error);
        currentTimeElement.textContent = 'Lỗi hiển thị thời gian';
        currentDateElement.textContent = 'Lỗi hiển thị ngày';
        timezoneElement.textContent = 'Lỗi múi giờ';
    }
}

// Hàm hiển thị thông tin thời gian
function showTimeInfo(timezone) {
    if (!timezone) {
        timeDisplay.style.display = 'none';
        if (updateInterval) {
            clearInterval(updateInterval);
        }
        return;
    }
    
    // Hiển thị tên quốc gia
    countryNameElement.textContent = countryNames[timezone] || timezone;
    
    // Cập nhật thời gian ngay lập tức
    updateTime(timezone);
    
    // Hiển thị khung thời gian
    timeDisplay.style.display = 'block';
    
    // Xóa interval cũ nếu có
    if (updateInterval) {
        clearInterval(updateInterval);
    }
    
    // Cập nhật thời gian mỗi giây
    updateInterval = setInterval(() => {
        updateTime(timezone);
    }, 1000);
}

// Event listener cho select
countrySelect.addEventListener('change', function() {
    const selectedTimezone = this.value;
    showTimeInfo(selectedTimezone);
});

// Kiểm tra xem có hỗ trợ Intl API không
if (!window.Intl) {
    alert('Trình duyệt của bạn không hỗ trợ hiển thị thời gian quốc tế. Vui lòng cập nhật trình duyệt.');
}

// Cleanup khi trang được đóng
window.addEventListener('beforeunload', function() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});