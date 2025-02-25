// Path to the JSON files
const jsonFiles = [
  '/data1/affurl.json',
  '/data1/affurl2.json'
];

// Function to load and display affiliate data
const loadAffiliateData = async () => {
  const footerContainer = document.getElementById('footer-container');

  try {
    for (const file of jsonFiles) {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error(`Failed to load ${file}`);
      }
      const links = await response.json(); // Parse as an array

      // Generate affiliate links dynamically
      links.forEach(link => {
        const anchor = document.createElement('a');
        anchor.href = link.url;
        anchor.target = '_blank';

        const img = document.createElement('img');
        img.src = link.image;
        img.alt = link.alt;
        img.width = 75;
        img.height = 75;

        anchor.appendChild(img);
        footerContainer.appendChild(anchor);
      });
    }
  } catch (error) {
    console.error('Error loading affiliate data:', error);
  }
};

// Load affiliate data on page load
loadAffiliateData();
