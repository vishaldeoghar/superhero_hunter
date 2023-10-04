const crypto = require("crypto");
const https = require("https");

const publicKey = "9ab871748d83ae2eb5527ffd69e034de";
const privateKey = "ad79003cf7316d9bd72c6eda71d1c93d7e807e90";

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
