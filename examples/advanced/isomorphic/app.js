let xs = require('xstream').default;
let {div, ul, li, a, section, h1, p} = require('@cycle/dom');

const renderMenu = () =>
  ul([
    li([ a('.link', {attrs: {href: '/'}}, 'Home') ]),
    li([ a('.link', {attrs: {href: '/about'}}, 'About') ]),
  ])

const renderHomePage = () => 
  section('.home', [
    h1('The homepage'),
    p('Welcome to our spectacular web page with nothing special here.'),
    renderMenu(),
  ])

const renderAboutPage = () =>
  section('.about', [
    h1('Read more about us'),
    p('This is the page where we describe ourselves.'),
    p('Contact us'),
    renderMenu(),
  ])


function app(sources) {

  let click$ = sources.DOM.select('.link')
    .events('click');

  let preventedEvent$ = click$;

  // -> Stream of routes such as {route: "/"}
  let contextFromClick$ = click$
    .map(ev => ({route: ev.currentTarget.attributes.href.value}));

  let context$ = xs.merge(

    // provided by the runner
    // -> window.appContext wrapped as stream
    sources.context, 
    contextFromClick$
  );

  let vtree$ = context$
    .map(({route}) => {
      if (typeof window !== 'undefined') {
        window.history.pushState(null, '', route);
      }
      switch (route) {
        case '/': return renderHomePage();
        case '/about': return renderAboutPage();
        default: return div(`Unknown page ${route}`)
      }
    });

  return {
    DOM: vtree$,
    PreventDefault: preventedEvent$
  };
}

module.exports = app;