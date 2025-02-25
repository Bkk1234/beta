// ฟังก์ชันโหลด GUI
function loadGUI(filename, containerId) {
    const path = `${filename}`; // เพิ่ม 'partials/' เพื่อชี้ไปที่โฟลเดอร์
    fetch(path)
      .then(response => response.text())
      .then(html => {
        document.getElementById(containerId).innerHTML = html;
      })
      .catch(error => console.error('Error loading GUI:', error));
  }
  
  // ผูกปุ่มกับการโหลด GUI
  document.getElementById('loadNearTimeBtn').addEventListener('click', () => {
    loadGUI('nearTime.html', 'contentArea');
  });
  
  document.getElementById('loadAllTimeBtn').addEventListener('click', () => {
    loadGUI('allTime.html', 'contentArea');
  });
  