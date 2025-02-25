function loadSchedule(route_id) {
    fetch(`data1/${route_id}.json`)  // ใช้ route_id เพื่อเลือกไฟล์ JSON ตาม route_id
      .then(response => response.json())
      .then(scheduleData => {
        const scheduleInfo = document.getElementById('scheduleInfo');
        if (scheduleData && scheduleData.routes) {
          const routeSchedules = scheduleData.routes.filter(route => route.route === route_id); // หาทุกเส้นทางที่ตรงกับ route_id
          if (routeSchedules.length > 0) {
            const currentTime = new Date();
            const currentHour = currentTime.getHours();
            const currentMinutes = currentTime.getMinutes();
            const currentTotalMinutes = currentHour * 60 + currentMinutes; // แปลงเวลาเป็นนาที
  
            let allSchedulesHTML = ''; // ใช้ตัวแปรเพื่อเก็บ HTML สำหรับแสดงตารางเวลา
  
            routeSchedules.forEach(routeSchedule => {
              const filteredTimes = routeSchedule.time.filter(time => {
                const [hour, minutes] = time.split(":").map(Number);
                const totalMinutes = hour * 60 + minutes;
                
                // กรองเวลาในช่วง ± 60 นาที (± 1 ชั่วโมง)
                return Math.abs(totalMinutes - currentTotalMinutes) <= 60;
              });
  
              // ถ้ากรองเวลาแล้วไม่มีค่า (เวลาผ่านไปแล้ว) ให้แสดงเวลาแรกของวัน
              if (filteredTimes.length === 0) {
                filteredTimes.push(routeSchedule.time[0]); // แสดงเวลาเที่ยวแรกของวัน
              }
  
              if (filteredTimes.length > 0) {
                const timeList = filteredTimes.join(", "); // รวมเวลาที่อยู่ในช่วงที่กรอง
                allSchedulesHTML += `
                  <p><strong>สถานี:</strong> ${routeSchedule.station}</p>
                  <p><strong>เวลาที่เดินรถในช่วง ± 1 ชั่วโมง:</strong> ${timeList}</p>
                `;
              }
            });
  
            if (allSchedulesHTML) {
              scheduleInfo.innerHTML = allSchedulesHTML; // แสดงข้อมูลทั้งหมด
            } else {
              scheduleInfo.innerHTML = '<p>ไม่พบข้อมูลตารางเวลาในช่วงเวลาที่เลือก</p>';
            }
          } else {
            scheduleInfo.innerHTML = '<p>ไม่พบข้อมูลสำหรับเส้นทางนี้</p>';
          }
        } else {
          scheduleInfo.innerHTML = '<p>ไม่พบข้อมูลสำหรับเส้นทางนี้</p>';
        }
      })
      .catch(error => {
        console.error('Error fetching schedule data:', error);
        const scheduleInfo = document.getElementById('scheduleInfo');
        scheduleInfo.innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูลตารางเวลา</p>';
      });
  }
  
  document.getElementById('routeSelect').addEventListener('change', function(event) {
    const route_id = event.target.value;
    if (route_id) {
      loadSchedule(route_id); // โหลดตารางเวลาจากไฟล์ที่เลือก
    } else {
      document.getElementById('scheduleInfo').innerHTML = ''; // ถ้าไม่มีการเลือก
    }
  });
  