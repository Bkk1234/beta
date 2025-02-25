// ฟังก์ชันเพื่อโหลดข้อมูลเวลาเดินรถ
function loadSchedule(routeId, filter) {
  fetch('data1/bus-contact.json')  // ปรับ path ตามตำแหน่งไฟล์ JSON
    .then(response => response.json())
    .then(data => {
      // ค้นหา route ที่ตรงกับ routeId
      const route = data.routes.find(route => route.route_id === routeId);

      if (route) {
        const scheduleElement = document.getElementById('scheduleInfo');

        // กำหนดเวลาปัจจุบัน
        const now = new Date();
        const currentHour = now.getHours();

        // กรองเวลาเดินรถตาม filter
        let filteredSchedule = route.schedule;
        if (filter === 'near') {
          filteredSchedule = route.schedule.filter(time => {
            const [hour] = time.split(':').map(Number);
            return Math.abs(hour - currentHour) <= 1; // กรองเวลาเดินรถในช่วง ±1 ชั่วโมง
          });
        }

        // สร้างรายการเวลาเดินรถ
        const scheduleList = filteredSchedule.length
          ? filteredSchedule.map(time => `<li>${time}</li>`).join('')
          : '<li>ไม่มีเวลาเดินรถในช่วงที่เลือก</li>';

        // แสดงข้อมูลเวลาเดินรถ
        scheduleElement.innerHTML = `
          <h4>เวลาเดินรถสำหรับ ${route.route_name}</h4>
          <ul>${scheduleList}</ul>
        `;
      } else {
        document.getElementById('scheduleInfo').innerHTML = `<p>ไม่พบข้อมูลเวลาเดินรถสำหรับสายรถนี้</p>`;
      }
    })
    .catch(error => {
      console.error('Error fetching schedule data:', error);
      document.getElementById('scheduleInfo').innerHTML = `<p>เกิดข้อผิดพลาดในการโหลดข้อมูลเวลาเดินรถ</p>`;
    });
}

// Event Listener เมื่อเลือกสายรถ
document.getElementById('routeSelect').addEventListener('change', function (event) {
  const routeId = event.target.value;
  const filterSelect = document.getElementById('filterSelect');
  
  if (routeId) {
    filterSelect.disabled = false; // เปิดใช้งาน filterSelect
    document.getElementById('scheduleInfo').innerHTML = ''; // ล้างข้อมูลเก่า
  } else {
    filterSelect.disabled = true; // ปิดการใช้งาน filterSelect
    filterSelect.value = ''; // รีเซ็ต filterSelect
    document.getElementById('scheduleInfo').innerHTML = ''; // ล้างข้อมูลเก่า
  }
});

// Event Listener เมื่อเลือกตัวกรองเวลา
document.getElementById('filterSelect').addEventListener('change', function (event) {
  const routeId = document.getElementById('routeSelect').value;
  const filter = event.target.value;

  if (routeId && filter) {
    loadSchedule(routeId, filter);
  }
});
