$(function() {
  $( "#tabs" ).tabs({
    collapsible: false
  });
});

var actualizarHtml = function(pestaña){
  switch (pestaña) {
    case "#Inicio":
        //$(pestaña).css("display","");
      break;
    case "#Gestion_de_colecciones":

      break;
    case "#Gestion_de_alojados":

      break;
    default:
      alert("Avisa a tu programador de confianza");
  }
}

$(document).ready(function() {
    $("#Inicio").click(function() {
        actualizarHtml("#Inicio");
    });
    $("#Gestion_de_colecciones").click(function() {
        actualizarHtml("#Gestion_de_colecciones");
    });
    $("#Gestion_de_alojados").click(function() {
        actualizarHtml("#Gestion_de_alojados");
    });

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
                //Ponemos este if porque si no es una mierda para esperar y hacer pruebas
                if (key > 640){
                    L.marker([val.geoData.latitude, val.geoData.longitude]).addTo(mymap)
                        .bindPopup("<a href=http://www.etsit.urjc.es>"+val.basicData.title+"</a>")
                        .openPopup();
                    $("#"+key).click(function() {
                        var latitude = val.geoData.latitude;
                        var longitude = val.geoData.longitude;
                        mymap.setView([latitude, longitude], 16);
                        console.log("Join1");
                        var layer = L.circleMarker([latitude, longitude], {
                            radius: 30,
                            fillColor: "#ff7800",
                            color: "#000",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.3,
                          }).addTo(mymap);
                        //Pendiente borrar el Layer
                        //$("#"+key).click(function() {
                        //    mymap.removeLayer(layer);
                        //});
                    });
              }
            });
        }).done(function( text ){
            $("boton").css("display","none");
            $("#listahoteles").css("display","block");
            console.log("Fichero de hoteles cargado");
        })
        .fail(function( text ){
            console.log("Problema al cargar el fichero de hoteles");
        });
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            mymap = L.map('mapa').setView([position.coords.latitude, position.coords.longitude], 14);
            L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'your.mapbox.project.id',
            accessToken: 'your.mapbox.public.access.token'
            }).addTo(mymap);
        });
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
        mymap = L.map('mapa').setView([40.2838, -3.8215], 14);
        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'your.mapbox.project.id',
        accessToken: 'your.mapbox.public.access.token'
        }).addTo(mymap);
    }

});
