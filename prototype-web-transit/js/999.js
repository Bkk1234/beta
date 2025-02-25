fetch('data1/999.json')
  .then(response => response.json())
  .then(data => {
    const routes = data.routes; // ใช้ 'routes' เป็นอาร์เรย์
    routes.forEach(route => {
      const row = document.createElement('tr');

      const routeIdCell = document.createElement('td');
      routeIdCell.textContent = route.route_id;
      row.appendChild(routeIdCell);

      const routeNameCell = document.createElement('td');
      routeNameCell.textContent = route.route_name;
      row.appendChild(routeNameCell);

      // เพิ่มแถวเข้าไปในตาราง
      document.getElementById('routesTable').appendChild(row);
    });
  })
  .catch(error => console.error('Error loading the JSON:', error));
