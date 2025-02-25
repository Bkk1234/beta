window.onload = () => {
  fetchArticleList();
};

// โหลด index.json เพื่อดูว่ามีไฟล์อะไรบ้าง
function fetchArticleList() {
  fetch('data3/index.json')
    .then(response => response.json())
    .then(files => {
      const promises = files.map(file => fetchArticle(file));
      return Promise.all(promises); // โหลดทุกไฟล์ JSON พร้อมกัน
    })
    .then(allArticles => {
      populateDropdown(allArticles.filter(article => article !== null)); // กรอง null ออก
    })
    .catch(error => console.error('Error loading JSON:', error));
}

// โหลดข้อมูลแต่ละไฟล์ JSON
function fetchArticle(filename) {
  return fetch(`data3/${filename}`)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .catch(error => {
      console.error(`Error loading ${filename}:`, error);
      return null; // ถ้าโหลดไม่ได้ คืนค่า null
    });
}

// เติมข้อมูลลงใน Dropdown
function populateDropdown(articles) {
  const dropdown = document.getElementById('articleSelect');
  dropdown.innerHTML = '<option value="">-- เลือกบทความ --</option>'; // เพิ่ม option เริ่มต้น

  articles.forEach((article, index) => {
    if (article) {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = article.title;
      dropdown.appendChild(option);
    }
  });

  dropdown.addEventListener('change', () => {
    const selectedIndex = dropdown.value;
    if (selectedIndex !== "") {
      showArticle(articles[selectedIndex]);
    } else {
      clearArticleDisplay();
    }
  });
}

// แสดงบทความที่เลือก โดยจับคู่ sub_title, content, html และ image_path ในแต่ละกลุ่ม
function showArticle(article) {
  // ตั้งชื่อบทความ
  document.getElementById('articleTitle').textContent = article.title;
  
  // Element สำหรับแสดงเนื้อหา
  const contentElement = document.getElementById('articleContent');
  contentElement.innerHTML = "";
  
  // แปลงข้อมูลให้เป็น Array เสมอ
  const subTitles = article.sub_title 
    ? (Array.isArray(article.sub_title) ? article.sub_title : [article.sub_title])
    : [];
  const contents = article.content 
    ? (Array.isArray(article.content) ? article.content : [article.content])
    : [];
  const htmls = article.html 
    ? (Array.isArray(article.html) ? article.html : [article.html])
    : [];
  const images = article.image_path 
    ? (Array.isArray(article.image_path) ? article.image_path : [article.image_path])
    : [];
  
  // คำนวณความยาวสูงสุดของอาเรย์ทั้ง 4 เพื่อให้วนลูปครอบคลุมทุกข้อมูล
  const maxLength = Math.max(subTitles.length, contents.length, htmls.length, images.length);
  
  for (let i = 0; i < maxLength; i++) {
    // สร้าง container สำหรับแต่ละกลุ่ม
    const sectionDiv = document.createElement('div');
    sectionDiv.className = "article-section my-3";
    
    // แสดง sub_title ถ้ามีข้อมูลใน index นี้
    if (subTitles[i]) {
      const h3 = document.createElement('h3');
      h3.textContent = subTitles[i];
      sectionDiv.appendChild(h3);
    }
    
    // แสดง content ถ้ามีข้อมูลใน index นี้
    if (contents[i]) {
      const p = document.createElement('p');
      p.textContent = contents[i];
      sectionDiv.appendChild(p);
    }
    
    // แสดง HTML ถ้ามีข้อมูลใน index นี้
    if (htmls[i]) {
      // ถ้าเป็น airplan.html ให้แสดงเป็น iframe
      if (htmls[i].includes("airplan.html")) {
        const iframe = document.createElement('iframe');
        iframe.src = htmls[i];
        iframe.className = "my-2";
        iframe.style.width = "100%";
        iframe.style.height = "250px"; // กำหนดความสูงตามที่ต้องการ
        iframe.frameBorder = 0;
        sectionDiv.appendChild(iframe);
      } else {
        // สำหรับไฟล์ HTML อื่นๆ ดึงข้อมูลแล้วแสดงใน div
        fetch(htmls[i])
          .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
          })
          .then(html => {
            const div = document.createElement('div');
            div.innerHTML = html;
            sectionDiv.appendChild(div);
          })
          .catch(error => console.error(`Error loading ${htmls[i]}:`, error));
      }
    }
    
    // แสดงรูปภาพ ถ้ามีข้อมูลใน index นี้
    if (images[i]) {
      const img = document.createElement('img');
      img.src = images[i];
      img.className = "img-fluid my-2";
      img.style.width = "100%";
      img.style.height = "auto";
      sectionDiv.appendChild(img);
    }
    
    // เพิ่ม container ของกลุ่มนี้เข้าไปใน element แสดงผลหลัก
    contentElement.appendChild(sectionDiv);
  }
  
  // แสดงแท็ก (ส่วนนี้แสดงนอกลูป)
  const tagsElement = document.getElementById('articleTags');
  tagsElement.innerHTML = "";
  if (article.tags && Array.isArray(article.tags)) {
    article.tags.forEach(tag => {
      const badge = document.createElement('span');
      badge.className = "badge bg-primary me-1";
      badge.textContent = tag;
      tagsElement.appendChild(badge);
    });
  }
  
  // เคลียร์ element สำหรับ external HTML (ถ้ามี)
  document.getElementById('externalHTML').innerHTML = "";
}

// เคลียร์การแสดงผลเมื่อไม่เลือกบทความ
function clearArticleDisplay() {
  document.getElementById('articleTitle').textContent = "";
  document.getElementById('articleContent').innerHTML = "";
  document.getElementById('articleImage').innerHTML = "";
  document.getElementById('articleTags').innerHTML = "";
  document.getElementById('externalHTML').innerHTML = "";
}
