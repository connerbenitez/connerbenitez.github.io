document.addEventListener("DOMContentLoaded", function () {
    // Fetch global data for chart
    let myPromise = new Promise(async function (myResolve, myReject) {
        const url = 'https://disease.sh/v3/covid-19/historical/all?lastdays=all';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                myReject(`Response status: ${response.status}`);
                return;
            }

            const json = await response.json();
            console.log(json);
            myResolve(json);
        } catch (error) {
            console.error(error.message);
            myReject(error.message);
        }
    });

    myPromise.then(
        function (value) {
           

            const labels = Object.keys(value.cases);
            const cases = Object.values(value.cases);

            const data = {
                labels: labels,
                datasets: [{
                    label: "Covid Cases",
                    data: cases,
                    borderColor: '#eef0f0',
                    borderWidth: 1,
                    backgroundColor: "rgb(17, 17, 17)",
                }]
            };

            const config = {
                type: 'line',
                data: data,
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            };

            new Chart(document.getElementById('myChart'), config);
        },
        function (error) {
            console.log(error);
        }
    );

    
    document.querySelector("form").addEventListener("submit", function (event) {
        event.preventDefault(); 

        let country = document.getElementById("country").value.trim().toLowerCase();
        if (!country) {
            alert("Please enter a country name.");
            return;
        }

        let CountryPromise = new Promise(async function (myResolve, myReject) {
            const url = `https://disease.sh/v3/covid-19/countries/${country}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    myReject(`Response status: ${response.status}`);
                    return;
                }

                const json = await response.json();
                console.log(json);
                myResolve(json);
            } catch (error) {
                console.error(error.message);
                myReject(error.message);
            }
        });

        CountryPromise.then(
            function (value) {
                // document.getElementById("CountryDataDisplay").innerHTML = JSON.stringify(value, null, 2);
                
                
                document.getElementById("Country").innerHTML = `Country: ${value.country}`;
                document.getElementById("Cases").innerHTML = `Cases: ${value.cases}`;
                document.getElementById("Deaths").innerHTML = `Deaths: ${value.deaths}`;
                document.getElementById("Recovered").innerHTML = `Recovered: ${value.recovered}`;
                document.getElementById("Active").innerHTML = `Active: ${value.active}`;
                document.getElementById("flag").src = value.countryInfo.flag;
            },
            function (error) {
                console.log("Error:", error);
                document.getElementById("CountryDataDisplay").innerHTML = `Error: Enter A Valid Country Name`; 
            }
        );
    });
});
