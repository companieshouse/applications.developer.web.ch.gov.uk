$(document).ready(function (event) {
  $('input[name=environment]').on('change', function (e) {
    showInDevelopmentOption();
  });
  (function () {
    showInDevelopmentOption();
  })();
});

function showInDevelopmentOption () {
  if ($('input[name=environment]').prop('checked')) {
    $('#conditional-environment').show();
  } else {
    $('#conditional-environment').hide();
  }
}

function clearDivs () {
  document.getElementById('restricted-ips').style.display = 'none';
  document.getElementById('js-domains').style.display = 'none';
  document.getElementById('redirect-uris').style.display = 'none';
}

function restClick () {
  clearDivs();
  showElementById('restricted-ips');
  showElementById('js-domains');
}
function streamClick () {
  clearDivs();
  showElementById('restricted-ips');
}
function webClick () {
  clearDivs();
  showElementById('redirect-uris');
}

function showElementById (id) {
  document.getElementById(id).style.visibility = 'visible';
  document.getElementById(id).style.display = 'block';
}

function changeFieldSecurity (fieldId) {
  var security = document.getElementById(fieldId).getAttribute('type');
  var linkId = fieldId + '-link';
  if (security === 'password') {
    document.getElementById(fieldId).setAttribute('type', 'text');
    document.getElementById(linkId).innerHTML = 'Hide<span class="govuk-visually-hidden"> key</span>';
  } else {
    document.getElementById(fieldId).setAttribute('type', 'password');
    document.getElementById(linkId).innerHTML = 'Show<span class="govuk-visually-hidden"> key</span>';
  }
}
