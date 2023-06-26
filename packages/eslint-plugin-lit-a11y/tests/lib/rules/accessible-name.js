/**
 * @fileoverview Enforce elements have accessible names and/or discernable text
 * @author open-wc
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/accessible-name.js');

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  settings: { litHtmlSources: false },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2015,
  },
});

ruleTester.run('accessible-name', rule, {
  valid: [
    // BUTTONS
    { code: 'html`<button>hello</button>`' },
    { code: 'html`<button title="hi"></button>`' },
    { code: 'html`<button aria-label="hi"></button>`' },
    { code: 'html`<button aria-labelledby="hi"></button>`' },
    { code: 'html`<button aria-hidden="true"></button>`' },
    // LINKS
    { code: 'html`<a>hello</a>`' },
    { code: 'html`<a aria-label="hello"></a>`' },
    { code: 'html`<a aria-label="hello">hello</a>`' },
    { code: 'html`<a aria-labelledby="hello"></a>`' },
    { code: 'html`<a aria-hidden="true"></a>`' },
    // ROLE TOOLTIP
    { code: 'html`<div role="tooltip" id="al" aria-label="Name"></div>`' },
    { code: 'html`<div role="tooltip" id="alb" aria-labelledby="labeldiv"></div>`' },
    { code: 'html`<div role="tooltip" id="combo" aria-label="Aria Name">Name</div>`' },
    { code: 'html`<div role="tooltip" id="title" title="Title"></div>`' },
    // ROLE PROGRESSBAR
    { code: 'html`<div role="progressbar" id="alb" aria-labelledby="labeldiv"></div>`' },
    { code: 'html`<div role="progressbar" id="combo" aria-label="Aria Name">Name</div>`' },
    { code: 'html`<div role="progressbar" id="title" title="Title"></div>`' },
    // ROLE METER
    { code: 'html`<div role="meter" id="alb" aria-labelledby="labeldiv"></div>`' },
    { code: 'html`<div role="meter" id="combo" aria-label="Aria Name">Name</div>`' },
    { code: 'html`<div role="meter" id="title" title="Title"></div>`' },
    // ROLE DIALOG
    { code: 'html`<div role="dialog" id="alb" aria-labelledby="labeldiv"></div>`' },
    { code: 'html`<div role="dialog" id="combo" aria-label="Aria Name">Name</div>`' },
    { code: 'html`<div role="dialog" id="title" title="Title"></div>`' },
    // ROLE ALERTDIALOG
    { code: 'html`<div role="alertdialog" id="alb" aria-labelledby="labeldiv"></div>`' },
    { code: 'html`<div role="alertdialog" id="combo" aria-label="Aria Name">Name</div>`' },
    { code: 'html`<div role="alertdialog" id="title" title="Title"></div>`' },
    // ROLES BUTTON, LINK, MENUITEM
    { code: 'html`<div role="button">hi</div>`' },
    { code: 'html`<div role="button" aria-label="hi"></div>`' },
    { code: 'html`<div role="button" aria-label="${bar}"></div>`' },
    { code: 'html`<div role="button" aria-labelledby="hi"></div>`' },
    { code: 'html`<div role="button" title="hi"></div>`' },
    { code: 'html`<div role="link">hi</div>`' },
    { code: 'html`<div role="link" aria-label="hi"></div>`' },
    { code: 'html`<div role="link" aria-labelledby="hi"></div>`' },
    { code: 'html`<div role="link" title="hi"></div>`' },
    { code: 'html`<div role="menuitem">hi</div>`' },
    { code: 'html`<div role="menuitem" aria-label="hi"></div>`' },
    { code: 'html`<div role="menuitem" aria-labelledby="hi"></div>`' },
    { code: 'html`<div role="menuitem" title="hi"></div>`' },
    // INPUT FIELDS
    { code: 'html`<div id="pass1" aria-label="country" role="combobox">England</div>`' },
    {
      code: 'html`<div id="pass2" role="listbox" aria-labelledby="pass2Label"><div role="option">Orange</div></div>`',
    },
    {
      code: 'html`<div id="pass3" role="searchbox" contenteditable="true" aria-labelledby="pass3Label"></div>`',
    },
    {
      code: 'html`<div id="pass4" role="slider" aria-label="Choose a value" aria-valuemin="1" aria-valuemax="7" aria-valuenow="2"></div>`',
    },
    {
      code: 'html`<div id="pass5" role="spinbutton" aria-valuemin="0" aria-valuemax="10" aria-valuenow="8" aria-label="Enter quantity:"></div>`',
    },
    { code: 'html`<div id="pass6" role="textbox" aria-labelledby="foo"></div>`' },
    // HEADINGS
    { code: 'html`<h1>hello</h1>`' },
    { code: 'html`<h2>hello</h2>`' },
    { code: 'html`<h3>hello</h3>`' },
    { code: 'html`<h4>hello</h4>`' },
    { code: 'html`<h5>hello</h5>`' },
    { code: 'html`<h6>hello</h6>`' },
    { code: 'html`<h6>${"foo"}</h6>`' },
    { code: 'html`<h1>${foo}</h1>`' },
    { code: 'html`<h2>${foo}</h2>`' },
    { code: 'html`<h3>${foo}</h3>`' },
    { code: 'html`<h4>${foo}</h4>`' },
    { code: 'html`<h5>${foo}</h5>`' },
    { code: 'html`<h6>${foo}</h6>`' },
    { code: "html`<h1><div aria-hidden='true'>foo</div> foo</h1>`" },
    { code: 'html`<h1>${foo()}</h1>`' },
    { code: 'html`<h1>${foo("hello")}</h1>`' },
    { code: 'html`<h1>${foo(1)}</h1>`' },
    { code: 'html`<h1>${foo(true)}</h1>`' },
    { code: 'html`<h1>${foo(bar)}</h1>`' },
    { code: 'html`<h1>${foo(bar, "hello", 1, true)}</h1>`' },
    { code: 'html`<h1>${this.foo()}</h1>`' },
    {
      code: 'html`<custom-heading level="1">${this.foo()}</custom-heading>`',
      options: [
        {
          customHeadingElements: 'custom-heading',
        },
      ],
    },

    { code: 'html`<input type="button" id="pass1" value="Button Name" />`' },
    { code: 'html`<input type="button" id="pass2" aria-label="Name" />`' },
    { code: 'html`<input type="button" id="pass3" aria-labelledby="labeldiv" />`' },
    { code: 'html`<input type="button" id="pass4" value="Name" aria-label="Aria Name" />`' },
    { code: 'html`<input type="button" title="Something" id="pass9" />`' },

    { code: 'html`<input type="submit" id="pass5" />`' },
    { code: 'html`<input type="submit" value="Something" id="pass6" />`' },
    { code: 'html`<input type="submit" title="Something" id="pass10" />`' },

    { code: 'html`<input type="reset" id="pass7" />`' },
    { code: 'html`<input type="reset" value="Something" id="pass8" />`' },
    { code: 'html`<input type="reset" title="Something" id="pass11" />`' },

    { code: 'html`<div role="treeitem" id="al" aria-label="Name"></div>`' },
    { code: 'html`<div role="treeitem" id="alb" aria-labelledby="labeldiv"></div>`' },
    { code: 'html`<div role="treeitem" id="combo" aria-label="Aria Name">Name</div>`' },
    { code: 'html`<div role="treeitem" id="title" title="Title"></div>`' },
  ],
  invalid: [
    // BUTTONS
    {
      code: 'html`<button></button>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<button aria-label=""></button>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<button aria-labelledby=""></button>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<button title=""></button>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<custom-button title=""></custom-button>`',
      options: [
        {
          customButtonElements: ['custom-button'],
        },
      ],
      errors: [{ messageId: 'name', data: { kind: 'Buttons' } }],
    },
    // lINKS
    {
      code: 'html`<a></a>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<a aria-label=""></a>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<a title=""></a>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<a aria-labelledby=""></a>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<custom-link aria-label=""></custom-link>`',
      options: [
        {
          customLinkElements: ['custom-link'],
        },
      ],
      errors: [{ messageId: 'name', data: { kind: 'Links' } }],
    },
    // ROLE TOOLTIP
    {
      code: 'html`<div role="tooltip"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role tooltip' } }],
    },
    {
      code: 'html`<div role="tooltip" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role tooltip' } }],
    },
    {
      code: 'html`<div role="tooltip" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role tooltip' } }],
    },
    {
      code: 'html`<div role="tooltip" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role tooltip' } }],
    },
    // ROLE PROGRESSBAR
    {
      code: 'html`<div role="progressbar"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role progressbar' } }],
    },
    {
      code: 'html`<div role="progressbar" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role progressbar' } }],
    },
    {
      code: 'html`<div role="progressbar" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role progressbar' } }],
    },
    {
      code: 'html`<div role="progressbar" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role progressbar' } }],
    },
    // ROLE METER
    {
      code: 'html`<div role="meter"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role meter' } }],
    },
    {
      code: 'html`<div role="meter" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role meter' } }],
    },
    {
      code: 'html`<div role="meter" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role meter' } }],
    },
    {
      code: 'html`<div role="meter" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role meter' } }],
    },
    // ROLE DIALOG
    {
      code: 'html`<div role="dialog"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role dialog' } }],
    },
    {
      code: 'html`<div role="dialog" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role dialog' } }],
    },
    {
      code: 'html`<div role="dialog" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role dialog' } }],
    },
    {
      code: 'html`<div role="dialog" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role dialog' } }],
    },
    // ROLE ALERTDIALOG
    {
      code: 'html`<div role="alertdialog"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role alertdialog' } }],
    },
    {
      code: 'html`<div role="alertdialog" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role alertdialog' } }],
    },
    {
      code: 'html`<div role="alertdialog" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role alertdialog' } }],
    },
    {
      code: 'html`<div role="alertdialog" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role alertdialog' } }],
    },
    // ROLES BUTTON, LINK, MENUITEM
    {
      code: 'html`<div role="button"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role button' } }],
    },
    {
      code: 'html`<div role="button" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role button' } }],
    },
    {
      code: 'html`<div role="button" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role button' } }],
    },
    {
      code: 'html`<div role="button" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role button' } }],
    },
    {
      code: 'html`<div role="button"><p aria-hidden="true">hi</p></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role button' } }],
    },
    {
      code: 'html`<div role="link"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role link' } }],
    },
    {
      code: 'html`<div role="link" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role link' } }],
    },
    {
      code: 'html`<div role="link" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role link' } }],
    },
    {
      code: 'html`<div role="link" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role link' } }],
    },
    {
      code: 'html`<div role="link"><p aria-hidden="true">hi</p></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role link' } }],
    },
    {
      code: 'html`<div role="menuitem"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role menuitem' } }],
    },
    {
      code: 'html`<div role="menuitem" aria-label=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role menuitem' } }],
    },
    {
      code: 'html`<div role="menuitem" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role menuitem' } }],
    },
    {
      code: 'html`<div role="menuitem" title=""></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role menuitem' } }],
    },
    {
      code: 'html`<div role="menuitem"><p aria-hidden="true">hi</p></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role menuitem' } }],
    },
    // INPUT FIELDS
    {
      code: 'html`<div id="fail1" aria-label=" " role="combobox">England</div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role combobox' } }],
    },
    {
      code: 'html`<div id="fail1" aria-labelledby=" " role="combobox">England</div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role combobox' } }],
    },
    {
      code: 'html`<div id="fail3" role="textbox"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role textbox' } }],
    },
    {
      code: 'html`<div id="fail8" role="slider" aria-valuemin="1" aria-valuemax="7" aria-valuenow="2"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role slider' } }],
    },
    {
      code: 'html`<div id="fail10" role="textbox"></div>`',
      errors: [{ messageId: 'name', data: { kind: 'Role textbox' } }],
    },
    // HEADINGS
    {
      code: "html`<h1><div aria-hidden='true'>foo</div></h1>`",
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
    },
    {
      code: 'html`<h1></h1>`',
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
    },
    {
      code: 'html`<h2></h2>`',
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
    },
    {
      code: 'html`<h3></h3>`',
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
    },
    {
      code: 'html`<h4></h4>`',
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
    },
    {
      code: 'html`<h5></h5>`',
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
    },
    {
      code: 'html`<h6></h6>`',
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
    },
    {
      code: 'html`<custom-heading level="1"></custom-heading>`',
      errors: [{ messageId: 'name', data: { kind: 'Headings' } }],
      options: [
        {
          customHeadingElements: ['custom-heading'],
        },
      ],
    },

    { code: 'html`<input type="button" id="fail1" />`', errors: [{ messageId: 'name' }] },
    { code: 'html`<input type="button" value="" id="fail1" />`', errors: [{ messageId: 'name' }] },
    {
      code: 'html`<input type="button" id="fail2" aria-label="" />`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<input type="button" id="fail3" aria-labelledby="" />`',
      errors: [{ messageId: 'name' }],
    },
    { code: 'html`<input type="submit" value="" id="fail5" />`', errors: [{ messageId: 'name' }] },
    { code: 'html`<input type="reset" value="" id="fail6" />`', errors: [{ messageId: 'name' }] },
    { code: 'html`<div role="treeitem" id="empty"></div>`', errors: [{ messageId: 'name' }] },
    {
      code: 'html`<div role="treeitem" id="alempty" aria-label=""></div>`',
      errors: [{ messageId: 'name' }],
    },
    {
      code: 'html`<div role="treeitem" id="albmissing" aria-labelledby=""></div>`',
      errors: [{ messageId: 'name' }],
    },
  ],
});
