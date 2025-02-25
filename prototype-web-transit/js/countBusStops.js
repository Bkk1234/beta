function countBusStops() {
    fetch('data1/stop_list.json')
        .then(response => response.json())
        .then(stopList => {
            document.getElementById('busStopCount').textContent = `ตอนนี้รวบรวมข้อมูลศาลารอรถได้ ${stopList.length} แห่ง`;
        })
        .catch(error => {
            console.error('Error loading stop list data:', error);
        });
}

// โหลดจำนวนศาลารอรถเมื่อหน้าเว็บโหลดเสร็จ
document.addEventListener('DOMContentLoaded', countBusStops);
