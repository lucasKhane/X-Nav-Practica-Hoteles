$(function() {
  $( "#tabs" ).tabs({
    collapsible: false
  });
});

$(function() {
    $("boton").button().click(function(event){
        $.getJSON("alojamientos.json", function( data ) {
            console.log(data);
            $.each(data.serviceList.service, function(key,val){
                //console.log(val.basicData.name);
                $("#listahoteles").prepend(
                  "<div id='"+key+"'>"+
                  "<h5>"+val.basicData.name+"</h5>"+
                  "</div>"
                );
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
});
