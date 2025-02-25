// ดึงข้อมูลจาก bus-contact.json และเติม dropdown
fetch('data1/bus-contact.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('เกิดข้อผิดพลาดในการโหลดไฟล์ JSON');
    }
    return response.json();
  })
  .then(data => {
    const routeSelect = document.getElementById('routeSelect');
    if (!routeSelect) return; // ตรวจสอบว่ามี element หรือไม่

    routeSelect.innerHTML = ''; // ล้างตัวเลือกเดิม

    // เพิ่ม option สำหรับสถานะเริ่มต้น
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'เลือกสายรถ';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    routeSelect.appendChild(defaultOption);

    // สร้าง <option> สำหรับแต่ละ route
    data.routes.forEach(route => {
      const option = document.createElement('option');
      option.value = route.route_id; // ใช้ route_id เป็น value
      option.textContent = route.route_name; // ใช้ route_name เป็นข้อความ
      routeSelect.appendChild(option);
    });
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
    const routeSelect = document.getElementById('routeSelect');
    if (routeSelect) {
      routeSelect.innerHTML = `<option value="">ไม่สามารถโหลดข้อมูลได้</option>`;
    }
  });

// ฟังก์ชันที่ทำงานเมื่อเลือก dropdown สำหรับการแสดงเวลา
document.getElementById('timeFilter').addEventListener('change', function (event) {
  const routeSelect = document.getElementById('routeSelect');
  if (!routeSelect || !routeSelect.value) {
    console.warn('กรุณาเลือกสายรถก่อน');
    return;
  }

  const routeId = routeSelect.value;
  const timeFilter = event.target.value;

  const showAllTimes = timeFilter === 'all'; // แสดงเวลาทั้งหมด
  const showNearTimes = timeFilter === 'near'; // แสดงเวลาช่วงใกล้

  if (!showAllTimes && !showNearTimes) {
    console.warn('เลือกตัวกรองเวลาไม่ถูกต้อง');
    return;
  }

  loadSchedule(routeId, showAllTimes, showNearTimes); // ส่งค่าที่เลือกไปให้ฟังก์ชัน
});
