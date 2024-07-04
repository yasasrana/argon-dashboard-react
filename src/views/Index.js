
import { useState, useEffect } from "react";
import axios from '../api/axios';
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts

import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

const Index = (props) => {
  const [activeNav, setActiveNav] = useState(1);
  const [chartExample1Data, setChartExample1Data] = useState("data1");
  const [scans, setScans] = useState([]);
  const [dates, setDate] = useState([])
  const [counts, setCount] = useState([])
  const [cancers, setcancers] = useState([]);
  const [nons, setNons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const datesArray = [];
        const countsArray = [];
        const response = await axios.get('/api/scan'); // Adjust the URL as necessary
        setScans(response.data);
        const nonData = response?.data?.filter(i => i.prediction == "noncanceros").length
        const cancerData = response?.data?.filter(i => i.prediction == "cancerous").length
        setcancers(cancerData)
        setNons(nonData)
        setLoading(false);

        const countsByDate = {};
        scans.forEach(item => {
          const date = item.createdAt.split('T')[0]; // Extract date portion
          if (countsByDate[date]) {
            countsByDate[date]++;
          } else {
            countsByDate[date] = 1;
          }
        });


        Object.keys(countsByDate).sort().forEach(date => {
          datesArray.push(date);
          countsArray.push(countsByDate[date]);
        });
        console.log(datesArray)
        console.log(countsArray)
        setDate(datesArray);
        setCount(countsArray)
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchScans();
  }, [activeNav]);

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }
  var colors = {
    gray: {
      100: "#f6f9fc",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#8898aa",
      700: "#525f7f",
      800: "#32325d",
      900: "#212529",
    },
    theme: {
      default: "#172b4d",
      primary: "#5e72e4",
      secondary: "#f4f5f7",
      info: "#11cdef",
      success: "#2dce89",
      danger: "#f5365c",
      warning: "#fb6340",
    },
    black: "#12263F",
    white: "#FFFFFF",
    transparent: "transparent",
  };

  let line = {
    options: {
      scales: {
        yAxes: [
          {
            gridLines: {
              color: colors.gray[900],
              zeroLineColor: colors.gray[900],
            },
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  return "" + value + "";
                }
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";

            if (data.datasets.length > 1) {
              content += label;
            }

            content += "" + yLabel + "";
            return content;
          },
        },
      },
    },
    data1: (canvas) => {
      return {
        labels: dates,
        datasets: [
          {
            label: "Performance",
            data: counts,
          },
        ],
      };
    },
    data2: (canvas) => {
      return {
        labels: ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Performance",
            data: [0, 20, 5, 25, 10, 30, 15, 40, 40],
          },
        ],
      };
    },
  };

  let Bar2 = {
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  //return '$' + value + 'k'
                  return value;
                }
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || "";
            var yLabel = item.yLabel;
            var content = "";
            if (data.datasets.length > 1) {
              content += label;
            }
            content += yLabel;
            return content;
          },
        },
      },
    },
    data: {
      labels: ["Cancerous", "non-canceros"],
      datasets: [
        {
          label: "Cancer Ratio",
          data: [cancers, nons],
          maxBarThickness: 20,
        },
      ],
    },
  };

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
    setChartExample1Data("data" + index);
  };
  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Daily Scan Counts</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink

                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Daily</span>
                          <span className="d-md-none">Daily</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink

                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Weely</span>
                          <span className="d-md-none">Weely</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Line
                    data={line[chartExample1Data]}
                    options={line.options}
                    getDatasetAtEvent={(e) => console.log(e)}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">

                    </h6>
                    <h2 className="mb-0">Cancer Ratio</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  <Bar
                    data={Bar2.data}
                    options={Bar2.options}


                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

      </Container>
    </>
  );
};

export default Index;
