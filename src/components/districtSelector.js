import React, {useState, useEffect} from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Dropdown from 'react-bootstrap/Dropdown'
import Accordion from 'react-bootstrap/Accordion'
import FormControl from 'react-bootstrap/FormControl'
import Card from 'react-bootstrap/Card'
import allSmallArea from '../smallArea/allSmallArea.json'
// dashborad
import voter from "../smallArea/voter.js"
import population from "../smallArea/population.js"
import {HorizontalBar} from 'react-chartjs-2';
import {Bar} from 'react-chartjs-2';
import {Doughnut} from 'react-chartjs-2';

// carousel
import Carousel from 'react-bootstrap/Carousel';
import rightIcon from '../img/icons8-chevron-right-48.png';
import leftIcon from '../img/icons8-chevron-left-48.png'

// tracking
// import * as TrackEvent from './trackEvent_prod.js'

    // The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a aria-haspopup="true" aria-expanded="false" href="" ref={ref} onClick={e =>{e.preventDefault(); onClick(e);}} className="dropdown-toggle nav-link" role="button">{children}</a>
  ));
  
  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
      const [value, setValue] = useState('');
      return (
        <div
          ref={ref}
          style={{width: '170px', height: '210px', overflowY: 'scroll'}}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 fix-width"
            placeholder="搜尋..."
            onChange={e => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              child =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );

// nav-dropdown
function DistrictsEighteen () {
    // tracking
    // let linkText = window.location.href;
    // console.log(linkText);
    // let entrySource = (linkText.match(/#/)) ? linkText.match(/#(.*?)(&|$|\?)/)[1] : 'organic';
    // let article_id = (linkText.match(/utm_source=inline_article/)) ? linkText.match(/utm_source=inline_article_(.*?)(&|$|\?)/)[1] : 'organic';
    // const [entryS, setEntryS] = useState(entrySource);

    // switch(entryS) {
    //     case "article":
    //     case "base":
    //     case "issue":
    //         break;
    //     default:
    //         entrySource = "organic";
    // TrackEvent.fireArticlePV(TrackEvent.removehash(window.location.href));
    // }

    const [selectedDsitrict, setDistrict] = useState("中西區");
    const [selectedSub, setSub] = useState("中環");
    const [selectedReport, setReport] = useState(voter);
    const [chartTheme, setTheme] = useState('age');
    // dashboard 
    const [chartOption, setOption] = useState();
    const [chartData, setData] = useState({});  
    // carousel for voter
    const [carouselIndex, setCaroueslIndex] = useState(0);
    const [directioin, setDirection] = useState(null);  
    // carousel for population
    const [carousePoplIndex, setCaroueslPopIndex] = useState(0);
    const [directioinPop, setDirectionPop] = useState(null); 

    useEffect(() => {
        setData({
            labels: selectedReport[chartTheme][selectedSub]['chartLabel'],   
            datasets:[{
                // chart legend
                label:  chartTheme === 'age'? '':selectedReport[chartTheme][selectedSub]['chartLabel'],
                data:[...selectedReport[chartTheme][selectedSub]['num']],
                backgroundColor: selectedReport === voter? chartTheme === 'age'? ('rgba(54, 162, 235, 0.5)'):(['rgba(54, 162, 235, 0.2)','rgba(255, 99, 132, 0.2)']):chartTheme === 'income'? ('rgba(255, 206, 86, 0.5)'): chartTheme === 'edu'?(['rgba(54, 162, 235, 0.2)','rgba(255, 99, 132, 0.2)','rgba(153, 102, 255, 0.2)']):(['rgba(255,99,132,1)','rgba(54, 162, 235, 1)','rgba(255, 206, 86, 1)','rgba(75, 192, 192, 1)','rgba(153, 102, 255, 1)'])        
            }]
           
        });
        setOption({
                // responsive:false,
                // width:100,
                // height:100, 
                title: {display:true,
                text: selectedReport === voter? chartTheme === 'age'? (selectedSub +'選民年齡組別分佈'):(selectedSub +'選民性別分佈') :chartTheme === 'income'?[(selectedSub +'家庭住戶月收入分佈') + '(中位數' + (selectedReport[chartTheme][selectedSub]['medianNum']).toString() + '元)']: chartTheme === 'edu'?(selectedSub +'選區人口最高教育程度分佈'):(selectedSub +'住所類型分佈'),
                fontSize: window.screen.width >768 ? 20:13,
              },
                layout:{
                    padding:{
                        top: 0,
                        right: 5,
                        left: 5,
                        bottom:0
                    }
                },
                scales:chartTheme === 'age'|| chartTheme === 'income'?{
                    yAxes:[
                        {
                        // scaleLabel:{
                        //     display:true,
                        //     labelString:'人',
                        // },
                        ticks:{
                            display:true,
                            fontSize: window.screen.width >768?13:window.screen.width >320? 11:8,
                            fontColor:'rgba(0, 0, 0, 0.87)'
                        },
                        gridLines: {
                            display:true
                        } 
                    }],
                    xAxes:[{
                        // scaleLabel:{
                        //     display:true,
                        //     labelString:chartTheme === 'age'?'歲':'元',
                        // },
                        // minBarLength:400,
                        // barPercentage: 0.2,
                        // categoryPercentage: 0.3,
                        barThickness:'flex',
                        gridLines: {
                            display:false,
                        },
                        ticks:{
                            fontSize:window.screen.width >768?13:window.screen.width >320? 11:8,
                            fontColor:'rgba(0, 0, 0, 0.87)',
                            display:true,
                            // fontWeight: 900
                        }
                    }]
                }:{
                    yAxes:[{
                        ticks:{
                            display:false,
                            fontColor:'rgba(0, 0, 0, 0.87)'

                        },
                        gridLines: {
                            display:false
                            // color: "rgba(0, 0, 0, 0)",
                        } 
                    }],
                    xAxes:[{
                        gridLines: {
                            display:false
                            // color: "rgba(0, 0, 0, 0)",
                        },
                        ticks:{
                            fontSize: window.screen.width >768 ?13:window.screen.width >320? 11:8,
                            fontColor:'rgba(0, 0, 0, 0.87)',
                            display:false
                        }
                    }]
                },
                // responsive: true,
                maintainAspectRatio:false,
                legend:chartTheme === 'age' || chartTheme ===  'income'?  {display:false}:{display:true,position:'right', align:'start'},     
                tooltips: {
                    callbacks: {
                        title: function(tooltipItem, data) {
                            var nu=''
                            chartTheme === 'age'? nu = data['datasets'][0]['data'][tooltipItem[0].index]: nu =  data['datasets'][0]['data'][tooltipItem[0].index];
                            return nu + ' 人';
                        },
                        label: function(tooltipItem, data) {
                            // get the concerned dataset
                            var dataset = data.datasets[tooltipItem.datasetIndex];
                            // calculate the total of this data set
                            var total = dataset.data.reduce((previousValue, currentValue, currentIndex, array)=>{
                                return previousValue + currentValue;
                            });
                            // get the current items value
                            var currentValue = dataset.data[tooltipItem.index];
                            // calculate the precentage base on the total and current item, also this does a rough rounding to a give a whole numnber
                            var percentage = Math.floor(((currentValue/total) * 100)+0.5);
                            return percentage + '%';
                        }
                    }
                }
        })
    },[selectedSub, selectedDsitrict, chartTheme, selectedReport]);

    const handleSelect = (selectedIndex, e) =>{
        setCaroueslIndex(selectedIndex);
        setDirection(e.direction);
        if(selectedReport === voter){
            if (selectedIndex === 0){
                setTheme('age');
            } else{
                setTheme('gender');
            }
        }else {
            if (selectedIndex === 0){
                setTheme('income');
            } else if (selectedIndex === 1){
                setTheme('edu');
            } else {
                setTheme('resident');
            }
        }
    };

    const handelPopSelect = (selectedPoIndex, e) =>{
        setCaroueslPopIndex(selectedPoIndex);
        setDirectionPop(e.directioin);
        if(selectedReport === voter){
            if (selectedPoIndex === 0){
                setTheme('age');
            } else{
                setTheme('gender');
            }
        }else {
            if (selectedPoIndex === 0){
                setTheme('income');
            } else if (selectedPoIndex === 1){
                setTheme('edu');
            } else {
                setTheme('resident');
            }
        }
    };
    const handleSelectDistrict = (e) =>{
        const listItems = allSmallArea[e.target.text];
        setDistrict(e.target.text);
        setSub(listItems[0].caname);
    };
    const handleSelectSub = (e) =>{
        console.log(selectedSub);
        setSub(e.target.text);
        console.log(selectedSub);
    };
    const handleSelectReport = (e) => {
        var btnText = e.target.text;
        if (btnText === '選民報表'){
            setReport(voter);
            setTheme('age');
            setCaroueslIndex(0);
        }else{
            setReport(population);
            setTheme('income');
            setCaroueslPopIndex(0);
        }
        
    }
    return(
        <div> 
        <Navbar bg="light" expand="lg">
        <NavDropdown title={selectedDsitrict} id="nav-dropdown">
            <Accordion defaultActiveKey="0" id='accordionDiv'>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="0">
                    香港島
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                    <div>
                    <NavDropdown.Item eventKey="0.1" onClick={handleSelectDistrict}>中西區</NavDropdown.Item>
                    <NavDropdown.Item eventKey="0.2" onClick={handleSelectDistrict}>灣仔區</NavDropdown.Item>
                    <NavDropdown.Item eventKey="0.3" onClick={handleSelectDistrict}>東區</NavDropdown.Item>
                    <NavDropdown.Item eventKey="0.4" onClick={handleSelectDistrict}>南區</NavDropdown.Item>
                    </div>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="1">
                    九龍
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="1">
                    <div>
                    <Dropdown.Item eventKey="1.1" onClick={handleSelectDistrict}>油尖旺區</Dropdown.Item>
                    <Dropdown.Item eventKey="1.2" onClick={handleSelectDistrict}>深水埗區</Dropdown.Item>
                    <Dropdown.Item eventKey="1.3" onClick={handleSelectDistrict}>九龍城區</Dropdown.Item>
                    <Dropdown.Item eventKey="1.4" onClick={handleSelectDistrict}>黃大仙區</Dropdown.Item>
                    <Dropdown.Item eventKey="1.5" onClick={handleSelectDistrict}>觀塘區</Dropdown.Item>
                    </div>
                    </Accordion.Collapse>
                </Card>
                <Card>
                    <Accordion.Toggle as={Card.Header} eventKey="2">
                    新界
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="2">
                    <div>
                    <Dropdown.Item eventKey="2.1" onClick={handleSelectDistrict}>荃灣區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.2" onClick={handleSelectDistrict}>屯門區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.3" onClick={handleSelectDistrict}>元朗區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.6" onClick={handleSelectDistrict}>北區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.7" onClick={handleSelectDistrict}>大埔區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.8" onClick={handleSelectDistrict}>西貢區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.9" onClick={handleSelectDistrict}>沙田區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.4" onClick={handleSelectDistrict}>葵青區</Dropdown.Item>
                    <Dropdown.Item eventKey="2.5" onClick={handleSelectDistrict}>離島區</Dropdown.Item>

                    </div>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </NavDropdown>
        {/* sub district dropdown */}
        <Dropdown id="nav-dropdown" style={{paddingLeft:'2px'}}>
            <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">
            {selectedSub}
            </Dropdown.Toggle>
            <Dropdown.Menu as={CustomMenu}>
            {allSmallArea[selectedDsitrict].map((d) => <Dropdown.Item key={d.cacode} eventKey={d.cacode} onClick={handleSelectSub}>{d.caname}</Dropdown.Item >)}
            </Dropdown.Menu>
        </Dropdown>
        <Nav variant="pills" defaultActiveKey="#voter">
        <Nav.Item>
            <Nav.Link href="#voter" style={{color:selectedReport ===voter? 'white': '#333'}} onClick={handleSelectReport}>選民報表</Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link href="#population" style={{color:selectedReport ===population? 'white': '#333'}} onClick={handleSelectReport}>人口報表</Nav.Link>
        </Nav.Item>
        </Nav>
        </Navbar>
        
        {selectedReport === voter ? 
         (
        <Carousel className='chartContainer' activeIndex={carouselIndex} direction={directioin} onSelect={handleSelect} interval={false} slide={false} prevIcon={<img alt="" src={leftIcon}/>} nextIcon={<img alt= "" src={rightIcon}/>} indicators={false}>
        <Carousel.Item className='chartSize'>
            <Bar data={chartData} options={chartOption}></Bar>
        </Carousel.Item>
        <Carousel.Item className='chartSize'>
            <Doughnut data={chartData} options={chartOption}></Doughnut>
        </Carousel.Item>
        </Carousel>
        ): (
        <Carousel className='chartContainer' activeIndex={carousePoplIndex} direction={directioinPop} onSelect={handelPopSelect} interval={false} slide={false} prevIcon={<img alt="" src={leftIcon}/>} nextIcon={<img alt= "" src={rightIcon}/>} indicators={false}>
        <Carousel.Item className='chartSize'>
            <Bar data={chartData} options={chartOption}></Bar>
        </Carousel.Item>
        <Carousel.Item className='chartSize'>
            <Doughnut data={chartData} options={chartOption}></Doughnut>
        </Carousel.Item>
        <Carousel.Item className='chartSize'>
            <Doughnut data={chartData} options={chartOption}></Doughnut>
        </Carousel.Item>
        </Carousel>)
        }
        </div>
        );
}
export default DistrictsEighteen;