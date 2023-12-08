document.getElementById('searchButton').addEventListener('click', function() {
    // Hämta söktermen från inmatningsfältet och ta bort eventuell extra whitespace
    const searchTerm = document.getElementById('searchInput').value.trim();

    // Hämta söktypen (land eller språk) från den valda radioknappen
    const searchType = document.querySelector('input[name="searchType"]:checked').value;

    let url; // Variabel för att lagra URL för API-anropet

    // Avgör vilken URL som ska användas beroende på söktypen
    if (searchType === 'name') {
        url = `https://restcountries.com/v3.1/name/${searchTerm}`;
    } else {
        url = `https://restcountries.com/v3.1/lang/${searchTerm}`;
    }

    // Gör API-anropet
    fetch(url)
        .then(response => {
            // Kontrollera om API-svaret är OK eller inte
            if (!response.ok) {
                throw new Error('No country or language found.');
            }
            return response.json(); // Om svaret är OK, konvertera det till JSON-format
        })
        .then(data => {
            // Visa resultaten (länder) i fallande ordning baserat på befolkning
            displayResults(data.sort((a, b) => b.population - a.population));
        })
        .catch(error => {
            // Visa ett felmeddelande om något går fel
            displayError(`An error occurred: ${error.message}`);
        });
});

// Funktion för att visa resultaten (länder)
function displayResults(countries) {
    const resultsContainer = document.getElementById('results');
    // Rensa tidigare resultat från container
    resultsContainer.innerHTML = '';

    // Loopa igenom varje land i listan av länder
    countries.forEach(country => {
        // Skapa ett HTML-element för varje land
        const countryElement = document.createElement('div');
        countryElement.classList.add('country');
        countryElement.innerHTML = `
            <h3>${country.name.official}</h3>
            <p>Subregion: ${country.subregion || 'N/A'}</p>
            <p>Capital: ${country.capital || 'N/A'}</p>
            <p>Population: ${country.population.toLocaleString('en-US')}</p>
            <img src="${country.flags.png}" alt="${country.name.official}'s flag" width="100">
        `;
        // Lägg till det skapade HTML-elementet i resultatbehållaren
        resultsContainer.appendChild(countryElement);
    });
}

// Funktion för att visa ett felmeddelande
function displayError(message) {
    const resultsContainer = document.getElementById('results');
    const messageOverlay = document.createElement('div');
    messageOverlay.classList.add('message-overlay');
    messageOverlay.innerHTML = `<p>${message}</p>`;
    // Lägg till meddelandeöverlagret på webbsidan
    document.body.appendChild(messageOverlay);
    // Visa meddelandeöverlagret genom att ändra dess display-stil till 'flex'
    messageOverlay.style.display = 'flex';

    // Dölj meddelandeöverlagret när det klickas på
    messageOverlay.addEventListener('click', function() {
        // Ta bort meddelandeöverlagret från webbsidan
        document.body.removeChild(messageOverlay);
    });
}