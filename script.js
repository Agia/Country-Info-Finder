// Variable to store the country alpha2 code, from Country API. Hardcoded for testing, until CountryAPI code is implemented
let countryAlphaCode;
// Variables to store English phrases
const phraseOne = "Hello";
const phraseTwo = "Goodbye";
const phraseThree = "Thank you";
// Variable to store and manipulate user input
let country;

// Element variables
let visitedNav = document.querySelector(".visited");
let wishListNav = document.querySelector(".wish-list");
let searchInput = document.querySelector("#search");
let searchButton = document.querySelector("#button-search");
let saveVisitedBtn = document.querySelector("#button-visited");
let saveWishBtn = document.querySelector("#button-wishlist");
let heroSearchContainer = document.querySelector("#hero-search");
let infoRowContainer = document.querySelector("#info-container");
let listContainer = document.querySelector("#saved-countries-visited");
let wishListContainer = document.querySelector("#saved-countries-wishList");
let clearButtonVisited = document.querySelector("#clear-visited");
let clearButtonWishlist = document.querySelector("#clear-wishlist");

//variables to store saved countries
let visitedCountriesArr = JSON.parse(localStorage.getItem("visited")) || [];
let wishListArr = JSON.parse(localStorage.getItem("wish")) || [];

//on click on Visited navbar item open a list of saved countries
visitedNav.addEventListener("click", function() {

    if (visitedCountriesArr.length > 0) {
    //   let listContainer = document.querySelector("#saved-countries-visited");
      listContainer.innerHTML = "";

      for (let i = 0; i < visitedCountriesArr.length; i++) {
        let visitedCountry = visitedCountriesArr[i];
        let countryList = document.createElement("li");

        listContainer.appendChild(countryList);
        countryList.textContent = visitedCountry;
      }
    } else {
        document.querySelector(".empty-visited").textContent = "You still don't have any Countries on your list"
    }
})

// Event Listener Wish list  navbar item open a list of saved countries
wishListNav.addEventListener("click", function() {
    if (wishListArr.length > 0) {

    // let wishListContainer = document.querySelector("#saved-countries-wishList");
      wishListContainer.innerHTML = "";

      for (let i = 0; i < wishListArr.length; i++) {
        let wishCountry = wishListArr[i];
        let wishCountryList = document.createElement("li");

        wishListContainer.appendChild(wishCountryList);
        wishCountryList.textContent = wishCountry; 
      }
    } else {
        document.querySelector(".empty-wish").textContent = "You still don't have any Countries on your list"
    }
});

//Event Listener when a Country is saved goes to localStorage
saveVisitedBtn.addEventListener("click", function(event){
    // Prevents default behavior 
    event.preventDefault();
    // To normalize output
    country = country.toUpperCase();
    if (!visitedCountriesArr.includes(country)) {

        visitedCountriesArr.push(country);
        localStorage.setItem("visited", JSON.stringify(visitedCountriesArr));
    }
    
});

saveWishBtn.addEventListener("click", function(event){
     // Prevents default behavior 
     event.preventDefault();
     // To normalize output
     country = country.toUpperCase();
    if (!wishListArr.includes(country)) {
        // If it doesn't, user input is pushed to the array
        wishListArr.push(country);
        localStorage.setItem("wish", JSON.stringify(wishListArr));
     }   
})


// Event listener for search input, which formats and stores the user input, calls a fetch request to the CountryAPI, and then calls the function to render the data
searchButton.addEventListener("click", function (event) {
    // Prevents default behavior 
    event.preventDefault();

    if (searchInput.value !== "") {
        country = searchInput.value.toLowerCase();
        
        fetch("https://countryapi.io/api/name/" + country + "?apikey=9faUreLJojOnzlUoLLEoVq5QZfM3kHI5UY7kq6xX")
        .then((response) => response.json())
        .then((data) => {

            heroSearchContainer.style.minWidth = "";
            infoRowContainer.style.display = "";
            
            obtainData(data)

        });
        
    } else {
        return;
    } 
})

// Event listeners to clear all previous saved list items. Removes localStorage, HTML and empties the array
clearButtonVisited.addEventListener("click", function (event) {
    listContainer.innerHTML = "";
    localStorage.removeItem("visited");
    visitedCountriesArr = [];
})

