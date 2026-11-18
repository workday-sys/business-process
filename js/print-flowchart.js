/* ==========================================================================
   print-flowchart.js — shared "Print flowchart" button
   --------------------------------------------------------------------------
   What it does:
     1. Finds every .flowchart on the page.
     2. Puts a "Print flowchart" button next to its "Process Flowchart" label.
     3. On click, copies ONLY that flowchart (plus its title) into a temporary
        #print-area, opens the browser print dialog, then removes the copy.
   The print-only rules (hide everything except #print-area) live in
   css/styles.css, section 6.
   Used by: every detail page that has a flowchart. To add it to a new page,
   include ONE line in <head>:
     <script src="js/print-flowchart.js?v=1" defer></script>      (root pages)
     <script src="../js/print-flowchart.js?v=1" defer></script>   (pages in a subfolder)
   ========================================================================== */
   (function () {
    'use strict';
  
    const BUTTON_TEXT    = 'Print flowchart';
    const PRINT_AREA_ID  = 'print-area';
    const PRINTING_CLASS = 'is-printing-flowchart';   // added to <body> while printing
    const PRINTER_ICON   =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/>' +
      '<path d="M6 14h12v7H6z"/></svg>';
  
    // Title for the printout: the tab's band heading (h2) or the card title.
    function getFlowchartTitle(flowchart) {
      const card = flowchart.closest('.card');
      const heading = card && (card.querySelector('.process-meta h2') || card.querySelector('.card-title'));
      return heading ? heading.textContent.trim() : 'Process Flowchart';
    }
  
    // Remove the temporary copy and put the page back to normal.
    function cleanUp() {
      const area = document.getElementById(PRINT_AREA_ID);
      if (area) area.remove();
      document.body.classList.remove(PRINTING_CLASS);
    }
  
    function printFlowchart(flowchart) {
      cleanUp();                                         // in case an earlier print was cancelled oddly
  
      const area = document.createElement('div');
      area.id = PRINT_AREA_ID;
  
      const pageTitle = document.querySelector('.header h1');
      const kicker = document.createElement('p');
      kicker.className = 'print-area-page';
      kicker.textContent = pageTitle ? pageTitle.textContent.trim() : document.title;
  
      const title = document.createElement('h1');
      title.className = 'print-area-title';
      title.textContent = getFlowchartTitle(flowchart);
  
      area.append(kicker, title, flowchart.cloneNode(true));   // a copy: the original stays in place
      document.body.appendChild(area);
      document.body.classList.add(PRINTING_CLASS);
  
      window.addEventListener('afterprint', cleanUp, { once: true });
      window.print();
    }
  
    function addPrintButtons() {
      document.querySelectorAll('.flowchart').forEach(function (flowchart) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'print-btn';
        button.innerHTML = PRINTER_ICON + '<span>' + BUTTON_TEXT + '</span>';
        // Screen readers hear which flowchart the button prints.
        button.setAttribute('aria-label', BUTTON_TEXT + ': ' + getFlowchartTitle(flowchart));
        button.addEventListener('click', function () { printFlowchart(flowchart); });
  
        // Toolbar row: [Process Flowchart label ........ Print button]
        const tools = document.createElement('div');
        tools.className = 'flowchart-tools';
        const label = flowchart.previousElementSibling;
        if (label && label.classList.contains('section-label')) {
          label.before(tools);
          tools.append(label, button);
        } else {
          flowchart.before(tools);
          tools.append(button);
        }
      });
    }
  
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addPrintButtons);
    } else {
      addPrintButtons();
    }
  })();