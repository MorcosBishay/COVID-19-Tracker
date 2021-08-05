import React, { Component } from "react";
import { patientService } from "../services";
import tooltip from "wsdm-tooltip";
import { scaleLinear } from "d3-scale";
import "../styles/styles.css";
import Loading from "./Loading";
import {
  ComposableMap,
  ZoomableGlobe,
  Geographies,
  Geography,
  Markers,
  Marker,
} from "react-simple-maps";
const _ = require("lodash");

const mapStyles = {
  width: "90%",
  margin: "0 auto",
  display: "block",
  height: "auto",
};

var markers = [];
var allPatients = [];
var data = [];
var minValue;
var maxValue;
var Table = [];
var TableList = [];
const minColor = "#CFD8DC";
const maxColor = "#FF0000";
var customScale;

class Map extends Component {
  constructor() {
    super();
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.handleMouseMoveMarker = this.handleMouseMoveMarker.bind(this);
    this.prevIndex = this.prevIndex.bind(this);
    this.nextIndex = this.nextIndex.bind(this);
    this.state = {
      zoom: 1,
      isLoading: true,
    };
    markers = [];
    allPatients = [];
    data = [];
    Table = [];
    TableList = [];
  }

  async componentDidMount() {
    this.tip = tooltip();
    this.tip.create();

    var allCountries = [];
    await patientService.getAllPatients().then((res) => {
      res.data.map((patient) =>
        markers.push({ coordinates: [patient.longitude, patient.latitude] })
      );
      allPatients = res.data;
      res.data.map((patient) => Table.push(patient.location));
      res.data.map((patient) => allCountries.push(patient.country_code_iso3));
    });

    let a = [],
      b = [],
      arr = [...allCountries],
      prev,
      aTable = [],
      bTable = [],
      arrTable = [...Table],
      prevTable;

    arr.sort();
    for (let element of arr) {
      if (element !== prev) {
        a.push(element);
        b.push(1);
      } else ++b[b.length - 1];
      prev = element;
    }

    arrTable.sort();
    for (let elementT of arrTable) {
      if (elementT !== prevTable) {
        aTable.push(elementT);
        bTable.push(1);
      } else ++bTable[bTable.length - 1];
      prevTable = elementT;
    }

    minValue = Math.min(...b) - 1;
    maxValue = Math.max(...b);
    customScale = scaleLinear()
      .domain([minValue, maxValue])
      .range([minColor, maxColor]);

    for (let i = 0; i < a.length; i++) {
      TableList.push({ country: aTable[i], count: bTable[i] });
      data.push({ id: a[i], val: b[i] });
    }

    TableList = _.orderBy(TableList, "count", "desc");
    if (TableList != null) {
      this.setState({ isLoading: false });
    }
  }

  handleMouseMove(geography, evt) {
    var { NAME, POP_EST } = geography.properties;
    for (let i = 0; i < TableList.length; i++) {
      if (TableList[i].country === NAME) {
        POP_EST = TableList[i].count;
        break;
      } else {
        POP_EST = 0;
      }
    }
    this.tip.show(`
      <div class="tooltip-inner">
        ${NAME + "-" + POP_EST}
      </div>
    `);
    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY });
  }

  handleMouseLeave() {
    this.tip.hide();
  }

  handleMouseMoveMarker(marker, evt) {
    const long = marker.coordinates[0];
    const latit = marker.coordinates[1];
    var name = "";
    var temperature = "";
    var age = "";
    var email = "";
    var phone_number = "";
    var nationality = "";
    var weight = "";
    var location = "";
    var gender = "";
    var longitude = "";
    var latitude = "";
    var country_code_iso3 = "";
    allPatients.map((patient) => {
      if (patient.longitude === long && patient.latitude === latit) {
        name = patient.name;
        temperature = patient.temperature;
        age = patient.age;
        email = patient.email;
        phone_number = patient.phone_number;
        nationality = patient.nationality;
        weight = patient.weight;
        location = patient.location;
        gender = patient.gender;
        longitude = patient.longitude;
        latitude = patient.latitude;
        country_code_iso3 = patient.country_code_iso3;
      }
      return "";
    });

    this.tip.show(`
      <div class="styles">
          ${"Name: " + name}
          <br/>
          ${"Temperature: " + temperature}
          <br/>
          ${"Age: " + age}
          <br/>
          ${"Email: " + email}
          <br/>
          ${"Phone Number: " + phone_number}
          <br/>
          ${"Nationality: " + nationality}
          <br/>
          ${"Weight: " + weight}
          <br/>
          ${"Location: " + location}
          <br/>
          ${"Gender: " + gender}
          <br/>
          ${"Longitude: " + longitude}
          <br/>
          ${"Latitude: " + latitude}
          <br/>
          ${"ISO3: " + country_code_iso3}
      </div>
    `);
    this.tip.position({ pageX: evt.pageX, pageY: evt.pageY });
  }

  nextIndex = () => {
    if (this.state.zoom > 0.5) {
      return this.setState({
        zoom: this.state.zoom - 0.5,
      });
    }
  };

  prevIndex = () => {
    return this.setState({
      zoom: this.state.zoom + 0.1,
    });
  };

  render() {
    const { isLoading } = this.state;

    if (isLoading) {
      return <Loading />;
    }
    return (
      <div className="float-container" style={{ width: "100%" }}>
        <div class="float-child">
          <div className="controls" style={{ top: "15%" }}>
            <button onClick={this.prevIndex}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <button onClick={this.nextIndex}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="3"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
          <ComposableMap
            width={500}
            height={500}
            projection="orthographic"
            projectionConfig={{ scale: 220 }}
            style={mapStyles}
          >
            <ZoomableGlobe zoom={this.state.zoom} sensitivity={0.1}>
              <circle
                cx={250}
                cy={250}
                r={220}
                fill="#89cff0"
                stroke="#CFD8DC"
              />
              <Geographies
                disableOptimization
                geography="https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"
              >
                {(geos, proj) =>
                  geos.map((geo, i) => {
                    const country = data.find(
                      (d) => d.id === geo.properties.ISO_A3
                    );
                    return (
                      <Geography
                        value={i}
                        key={i}
                        geography={geo}
                        projection={proj}
                        onMouseMove={this.handleMouseMove}
                        onMouseLeave={this.handleMouseLeave}
                        style={{
                          default: {
                            fill: country
                              ? customScale(country.val)
                              : "#ECEFF1",
                            stroke: "#000",
                            strokeWidth: 0.75,
                            outline: "none",
                          },
                          hover: {
                            fill: "#263238",
                            stroke: "#FFF",
                            strokeWidth: 0.75,
                            outline: "none",
                          },
                          pressed: {
                            fill: "#263238",
                            stroke: "#FFF",
                            strokeWidth: 0.75,
                            outline: "none",
                          },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              <Markers>
                {markers.map((marker) => (
                  <Marker
                    onMouseMove={this.handleMouseMoveMarker}
                    onMouseLeave={this.handleMouseLeave}
                    marker={marker}
                    style={{
                      hidden: { display: "none" },
                    }}
                  >
                    <circle cx={0} cy={0} r={2} fill="#0000FF" stroke="#FFF" />
                  </Marker>
                ))}
              </Markers>
            </ZoomableGlobe>
          </ComposableMap>
        </div>
        <div className="float-child-list">
          <h1 id="title">COVID-19 Statistics</h1>
          <table id="table">
            <tbody>
              <tr>
                <th>Country</th>
                <th>Patient#</th>
              </tr>
              {TableList.map((c) => {
                const { country, count } = c;
                return (
                  <tr>
                    <td>{country}</td>
                    <td>{count}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Map;