clearButtonWishlist.addEventListener("click", function (event) {
    wishListContainer.innerHTML = "";
    localStorage.removeItem("wish");
    wishListArr = [];
})

// Function to be called on page load
function init() {

    heroSearchContainer.style.minWidth = "70vw";
    infoRowContainer.style.display = "none";
}

// Obtains data from CountryAPI and renders it to the page
function obtainData(data) {
    for (const [countryCode, countryData] of Object.entries(data)) {
        //Capital
        let capitalEL = document.getElementById("capital")
        capitalEL.textContent = countryData.capital

        //Population
        let populationEL = document.getElementById("population")
        populationEL.textContent = countryData.population

        //LanguagesList
        let languagesEL = document.getElementById("languages")
        // Added the below to show content stacking from previous requests
        languagesEL.textContent = "";
        let languageCount = 0;
        for (const languageCode in countryData.languages) {
            const element = countryData.languages[languageCode]

            if (Object.keys(countryData.languages).length === 1) {
                languagesEL.textContent += countryData.languages[languageCode]
                break
            } else if (languageCount < Object.keys(countryData.languages).length - 1) {
                languagesEL.textContent += countryData.languages[languageCode] + ", "
                languageCount++
            } else{
                languagesEL.textContent += countryData.languages[languageCode]
            }
        }
        
        //Region
        let regionEL = document.getElementById("region")
        regionEL.textContent = countryData.region

        //Currency
        let currencyEL = document.getElementById("currency")
        // Added the below to show content stacking from previous requests
        currencyEL.innerHTML = "";
        for (const currencyCode in countryData.currencies) {
            const currency = countryData.currencies[currencyCode]
            console.log(currency.name)
            currencyEL.textContent += currency.name
        }

        //Flag
        let flagEL = document.getElementById("flag")
        flagEL.setAttribute("src", countryData.flag.medium);

        //CountryName
        let countryNameEL = document.getElementById("countryName")
        countryNameEL.textContent = countryData.name

        // CountryAlpha2Code - Retrieves data and converts it to a readable format for translate API
        countryAlphaCode = countryData.alpha2Code.toLowerCase();

    }

    // Calls the translate function to translate and render phrases to the page
    getTranslations(phraseOne);
    getTranslations(phraseTwo);
    getTranslations(phraseThree);

    //  Clears the input field
    searchInput.value = "";
};


// Does a fetch request to translate API with fixed, and generated, variables as parameters and renders content to 'Phrases' area of page
function getTranslations(phrase) {
    // Variables to store the translated phrases
    let translatedPhraseOne;
    let translatedPhraseTwo;
    let translatedPhraseThree;

    // Call to translate API using phraseOne
    const encodedParams = new URLSearchParams();
    encodedParams.append("source_language", "en");
    encodedParams.append("target_language", countryAlphaCode);
    encodedParams.append("text", phrase);

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Key': '056b2790e1mshd8bb490ad1003bcp114ba5jsn60210fff2967',
            'X-RapidAPI-Host': 'text-translator2.p.rapidapi.com'
        },
        body: encodedParams
    };

    fetch('https://text-translator2.p.rapidapi.com/translate', options)
    .then(response => response.json())
    .then((input) => {
        
        // Local variables to store HTML elements changed via the function
        let phraseOneElement = document.querySelector("#phrase-one");
        let phraseTwoElement = document.querySelector("#phrase-two");
        let phraseThreeElement = document.querySelector("#phrase-three");
        
        // Compares passed parameter to global values, saves the relavant data and changes the associated HTML element. If not match is found, the function returns;
        if (phrase === phraseOne) {
            translatedPhraseOne = input.data.translatedText;
            phraseOneElement.textContent = `${translatedPhraseOne}`;
            
        } else if (phrase === phraseTwo) {
            translatedPhraseTwo = input.data.translatedText;
            phraseTwoElement.textContent = `${translatedPhraseTwo}`;
            
        } else if (phrase === phraseThree) {
            translatedPhraseThree = input.data.translatedText;
            phraseThreeElement.textContent = `${translatedPhraseThree}`;
            
        } else {
            return;
        }
    })
    .catch(err => console.error(err));
    
}

// Calls on page load
init();