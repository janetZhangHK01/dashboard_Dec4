import React from 'react';
import './App.css';
import Brand from './components/brandNavbar';
import DistrictsEighteen from './components/districtSelector';

// tracking
// import * as TrackEvent from './trackEvent_prod.js'
// import * as TrackEvent from './components/trackEvent_tester.js'

function App() {
    // // tracking
    // let linkText = window.location.href;
    // console.log(linkText);
    // let entrySource = (linkText.match(/#/)) ? linkText.match(/#(.*?)(&|$|\?)/)[1] : 'organic';
    // let article_id = (linkText.match(/utm_source=inline_article/)) ? linkText.match(/utm_source=inline_article_(.*?)(&|$|\?)/)[1] : 'organic';
    // // const [entryS, setEntryS] = useState(entrySource);

    // switch(entrySource) {
    //     case "article":
    //     case "base":
    //     case "issue":
    //         break;
    //     default:
    //         entrySource = "organic";
    //         TrackEvent.fireArticlePV(TrackEvent.removehash(window.location.href));
    // };
  return (
    <div>
      <Brand />
      <DistrictsEighteen >
      </DistrictsEighteen>
    </div>
  );
}

export default App;
