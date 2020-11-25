$(document).ready(function(event) {
  $("input[name=environment]").on("change", function (e) {
    showInDevelopmentOption();
  });
  (function () {
    showInDevelopmentOption();
  })();
});
function showInDevelopmentOption() {
  if ($("input[name=environment]").prop("checked")) {
    $("#conditional-environment").show();
  } else {
    $("#conditional-environment").hide();
  }
}
function clearDivs() {
  document.getElementById('restricted-ips').style.display = 'none';
  document.getElementById('redirect-uris').style.display = 'none';
  document.getElementById('js-domains').style.display = 'none';
}
function restClick() {
  document.getElementById('more-detail-uri').value = '';
  clearDivs();
  showElementById('restricted-ips');
  showElementById('js-domains');
}
function streamClick() {
  document.getElementById('more-detail-uri').value = '';
  document.getElementById('more-detail-domain').value = '';
  clearDivs();
  showElementById('restricted-ips');
}
function webClick() {
  document.getElementById('more-detail-domain').value = '';
  document.getElementById('more-detail-ip').value = '';
  clearDivs();
  showElementById('redirect-uris');
}
function showElementById(id) {
  document.getElementById(id).style.visibility = 'visible';
  document.getElementById(id).style.display = 'block';
}
function changeFieldSecurity(fieldId) {
  var displayType = document.getElementById(fieldId).getAttribute('type');
  var linkId = fieldId + '-link';
  if (displayType === 'password') {
    document.getElementById(fieldId).setAttribute('type', 'text');
    document.getElementById(linkId).innerHTML = 'Hide<span class="govuk-visually-hidden"> key</span>';
  } else {
    document.getElementById(fieldId).setAttribute('type', 'password');
    document.getElementById(linkId).innerHTML = 'Show<span class="govuk-visually-hidden"> key</span>';
  }
}
