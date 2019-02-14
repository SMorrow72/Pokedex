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
    var abilUrl = "https://pokeapi.co/api/v2/ability?limit=300";
    var singleAbilUrl = "https://pokeapi.co/api/v2/ability";
    var itemsUrl = "https://pokeapi.co/api/v2/item?limit=1000";
    var singleItemUrl = "https://pokeapi.co/api/v2/item";
    var movesUrl = "https://pokeapi.co/api/v2/move?limit=800";
    var singleMoveUrl = "https://pokeapi.co/api/v2/move";

    var selectedOption = $(".selectedOption");
    var selectedNav = $(".selectedNav");

    $(".navBtn").click(function () {
        selectedNav.toggleClass("selectedNav");
        $(this).toggleClass("selectedNav");
        selectedNav = $(this);

        if ($(this).attr("id") == "pokemonBtn") {
            pokemonMode();
        } else if ($(this).attr("id") == "movesBtn") {
            movesMode();
        } else if ($(this).attr("id") == "abilBtn") {
            abilitiesMode();
        } else {
            itemsMode();
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

        //Opening message from Professor Oak
        pokemonDiv.append("<img src='images/prof_oak.png' style='margin: 5px 165px' >")
        pokemonDiv.append("<p>Hello there! Welcome to the world of pokemon! My name is Oak! People call me the pokemon Prof! This world is inhabited by creatures called pokemon! For some people, pokemon are pets. Others use them for fights. Myself... I study pokemon as a profession.</p>");
        pokemonDiv.append("<p>This here is my latest invention, the Pokedex! It automatically records data on Pokemon you've seen or caught! It's a hi-tech encyclopedia!</p>");
        pokemonDiv.append("<p>To make a complete guide on all the Pokemon in the world... That was my dream! But, I'm too old! I can't do it! So, I want you two to fulfill my dream for me! Get moving, you two! This is a great undertaking in Pokemon history!</p>");
       
        var sortForm = $("<form id='sortForm'>");
        sortForm.append("<h2>Sort By:</h2>");
        var sortBtn1 = $("<label class='container btn selectedSort' id='genBtn'>Gen<input type='radio' name='sortMode' value='gen' checked='checked'></label>");
        var sortBtn2 = $("<label class='container btn' id='typeBtn'>Type<input type='radio' name='sortMode' value='type'></span></label>");

        sortBtn1.change(sortSwitch);
        sortBtn2.change(sortSwitch);

        sortForm.append(sortBtn1);
        sortForm.append(sortBtn2);

        optionsDiv.append(sortForm);

        var genBtnDiv = $("<div>").attr("id", "genBtnDiv").css("margin", "0").css("padding", "0");
        genBtnDiv.appendTo(optionsDiv);

        appendGenBtn(1);
        appendGenBtn(2);
        appendGenBtn(3);
        appendGenBtn(4);
        appendGenBtn(5);
        appendGenBtn(6);
        appendGenBtn(7);       

        appendTypeBtns("pokemon");
        var typeBtnDiv = $("#typeBtnDiv");
        typeBtnDiv.css("display", "none");

        getPokemonList(pokeApiUrl);
    }

    function movesMode() {
        clearControls();
        getMovesList(movesUrl);
        appendTypeBtns("moves");      
    }

    function abilitiesMode() {
        clearControls();
        getAbilityList(abilUrl);

    }

    function itemsMode() {
        clearControls();
        getItemsList(itemsUrl);
        appendPocketBtns();
    } 



    //**********************************
    // ELEMENT-APPENDING FUNCTIONS

    function appendGenBtn(gen) {
        var btn = $("<button class='btn opt_btn'>").html("Gen. " + gen);

        var genBtnDiv = $("#genBtnDiv");

        btn.click(function () {
            selectedOption.toggleClass("selectedOption");
            $(this).toggleClass("selectedOption");
            selectedOption = $(this);

            pokeApiUrl = "https://pokeapi.co/api/v2/generation/" + gen;
            listDiv.empty();
            getPokemonList(pokeApiUrl);
        });

        btn.appendTo(genBtnDiv);
    }

    function appendTypeBtns(mode) {
        
        var typeLink = "https://pokeapi.co/api/v2/type";
        var typeBtnDiv = $("<div>").attr("id", "typeBtnDiv").css("margin", "0").css("padding", "0");

        $.getJSON(typeLink).done(function (data) {
            $.each(data.results, function (index, type) {
                var typeName = type.name;

                var btn = $("<button class ='type-btn " + typeName + "'>").html(typeName.charAt(0).toUpperCase() + typeName.slice(1));

                btn.click(function () {
                    var singleTypeLink = "https://pokeapi.co/api/v2/type/" + typeName;

                    listDiv.empty();

                    $.getJSON(singleTypeLink).done(function (typeData) {
                        if (mode == "moves") {
                            $.each(typeData.moves, function (index, move) {
                                fillList(move.name, getMovesDetails);
                            });
                        } else if (mode == "pokemon") {
                            $.each(typeData.pokemon, function (index, pokemon) {
                                fillList(pokemon.pokemon.name, getPokemonDetails);
                            });
                        }                        

                    }).fail(function () {
                        console.log("Request to PokeApi failed.");
                    });
                });

                btn.appendTo(typeBtnDiv);            
            });

        }).fail(function () {
            console.log("Request to PokeApi failed.");
        }); 

        var allBtn = $("<button class='btn opt_btn'>").html("All Types");

        allBtn.click(function () {
            if (mode == "moves") {
                getMovesList(movesUrl);
            } else if (mode == "pokemon") {
                getPokemonList(pokeApiUrl);
            }
            
        });
        typeBtnDiv.append(allBtn);
        optionsDiv.append(typeBtnDiv);

    }

    function appendPocketBtns() {
        var pocketsUrl = "https://pokeapi.co/api/v2/item-pocket";
        var pocketBtnDiv = $("<div>").attr("id", "pocketBtnDiv").css("margin", "0").css("padding", "0");
        pocketBtnDiv.append("<h2>Bag Pocket:<h2>");

        $.getJSON(pocketsUrl).done(function (data) {
            $.each(data.results, function (index, pocket) {
                var pocketName = pocket.name;
                var singlePocketUrl = pocketsUrl + "/" + pocketName;

                var btn = $("<button class ='btn opt_btn pocket_btn'>").html(pocketName.charAt(0).toUpperCase() + pocketName.slice(1));

                btn.click(function () {
                    listDiv.empty();

                    $.getJSON(singlePocketUrl).done(function (pocketData) {
                        //Okay, these contain CATEGORIES, which then contain ITEMS
                        $.each(pocketData.categories, function (index, cat) {
                            var catUrl = "https://pokeapi.co/api/v2/item-category/" + cat.name;

                            $.getJSON(catUrl).done(function (data) {
                                $.each(data.items, function (index, item) {
                                    fillList(item.name, getItemDetails);
                                });
                            });
                        });
                    })
                });

                pocketBtnDiv.append(btn);
            });

        });
        optionsDiv.append(pocketBtnDiv);
    }

    function appendTitleCol(text) {
        var td;
        var strong = $("<strong>").html(text);
        td = $("<td>").append(strong);        

        td.appendTo($(titleRow));
    }

    //MISCELLANEOUS FUNCTIONS

    function fillList(entry, detailsFn) {
        var name = entry.charAt(0).toUpperCase() + entry.slice(1);
        var link = $("<a>").attr("id", entry).attr("href", "#").append($("<strong>").text(name.replace("-", " ")));
        var par = $("<p>").append(link);

        par.appendTo(listDiv);
        link.click(detailsFn);
    }

    function sortSwitch() {
        var genBtnDiv = $("#genBtnDiv");
        var typeBtnDiv = $("#typeBtnDiv");

        if (genBtnDiv.css("display") == "none") {
            typeBtnDiv.slideToggle(300);
            genBtnDiv.delay(400).slideToggle(300);
        } else {
            genBtnDiv.slideToggle(300);
            typeBtnDiv.delay(400).slideToggle(300);            
        }
        $("#genBtn").toggleClass("selectedSort");
        $("#typeBtn").toggleClass("selectedSort");

    }



    // LIST GENERATING FUNCTIONS

    function getPokemonList(pokeApiUrl) {
        $.getJSON(pokeApiUrl).done(function (data) {
            console.log(data);

            listDiv.empty();
            $.each(data.pokemon_species, function (index, pokemon) {
                fillList(pokemon.name, getPokemonDetails);
 
            });
            
        }).fail(function () {
            console.log("Request to PokeApi failed.");
        }).always(function () {
            console.log("Pokemon is awesome!");
        });
    }

    function getMovesList(movesUrl){
        $.getJSON(movesUrl).done(function (data) {
            listDiv.empty();

            $.each(data.results, function (index, move) {
                fillList(move.name, getMovesDetails);
            });

        }).fail(function () {
            console.log("Request to PokeApi failed.");
        }).always(function () {

        });
    }

    function getAbilityList(abilUrl) {
        $.getJSON(abilUrl).done(function (data) {

            listDiv.empty();

            $.each(data.results, function (index, ability) {
                fillList(ability.name, getAbilityDetails);
            });


        }).fail(function () {
            console.log("Request to PokeApi failed.");
        });
    }

    function getItemsList(itemsUrl) {
        $.getJSON(itemsUrl).done(function (data) {
            listDiv.empty();

            $.each(data.results, function (index, item) {
                fillList(item.name, getItemDetails);
            });
        }).fail(function () {
            console.log("Request to PokeApi failed.");
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
                typeCol.append("<p class='type-label " + typeName + "'>" + typeName.charAt(0).toUpperCase() + typeName.slice(1) + " ");
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

            //infoDiv.append("<h2>Moves</h2>");

            // GENERATE MOVES LIST

            //var movesList = $("<ul>").css("id", "movesList");

            //var moves = details.moves;
            //moves.forEach(function (item) {
            //    var moveName = item.move.name;
            //    movesList.append("<li>" + moveName.charAt(0).toUpperCase() + moveName.slice(1) + " ");
            //});

            //movesList.appendTo(infoDiv);

            infoDiv.delay(400).fadeTo(400, 1);
        });
        event.preventDefault();
    }

    function getMovesDetails(){
        var name = $(this).attr("id");
        $.getJSON(singleMoveUrl + "/" + name).done(function (details) {
            console.log(details);

            pokemonDiv.empty();
            pokemonDiv.css("opacity", 0);
            infoDiv.css("opacity", 0);

            pokemonDiv.append("<h1>" + name.charAt(0).toUpperCase() + name.slice(1) + "</h1>");
            var typeName = details.type.name;
            pokemonDiv.append("<p class='type-label " + typeName + "' style='margin-top:2px;'>" + typeName.charAt(0).toUpperCase() + typeName.slice(1) + " ");
            pokemonDiv.append("</br> </br>");
            if (details.flavor_text_entries[2] != null) {
                var description = details.flavor_text_entries[2].flavor_text;
                pokemonDiv.append("<h3>Description: ");
                pokemonDiv.append("<p>" + description + "</p>");
            } else {
                pokemonDiv.append("<p>Move definition is not available.</p>");
            }
            
            pokemonDiv.delay(100).fadeTo(400, 1);

            titleRow.empty();
            infoRow.empty();

            appendTitleCol("Power");
            appendTitleCol("PP");
            appendTitleCol("Damage Class");
            appendTitleCol("Contest Type");


            var powerCol = $("<td>").attr("id", "powerCol").attr("class", "infoCol");
            var ppCol = $("<td>").attr("id", "ppCol").attr("class", "infoCol");
            var damageCol = $("<td>").attr("id", "damageCol").attr("class", "infoCol");
            var contestCol = $("<td>").attr("id", "contestCol").attr("class", "infoCol");
            
            powerCol.append("<p>" + details.power + "</p>");
            ppCol.append("<p>" + details.pp + "</p>");
            var damageName = details.damage_class.name;
            damageCol.append("<p>" + damageName.charAt(0).toUpperCase() + damageName.slice(1) + "</p>");
            var contestName = details.contest_type.name;
            contestCol.append("<p>" + contestName.charAt(0).toUpperCase() + contestName.slice(1) + "</p>");

            infoRow.append(powerCol);
            infoRow.append(ppCol);
            infoRow.append(damageCol);
            infoRow.append(contestCol);

            
            infoDiv.delay(400).fadeTo(400, 1);

        });
        event.preventDefault();
    }

    function getAbilityDetails() {
        var name = $(this).attr("id");
        $.getJSON(singleAbilUrl + "/" + name).done(function (details) {
            console.log(details);
            pokemonDiv.empty();
            pokemonDiv.css("opacity", 0);
            infoDiv.css("opacity", 0);

            titleRow.empty();
            infoRow.empty();

            pokemonDiv.append("<h1>" + name.charAt(0).toUpperCase() + name.slice(1) + "</h1>");
            pokemonDiv.append("<h3> Effect: </h3>");
            pokemonDiv.append("<p>" + details.effect_entries[0].effect + "</p>");
            pokemonDiv.append("<h3>Short Effect: </h3>");
            pokemonDiv.append("<p>" + details.effect_entries[0].short_effect + "</p>");
                       
            pokemonDiv.delay(100).fadeTo(400, 1);
            infoDiv.delay(400).fadeTo(400, 1);
        });
        event.preventDefault();
    }

    function getItemDetails() {
        var name = $(this).attr("id");
        $.getJSON(singleItemUrl + "/" + name).done(function(details){
            console.log(details);

            pokemonDiv.empty();
            pokemonDiv.css("opacity", 0);
            infoDiv.css("opacity", 0);

            titleRow.empty();
            infoRow.empty();

            var itemName = name.charAt(0).toUpperCase() + name.slice(1);
            pokemonDiv.append("<h1>" + itemName.replace("-", " "));
            pokemonDiv.append("<img class='itemImg' src='" + details.sprites.default + "'>");
            pokemonDiv.append("<p>" + details.flavor_text_entries[2].text + "<p>");
            pokemonDiv.append("<h3>Effect:<h3>");
            pokemonDiv.append("<p>" + details.effect_entries[0].effect + "<p>");
            //getting the sprite will be tricky
            //you have to get it from its item entry

            appendTitleCol("Category");
            //appendTitleCol("Effect");
            appendTitleCol("Attributes");
            appendTitleCol("Cost");

            var catCol = $("<td>").attr("id", "catCol").attr("class", "infoCol");
            //var effectCol = $("<td>").attr("id", "effectCol").attr("class", "infoCol");
            var attrCol = $("<td>").attr("id", "attrCol").attr("class", "infoCol");
            var costCol = $("<td>").attr("id", "costCol").attr("class", "infoCol");

            catCol.append("<p>" + details.category.name + "<p>");

            var attributes = details.attributes;
            attributes.forEach(function (item) {
                attrCol.append("<p>" + item.name + "<p>");
            });

            costCol.append("<p>" + details.cost + "<p>");

            infoRow.append(catCol);
            //infoRow.append(effectCol);
            infoRow.append(attrCol);
            infoRow.append(costCol);

            pokemonDiv.delay(100).fadeTo(400, 1);
            infoDiv.delay(400).fadeTo(400, 1);
        });
        event.preventDefault();
    }

});