// เพิ่มเครื่องหมาย + อัตโนมัติเมื่อกรอกเลข
document.getElementById('busStopCode').addEventListener('input', function(event) {
    let inputValue = event.target.value;
  
    // ลบตัวอักษรที่ไม่ใช่ตัวเลข
    inputValue = inputValue.replace(/\D/g, '');
  
    // ถ้า input มีความยาว 5 หลัก ให้แทรกเครื่องหมาย + ที่ตำแหน่ง 2
    if (inputValue.length === 5) {
        inputValue = inputValue.slice(0, 2) + '+' + inputValue.slice(2);
    }
  
    event.target.value = inputValue;
  });
  
  // ค้นหาข้อมูลเมื่อ submit ฟอร์ม
  document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    let busStopCode = document.getElementById('busStopCode').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
  
    // ตรวจสอบว่า busStopCode มีรูปแบบถูกต้อง (XX+XXX)
    if (!/^\d{2}\+\d{3}$/.test(busStopCode)) {
        resultDiv.innerHTML = '<p class="error">กรุณากรอกเลขในรูปแบบ XX+XXX</p>';
        return;
    }
  
    // เรียกข้อมูลจาก stop_list.json
    fetch('data1/stop_list.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('ไม่สามารถโหลด stop_list.json');
            }
            return response.json();
        })
        .then(stopList => {
            const stopData = stopList.find(stop => stop.km_position === busStopCode);
            console.log("Stop Data:", stopData);
  
            if (!stopData) {
                resultDiv.innerHTML = '<p class="error">ไม่พบข้อมูลศาลารอรถประจำทาง</p>';
                return;
            }
  
            // แสดงรูปภาพศาลารอรถ
            const imagePath = `img/bus-stop/${busStopCode.replace('+', '')}.jpg`;
            const imageHTML = `<img src="${imagePath}" alt="Bus Stop Image" class="bus-stop-image">`;
  
            // สร้างลิงก์ไปยัง Google Maps
            const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${stopData.latitude},${stopData.longitude}`;
            const locationHTML = `<p><a href="${googleMapsLink}" target="_blank">ดูตำแหน่งที่ตั้งใน Google Maps</a></p>`;
  
            // ดึงชื่อสายจาก bus-contact.json
            fetch('data1/bus-contact.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('ไม่สามารถโหลด bus-contact.json');
                    }
                    return response.json();
                })
                .then(busContactData => {
                    let routes = [];
                    if (stopData.route_id) {
                        routes = stopData.route_id.map(route_id => {
                            const route = busContactData.routes.find(r => r.route_id === route_id);
                            return route ? route.route_name : `ไม่พบข้อมูลสาย ${route_id}`;
                        });
                    }
  
                    let routeInfoHTML = '<h4>สายรถประจำทางที่ผ่าน:</h4>';
                    routeInfoHTML += `<p>${routes.join(', ') || 'ไม่พบข้อมูลสายรถ'}</p>`;
  
                    resultDiv.innerHTML = `
                        <h4>ศาลารอรถประจำทาง: ${busStopCode}</h4>
                        ${imageHTML}
                        ${locationHTML}
                        ${routeInfoHTML}
                    `;
                })
                .catch(error => {
                    console.error('Error loading bus contact data:', error);
                    resultDiv.innerHTML = `<p class="error">เกิดข้อผิดพลาดในการโหลดข้อมูลสายรถ: ${error.message}</p>`;
                });
        })
        .catch(error => {
            console.error('Error loading stop list data:', error);
            resultDiv.innerHTML = `<p class="error">เกิดข้อผิดพลาดในการโหลดข้อมูลศาลารอรถประจำทาง: ${error.message}</p>`;
        });
  });
  // โหลดจำนวนศาลารอรถเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', function() {
    fetch('data1/stop_list.json')
        .then(response => response.json())
        .then(stopList => {
            document.getElementById('busStopCount').textContent = `ตอนนี้รวบรวมข้อมูลศาลารอรถได้ ${stopList.length} แห่ง`;
        })
        .catch(error => {
            console.error('Error loading stop list data:', error);
        });
});
