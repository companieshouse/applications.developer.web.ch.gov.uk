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

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
   $(".restrictedIps").hide();
   $(".javaScriptDomains").hide();
   $(".redirectURIs").hide();
})

$("input[name='keyType']").on('change', function () {
  if ($(this).val() == 'rest') {
      $(".restrictedIps").show();
      $(".javaScriptDomains").show();
      $(".redirectURIs").hide();
  } else if ($(this).val() == 'stream'){
      $(".restrictedIps").show();
      $(".javaScriptDomains").hide();
      $(".redirectURIs").hide();
  } else if ($(this).val() == 'web'){
      $(".restrictedIps").hide();
      $(".javaScriptDomains").hide();
      $(".redirectURIs").show();
  }

})


})
