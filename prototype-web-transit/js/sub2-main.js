document.getElementById('routeSelect').addEventListener('change', function(event) {
    const route_id = event.target.value;
    if (route_id) {
      loadSchedule(route_id); // โหลดตารางเวลาจากไฟล์ที่เลือก
    } else {
      document.getElementById('scheduleInfo').innerHTML = ''; // ถ้าไม่มีการเลือก
    }
  });
  