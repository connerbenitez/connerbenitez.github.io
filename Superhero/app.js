document.getElementById("superheroForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let name = document.getElementById("superhero").value.trim().toLowerCase();
    if (!name) {
        alert("Please enter a superhero name");
        return;
    }

    let myPromise = new Promise(async function(myResolve, myReject) {
        const token = "9f16064402eace60477ecd98523a62e2";
        const url = `https://cors-anywhere.herokuapp.com/https://superheroapi.com/api/${token}/search/${name}`;
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                myReject(`Response status: ${response.status}`);
                return;
            }

            const json = await response.json();
            if (json.response === "error") {
                myReject("Superhero not found.");
                return;
            }

            console.log(json);
            myResolve(json);
        } catch (error) {
            console.error(error.message);
            myReject(error.message);
        }
    });

    myPromise.then(
        function(value) {
            const hero = value.results[0]; 

            document.getElementById("outputtext").innerHTML = `<strong>Name:</strong> ${hero.name}`;

            document.getElementById("powerstats").innerHTML = `
                <strong>Powerstats:</strong><br>
                Intelligence: ${hero.powerstats.intelligence}<br>
                Strength: ${hero.powerstats.strength}<br>
                Speed: ${hero.powerstats.speed}<br>
                Durability: ${hero.powerstats.durability}<br>
                Power: ${hero.powerstats.power}<br>
                Combat: ${hero.powerstats.combat}
            `;

            document.getElementById("biography").innerHTML = `
                <strong>Biography:</strong><br>
                Full Name: ${hero.biography["full-name"]}<br>
                First Appearance: ${hero.biography["first-appearance"]}<br>
                Publisher: ${hero.biography.publisher}<br>
                Alignment: ${hero.biography.alignment}
            `;

            document.getElementById("appearance").innerHTML = `
                <strong>Appearance:</strong><br>
                Gender: ${hero.appearance.gender}<br>
                Race: ${hero.appearance.race}<br>
                Eye Color: ${hero.appearance["eye-color"]}<br>
                Hair Color: ${hero.appearance["hair-color"]}
            `;

            document.getElementById("superheroImage").src = hero.image.url;
            document.getElementById("superheroImage").style.display = "block";
        },
        function(error) {
            console.log("Error:", error);
            document.getElementById("outputtext").innerHTML = `<strong>Error:</strong> ${error}`;
        }
    );
});
