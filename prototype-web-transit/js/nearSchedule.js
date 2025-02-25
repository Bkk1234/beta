// ฟังก์ชันสำหรับการเลือกสายรถและโหลดตารางเวลา
document.getElementById('routeSelect').addEventListener('change', function(event) {
    const route_id = event.target.value;
    if (route_id) {
      loadSchedule(route_id);  // เรียกฟังก์ชัน loadSchedule
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
        const currentTime = new Date(); // เวลาปัจจุบัน
        const currentHour = currentTime.getHours();
        const currentMinutes = currentTime.getMinutes();
        
        let allSchedulesHTML = '';
        let hasSchedules = false;  // ตัวแปรเพื่อตรวจสอบว่าเจอเวลาในช่วง ± 1 ชั่วโมงหรือไม่
  
        scheduleData.routes.forEach(route => {
          if (route.route === route_id) {  // ค้นหาสายรถที่ตรงกับ route_id
            const timesWithinRange = []; // เก็บเวลาที่อยู่ในช่วง ± 1 ชั่วโมง
            
            route.time.forEach(time => {
              const [hour, minute] = time.split(':').map(Number);
              const timeDate = new Date();
              timeDate.setHours(hour);
              timeDate.setMinutes(minute);
              timeDate.setSeconds(0);
  
              // คำนวณหาค่าต่างระหว่างเวลาปัจจุบันและเวลารถ
              const diffInMinutes = Math.abs(currentTime - timeDate) / (1000 * 60); // คำนวณเป็นนาที
  
              // เงื่อนไขแสดงผลเฉพาะเวลาที่อยู่ในช่วง ± 1 ชั่วโมง (± 60 นาที)
              if (diffInMinutes <= 60) {
                timesWithinRange.push(time);  // เก็บเวลาที่อยู่ในช่วง ± 1 ชั่วโมง
              }
            });
  
            // ถ้ามีเวลาในช่วง ± 1 ชั่วโมงให้แสดงผล
            if (timesWithinRange.length > 0) {
              hasSchedules = true;
              allSchedulesHTML += `
                <p><strong>สถานี:</strong> ${route.station}</p>
                <p><strong>เวลาที่เดินรถ:</strong> ${timesWithinRange.join(', ')}</p>
              `;
            }
            
            // ถ้ามี key "txt" ในข้อมูล ก็แสดงหมายเหตุ
            if (route.txt) {
              allSchedulesHTML += `<p><strong>หมายเหตุ:</strong> ${route.txt}</p>`;
            }
          }
        });
  
        // ถ้าไม่มีเวลาที่ตรงกับเงื่อนไข ให้แสดงเวลารถเที่ยวแรก
        if (!hasSchedules) {
          scheduleData.routes.forEach(route => {
            if (route.route === route_id) {
              const firstTime = route.time[0]; // เวลาเที่ยวแรก
              allSchedulesHTML += `
                <p><strong>สถานี:</strong> ${route.station}</p>
                <p><strong>เวลาที่เดินรถ:</strong> ${firstTime} (เที่ยวแรก)</p>
              `;
              
              // ถ้ามี key "txt" ในข้อมูล ก็แสดงหมายเหตุ
              if (route.txt) {
                allSchedulesHTML += `<p><strong>หมายเหตุ:</strong> ${route.txt}</p>`;
              }
            }
          });
        }
  
        // แสดงข้อมูลที่ได้
        scheduleInfo.innerHTML = allSchedulesHTML || '<p>ไม่พบข้อมูลตารางเวลา</p>';
      })
      .catch(error => {
        console.error('Error loading schedule data:', error);
        const scheduleInfo = document.getElementById('scheduleInfo');
        scheduleInfo.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูลตารางเวลา</p>';
      });
  }
  