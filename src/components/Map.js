import React, { useState, useEffect } from "react";
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

const mapStyles = {
  width: "90%",
  margin: "0 auto",
  display: "block",
  height: "auto",
};

const Map = () => {
  const [markers, setMarkers] = useState([]);
  const [allPatients, setAllPatients] = useState([]);
  const [data, setData] = useState([]);
  const [minValue, setMinValue] = useState();
  const [maxValue, setMaxValue] = useState();
  const [TableList, setTableList] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [tip] = useState(tooltip());
  const minColor = "#CFD8DC";
  const maxColor = "#FF0000";
  tip.create();

  useEffect(() => {
    async function fetchData() {
      await patientService.getCounts().then((res) => {
        res.data.patients.map((patient) => {
          setMarkers((markers) => [
            ...markers,
            { coordinates: [patient.longitude, patient.latitude] },
          ]);
          return "";
        });
        setAllPatients(res.data.patients);
        setTableList(res.data.TableList);
        setData(res.data.data);
        setMinValue(res.data.minValue);
        setMaxValue(res.data.maxValue);
      });
    }
    fetchData().then(
      setTimeout(() => {
        setIsLoading(false);
      }, 1000)
    );
  }, []);

  const handleMouseMove = (geography, evt) => {
    let { NAME, POP_EST } = geography.properties;
    for (let i = 0; i < TableList.length; i++) {
      if (TableList[i].country === NAME) {
        POP_EST = TableList[i].count;
        break;
      } else {
        POP_EST = 0;
      }
    }
    tip.show(`
      <div class="tooltip-inner">
        ${NAME + "-" + POP_EST}
      </div>
    `);
    tip.position({ pageX: evt.pageX, pageY: evt.pageY });
  };

  const handleMouseLeave = () => {
    tip.hide();
  };

  const handleMouseMoveMarker = (marker, evt) => {
    const long = marker.coordinates[0];
    const latit = marker.coordinates[1];
    let name = "";
    let temperature = "";
    let age = "";
    let email = "";
    let phone_number = "";
    let nationality = "";
    let weight = "";
    let location = "";
    let gender = "";
    let longitude = "";
    let latitude = "";
    let country_code_iso3 = "";
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

    tip.show(`
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
    tip.position({ pageX: evt.pageX, pageY: evt.pageY });
  };

  const nextIndex = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.5);
    }
  };

  const prevIndex = () => {
    setZoom(zoom + 0.1);
  };

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="float-container" style={{ width: "100%" }}>
      <div class="float-child">
        <div className="controls" style={{ top: "15%" }}>
          <button onClick={prevIndex}>
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
          <button onClick={nextIndex}>
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
          <ZoomableGlobe zoom={zoom} sensitivity={0.1}>
            <circle cx={250} cy={250} r={220} fill="#89cff0" stroke="#CFD8DC" />
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
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: {
                          fill: country
                            ? scaleLinear()
                                .domain([minValue, maxValue])
                                .range([minColor, maxColor])(country.val)
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
                  onMouseMove={handleMouseMoveMarker}
                  onMouseLeave={handleMouseLeave}
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
};

export default Map;
