import React, {Component} from 'react'
import Select from 'react-select';
import {ChartContainer, DataTable, DataCount, BubbleChart, BarChart, RowChart, LineChart, PieChart} from 'dc-react'
import {combination} from 'js-combinatorics';
import {scaleTime, scaleOrdinal, scaleLinear} from 'd3-scale';
import {timeFormat} from 'd3-time-format'
import changeCase from 'change-case'
import path, {dirname} from 'path'
import dc from 'dc'
import crossfilter from 'crossfilter'
import colorbrewer from 'colorbrewer';

import SkyLight from 'react-skylight';
import classnames from 'classnames';

import '../stylesheets/App.scss'

// let crossfilterContext = function () {} || {};
// const dateParse = timeFormat('%d/%m/%Y');
const dateParse = timeFormat("%B %d, %Y");
let minDate, maxDate;
let newData;
let settings;
let buttons = [];
let children = [];
let indices = [];
let options = [];
let Dimes = [];
let DimesGroups = [];
let DimesCount = [];


function isDate(a) {
    let b = Dimes[a].bottom(1)[0][[...new Set(indices)][a]], i = new RegExp('((?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Sept|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?))' + '.*?' + '((?:(?:[0-2]?\\d{1})|(?:[3][01]{1})))(?![\\d])' + '(.)' + '.*?' + '((?:(?:[1]{1}\\d{1}\\d{1}\\d{1})|(?:[2]{1}\\d{3})))(?![\\d])', ['i']);
    return null !== i.exec(b)
}
function isMinMax(dimension) {

    // let min = Dimes[this.dimension].bottom(1)[0][[...new Set(indices)][dimension]];
    // let max = Dimes[this.dimension].top(1)[0][[...new Set(indices)][dimension]];
    //
    // if(typeof min == "number")
    //     return [min,max]
    return [0, 1000]

}
class CrossfilterContext {
    constructor(data) {
        this.data = data;
        //-- crossfilter instance
        this.crossfilter = crossfilter(data);
        this.groupAll = this.crossfilter.groupAll();
        let that = this;
        combination([...new Set(indices)], 1).forEach(function (d, i) {
            Dimes.push(that.crossfilter.dimension(function (g) {
                return g[d[0]];
            }));
            // DimesGroups.push(that.crossfilter.dimension(function (g) {
            //
            //     return g[d[0]];
            // }).group());
            ///CANT HOLD ANY MORE INFORMATION??? 32<Dimensions
            DimesCount.push(that.crossfilter.dimension(function (g) {

                return g[d[0]];
            }).group().reduceSum(r => r[d[0]]));
        });

        this.datePostedDimension = this.crossfilter.dimension(d => dateParse(new Date(d["Date Created"])));
        minDate = dateParse(new Date(this.datePostedDimension.bottom(1)[0]["Date Created"]));
        maxDate = dateParse(new Date(this.datePostedDimension.top(1)[0]["Date Created"]));

    }
}
class BaseComponent extends React.Component {
    constructor(props) {
        super(props);
        this.dimension = this.props.dimension;
        this.group = this.props.group;
        this.state = {
            active: false
        };
    }

    click() {
        this.setState({active: true});
    }

}
class TitleComponent extends BaseComponent {

    render() {

        return (
            <span key={new Date().getTime()} style={{
                float: "right",
                position: "relative",
                left: "-50%", /* or right 50% */
                textAlign: "left"
            }}>{changeCase.sentenceCase([...new Set(indices)][this.dimension])}
            </span>

        )
    }
}

class ButtonComponent extends React.Component {


    render() {
        buttons = [
            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={0}
                    onClick={this.props.addPie}>Pie Chart</button>,
            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={2}
                    onClick={this.props.addLine}>Line Chart</button>,
            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={3}
                    onClick={this.props.addRow}>Row Chart</button>,
            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={4}
                    onClick={this.props.addBar}>Bar Chart</button>,
            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={5}
                    onClick={this.props.addChild}>Table View</button>,
            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={6}
                    onClick={this.props.addBub}>Bubble Chart</button>,
            <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={7}
                    onClick={this.props.setGroup}>Select Data</button>
        ];
        return (

            <div className="addCharts" style={{marginLeft: '15px', width: '1024px'}}>
                {buttons}
            </div>

        );
    }
}

