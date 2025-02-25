
// ฟังก์ชันที่จะทำงานเมื่อเลือกสายรถจาก dropdown
document.getElementById('routeSelect').addEventListener('change', function(event) {
  const routeId = event.target.value;
  if (routeId) {
    loadRouteData(routeId); // โหลดข้อมูลของสายรถที่เลือก
  } else {
    document.getElementById('contactInfo').innerHTML = ''; // ถ้าไม่เลือกให้ลบข้อมูลที่แสดง
  }
});
// ฟังก์ชันเพื่อโหลดข้อมูลจากไฟล์ JSON ตาม route_id
function loadRouteData(routeId) {
  // ใช้ fetch API เพื่อดึงข้อมูลจากไฟล์ JSON
  fetch('data1/bus-contact.json')  // แก้ไข path ให้ตรงกับที่เก็บไฟล์ของคุณ
    .then(response => response.json())  // แปลงข้อมูลเป็น JSON
    .then(data => {
      // หาข้อมูลของสายรถที่เลือกจาก JSON
      const route = data.routes.find(route => route.route_id === routeId);
      
      if (route) {
        const contactInfo = document.getElementById('contactInfo');

        // ตรวจสอบว่าเบอร์โทรเป็น array หรือไม่
        const phoneNumbers = Array.isArray(route.contact.phone) 
          ? route.contact.phone.map(phone => 
              `<p><strong>เบอร์โทร:</strong> <a href="tel:${phone}">${phone}</a></p>`
            ).join('') 
          : `<p><strong>เบอร์โทร:</strong> <a href="tel:${route.contact.phone}">${route.contact.phone}</a></p>`;  // กรณีมีเบอร์เดียว

       // แสดง Website หากมี web_url
const websiteInfo = Array.isArray(route.contact.web_url) 
? route.contact.web_url.map(url => 
    `<p><strong>Website:</strong> <a href="${url}" target="_blank">${url}</a></p>`
  ).join('') 
: route.contact.web_url 
  ? `<p><strong>Website:</strong> <a href="${route.contact.web_url}" target="_blank">${route.contact.web_url}</a></p>` 
  : '';  // ถ้าไม่มี web_url ก็ไม่แสดง

  const textLine = Array.isArray(route.contact.text_line) 
  ? route.contact.text_line.map(line => 
      `<p><strong>จุดจอดรถ:</strong> 
         <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(line)}" 
            target="_blank">
            ${line}
         </a>
       </p>`
    ).join('') 
  : route.contact.text_line 
    ? `<p><strong>จุดจอดรถ:</strong> 
         <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(route.contact.text_line)}" 
            target="_blank">
            ${route.contact.text_line}
         </a>
       </p>` 
    : '';

    contactInfo.innerHTML = `
          <h4>ข้อมูลติดต่อสำหรับ ${route.route_name}</h4>
          ${phoneNumbers}  <!-- แสดงเบอร์โทรทั้งหมด -->
          ${websiteInfo}   <!-- แสดงลิงก์ Website ถ้ามี -->
          ${textLine}      <!-- แสดงข้อความสถานีขนส่ง ถ้ามี -->
          <p><strong>ยานพาหนะ:</br></strong> <img src="${route.contact.vehicle}" alt="Vehicle Image" style="width: 300px;"></p><!-- แสดงรูปยานพาหนะ ถ้ามี -->
          <p><strong>QR Code:</br></strong> <img src="${route.contact.qr_code_path}" alt="QR Code" style="width: 200px;"></p><!-- แสดงรูป qr code ถ้ามี -->
        `;
      } else {
        const contactInfo = document.getElementById('contactInfo');
        contactInfo.innerHTML = `<p>ไม่พบข้อมูลสำหรับสายรถที่เลือก</p>`;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      const contactInfo = document.getElementById('contactInfo');
      contactInfo.innerHTML = `<p>เกิดข้อผิดพลาดในการโหลดข้อมูล</p>`;
    });
}
