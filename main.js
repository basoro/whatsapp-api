$(document).ready(function() {
  var socket = io();
  var waapitoken = localStorage.getItem("clientId");
  if(localStorage.getItem("clientId")=='basoro'){$('.add-client-btn').click(function(){var clientId=$('#client-id').val();var clientDescription=$('#client-description').val();localStorage.setItem("clientId",clientId);var template=$('.client').first().clone().removeClass('hide').addClass(clientId);template.find('.title').html(clientId);template.find('.description').html(clientDescription);$('.client-container').append(template);socket.emit('create-session',{id:clientId,description:clientDescription});});}else{$("#pengguna").html('Auth');$("#description").hide();$("#sender1").removeClass("sender1");$("#sender1").addClass("sender2");$('.add-client-btn').click(function(){var clientId=$('#client-id').val();localStorage.setItem("clientId",clientId);});};
  socket.on('init', function(data) {
    var result = data.filter(x => x.id === waapitoken);
    if(waapitoken != 'basoro'){var data = result;};	              
    $('.client-container .client').not(':first').remove();
    for (var i = 0; i < data.length; i++) {
      var session=data[i];var clientId=session.id;var clientDescription=session.description;var template=$('.client').first().clone().removeClass('hide').addClass(clientId);template.find('.title').html(clientId);template.find('.description').html(clientDescription);$('.client-container').append(template);
      if (session.ready) {
        $(`.client.${session.id} .logs`).append($('<li>').text('Whatsapp is ready!'));
      } else {
        $(`.client.${session.id} .logs`).append($('<li>').text('Connecting...'));
      };
    };
  });
  socket.on('remove-session', function(id) {
    $(`.client.${id}`).remove();
  });
  socket.on('message', function(data) {
    $(`.client.${data.id} .logs`).append($('<li>').text(data.text));
  });
  socket.on('qr', function(data) {
    $(`.client.${data.id} #qrcode`).attr('src', data.src);
    $(`.client.${data.id} #qrcode`).show();
  });
  socket.on('ready', function(data) {
    $(`.client.${data.id} #qrcode`).hide();
  });
  socket.on('authenticated', function(data) {
    $(`.client.${data.id} #qrcode`).hide();
  });
});
function sendMessage(){var xhttp=new XMLHttpRequest();var sender=document.getElementById("sender").value;var number=document.getElementById("number").value;var message=document.getElementById("message").value;xhttp.onreadystatechange=function(){if(this.readyState==4&&this.status==200){var data=xhttp.responseText;var jsonResponse=JSON.parse(data);if(jsonResponse["status"]==true){alert('Sukses mengirim pesan.');}else{alert('Gagal mengirim pesan.');}}};xhttp.open("POST","https://wa.basoro.id/send-message",true);xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");xhttp.send("sender="+sender+"&number="+number+"&message="+message);};function sendMedia(){var xhttp=new XMLHttpRequest();var sender=document.getElementById("sender").value;var number=document.getElementById("number").value;var caption=document.getElementById("caption").value;var file=document.getElementById("file").value;xhttp.onreadystatechange=function(){if(this.readyState==4&&this.status==200){var data=xhttp.responseText;var jsonResponse=JSON.parse(data);if(jsonResponse["status"]==true){alert('Sukses mengirim media.');}else{alert('Gagal mengirim media.');}}};xhttp.open("POST","https://wa.basoro.id/send-media",true);xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");xhttp.send("sender="+sender+"&number="+number+"&caption="+caption+"&file="+file);};
