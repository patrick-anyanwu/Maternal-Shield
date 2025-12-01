import React, { useEffect, useRef } from 'react';

const TableauChart = ({ height = '600px' }) => {
  const vizRef = useRef(null);
  const vizElementRef = useRef(null);
  const vizLoaded = useRef(false);

  useEffect(() => {
    // Only load the visualization once
    if (vizLoaded.current) return;

    // Function to initialize the Tableau viz
    const initViz = () => {
      const divElement = vizRef.current;
      if (!divElement) return;

      // Find or create the object element
      let vizElement = divElement.getElementsByTagName('object')[0];
      if (!vizElement) {
        const newVizElement = document.createElement('object');
        newVizElement.classList.add('tableauViz');
        newVizElement.style.display = 'none';
        divElement.appendChild(newVizElement);
        vizElement = newVizElement;
      }
      vizElementRef.current = vizElement;

      // Set parameters for the visualization
      const parameters = [
        { name: 'host_url', value: 'https%3A%2F%2Fpublic.tableau.com%2F' },
        { name: 'embed_code_version', value: '3' },
        { name: 'site_root', value: '' },
        { name: 'name', value: 'Top10PHNsbyProportionofWomenwith5orMoreAntenatalVisits2022&#47;Sheet1' },
        { name: 'tabs', value: 'no' },
        { name: 'toolbar', value: 'yes' },
        { name: 'static_image', value: 'https:&#47;&#47;public.tableau.com&#47;static&#47;images&#47;To&#47;Top10PHNsbyProportionofWomenwith5orMoreAntenatalVisits2022&#47;Sheet1&#47;1.png' },
        { name: 'animate_transition', value: 'yes' },
        { name: 'display_static_image', value: 'yes' },
        { name: 'display_spinner', value: 'yes' },
        { name: 'display_overlay', value: 'yes' },
        { name: 'display_count', value: 'yes' },
        { name: 'language', value: 'en-US' }
      ];

      // Add parameters to the viz element
      parameters.forEach(param => {
        const paramElement = document.createElement('param');
        paramElement.name = param.name;
        paramElement.value = param.value;
        vizElement.appendChild(paramElement);
      });

      // Set the width and height
      vizElement.style.width = '100%';
      vizElement.style.height = height;

      // Create and add the script element
      const scriptElement = document.createElement('script');
      scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
      
      // Add the script element and mark as loaded
      vizElement.parentNode.insertBefore(scriptElement, vizElement);
      vizLoaded.current = true;
    };

    // Initialize the Tableau visualization
    if (window.tableau) {
      initViz();
    } else {
      // If the Tableau API isn't loaded yet, wait a bit and try again
      const timer = setTimeout(initViz, 100);
      return () => clearTimeout(timer);
    }

    // Clean up function
    return () => {
      if (vizElementRef.current) {
        // Clear out the element contents
        while (vizElementRef.current.firstChild) {
          vizElementRef.current.removeChild(vizElementRef.current.firstChild);
        }
      }
    };
  }, [height]);

  return (
    <div className="tableau-container" style={{ width: '100%', marginBottom: '2rem' }}>
      <div 
        className="tableauPlaceholder" 
        id="viz1745899532298" 
        ref={vizRef}
        style={{ position: 'relative' }}
      >
        <noscript>
          <a href="#">
            <img 
              alt="Top 10 PHNs by Proportion of Women with 5 or More Antenatal Visits (2022)" 
              src="https://public.tableau.com/static/images/To/Top10PHNsbyProportionofWomenwith5orMoreAntenatalVisits2022/Sheet1/1_rss.png"
              style={{ border: 'none' }}
            />
          </a>
        </noscript>
      </div>
    </div>
  );
};

export default TableauChart;