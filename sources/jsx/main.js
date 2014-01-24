/** @jsx React.DOM */

// Render base structure
// ---------------------

var domMain = document.getElementById('app-main');
React.renderComponent(
  <Page message="hello, world"/>,
  domMain
);