class LineComponent extends BaseComponent {
    render() {
        let classes = classnames('close', {active: this.state.active});
        return (
            <div className={classes}>
                <span className={classes} onClick={this.click.bind(this)}>&times;</span>
                <TitleComponent dimension={this.dimension}/>
                <LineChart
                    id="LineChart"
                    dimension={ctx => Dimes[this.dimension]}
                    group={ctx => Dimes[this.group].group()}
                    width={990} height={250}
                    xAxisLabel={options[this.dimension].label}
                    yAxisLabel={options[this.group].label}
                    transitionDuration={500}
                    margins={{top: 10, right: 0, bottom: 20, left: 50}}
                    elasticY={true}
                    renderArea={true}
                    renderHorizontalGridLines={true}
                    renderVerticalGridLines={true}
                    mouseZoomable={true}
                    x={isDate(this.group) ? scaleTime().domain([new Date(minDate), new Date(maxDate)]) :
                        scaleLinear().domain(isMinMax(this.group))}
                    yAxis={axis => axis.ticks(6)}/>
            </div>
        );
    }
}
class BarComponent extends BaseComponent {
    render() {
        let classes = classnames('close', {active: this.state.active});
        return (
            <div className={classes}>
                <span className={classes} onClick={this.click.bind(this)}>&times;</span>
                <TitleComponent dimension={this.dimension}/>
                <BarChart
                    id="BarChart"
                    dimension={ctx => Dimes[this.dimension]}
                    group={ctx => Dimes[this.group].group()}
                    width={990} height={250}
                    transitionDuration={500}
                    margins={{top: 10, right: 0, bottom: 20, left: 50}}
                    elasticY={true}
                    renderArea={true}
                    centerBar={true}
                    gap={1}
                    renderHorizontalGridLines={true}
                    renderVerticalGridLines={true}
                    mouseZoomable={true}
                    x={isDate(this.group) ? scaleTime().domain([new Date(minDate), new Date(maxDate)]) :
                        scaleLinear().domain(isMinMax(this.group))}
                    y={isDate(this.group) ? scaleTime().domain([new Date(minDate), new Date(maxDate)]) :
                        scaleLinear().domain(isMinMax(this.group))}
                    yAxis={axis => axis.ticks(6)}/>
            </div>
        );
    }
}
class BubbleComponent extends BaseComponent {

    render() {
        let classes = classnames('close', {active: this.state.active});

        return (
            <div className={classes}>
                <span className={classes} onClick={this.click.bind(this)}>&times;</span>
                <BubbleChart
                    className="dc-chart"
                    ref="BubbleChart"
                    dimension={ctx => Dimes[this.dimension]}
                    group={ctx => Dimes[this.group].group()}
                    colorAccessor={ctx => Dimes[this.group].group()}
                    keyAccessor={ctx => Dimes[this.group].group()}
                    width={990} height={250}
                    margins={{top: 10, right: 5, bottom: 35, left: 35}}
                    renderHorizontalGridLines={true}
                    renderVerticalGridLines={true}
                    xAxisLabel={options[this.dimension].label}
                    yAxisLabel={options[this.group].label}
                    yAxis={axis => axis.ticks(7)}
                    label={p => p.key}
                    transitionDuration={1500}
                    x={isDate(this.group) ? scaleTime().domain([new Date(minDate), new Date(maxDate)]) :
                        scaleLinear().domain(isMinMax(this.group))}
                    y={isDate(this.group) ? scaleTime().domain([new Date(minDate), new Date(maxDate)]) :
                        scaleLinear().domain(isMinMax(this.group))}
                    r={scaleLinear().domain([0, 100])}
                    colorDomain={[-500, 500]}
                    colors={colorbrewer.RdYlGn[9]}
                />
            </div>
        );
    }
}
class RowComponent extends BaseComponent {

