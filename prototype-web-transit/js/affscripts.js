const slideInterval = 10000; // เปลี่ยนรูปทุก 10 วินาที
let currentIndex = 0; // เก็บ index ของรายการปัจจุบัน
let data = []; // เก็บข้อมูลจาก JSON

// ดึงข้อมูลจาก JSON
fetch("data1/affurl.json") // เปลี่ยนเส้นทางเป็น data1/affurl.json
  .then(response => response.json())
  .then(jsonData => {
    data = jsonData;
    startSlideshow(); // เริ่มสไลด์โชว์เมื่อโหลด JSON เสร็จ
  })
  .catch(error => console.error("Error loading JSON:", error));

// ฟังก์ชันเปลี่ยนภาพในป๊อปอัพ
function updatePopupContent() {
  const popup = document.getElementById("popup");
  const link = popup.querySelector("a");
  const image = popup.querySelector("img");

  // ตั้งค่าลิงก์และภาพจาก JSON
  link.href = data[currentIndex].url;
  image.src = data[currentIndex].image;

  // ไปยังรายการถัดไป
  currentIndex = (currentIndex + 1) % data.length; // วนกลับไปเริ่มที่ 0 หากถึงรายการสุดท้าย
}

// ฟังก์ชันเริ่มสไลด์โชว์
function startSlideshow() {
  const popup = document.getElementById("popup");
  popup.style.display = "flex"; // แสดงป๊อปอัพเมื่อเริ่มสไลด์โชว์
  updatePopupContent(); // แสดงภาพแรกทันที

  // เปลี่ยนภาพทุก slideInterval
  setInterval(updatePopupContent, slideInterval);
}

// ฟังก์ชันปิดป๊อปอัพ
function closePopup() {
  const popup = document.getElementById("popup");
  popup.style.display = "none"; // ซ่อนป๊อปอัพ
}
