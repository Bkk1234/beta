// ฟังก์ชันสำหรับการเลือกสายรถและโหลดตารางเวลา
document.getElementById('routeSelect').addEventListener('change', function(event) {
  const route_id = event.target.value;
  if (route_id) {
    loadSchedule(route_id);  // เรียกฟังก์ชัน loadSchedule จาก allschedule.js
  } else {
    document.getElementById('scheduleInfo').innerHTML = ''; // ถ้าไม่มีการเลือก
  }
});

// ฟังก์ชันที่ใช้ในการโหลดตารางเวลา
function loadSchedule(route_id) {
  fetch(`data1/${route_id}.json`)  // ใช้ route_id เพื่อเลือกไฟล์ JSON
    .then(response => response.json())
    .then(scheduleData => {
      const scheduleInfo = document.getElementById('scheduleInfo');
      let allSchedulesHTML = '';
      
      scheduleData.routes.forEach(route => {
        if (route.route === route_id) {  // ค้นหาสายรถที่ตรงกับ route_id
          // รวมเวลาทั้งหมดจากสถานีในรูปแบบ array
          const allTimes = route.time.join(', ');  // ใช้ join() เพื่อรวมเวลาในรูปแบบที่ต้องการ
          
          // แสดงผลเป็นข้อความ
          allSchedulesHTML += `
            <p><strong>สถานี:</strong> ${route.station}</p>
            <p><strong>เวลาที่เดินรถ:</strong> ${allTimes}</p>
          `;

          // ตรวจสอบว่าใน route มี key "txt" หรือไม่
          if (route.txt) {
            allSchedulesHTML += `<p><strong>หมายเหตุ:</strong> ${route.txt}</p>`;
          }
        }
      });

      // แสดงข้อมูลที่ได้
      scheduleInfo.innerHTML = allSchedulesHTML || '<p>ไม่พบข้อมูลตารางเวลา</p>';
    })
    .catch(error => {
      console.error('Error loading schedule data:', error);
      const scheduleInfo = document.getElementById('scheduleInfo');
      scheduleInfo.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูลตารางเวลา</p>';
    });
}
