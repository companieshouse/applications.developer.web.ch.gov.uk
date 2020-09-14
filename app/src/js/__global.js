$(document).ready(function(event) {
  $("input[name=environment]").on("change", function (e) {
    showInDevelopmentOption();
  });
  (function () {
    showInDevelopmentOption();
  })();
});

function showInDevelopmentOption () {
  if ($("input[name=environment]").prop("checked")) {
    $("#conditional-environment").show();
  } else {
    $("#conditional-environment").hide();
  }
}

document.getElementById('restricted-ips').style.display='none';
document.getElementById('js-domains').style.display='none';
document.getElementById('redirect-uris').style.display='none';

function restClick(){
  document.getElementById('restricted-ips').style.visibility='visible';
  document.getElementById('restricted-ips').style.display = 'block';
  document.getElementById('js-domains').style.visibility='visible';
  document.getElementById('js-domains').style.display = 'block';
  document.getElementById('redirect-uris').style.display='none';
}
function streamClick(){
  document.getElementById('restricted-ips').style.visibility='visible';
  document.getElementById('restricted-ips').style.display = 'block';
  document.getElementById('js-domains').style.display='none';
  document.getElementById('redirect-uris').style.display='none';
}
function webClick(){
  document.getElementById('restricted-ips').style.display='none';
  document.getElementById('js-domains').style.display='none';
  document.getElementById('redirect-uris').style.visibility='visible';
  document.getElementById('redirect-uris').style.display = 'block';
}
