// See http://en.wikipedia.org/wiki/Comma-separated_values
(() => {
"use strict"; // Use ECMAScript 5 strict mode in browsers that support it

const resultTemplate = `
<div class="contenido">
      <table class="center" id="result">
          <% _.each(rows, (row) => { %>
          <tr class="<%=row.type%>">
              <% _.each(row.items, (name) =>{ %>
              <td><%= name %></td>
              <% }); %>
          </tr>
          <% }); %>
      </table>
  </p>
</div>
`;

/* Volcar la tabla con el resultado en el HTML */
const fillTable = (data) => {
  $("#finaltable").html(_.template(resultTemplate, { rows: data.rows }));
};

/* Volcar en la textarea de entrada
 * #original el contenido del fichero fileName */
/*const dump = (fileName) => {
  $.get(fileName, function (data) {
      $("#original").val(data);
  });
};*/

//File
const handleFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.target.files;
   var reader = new FileReader();
   reader.onload = (e) => {
     $("#original").val(e.target.result);
   };
   reader.readAsText(files[0])
}

//File
/* Drag and drop: el fichero arrastrado se vuelca en la textarea de entrada */
const handleDragFileSelect = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();

  var files = evt.dataTransfer.files; // FileList object.

  var reader = new FileReader();
  reader.onload = (e) => {
    $("#original").val(e.target.result);
    evt.target.style.background = "white";
  };
  reader.readAsText(files[0])
}

const handleDragOver = (evt) => {
  evt.stopPropagation();
  evt.preventDefault();
  evt.target.style.background = "pink";
}

//localstorage, inicializacion de ruta botones,
//añadidos eventos drap and drop
$(document).ready(() => {
    let original = document.getElementById("original");
    if (window.localStorage && localStorage.original) {
      original.value = localStorage.original;
    }

    $("#parser").click( () => {
        if (window.localStorage) localStorage.original = original.value;
        $.get("/csv", 
          { input: original.value },
          fillTable,
          'json'
        );
   });
      //rellenamos el textarea original con el contenido del boton
      $('button.example').each( (_,y) => {
        $(y).click( () => { 
                $.get("/findPorNombre", {
                        name: $(y).text()
                    },
                    (data) => {
                        $("#original").val(data[0].content);
                    });
            });
       //dump(`examples/${$(y).text()}.txt`); });
        });

        $.get("/find", {}, (data) => {
            for (var i = 0; i < 4; i++) {
                if (data[i]) {
                    $('button.example').get(i).className = "example";
                    $('button.example').get(i).textContent = data[i].name;
                }
            }
        });

       
       $("#guardar").click(() => {
          if (window.localStorage) localStorage.original = original.value;
          $.get("/mongo/", {
            name: $("#titulo").val(),
            content: $("#original").val()
          });
        });
    
    // Setup the drag and drop listeners.
    //var dropZone = document.getElementsByClassName('drop_zone')[0];
    let dropZone = $('.drop_zone')[0];
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleDragFileSelect, false);
    let inputFile = $('.inputfile')[0];
    inputFile.addEventListener('change', handleFileSelect, false);
 });
})();
