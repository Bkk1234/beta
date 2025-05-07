document.addEventListener('DOMContentLoaded', () => {
  const stationSelect = document.getElementById('stationSelect');
  const routeContainer = document.getElementById('routeContainer');

  fetch('data/bus-contact.json')
    .then(res => res.json())
    .then(data => {
      // รวมสถานีทั้งหมดไม่ซ้ำ
      const allStations = new Set();
      data.routes.forEach(route => {
        route.contact?.text_line?.forEach(station => allStations.add(station));
      });

      // เติม dropdown
      [...allStations].sort().forEach(station => {
        const opt = document.createElement('option');
        opt.value = station;
        opt.textContent = station;
        stationSelect.appendChild(opt);
      });

      stationSelect.addEventListener('change', () => {
        const selected = stationSelect.value;
        const now = new Date();
        const nowMinutes = now.getHours() * 60 + now.getMinutes();

        // กรอง route ที่มีสถานีนี้ใน text_line
        const matchedRoutes = data.routes.filter(route =>
          route.contact?.text_line?.includes(selected)
        );

        routeContainer.innerHTML = '';
        matchedRoutes.forEach(route => {
          // กรองเวลาเดินรถ +/- 1 ชม
          const times = route.timetable || [];
          const timeMatches = times.filter(t => {
            const [h, m] = t.split(':').map(Number);
            const tMinutes = h * 60 + m;
            return Math.abs(tMinutes - nowMinutes) <= 60;
          });

          const card = document.createElement('div');
          card.className = 'card route-card';
          card.innerHTML = `
            <div class="card-body">
              <h5 class="card-title">สาย ${route.route_id}: ${route.route_name}</h5>
              <p><strong>เบอร์โทร:</strong> ${(route.contact.phone || []).join(', ')}</p>
              <p><strong>จุดจอด:</strong> ${(route.contact.text_line || []).join(', ')}</p>
              <p><img src="${route.contact.vehicle}" alt="รถสาย${route.route_id}" class="img-fluid mb-2"></p>
              <p><img src="${route.contact.qr_code_path}" alt="QR ${route.route_id}" width="150"></p>
              <p><strong>รอบใกล้เคียง:</strong> ${timeMatches.join(', ') || 'ไม่มีใน 1 ชม.'}</p>
            </div>
          `;
          routeContainer.appendChild(card);
        });
      });
    });
});
