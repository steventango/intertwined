(function() {
  function isOurTeamInViewport() {
    var element = document.getElementsByClassName('ourteam')[0];
    if (element) {
      var rect = element.getBoundingClientRect();
      return (
        rect.top <= 100
      );
    } else {
      return false;
    }
  }
  function callback() {
    if (isOurTeamInViewport()) {
      var teamMembers = document.querySelectorAll('.team-member');
      for (var i = 0; i < teamMembers.length; i++) {
        teamMembers[i].className = 'team-member animate';
      }
    }
  }
  if (document.body.className.indexOf('page-id-29') !== -1) {
    document.addEventListener('scroll', callback, false)
    document.addEventListener('load', callback, false)
  }
})();
