// Client-side authentication
const publicKey = "5619c56848f0d9d0ca17fd56f354cb4d";

document.addEventListener("DOMContentLoaded", () => {
  const resultsContainer = document.getElementById("resultsContainer");
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");

  searchButton.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();
    if (searchTerm !== "") {
      fetchSuperheroes(searchTerm)
        .then(displayResults)
        .catch((error) => console.error("Error fetching data:", error));
    }
  });

  function fetchSuperheroes(searchTerm) {
    const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchTerm}&apikey=${publicKey}`;
    return fetch(apiUrl).then((response) => response.json());
  }

  function displayResults(data) {
    resultsContainer.innerHTML = "";
    const superheroes = data.data.results;
    if (superheroes.length === 0) {
      resultsContainer.innerHTML = "<p>No superheroes found.</p>";
    } else {
      superheroes.forEach((hero) => {
        const heroElement = createHeroElement(hero);
        resultsContainer.appendChild(heroElement);
      });
    }
  }

  function createHeroElement(hero) {
    const heroElement = document.createElement("div");
    heroElement.classList.add("hero");
    heroElement.innerHTML = `
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${
      hero.name
    }">
      <h2>${hero.name}</h2>
      <p>${hero.description || "No description available."}</p>
    `;
    return heroElement;
  }
});
