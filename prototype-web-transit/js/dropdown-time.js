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
    routeSelect.innerHTML = ''; // ล้างตัวเลือกเดิม

    // สร้าง <option> สำหรับแต่ละ route
    data.routes.forEach(route => {
      const option = document.createElement('option');
      option.value = route.route_id; // ใช้ route_id เป็น value
      option.textContent = route.route_name; // ใช้ route_name เป็นข้อความ
      routeSelect.appendChild(option);
    });

    // เพิ่ม option สำหรับสถานะเริ่มต้น
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'เลือกสายรถ';
    defaultOption.selected = true;
    defaultOption.disabled = true;
    routeSelect.prepend(defaultOption);
  })
  .catch(error => {
    console.error('Error loading JSON:', error);
    const routeSelect = document.getElementById('routeSelect');
    routeSelect.innerHTML = `<option value="">ไม่สามารถโหลดข้อมูลได้</option>`;
  });
