$(function() {
  $( "#tabs" ).tabs({
    collapsible: false
  });
});

var cargarInfoHotel = function (hotel){
    //Hacemos la lista de ids
    $("#listids").empty();
    idsplus[hotel.basicData.name].forEach(function(number){
        console.log(idsplus[hotel.basicData.name]);
        console.log(number);
        $("#listids").prepend(
          "<div id='"+number+"'>"+
          "<h5>"+number+"</h5>"+
          "</div>"
        );
    });
    //Eliminar antiguo
    $("#central .hotel").empty();
    $("#central .phone").empty();
    $("#central .web").empty();
    $("#central .direccion").empty();
    $("#central .descripcion").empty();
    //Asignamos nuevo
    $("#central .hotel").html("Hotel: "+hotel.basicData.name);
    $("#central .phone").html("Teléfono: "+hotel.basicData.phone);
    $("#central .web").html("Web: "+hotel.basicData.web);
    $("#central .direccion").html("Hotel: "+hotel.geoData.address);
    $("#central .descripcion").html("Hotel: "+hotel.basicData.body);

    //Eliminar antiguo
    $(".carousel-indicators").empty();
    //Asignamos nuevo
    var indicatorscarrusel = '<li data-target="#myCarousel" data-slide-to="0" class="active"></li>';
    for (i=1;i<hotel.multimedia.media.length;i++){
      indicatorscarrusel = indicatorscarrusel +
      '<li data-target="#myCarousel" data-slide-to='+i+'></li>'
    }
    $(".carousel-indicators").html(indicatorscarrusel);

    //Eliminar antiguo
    $(".carousel-inner").empty();
    //Asignamos nuevo
    var fotoscarrusel = '<div class="item active">'+
                          '<img src='+hotel.multimedia.media[0].url+">"+
                       '</div>'
    for (i=1;i<hotel.multimedia.media.length;i++){
      fotoscarrusel = fotoscarrusel +
      '<div class="item">'+
         '<img src='+hotel.multimedia.media[i].url+">"+
      '</div>'
    }
    $(".carousel-inner").html(fotoscarrusel);
}

var idsplus = {};
function addidplus(idnumber) {
    nombrehotelactual = $("#hotelactual").html();
    if (idsplus[nombrehotelactual].indexOf(idnumber) == -1){
      idsplus[nombrehotelactual].push(idnumber);
    }
    //Hacemos la lista de ids
    $("#listids").empty();
    idsplus[nombrehotelactual].forEach(function(number){
        console.log(idsplus[nombrehotelactual]);
        console.log(number);
        $("#listids").prepend(
          "<div id='"+number+"'>"+
          "<h5>"+number+"</h5>"+
          "</div>"
        );
    });
}

$(document).ready(function() {

    $("#Inicio").click(function() {
        $("#addplus").css("display", "none");
    });
    $("#Gestion_de_colecciones").click(function() {
        $("#addplus").css("display", "none");
    });
    $("#Gestion_de_alojados").click(function() {
        $("#addplus").css("display", "block");
        $("#hotelcontainer2").html($("#hotelcontainer").html());
    });

    //Pestaña de Inicio
    $("boton").button().click(function(event){
        $.getJSON("alojamientos.json", function( data ) {
            console.log(data);
            alert("Puede que tarde en cargar, se paciente y no detengas el script!");
            $.each(data.serviceList.service, function(key,val){
                //console.log(val.basicData.name);
                $("#listahoteles").prepend(
                  "<div id='"+key+"'>"+
                  "<h5>"+val.basicData.name+"</h5>"+
                  "</div>"
                );
                idsplus[val.basicData.name] = [];

                $("#"+key).draggable({
                    containment: "window",
                    scroll: false,
                    helper: 'clone',
                });
                    //Si quisiesemos poner todos los marcadores en el mapa tras pulsar el boton. Malo tarda mucho en cargar
                    /*var marker = L.marker([val.geoData.latitude, val.geoData.longitude])
                    .addTo(mymap)
                    .on('click', onClick)
                    .bindPopup("<a href= nada>"+val.basicData.title+"</a>")
                    .openPopup();
                    function onClick(e) {
                        cargarInfoHotel(val);
                        mymap.setView([val.geoData.latitude, val.geoData.longitude], 16);
                    }*/

                $("#"+key).click(function() {
                    var latitude = val.geoData.latitude;
                    var longitude = val.geoData.longitude;
                    mymap.setView([latitude, longitude], 16);
                    var marker = L.marker([val.geoData.latitude, val.geoData.longitude])
                    .addTo(mymap)
                    .on('click', onClick)
                    .bindPopup("<a href="+val.basicData.web+">"+val.basicData.title+"  </a>"+
                                "<input type='button' value='Delete' class='marker-delete-button'/>")
                    .on("popupopen", onPopupOpen)
                    .openPopup();
                    function onClick(e) {
                        $("#hotelactual").html(val.basicData.name);
                        cargarInfoHotel(val);
                        mymap.setView([val.geoData.latitude, val.geoData.longitude], 16);
                    }
                    var layer = L.circleMarker([latitude, longitude], {
                        radius: 30,
                        fillColor: "#ff7800",
                        color: "#000",
                        weight: 1,
                        opacity: 1,
                        fillOpacity: 0.3,
                    }).addTo(mymap);
                    function onPopupOpen() {
                        var tempMarker = this;
                        $(".marker-delete-button:visible").click(function () {
                            mymap.removeLayer(tempMarker);
                            mymap.removeLayer(layer);
                        });
                    }
                    $("#hotelactual").html(val.basicData.name);
                    cargarInfoHotel(val);
                });
            });
        }).done(function( text ){
            $("boton").css("display","none");
            $("#listahoteles").css("display","block");
            $("#hotelcontainer").css("display","block");
            console.log("Fichero de hoteles cargado");
        })
        .fail(function( text ){
            console.log("Problema al cargar el fichero de hoteles");
        });
    });

    mymap = L.map('mapa').setView([40.2838, -3.8215], 14);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'your.mapbox.project.id',
    accessToken: 'your.mapbox.public.access.token'
    }).addTo(mymap);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            mymap.setView([position.coords.latitude, position.coords.longitude], 14);
        });
    }

    //Pestaña Gestion_de_colecciones
    $("#form1").submit(function(event) {
      var idname2 = $('input[name="form1"]').val();
      idname = idname2+"a";
      console.log(idname);
      event.preventDefault();
      $("#listacolecciones").prepend(
        "<div id='"+idname+"'>"+
        "<h4>"+idname2+"</h4>"+
        "</div>"
      );
      $("#"+idname).droppable({
        drop: handleDropEvent
      });
      function handleDropEvent( event, ui ) {
        var draggable = ui.draggable;
        console.log(idname);
        $("#"+idname).append(draggable);
      };
      $("#"+idname+" h4").css("text-decoration","underline");
      $("#"+idname).css("border","2px solid #777");
      $("#"+idname).css("background","Beige");
      $("#"+idname).css("width","80%");
      $("#"+idname).css("text-align","center");
    });

    //Pestaña Gestion_de_alojados
    $("#form2").submit(function(event) {
        var idnumber = $('input[name="form2"]').val();
        event.preventDefault();
        addidplus(idnumber);
    });

});
