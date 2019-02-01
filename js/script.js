// JavaScript source code
$(function () {

    var pokeApiUrl = "https://pokeapi.co/api/v2/generation/1";
    var pokemonByName = "https://pokeapi.co/api/v2/pokemon/";

    var selectedBtn = $(".selected");

    getList(pokeApiUrl);

    $("#gen1_btn").on("click", changeGen);
    $("#gen2_btn").on("click", changeGen);
    $("#gen3_btn").on("click", changeGen);
    $("#gen4_btn").on("click", changeGen);
    $("#gen5_btn").on("click", changeGen);
    $("#gen6_btn").on("click", changeGen);
    $("#gen7_btn").on("click", changeGen);

    function changeGen() {
        selectedBtn.toggleClass("selected");
        $(this).toggleClass("selected");
        selectedBtn = $(this);

        var id = selectedBtn.attr("id");
        var gen;
        if (id == "gen1_btn") {
            gen = 1;
        } else if (id == "gen2_btn") {
            gen = 2;
        } else if (id == "gen3_btn") {
            gen = 3;
        } else if (id == "gen4_btn") {
            gen = 4;
        } else if (id == "gen5_btn") {
            gen = 5;
        } else if (id == "gen6_btn") {
            gen = 6;
        } else if (id == "gen7_btn") {
            gen = 7;
        }

        pokeApiUrl = "https://pokeapi.co/api/v2/generation/" + gen;
        $("#pokemon-list").empty();
        getList(pokeApiUrl);
    }

    function getList(pokeApiUrl) {
        $.getJSON(pokeApiUrl).done(function (data) {
            console.log(data);
            $.each(data.pokemon_species, function (index, pokemon) {
                var name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                var link = $("<a>").attr("id", pokemon.name).attr("href", "#").append($("<strong>").text(name));
                var par = $("<p>").html("No. " + (index + 1) + ": ").append(link);

                par.appendTo("#pokemon-list");

                link.click(getDetails);

            });
        }).fail(function () {
            console.log("Request to PokeApi failed.");
        }).always(function () {
            console.log("Pokemon is awesome!");
        });
    }

    function getDetails() {
        var name = $(this).attr("id");
        $.getJSON(pokemonByName + name).done(function (details) {
            console.log(details);
            var pokemonDiv = $("#pokemon-info");
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
            pokemonDiv.delay(300).fadeTo(500, 1);

            var infoDiv = $("#pokemon-exp-info");
            infoDiv.css("opacity", 0);
            //infoDiv.css("opacity", 0);
            var typeCol = $("#typesCol");
            var abilCol = $("#abilCol");
            var movesList = $("#movesList");

            $(".infoCol").empty();

            movesList.empty();

            //typeCol.append("<td><p><strong>Type(s): </strong></p>");

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
            $("#heightCol").append("<p>" + heightm + " m");
            var weightKg = details.weight / 10;
            $("#weightCol").append("<p>" + weightKg + " kg.");


            var moves = details.moves;
            moves.forEach(function (item) {
                var moveName = item.move.name;
                movesList.append("<li>" + moveName.charAt(0).toUpperCase() + moveName.slice(1) + " ");
            });

            infoDiv.delay(800).fadeTo(500, 1);
        });
        event.preventDefault();
    }
    


});