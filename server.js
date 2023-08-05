const crypto = require("crypto");
const https = require("https");

const publicKey = "5619c56848f0d9d0ca17fd56f354cb4d";
const privateKey = "f46f7fb331fc8bfd6fc637da8d1cca7861ae8067";

function generateHash(ts) {
  const hash = crypto
    .createHash("md5")
    .update(ts + privateKey + publicKey)
    .digest("hex");
  return hash;
}

function buildRequestURL(endpoint) {
  const ts = new Date().getTime();
  const hash = generateHash(ts);
  const requestURL = `https://gateway.marvel.com/v1/public/${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  return requestURL;
}

// Example usage:
const endpoint = "comics"; // Replace with the desired API endpoint
const requestURL = buildRequestURL(endpoint);

// Make the HTTPS request
https
  .get(requestURL, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const jsonData = JSON.parse(data);
      if (jsonData.data && jsonData.data.results) {
        const superheroes = jsonData.data.results;
        superheroes.forEach((superhero, index) => {
          console.log(`Superhero ${index + 1}`);
          console.log("Name:", superhero.name);
          console.log(
            "Description:",
            superhero.description || "No description available."
          );
          console.log("-------------------");
        });
      } else {
        console.log("No superheroes found in the response.");
      }
    });
  })
  .on("error", (error) => {
    console.error("Error fetching data:", error);
  });
