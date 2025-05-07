document.addEventListener('DOMContentLoaded', () => {
  const provinceSelect = document.getElementById('provinceSelect');
  const stationSelect = document.getElementById('stationSelect');
  const contactDiv = document.getElementById('contactInfo');
  let currentProvince = null;

  // โหลดรายชื่อจังหวัดและสถานีขนส่ง ยกเว้นอ่างทอง
  fetch('data1/bus-list.json')
    .then(res => res.json())
    .then(data => {
      const provinces = data["bus-station-list"].filter(p => p.province !== 'อ่างทอง');

      // เติม dropdown จังหวัด
      provinceSelect.innerHTML = '';
      provinces.forEach(item => {
        const option = document.createElement('option');
        option.value = item.province;
        option.textContent = item.province;
        provinceSelect.appendChild(option);
      });

      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'เลือกจังหวัด';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      provinceSelect.prepend(defaultOption);

      provinceSelect.addEventListener('change', () => {
        const selectedProvince = provinceSelect.value;
        currentProvince = selectedProvince; // เก็บจังหวัดที่เลือกไว้
        const provinceData = provinces.find(p => p.province === selectedProvince);

        stationSelect.innerHTML = '';
        if (provinceData && Array.isArray(provinceData.station)) {
          provinceData.station.forEach(station => {
            const option = document.createElement('option');
            option.value = station;
            option.textContent = station;
            stationSelect.appendChild(option);
          });

          const defaultStationOption = document.createElement('option');
          defaultStationOption.textContent = 'เลือกสถานีในจังหวัด ' + selectedProvince;
          defaultStationOption.disabled = true;
          defaultStationOption.selected = true;
          stationSelect.prepend(defaultStationOption);
        }
      });
    });

  // เมื่อเลือกสถานี
  stationSelect.addEventListener('change', () => {
    const selectedStation = stationSelect.value;
    contactDiv.innerHTML = '<div class="alert alert-info">กำลังโหลดข้อมูล...</div>';

    fetch('data1/bus-contact.json')
      .then(res => res.json())
      .then(data => {
        const matchedRoutes = data.routes.filter(route => {
          const textLines = route.contact?.text_line || [];
          return textLines.includes(selectedStation) ||
            (selectedStation === 'จุดขึ้นรถประจำทางอื่นๆ' &&
              textLines.includes('จุดขึ้นรถประจำทางอื่นๆ') &&
              route.contact?.province === currentProvince);
        });

        if (matchedRoutes.length === 0) {
          contactDiv.innerHTML = `<div class="alert alert-warning">ไม่พบสายรถที่ผ่าน "${selectedStation}"</div>`;
          return;
        }

        const resultHTML = matchedRoutes.map(route => {
          const contact = route.contact || {};

          const phones = Array.isArray(contact.phone)
            ? contact.phone.filter(p => p !== 'N/A')
            : typeof contact.phone === 'string' && contact.phone !== 'N/A'
              ? [contact.phone]
              : [];

          const websites = Array.isArray(contact.web_url)
            ? contact.web_url.filter(url => url !== 'N/A')
            : typeof contact.web_url === 'string' && contact.web_url !== 'N/A'
              ? [contact.web_url]
              : [];

          let card = `
            <div class="card mb-3 shadow-sm">
              <div class="card-body">
                <h5 class="card-title">สาย ${route.route_id}: ${route.route_name}</h5>
                <p><strong>เบอร์โทร:</strong> ${
                  phones.length ? phones.map(phone => `<a href="tel:${phone}">${phone}</a>`).join(', ') : 'ไม่มีข้อมูล'
                }</p>
          `;

          if (websites.length > 0) {
            card += `<p><strong>เว็บไซต์:</strong> ${websites.map(url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`).join(', ')}</p>`;
          }

          if (typeof contact.vehicle === 'string' && contact.vehicle.match(/\.(jpg|jpeg|png|gif)$/i)) {
            card += `<p><strong>รถโดยสาร:</strong><br><img src="${contact.vehicle}" alt="รถสาย${route.route_id}" class="img-fluid rounded mb-2" style="max-width: 100%; height: auto;"></p>`;
          }

          if (typeof contact.qr_code_path === 'string' && contact.qr_code_path.match(/\.(jpg|jpeg|png|gif)$/i)) {
            card += `<p><strong>QR Code:</strong><br><img src="${contact.qr_code_path}" alt="QR ${route.route_id}" style="width: 150px;"></p>`;
          }

          card += `<div id="time-${route.route_id}" class="mt-2"></div>`;
          card += `<button class="btn btn-sm btn-outline-primary" onclick="showAllTimes('${route.route_id}', '${selectedStation}')">ดูเวลาทั้งหมด</button>`;
          card += '</div></div>';

          fetch(`data1/timetable/${route.route_id}.json`)
            .then(res => res.json())
            .then(timetableData => {
              const routeTimes = timetableData.routes.filter(r => {
                if (typeof r.station === 'string') return r.station === selectedStation;
                if (Array.isArray(r.station)) return r.station.includes(selectedStation);
                return false;
              });

              const allTimes = routeTimes.flatMap(r => r.time || []);
              const now = new Date();
              const nowMin = now.getHours() * 60 + now.getMinutes();
              const matchedTimes = allTimes.filter(t => {
                const [h, m] = t.split(':').map(Number);
                const tMin = h * 60 + m;
                return Math.abs(tMin - nowMin) <= 60;
              });

              const container = document.getElementById(`time-${route.route_id}`);
              container.innerHTML = `<p><strong>รอบใน 1 ชม.:</strong> ${matchedTimes.join(', ') || 'ไม่มีรอบใกล้เคียง'}</p>`;
            });

          return card;
        }).join('');

        contactDiv.innerHTML = `
          <h5 class="mb-4">สายรถที่ผ่าน "<strong>${selectedStation}</strong>"</h5>
          ${resultHTML}
        `;
      })
      .catch(err => {
        console.error('เกิดข้อผิดพลาด:', err);
        contactDiv.innerHTML = `<div class="alert alert-danger">ไม่สามารถโหลดข้อมูลได้</div>`;
      });
  });
});

function showAllTimes(routeId, stationName) {
  fetch(`data1/${routeId}.json`)
    .then(res => res.json())
    .then(data => {
      const all = data.routes.filter(r => {
        if (typeof r.station === 'string') return r.station === stationName;
        if (Array.isArray(r.station)) return r.station.includes(stationName);
        return false;
      });
      const allTimes = all.flatMap(r => r.time || []);
      alert(`เวลาทั้งหมดของสาย ${routeId} ที่สถานี ${stationName}:\n` + allTimes.join(', '));
    })
    .catch(err => alert('ไม่สามารถโหลดเวลาเดินรถได้'));
}
