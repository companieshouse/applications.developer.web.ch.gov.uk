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
