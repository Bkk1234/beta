// ฟังก์ชันควบคุมการโหลดข้อมูลตารางเวลา
document.getElementById('scheduleTypeSelect').addEventListener('change', function(event) {
    const scheduleType = event.target.value;
    const route_id = document.getElementById('routeSelect').value;
    
    if (route_id) {
      if (scheduleType === 'loadSchedule') {
        loadSchedule(route_id);  // โหลดข้อมูลจาก loadSchedule.js
      } else if (scheduleType === 'allSchedule') {
        allSchedule(route_id);  // โหลดข้อมูลจาก allSchedule.js
      }
    } else {
      document.getElementById('scheduleInfo').innerHTML = ''; // ถ้าไม่มีการเลือกเส้นทาง
    }
  });
  
