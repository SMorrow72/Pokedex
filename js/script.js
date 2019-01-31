// JavaScript source code
$(function () {

    var pokeApiUrl = "https://pokeapi.co/api/v2/generation/1";
    var pokemonByName = "https://pokeapi.co/api/v2/pokemon/";

    var selectedBtn = $(".selected");

    getJSON(pokeApiUrl);

    $("#gen1_btn").on("click", changeGen);
    $("#gen2_btn").on("click", changeGen);
    $("#gen3_btn").on("click", changeGen);

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
        } else {
            gen = 3;
        }

        pokeApiUrl = "https://pokeapi.co/api/v2/generation/" + gen;
        $("#pokemon-list").empty();
        getJSON(pokeApiUrl);
    }

    function getJSON(pokeApiUrl) {
        $.getJSON(pokeApiUrl).done(function (data) {
            console.log(data);
            $.each(data.pokemon_species, function (index, pokemon) {
                var name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                var link = $("<a>").attr("id", pokemon.name).attr("href", "#").append($("<strong>").text(name));
                var par = $("<p>").html("No. " + (index + 1) + ": ").append(link);


                par.appendTo("#pokemon-list");

                link.click(function (event) {
                    $.getJSON(pokemonByName + pokemon.name).done(function (details) {
                        console.log(details);
                        var pokemonDiv = $("#pokemon-info");
                        pokemonDiv.empty();
                        pokemonDiv.css("opacity", 0);
                        pokemonDiv.append("<h1>" + name + "</h1>");
                        pokemonDiv.append("<img src='" + details.sprites.front_default + "'>");
                        pokemonDiv.append("<img src='" + details.sprites.back_default + "'>");
                        pokemonDiv.append("<img src='" + details.sprites.front_shiny + "'>");
                        pokemonDiv.append("<img src='" + details.sprites.back_shiny + "'>");
                        pokemonDiv.fadeTo(500, 1);

                        var infoDiv = $("#pokemon-exp-info");
                        //infoDiv.css("opacity", 0);
                        var typeCol = $("#typesCol");
                        var abilCol = $("#abilCol");
                        var movesCol = $("#movesCol");

                        typeCol.empty();
                        abilCol.empty();
                        movesCol.empty();

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

                        //movesCol.append("<p><strong>Moves: </strong></p>");
                        var moves = details.moves;
                        moves.forEach(function (item) {
                            var moveName = item.move.name;
                            movesCol.append("<p>" + moveName.charAt(0).toUpperCase() + moveName.slice(1) + " ");
                        });

                        infoDiv.delay(500).fadeTo(500, 1);


                        //pokemonDiv.append("<p>" + details.);
                    });
                    event.preventDefault();
                });

            });
        }).fail(function () {
            console.log("Request to PokeApi failed.");
        }).always(function () {
            console.log("Pokemon is awesome!");
        });
    }
    


});