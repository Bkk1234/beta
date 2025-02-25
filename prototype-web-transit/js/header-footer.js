// ฟังก์ชันสำหรับโหลด Header และ Footer
function loadPartial(partialId, filePath) {
    fetch(filePath)
        .then(response => {
            if (!response.ok) throw new Error(`Failed to load ${filePath}`);
            return response.text();
        })
        .then(html => {
            document.getElementById(partialId).innerHTML = html;
        })
        .catch(error => console.error(error));
}

// โหลด Header และ Footer
loadPartial('header', 'partials/header.html');
loadPartial('footer', 'partials/footer.html');
