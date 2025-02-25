document.getElementById('routeSelect').addEventListener('change', function(event) {
  const route_id = event.target.value;
  console.log("Selected route_id:", route_id);  // ตรวจสอบค่า route_id ที่เลือก

  if (route_id) {
    loadRouteData(route_id); // โหลดข้อมูลของสายรถที่เลือก
  } else {
    document.getElementById('contactInfo').innerHTML = ''; // ถ้าไม่เลือกให้ลบข้อมูลที่แสดง
  }
});

function loadRouteData(route_id) {
  fetch('data1/bus-contact.json')  // แก้ไข path ให้ตรงกับที่เก็บไฟล์ของคุณ
    .then(response => response.json())
    .then(data => {
      const route = data.routes.find(route => route.route_id === route_id);
      console.log(route);  // ตรวจสอบว่าได้ข้อมูล route หรือไม่

      if (!route) {
        document.getElementById('contactInfo').innerHTML = '<p>ไม่พบข้อมูลสำหรับสายรถที่เลือก</p>';
        return;
      }

      const { route_name, contact, destination } = route;
      const contactInfo = document.getElementById('contactInfo');

      // จัดการข้อมูลจุดจอดรถ
      const textLine = Array.isArray(contact.text_line) 
        ? contact.text_line.map(line => `<p><strong>จุดจอดรถ:</strong> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(line)}" target="_blank">${line}</a></p>`).join('') 
        : contact.text_line 
          ? `<p><strong>จุดจอดรถ:</strong> <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contact.text_line)}" target="_blank">${contact.text_line}</a></p>` 
          : '';

      // เพิ่มข้อมูล destination (สถานที่ผ่าน)
      const destinationInfo = destination && Array.isArray(destination) && destination.length > 0
        ? `<p><strong>สถานที่ผ่าน:</strong> ${destination.join(', ')}</p>`
        : '<p><strong>สถานที่ผ่าน:</strong> ไม่มีข้อมูลสถานที่ผ่าน</p>';

      // เพิ่มรูปภาพเส้นทางจากโฟลเดอร์ /data4/busline/
      const routeImage = `<p><strong>แผนที่เส้นทาง:</strong> <img src="data4/busline/${route_id}.png" alt="เส้นทาง ${route_id}" style="width: 100%; max-width: 500px;"></p>`;

      contactInfo.innerHTML = `
        <h4>${route_name} สถานที่น่าสนใจที่ผ่าน</h4>
        ${textLine}
        ${destinationInfo}
        ${routeImage} 
        <p><strong>ยานพาหนะ:</strong> <img src="${contact.vehicle}" alt="Vehicle Image" style="width: 300px;"></p>
      `;
    })


    
    .catch(error => {
      console.error('Error fetching data:', error);
      document.getElementById('contactInfo').innerHTML = '<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>';
    });
}


function openRouteMap(route_id) {
  // สร้าง URL สำหรับไฟล์ GeoJSON ที่ตรงกับ route_id
  const geoJsonUrl = `data4/GeoJSON/${route_id}.geojson`;

  // สร้าง iframe และแทรกเข้าไปใน div ที่ต้องการในหน้า
  const mapContainer = document.getElementById('mapContainer');
  if (!mapContainer) {
    console.error('mapContainer not found in the DOM.');
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.style.width = '100%';
  iframe.style.height = '500px'; // ปรับความสูงตามที่ต้องการ
  iframe.style.border = 'none';
  mapContainer.innerHTML = ''; // ล้างข้อมูลเก่าใน mapContainer
  mapContainer.appendChild(iframe);

  // สร้างเนื้อหาภายใน iframe
  const iframeDoc = iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write('<html><head><title>เส้นทางรถ</title>');
  iframeDoc.write('<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />');
  iframeDoc.write('<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>');
  iframeDoc.write('</head><body><div id="map" style="height: 100%;"></div></body></html>');
  iframeDoc.close();

  // เมื่อ iframe โหลดเสร็จ ให้สร้างแผนที่
  iframe.onload = function () {
    const map = L.map(iframeDoc.getElementById('map')).setView([13.7563, 100.5018], 13); // ตั้งค่าแผนที่
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch(geoJsonUrl)
      .then(response => response.json())
      .then(data => {
        if (data && data.features && data.features.length > 0) {
          L.geoJSON(data).addTo(map);  // เพิ่ม GeoJSON บนแผนที่
        } else {
          iframeDoc.body.innerHTML = '<p>ไม่พบข้อมูล GeoJSON สำหรับเส้นทางนี้</p>';
        }
      })
      .catch(error => {
        console.error('Error loading GeoJSON:', error);
        iframeDoc.body.innerHTML = '<p>ไม่สามารถโหลดเส้นทางได้</p>';
      });
  };
}