    render() {
        let classes = classnames('close', {active: this.state.active});
        return (
            <div className={classes}>
                <span className={classes} onClick={this.click.bind(this)}>&times;</span>
                <TitleComponent dimension={this.dimension}/>
                <RowChart
                    id="RowChart"
                    dimension={ctx => Dimes[this.dimension]}
                    group={ctx => Dimes[this.group].group()}
                    width={990} height={250}
                    transitionDuration={500}
                    elasticX={true}
                    xAxis={axis => axis.ticks(5)}
                    yAxis={axis => axis.ticks(10)}/>
            </div>
        );
    }
}
class PieComponent extends BaseComponent {

    render() {
        let classes = classnames('close', {active: this.state.active});
        return (
            <div className={classes}>

                <span className={classes} onClick={this.click.bind(this)}> &times;</span>
                <TitleComponent dimension={this.dimension}/>
                <PieChart
                    id="PieChart"
                    dimension={ctx => Dimes[this.dimension]}
                    group={ctx => Dimes[this.group].group()}
                    width={350}
                    height={220}
                    transitionDuration={1000}
                    radius={90}
                    innerRadius={40}/>
            </div>

        );
    }
}
class ChildComponent extends BaseComponent {


    render() {
        let xLabel = [...new Set(indices)][this.dimension];
        let yLabel = [...new Set(indices)][this.group];
        let classes = classnames('close', {active: this.state.active});
        return (
            <div className={classes}>
                <span className={classes} onClick={this.click.bind(this)}>&times;</span>
                <DataTable
                    className="table table-hover"
                    id="DataTable"
                    width={990}
                    dimension={ctx => Dimes[this.dimension]}
                    group={d => d._id + " " + d[xLabel]}
                    columns={['Index', xLabel, yLabel]}/>
            </div>
        );
    }
}
class CrossComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {active: false};
        this.crossfilterContext = this.props.crossfilterContext;
    }

    resetAll() {
        console.log("APP :: resetAll");
        dc.filterAll();
        dc.redrawAll()
    }

    render() {

        return (
            <ChartContainer className="container"
                            crossfilterContext={this.crossfilterContext}>
                <div className="row" style={{marginLeft: '15px', width: '1024px'}}>
                    <DataCount
                        className="dc-data-count"
                        dimension={ctx => ctx.crossfilter}
                        group={ctx => ctx.groupAll}/>
                    <div className="dc-data-count" style={{position: 'absolute', right: '50px'}}>
                        <a className="reset" style={{
                            fontWeight: 'bold',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            color: '#3182bd'
                        }} onClick={this.resetAll}>Reset All</a>
                    </div>
                </div>
                <div className="row">
                    {children}
                </div>
            </ChartContainer>

        );
    }
}
class App extends Component {

    constructor(props) {
        super(props);

        newData = this.props.data;
        settings = this.props.settings;
        this.state = {
            dataSet: 1,
            dataGroup: 1
        }

        ///Format Data for charts///
        newData.forEach(function (d, i) {
            //Set Dates for review
            d.event = dateParse(new Date(parseInt(d.event.toString().substring(0, 8), 16) * 1000));
            d["Event Count"] = +d.event;
            d._created = dateParse(new Date(d._created));
            d["Date Created"] = d._created;

            //Can show image onHover
            d.profile = d.profile.picture.main;
            delete d._created;
            //Not needed
            delete d.__v;

            //Push indice for Selection Options
            for (var key in d) {
                indices.push(key);
            }

        });
        [...new Set(indices)].forEach(function (d, i) {
            options.push({value: i, label: changeCase.sentenceCase(d)})
        });
        this.resetAll = this.resetAll.bind(this);
        this.crossfilterContext = (callBack) => {
            if (!callBack) {
                return null;
            }
            console.log("Cross Loaded!!!")
            callBack(new CrossfilterContext(newData))
        };


    }

