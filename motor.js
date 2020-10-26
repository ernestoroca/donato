var Motor = (function(){
  var tabla,vecPreguntas,pActual,nroEjercicios,nroErrores,reloj;
  function cargar(){
    var datostr = localStorage.getItem(tabla);
    if (datostr){
      vecPreguntas = JSON.parse(datostr);
    } else {
      vecPreguntas = crear();
      localStorage.setItem(tabla,JSON.stringify(vecPreguntas));
    }
  }
  function iniciar(){//carga pagina
    cargar();
    pActual = -1;
    document.getElementById('empezar').style.display='block';
    document.getElementById('avance').style.width = '0%';
  }
  function preguntar(){
    var lng = vecPreguntas.length;
    if (nroEjercicios===0 || lng===0){
      if (nroErrores===0){
        document.getElementById('empezar-img').src = "http://i1.kym-cdn.com/photos/images/original/000/751/685/932.gif";
        document.getElementById('empezar-mensaje').innerHTML="FELICIDADES!<br>No tuviste ning&uacute;n error!<br>Presiona para continuar";
      } else if(nroErrores==1){
        document.getElementById('empezar-img').src = "http://www.reactiongifs.com/r/sbbn.gif";
        document.getElementById('empezar-mensaje').innerHTML="Tuviste un error!<br>Presiona para continuar";
      } else {
        document.getElementById('empezar-img').src= "http://www.reactiongifs.com/r/sbbn.gif";
        document.getElementById('empezar-mensaje').innerHTML="Tuviste "+nroErrores+" errores!<br>Presiona para continuar";
      }
      
      document.getElementById('empezar').style.display='block';
      
      if (lng ===0){
        vecPreguntas = crear();
      }
      localStorage.setItem(tabla,JSON.stringify(vecPreguntas));
      return;
    } else {
      nroEjercicios--;
      document.getElementById('avance').style.width = (100 - 5*nroEjercicios)+'%';
      var pos = 0;
      var repete=3;
      var salto;
      do{
        salto = Math.floor(40*Math.random())+1;
        while(salto>vecPreguntas[pos].nivel){
          salto -= vecPreguntas[pos].nivel;
          pos++;
          if (pos>=lng){
            pos = 0;
          }
        }
        if (repete===0){
          break;
        }
        repete--;
      } while(pActual===pos);
      reloj = setTimeout(evaluar,3500);
      pActual = pos;
      document.getElementById("pregunta").innerHTML=vecPreguntas[pos].pregunta;
      document.getElementById("respuesta").innerHTML="&nbsp;";
    }
  }
  function numeroclick() {
    var pantalla = document.getElementById("respuesta");
    var anterior = pantalla.innerHTML;
    var actual = this.id.substring(3,4);
    if (anterior=="&nbsp;"){
      anterior="0";
    }
    var nuevo = parseInt(anterior)*10+parseInt(actual);
    pantalla.innerHTML = ""+nuevo;
  }
  function celebrar(){
    document.getElementById('feliz').style.display='block';
    vecPreguntas[pActual].nivel--;
    if (vecPreguntas[pActual].nivel<=0){
      vecPreguntas.splice(pActual,1);
      pActual = -1;
    }
    setTimeout(function(){
       document.getElementById('feliz').style.display='none';
      preguntar();
    },2000);
  }
  function entristecer(){
    document.getElementById('triste').style.display='block';
    vecPreguntas[pActual].nivel=10;
    nroErrores++;
    document.getElementById('triste-mensaje').innerText= vecPreguntas[pActual].pregunta + " = " + vecPreguntas[pActual].respuesta;
    setTimeout(function(){
      document.getElementById('triste').style.display='none';
      preguntar();
    },6000);
  }
  function retro(){
    document.getElementById("respuesta").innerHTML = "&nbsp;";
  }
  function evaluar(){
    var numero,respuesta,pregunta,pos;
    if (reloj){
      clearTimeout(reloj);
    }
    respuesta = document.getElementById("respuesta").innerHTML;
    if (respuesta=="&nbsp;"){
      numero=10000;
    } else if (respuesta=="31416"){
      localStorage.removeItem(tabla);
      cargar();
      return;
    }
    numero = parseInt(respuesta);
    
    if (vecPreguntas[pActual].respuesta===numero){
      celebrar();
    } else {
      entristecer();
    }
  }
  function empezar(){//serie de preguntas
    nroEjercicios=20;
    nroErrores=0;
    document.getElementById('empezar').style.display='none';
    document.getElementById('avance').style.width = '0%';
    preguntar();
  }
  return {
    iniciar:function(t){
      tabla = t;
      //document.getElementById("btn-del").addEventListener('click',retro,false);
      document.getElementById("btn-OK").addEventListener('click',evaluar,false);
      document.getElementById("empezar").addEventListener('click',empezar,false);
      var vecBtnCls = document.getElementsByClassName("boton");
      for (var i = 0; i < vecBtnCls.length; i++) {
          vecBtnCls[i].addEventListener('click', numeroclick, false);
      }
      iniciar();
    },
  };
}());
