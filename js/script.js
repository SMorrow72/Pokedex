// JavaScript source code
$(function () {

    // GLOBAL HTML CONTROLS
    var pokemonDiv = $("#pokemon-info");
    var infoDiv = $("#pokemon-exp-info");
    var titleRow = $(".titleRow");
    var infoRow = $(".infoRow");
    var optionsDiv = $("#options");
    var listDiv = $("#list");

    var pokeApiUrl = "https://pokeapi.co/api/v2/generation/1";
    var pokemonByName = "https://pokeapi.co/api/v2/pokemon/";
    var locationsUrl = "https://pokeapi.co/api/v2/location";
    var abilUrl = "https://pokeapi.co/api/v2/ability";

    var selectedOption = $(".selectedOption");
    var selectedNav = $(".selectedNav");

    $(".navBtn").click(function () {
        selectedNav.toggleClass("selectedNav");
        $(this).toggleClass("selectedNav");

        if ($(this).attr("id") == "pokemonBtn") {
            pokemonMode();
        } else if ($(this).attr("id") == "movesBtn") {
            movesMode();
        } else if ($(this).attr("id") == "locationsBtn") {
            locationsMode();
        } else {
            abilitiesMode();
        }

    });

    pokemonMode();

    //*********************************
    // MODE-SWITCH FUNCTIONS

    function clearControls() {
        pokemonDiv.empty();
        titleRow.empty();
        infoRow.empty();
        optionsDiv.empty();
        listDiv.empty();
    }

    function pokemonMode() {
        clearControls();

        appendGenBtn(1);
        appendGenBtn(2);
        appendGenBtn(3);
        appendGenBtn(4);
        appendGenBtn(5);
        appendGenBtn(6);
        appendGenBtn(7);

        getPokemonList(pokeApiUrl);
    }

    function movesMode() {
        clearControls();
    }

    function locationsMode() {
        clearControls();
        getLocationList(locationsUrl);
    }

    function abilitiesMode() {
        clearControls();
    }

    //**********************************
    // ELEMENT APPENDING FUNCTIONS

    function appendGenBtn(gen) {
        var btn = $("<button class='opt_btn'>").html("Gen. " + gen);

        btn.click(function () {
            selectedOption.toggleClass("selectedOption");
            $(this).toggleClass("selectedOption");
            selectedOption = $(this);

            pokeApiUrl = "https://pokeapi.co/api/v2/generation/" + gen;
            listDiv.empty();
            getPokemonList(pokeApiUrl);
        });

        btn.appendTo(optionsDiv);
    }

    function appendTitleCol(text) {
        var td;
        var strong = $("<strong>").html(text);
        td = $("<td>").append(strong);        

        td.appendTo($(titleRow));
    }

    // LIST GENERATING FUNCTIONS

    function getPokemonList(pokeApiUrl) {
        $.getJSON(pokeApiUrl).done(function (data) {
            console.log(data);

            $.each(data.pokemon_species, function (index, pokemon) {
                var name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                var link = $("<a>").attr("id", pokemon.name).attr("href", "#").append($("<strong>").text(name));
                var par = $("<p>").html("No. " + (index + 1) + ": ").append(link);

                par.appendTo("#list");

                link.click(getPokemonDetails);
            });
            
        }).fail(function () {
            console.log("Request to PokeApi failed.");
        }).always(function () {
            console.log("Pokemon is awesome!");
        });
    }

    function getLocationList(locationsUrl) {
        $.getJSON(locationsUrl).done(function (data) {
            console.log(data);

            //$.each LEFT OFF HERE
           


        }).fail(function () {
            console.log("Request to PokeApi failed.");
        }).always(function () {
            console.log("Pokemon is Sweeet!");
        });
    }


    //DETAILS GENERATING FUNCTIONS

    function getPokemonDetails() {
        var name = $(this).attr("id");
        $.getJSON(pokemonByName + name).done(function (details) {
            console.log(details);
            pokemonDiv.empty();
            pokemonDiv.css("opacity", 0);

            var sprites = details.sprites;
            pokemonDiv.append("<h1>" + name.charAt(0).toUpperCase() + name.slice(1) + "</h1>");
            pokemonDiv.append("<img src='" + sprites.front_default + "'>");
            if (sprites.back_default)
                pokemonDiv.append("<img src='" + sprites.back_default + "'>");
            pokemonDiv.append("<img src='" + sprites.front_shiny + "'>");
            if (sprites.back_shiny)
                pokemonDiv.append("<img src='" + sprites.back_shiny + "'>");
            pokemonDiv.delay(100).fadeTo(400, 1);

            titleRow.empty();

            appendTitleCol("Type(s)");
            appendTitleCol("Abilities");
            appendTitleCol("Height");
            appendTitleCol("Weight");
            
            infoDiv.css("opacity", 0);

            //var typeCol = $("#typesCol");
            var typeCol = $("<td>").attr("id", "typesCol").attr("class", "infoCol");
            //var abilCol = $("#abilCol");
            var abilCol = $("<td>").attr("id", "abilCol").attr("class", "infoCol");
            var heightCol = $("<td>").attr("id", "heightCol").attr("class", "infoCol");
            var weightCol = $("<td>").attr("id", "weightCol").attr("class", "infoCol");

            infoRow.empty();
            $(".infoCol").empty();           

            //typeCol.append("<td><p><strong>Type(s): </strong></p>");

            // GET TYPES, ABILITIES, HEIGHT, AND WEIGHT

            var types = details.types;
            types.forEach(function (item) {
                var typeName = item.type.name;
                typeCol.append("<p>" + typeName.charAt(0).toUpperCase() + typeName.slice(1) + " ");
            });

            //abilCol.append("<p><strong>Abilities: </strong></p>");
            var abilities = details.abilities;
            abilities.forEach(function (item) {
                var abilityName = item.ability.name;
                abilCol.append("<p>" + abilityName.charAt(0).toUpperCase() + abilityName.slice(1) + " ");
            });

            var heightm = details.height / 10;
            heightCol.append("<p>" + heightm + " m");
            var weightKg = details.weight / 10;
            weightCol.append("<p>" + weightKg + " kg.");

            typeCol.appendTo(infoRow);
            abilCol.appendTo(infoRow);
            heightCol.appendTo(infoRow);
            weightCol.appendTo(infoRow);

            infoDiv.append("<h2>Moves</h2>");

            // GENERATE MOVES LIST

            var movesList = $("<ul>").css("id", "movesList");

            var moves = details.moves;
            moves.forEach(function (item) {
                var moveName = item.move.name;
                movesList.append("<li>" + moveName.charAt(0).toUpperCase() + moveName.slice(1) + " ");
            });

            movesList.appendTo(infoDiv);

            infoDiv.delay(400).fadeTo(400, 1);
        });
        event.preventDefault();
    }
    


});