    render() {
        children = children.sort(function (x, y) {
            return x.props.number < y.props.number;
        })
        return (
            <div className="app">
                <div className="appHeader">
                    <h2 style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}}>React.JS / Crossfilter / Dynamic /
                        Analytics</h2>
                </div>
                <div className="appContent">
                    <ButtonComponent addLine={this.onAddLine.bind(this)}
                                     addBar={this.onAddBar.bind(this)}
                                     addPie={this.onAddPie.bind(this)}
                                     addRow={this.onAddRow.bind(this)}
                                     addChild={this.onAddChild.bind(this)}
                                     addBub={this.onAddBub.bind(this)}
                                     setGroup={this.setGroup.bind(this)}
                    />
                    <CrossComponent crossfilterContext={this.crossfilterContext.bind(this)}/>
                </div>
                <SkyLight hideOnOverlayClicked
                          onOverlayClicked={this._executeOnOverlayClicked}
                          ref="dialogWithCallBacks"
                          title="Please select data-set for review:">
                    <img src={path.join(__dirname, '../public') + '/img/ex-chart.png'}
                         style={{height: 150, position: "middle"}}/>
                    <br/>
                    <hr/>
                    <div className="chart-title"> Data V's Grouped Data</div>
                    <div style={{width: 200, position: "relative", display: "inline-block", margin: "5 auto"}}>
                        <Select
                            style={{width: 200}}
                            name="form-field-name"
                            value={this.state.dataSet}
                            options={options}
                            onChange={this.logData.bind(this)}
                        />
                        <Select
                            style={{width: 200}}
                            name="form-field-name"
                            value={this.state.dataGroup}
                            options={options}
                            onChange={this.logGroup.bind(this)}
                        />
                        <button style={{color: "#" + ((1 << 24) * Math.random() | 0).toString(16)}} key={0}
                                onClick={() => this.refs.dialogWithCallBacks.hide()}>confirm
                        </button>

                    </div>
                </SkyLight>
            </div>
        )
    }


    onAddLine() {
        children.push(<LineComponent dimension={this.state.dataSet} group={this.state.dataGroup}
                                     key={new Date().getTime()}
                                     number={new Date().getTime()}/>);
        this.forceUpdate();
    }

    onAddBar() {
        children.push(<BarComponent dimension={this.state.dataSet} group={this.state.dataGroup}
                                    key={new Date().getTime()}
                                    number={new Date().getTime()}/>);
        this.forceUpdate();
    }

    onAddPie() {

        children.push(<PieComponent dimension={this.state.dataSet} group={this.state.dataSet} key={new Date().getTime()}
                                    number={new Date().getTime()}/>)
        this.forceUpdate();
    }

    onAddRow() {
        children.push(<RowComponent dimension={this.state.dataSet} group={this.state.dataGroup}
                                    key={new Date().getTime()}
                                    number={new Date().getTime()}/>);
        this.forceUpdate();
    }

    onAddBub() {

        children.push(<BubbleComponent dimension={this.state.dataSet} group={this.state.dataGroup}
                                       key={new Date().getTime()}
                                       number={new Date().getTime()}/>);
        this.forceUpdate();
    }

    onAddChild() {
        children.push(<ChildComponent dimension={this.state.dataSet} group={this.state.dataGroup}
                                      key={new Date().getTime()}
                                      number={new Date().getTime()}/>)
        this.forceUpdate();
    }

    logData(val) {
        console.log("logData: " + val.value);
        this.setState({
            dataSet: val.value
        });

    }

    logGroup(val) {
        console.log("logGroup " + val.value);
        this.setState({
            dataGroup: val.value
        });
    }

    setGroup() {

        this.refs.dialogWithCallBacks.show()
        this.forceUpdate();
    }

    resetAll() {
        console.log("APP :: resetAll");
        dc.filterAll();
        dc.redrawAll()
    }
}

export default App