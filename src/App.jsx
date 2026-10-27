
import { useState } from "react";
import {
  Link,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ChevronRight,
  ShieldCheck,
  CarFront,
  FileCheck,
  CircleDollarSign,
  CheckCircle2,
  ArrowRight,
  Gauge,
  Clock,
  Shield,
  ClipboardCheck,
  Truck,
} from "lucide-react";

const LOGO =
  "https://totalcarcheck.co.uk/Content/images/total_car_check_logo.svg";

/* HEADER */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    ["HOME", "/"],
    ["SAMPLE", "/sample"],
    ["PRICES", "/prices"],
    ["TRADE", "/trade"],
    ["BLOG", "/blog"],
  ];

  return (
    <header className="header" id="top">
      <div className="header-inner">
        <Link className="logo" to="/">
          <img src={LOGO} alt="Total Car Check" />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? "nav open" : "nav"}>
          {links.map(([label, to]) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}

          <Link
            className="register-link"
            to="/register"
            onClick={() => setMenuOpen(false)}
          >
            REGISTER
          </Link>

          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
          >
            LOGIN
          </Link>
        </nav>
      </div>
    </header>
  );
}

/* FOOTER */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <h3>QUICK LINKS</h3>
          <Link to="/">Home</Link>
          <Link to="/sample">Sample Report</Link>
          <Link to="/prices">Prices</Link>
          <Link to="/trade">Trade</Link>
          <Link to="/blog">Blog</Link>
        </div>

        <div>
          <h3>INFORMATION</h3>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
          <a href="mailto:enquiries@totalcarcheck.co.uk">
            Contact
          </a>
          <a href="https://totalcarcheck.co.uk/PrivacyPolicy">
            Privacy Policy
          </a>
          <a href="https://totalcarcheck.co.uk/TermsAndConditions">
            Terms and Conditions
          </a>
        </div>

        <div className="footer-brand">
          <Link to="/">
            <img src={LOGO} alt="Total Car Check" />
          </Link>

          <p>Copyright © 2026 Total Car Check</p>

          <h3>FOLLOW US</h3>
          <a href="https://twitter.com/totalcarcheck">
            @TotalCarCheck
          </a>
          <a href="https://www.facebook.com/totalcarcheck/">
            Facebook / TotalCarCheck
          </a>

          <p>
            <strong>SEND US AN EMAIL</strong>
            <br />
            enquiries@totalcarcheck.co.uk
          </p>

          <a href="#top">Back to the top ↑</a>
        </div>
      </div>
    </footer>
  );
}

/* SHARED PAGE LAYOUT */

function PageLayout({ title, subtitle, children }) {
  return (
    <>
      <Header />

      <section className="page-banner">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </section>

      <main className="inner-page">
        <div className="inner-content">{children}</div>
      </main>

      <Footer />
    </>
  );
}

/* HOME PAGE */

function RegistrationSearch() {
  const [registration, setRegistration] = useState("");
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();

    const cleanedRegistration = registration
      .trim()
      .toUpperCase();

    if (!cleanedRegistration) {
      alert("Please enter a vehicle registration.");
      return;
    }

    navigate(
      `/sample?reg=${encodeURIComponent(cleanedRegistration)}`
    );
  }

  return (
    <section className="hero">
      <h1>Get a free car check now, enter your reg:</h1>

      <form
        className="registration-form"
        onSubmit={submit}
      >
        <span className="uk-badge">
          <span>✳</span>
          <small>UK</small>
        </span>

        <input
          value={registration}
          onChange={(event) =>
            setRegistration(event.target.value.toUpperCase())
          }
          placeholder="ENTER REG"
          aria-label="Vehicle registration"
          maxLength={8}
        />
      </form>

      <button
        className="check-button"
        onClick={submit}
        type="button"
      >
        Click to Check <ChevronRight size={18} />
      </button>

      <p className="voucher">
        <Link to="/prices">Buy vouchers</Link> for the best prices
      </p>

      <p className="vin-link">
        Try our free <Link to="/sample">VIN Check</Link> service
      </p>
    </section>
  );
}

const homeFeatures = [
  {
    icon: <CarFront size={55} />,
    title: "What do we check?",
    text: "50+ checks are performed including:",
    items: [
      "Stolen check (Police & insurance)",
      "Written off vehicle check",
      "Outstanding Finance check",
      "MOT history records",
      "All plate changes",
    ],
    button: "View a sample report",
    to: "/sample",
  },
  {
    icon: <ShieldCheck size={55} />,
    title: "£30,000 Data Guarantee",
    text:
      "Our Gold Check comes with a £30,000 data guarantee, subject to the applicable terms.",
    items: [
      "Get total peace of mind.",
      "Check the guarantee terms before purchasing.",
    ],
    button: "View products and prices",
    to: "/prices",
  },
  {
    icon: <ClipboardCheck size={55} />,
    title: "Our customers rate us highly",
    text:
      "Explore vehicle-check information, reviews and buying advice.",
    items: [
      "Information to help you buy with confidence.",
      "Value and vehicle history information.",
    ],
    button: "Read our blog",
    to: "/blog",
  },
];

function HomePage() {
  return (
    <>
      <Header />

      <RegistrationSearch />

      <section className="features">
        <div className="feature-grid">
          {homeFeatures.map((feature) => (
            <article
              className="feature-card"
              key={feature.title}
            >
              <div className="feature-image">
                {feature.icon}
              </div>

              <h2>{feature.title}</h2>
              <p>{feature.text}</p>

              <div className="feature-items">
                {feature.items.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>

              <Link
                className="blue-button"
                to={feature.to}
              >
                {feature.button}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-grid">
          <article className="trust-column">
            <ShieldCheck size={45} />
            <h3>Vehicle history information</h3>
            <p>
              Explore vehicle records before buying a used car.
            </p>
            <Link to="/sample">
              View the sample report
            </Link>
          </article>

          <article className="trust-column">
            <CarFront size={45} />
            <h3>Checks for used-car buyers</h3>
            <p>
              Review the checks and information available in a report.
            </p>
            <Link to="/prices">Compare checks</Link>
          </article>

          <article className="trust-column">
            <CircleDollarSign size={45} />
            <h3>Solutions for motor traders</h3>
            <p>
              Explore bulk vouchers and vehicle data options.
            </p>
            <Link to="/trade">Trade vehicle checks</Link>
          </article>
        </div>
      </section>

      <section className="history-section">
        <div className="history-content">
          <h2>Why check a vehicle's history?</h2>
          <p>
            A vehicle history report can help you investigate
            recorded finance, theft, write-off, mileage and MOT
            information before purchasing a used car. Always
            inspect the vehicle and verify important details
            independently.
          </p>

          <h2>Need vehicle data for your business?</h2>
          <p>
            Our trade information page covers bulk voucher
            bundles and vehicle data services.
          </p>

          <Link className="blue-button" to="/trade">
            Explore trade options
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

/* PRICES PAGE */

const pricePlans = [
  {
    name: "Free Check",
    price: "£0",
    description: "Start with an overview.",
    features: [
      "Basic vehicle information",
      "Registration details",
      "Explore available vehicle data",
    ],
  },
  {
    name: "Silver Check",
    price: "£3.99",
    description: "Essential vehicle history.",
    features: [
      "Stolen marker checks",
      "Write-off status information",
      "Plate changes",
      "DVLA data fields",
    ],
  },
  {
    name: "Gold Check",
    price: "View prices",
    description: "A more comprehensive report.",
    features: [
      "Outstanding finance information",
      "Vehicle history details",
      "Additional checks",
      "Check the current guarantee terms",
    ],
  },
];

function PricesPage() {
  const comparison = [
    ["Basic vehicle details", "✓", "✓", "✓"],
    ["Stolen checks", "Limited", "✓", "✓"],
    ["Write-off information", "—", "✓", "✓"],
    ["Outstanding finance", "—", "Check", "✓"],
    ["Detailed report", "—", "✓", "✓"],
    ["MOT history", "Limited", "✓", "✓"],
    ["Vehicle valuation", "—", "—", "✓"],
    ["Mileage information", "Limited", "✓", "✓"],
  ];

  return (
    <PageLayout
      title="Vehicle Check Prices"
      subtitle="Choose the right vehicle history report"
    >
      <div className="price-grid">
        {pricePlans.map((plan) => (
          <article
            className={`price-card ${
              plan.name === "Gold Check"
                ? "gold-price-card"
                : ""
            }`}
            key={plan.name}
          >
            {plan.name === "Gold Check" && (
              <span className="popular">GOLD CHECK</span>
            )}

            <h2>{plan.name}</h2>
            <div className="price">{plan.price}</div>
            <p>{plan.description}</p>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <CheckCircle2 size={17} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link className="blue-button" to="/">
              Start a Check
            </Link>
          </article>
        ))}
      </div>

      <section className="comparison-section">
        <h2>Compare our vehicle checks</h2>
        <p>
          Review the included features before choosing a report.
          Confirm current prices, coverage and guarantee terms
          before purchase.
        </p>

        <div className="comparison-table">
          <div className="comparison-row comparison-head">
            <strong>Feature</strong>
            <strong>Free</strong>
            <strong>Silver</strong>
            <strong>Gold</strong>
          </div>

          {comparison.map((row) => (
            <div className="comparison-row" key={row[0]}>
              {row.map((cell, index) => (
                <span key={`${row[0]}-${index}`}>
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>

        <p className="demo-notice">
          Prices and feature availability shown here are for
          this website recreation. Verify the provider's live
          offer before relying on them.
        </p>
      </section>
    </PageLayout>
  );
}

/* TRADE PAGE */

const tradeBundles = [
  { quantity: 20, price: "£64.99", unit: "£2.70" },
  { quantity: 50, price: "£150.00", unit: "£2.50" },
  { quantity: 100, price: "£270.00", unit: "£2.25" },
  { quantity: 200, price: "£480.00", unit: "£2.00" },
  { quantity: 300, price: "£630.00", unit: "£1.75" },
];

function TradePage() {
  const benefits = [
    "Trade vehicle checks from the listed bulk bundle prices",
    "Voucher codes available through an account in the described service",
    "Vouchers stated to be valid for 24 months",
    "Reports available for future reference in the described service",
    "Suitable for independent traders, garages and dealerships",
  ];

  const goldFeatures = [
    "Outstanding finance and logbook loan checks",
    "Write-off status, including Cat A, B, C, D, S and N",
    "Salvage history",
    "Stolen vehicle information",
    "Mileage anomalies and MOT history",
    "Keeper and registration plate changes",
    "Import, export and scrapped status",
    "VIN and engine number information",
    "DVLA vehicle data",
  ];

  return (
    <PageLayout
      title="Trade Vehicle Checks"
      subtitle="Gold Check vouchers and vehicle history services for UK motor traders"
    >
      <section className="trade-intro">
        <Truck size={48} />
        <h2>
          Trade Vehicle Checks – Gold Check Vouchers for UK Motor Traders
        </h2>
        <p>
          Looking for trusted, low-cost trade vehicle checks?
          Explore bulk Gold Check voucher bundles intended for
          motor dealers, garages and car traders.
        </p>
      </section>

      <section className="trade-section">
        <h2>Bulk Gold Check Voucher Bundles – Trade Pricing</h2>
        <p>
          Prices below reproduce the figures supplied for this
          page. They are not a live quote.
        </p>

        <div className="trade-table-wrap">
          <table className="trade-pricing-table">
            <thead>
              <tr>
                <th>Voucher Bundle Size</th>
                <th>Price (Ex. VAT)</th>
                <th>Cost per Check (Ex. VAT)</th>
              </tr>
            </thead>

            <tbody>
              {tradeBundles.map((bundle) => (
                <tr key={bundle.quantity}>
                  <td>{bundle.quantity}</td>
                  <td>{bundle.price}</td>
                  <td>{bundle.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="demo-notice">
          Please verify prices and VAT treatment with the provider
          before purchasing. The supplied unit prices are reproduced
          as given and may not reconcile exactly with every bundle
          total.
        </p>
      </section>

      <section className="trade-section">
        <h2>
          Bulk Vehicle Upload – Fast Trade Vehicle Checks for Multiple Cars
        </h2>
        <p>
          The supplied description presents a bulk upload feature
          for UK motor traders who need to process multiple
          registrations. It describes uploading up to 50 vehicle
          registration numbers in one go and receiving reports
          within minutes.
        </p>
        <p>
          This workflow is useful to consider when buying at
          auctions, managing part-exchange vehicles or reviewing
          incoming stock. Actual availability and processing times
          need to be confirmed with the service provider.
        </p>
      </section>

      <section className="trade-section">
        <h2>Key Benefits of Bulk Vehicle Upload</h2>
        <div className="benefit-grid">
          {[
            "Process up to 50 registrations per batch, according to the supplied description",
            "Review multiple vehicle history reports",
            "Designed for auctions, dealerships and car traders",
            "Reduce repetitive manual entry",
            "Keep reports organised for future reference",
          ].map((benefit) => (
            <div className="benefit-item" key={benefit}>
              <CheckCircle2 />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="trade-section">
        <h2>Benefits of Buying Trade Vehicle Check Vouchers</h2>
        <div className="benefit-grid">
          {benefits.map((benefit) => (
            <div className="benefit-item" key={benefit}>
              <CheckCircle2 />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="trade-section">
        <h2>Why Choose Total Car Check for Trade Vehicle Checks?</h2>

        <h3>AutoExpress Best Buy</h3>
        <p>
          The supplied page describes multiple years of AutoExpress
          Best Buy recognition for vehicle checks. Check the
          relevant award details and dates independently.
        </p>

        <h3>The UK's Comprehensive Trade Vehicle Check</h3>
        <p>
          Gold Check features described in the supplied content
          include the following categories:
        </p>

        <div className="feature-list">
          {goldFeatures.map((feature) => (
            <div className="feature-list-item" key={feature}>
              <CheckCircle2 size={18} />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <p>
          Vehicle-history data can come from different industry
          sources. Coverage varies by check and source; a report
          should not be treated as a guarantee that every risk
          will be identified.
        </p>
      </section>

      <section className="trade-section">
        <h2>Designed for the Trade – Built Around Your Workflow</h2>

        <h3>Use on Any Device</h3>
        <p>
          A mobile-friendly platform can help traders review
          vehicles from the forecourt, auction or office.
        </p>

        <h3>All Reports Saved in Your Account</h3>
        <p>
          The supplied description states that reports can be
          saved for later viewing, downloading or printing.
        </p>

        <h3>24-Month Voucher Validity</h3>
        <p>
          The supplied description states that vouchers remain
          valid for 24 months from purchase. Confirm current
          voucher terms before buying.
        </p>

        <h3>Trusted by the UK Motor Trade</h3>
        <p>
          Vehicle checks can support decisions by independent
          dealers, garages and larger motor businesses.
        </p>
      </section>

      <section className="trade-cta">
        <h2>Interested in Trade Vehicle Checks?</h2>
        <p>
          Create a demo account or contact the provider for
          information about current trade products.
        </p>

        <div className="trade-cta-actions">
          <Link className="blue-button" to="/register">
            Register
          </Link>

          <a
            className="blue-button"
            href="mailto:enquiries@totalcarcheck.co.uk"
          >
            Contact Us
          </a>
        </div>
      </section>
    </PageLayout>
  );
}

/* SAMPLE REPORT DATA */

const reportSections = [
  {
    title: "Completed Checks",
    rows: [
      ["Stolen (Police)", "No"],
      ["Stolen (Insurance)", "No"],
      ["Written off", "SAMPLE1 - Cat. N"],
      ["Date of write-off", "09 January 2022"],
      ["Damaged areas", "Engine"],
      ["Cause of damage", "Water"],
      ["Salvage History", "None Recorded"],
      ["Exported", "Not Exported"],
      ["Imported", "Not Imported"],
      ["Scrapped", "Not Scrapped"],
      ["Unscrapped", "Not Unscrapped"],
      ["VIC Inspected", "Not VIC Inspected"],
      ["Colour Changes", "No Colour Changes"],
      ["Plate Changes", "No Plate Changes"],
      ["Mileage Issues", "Yes"],
      [
        "Mileage Issues Summary",
        "The odometer reading reduced by 11,420 miles between 04/11/2021 and 23/11/2021.",
      ],
      ["Ex-Taxi", "Yes"],
    ],
  },
  {
    title: "MOT & Road Tax",
    rows: [
      ["Road Tax", "Vehicle has a SORN"],
      ["MOT", "Ends: 28 Sep 2023"],
    ],
  },
  {
    title: "Your Manual Checks",
    rows: [
      ["VIN ends with", "8525"],
      ["Engine Number", "CULB0343Z4"],
      ["V5C log book date", "26/07/22"],
    ],
  },
  {
    title: "Finance Check",
    note:
      "Finance information is shown here as part of this illustrative Gold Check report.",
    rows: [
      ["Outstanding Finance", "Yes"],
      ["Vehicle Desc.", "AUDI Q3 S LINE"],
      ["Agreement Type", "Log Book Loan"],
      ["Agreement Date", "27/11/21"],
      ["Agreement No.", "FINANCE123"],
      ["Company", "Example Bank"],
      ["Contact Number", "020 7946 0100"],
      ["Information provider", "Experian (as stated in example)"],
    ],
  },
  {
    title: "Vehicle Valuation",
    note:
      "Illustrative values copied from the supplied sample content; not a current valuation.",
    rows: [
      ["Description", "AUDI Q3 S LINE + TFSI QUATTRO S-A (2016-66)"],
      ["Based on estimated mileage", "36,994 miles"],
      ["On the Road", "£34,775"],
      ["Dealer Forecourt", "£21,410"],
      ["Private Average", "£19,600"],
      ["Part Exchange", "£17,270"],
      ["Auction", "£16,350"],
    ],
  },
  {
    title: "Vehicle Details",
    rows: [
      ["Registration", "SAMPLE1"],
      ["VIN (ends with)", "8525"],
      ["Manufacturer", "Audi"],
      ["Model", "Q3 S Line + Tfsi Quattro S-A"],
      ["Model Details", "Tfsi 180 Quattro S Tronic Auto Start/Stop"],
      ["Colour", "Grey"],
      ["Body Style", "SUV"],
      ["Transmission", "Semi Automatic"],
      ["No. Of Gears", "7 Gears"],
      ["Fuel Type", "Petrol"],
      ["Engine Size", "1984 cc"],
      ["No. Of Seats", "5 Seats"],
      ["No. Of Doors", "5 Doors"],
    ],
  },
  {
    title: "Ownership",
    rows: [
      ["No. Previous Keepers", "2"],
      ["Current Keeper Acq.", "01 July 2022"],
      ["Current Ownership", "4 years 3 months (as supplied)"],
      ["Prev. Keeper Sold", "15 January 2022"],
      ["Prev. Keeper Acq.", "29 April 2017"],
      ["Vehicle Age", "6 years 4 months (as supplied)"],
      ["Registration", "14 November 2016"],
      ["Registered Near", "Sheffield / Yorkshire"],
    ],
  },
  {
    title: "Mileage Information",
    rows: [
      ["Last MOT Mileage", "36,994 miles"],
      ["Avg. Annual Mileage", "6,300 miles"],
      ["Mileage Last Year", "1,259 miles"],
    ],
  },
  {
    title: "Engine Specification",
    rows: [
      ["Engine No.", "CULB0343Z4"],
      ["Engine Code", "CULB"],
      ["Position", "Front"],
      ["Alignment", "Transverse"],
      ["Valves", "16 Valves"],
      ["Cylinders", "4 Cylinders Inline"],
      ["Fuel Delivery", "Turbo Injection"],
      ["BHP", "177 BHP"],
      ["Power Output", "132 kW"],
    ],
  },
  {
    title: "Additional Information",
    rows: [
      ["Vehicle Type", "Car"],
      ["Width", "1831 mm"],
      ["Length", "4388 mm"],
      ["Height", "1608 mm"],
      ["Top Speed", "135 MPH"],
      ["0-60 MPH", "7.60 secs"],
      ["Euro Status", "6b"],
      ["Insurance Group", "28E"],
    ],
  },
  {
    title: "Fuel Economy - Used Cars",
    rows: [
      ["Reg No.", "SAMPLE1"],
      ["CO2 emissions", "161 g/km"],
      ["Estimated fuel cost for 12,000 miles", "£2,434"],
      ["VED for 12 months", "£220"],
      ["VED for 6 months", "£121"],
      ["Make / Model", "Audi / Q3"],
      ["Description", "2.0 Tfsi Quattro 180"],
      ["Fuel Type", "Petrol"],
      ["Engine Capacity", "2.0 litres"],
      ["Urban consumption", "8.4 litres/100km · 33.6 MPG"],
      ["Extra-Urban consumption", "6.3 litres/100km · 44.8 MPG"],
      ["Combined consumption", "7 litres/100km · 40.4 MPG"],
      ["Date of First Registration", "14 November 2016"],
    ],
  },
];

const keeperHistory = [
  ["1", "14 November 2016", "5 months and 15 days"],
  ["2", "29 April 2017", "5 years, 2 months and 2 days"],
  ["3 (Current keeper)", "01 July 2022", "8 months and 22 days"],
];

const taxiHistory = [
  ["16/12/2021 - 11/01/2023", "Taxi", "Peterborough City Council"],
  ["27/12/2019 - 22/11/2021", "Taxi", "Peterborough City Council"],
  ["29/12/2017 - 12/01/2019", "Taxi", "Peterborough City Council"],
];

const mileageHistory = [
  ["29/09/2022", "36,994", "MOT"],
  ["23/11/2021", "24,315 (Reduced -11,420 miles)", "Mileage issue"],
  ["04/11/2021", "35,735", "MOT"],
  ["18/11/2020", "29,963", "MOT"],
  ["12/11/2019", "25,827", "MOT"],
];

const motHistory = [
  {
    date: "29/09/2022",
    time: "12:31",
    result: "Pass",
    mileage: "36,994 miles",
    note: "1,259 miles travelled since last MOT.",
  },
  {
    date: "04/11/2021",
    time: "15:11",
    result: "Pass",
    mileage: "35,735 miles",
    note: "5,772 miles travelled since last MOT.",
    advisory:
      "Rear child seat fitted not allowing full inspection of adult belt.",
  },
  {
    date: "18/11/2020",
    time: "13:53",
    result: "Pass",
    mileage: "29,963 miles",
    note: "4,136 miles travelled since last MOT.",
    advisory:
      "Nearside rear nail in tyre. Offside front inner tyre worn close to legal limit; offside front tyre had a cut.",
  },
  {
    date: "12/11/2019",
    time: "16:00",
    result: "Pass",
    mileage: "25,827 miles",
    note: "",
  },
];

/* REPORT COMPONENTS */

function ReportTable({ rows }) {
  return (
    <div className="report-table">
      {rows.map(([label, value], index) => (
        <div
          className="report-row"
          key={`${label}-${index}`}
        >
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

function DataTable({ headers, rows }) {
  return (
    <div className="trade-table-wrap">
      <table className="trade-pricing-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* SAMPLE REPORT PAGE */

function SamplePage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const registration = (
    params.get("reg") || "SAMPLE1"
  ).toUpperCase();

  return (
    <>
      <Header />

      <RegistrationSearch />

      <main className="sample-page">
        <div className="sample-report">
          <div className="sample-title">
            <h1>Sample - Gold Check</h1>
            <p>Certificate of Vehicle History</p>
          </div>

          <div className="report-meta">
            <div>
              <span>Registration</span>
              <strong className="registration-plate">
                {registration}
              </strong>
            </div>

            <div>
              <span>Date Of Check</span>
              <strong>22 March 2023 16:16</strong>
            </div>

            <div>
              <span>Reference</span>
              <strong>TCFLLFBEQ7WB</strong>
            </div>
          </div>

          <h2>Overview</h2>

          <div className="overview-box">
            <div>
              <strong>Result</strong>
              <span className="report-fail">Fail</span>
            </div>

            <div>
              <strong>Information</strong>
              <p>
                This example vehicle has outstanding finance and
                has been written off.
              </p>
            </div>
          </div>

          {reportSections.map((section) => (
            <section
              className="report-section"
              key={section.title}
            >
              <h2>{section.title}</h2>

              {section.note && (
                <p className="report-note">
                  {section.note}
                </p>
              )}

              <ReportTable
                rows={section.rows.map(([label, value]) => [
                  label,
                  label === "Registration" &&
                  section.title === "Vehicle Details"
                    ? registration
                    : value,
                ])}
              />
            </section>
          ))}

          <section className="report-section">
            <h2>Important</h2>

            <p>
              It is important that you check the above details
              before purchasing this vehicle to confirm its identity.
            </p>

            <p>
              Stay safe and review our{" "}
              <Link to="/blog">car buying advice</Link>.
            </p>
          </section>

          <section className="report-section">
            <h2>Keeper History</h2>

            <DataTable
              headers={[
                "Keeper",
                "Acquired",
                "Ownership Duration",
              ]}
              rows={keeperHistory}
            />

            <p className="report-note">
              The original sample report states that durations
              may include time the vehicle spent at a registered
              motor trader awaiting sale.
            </p>
          </section>

          <section className="report-section">
            <h2>Ex-Taxi Search</h2>

            <p>
              This example states that the vehicle was previously
              licensed as a taxi or private hire vehicle.
            </p>

            <DataTable
              headers={["From / To", "Type", "Source"]}
              rows={taxiHistory}
            />
          </section>

          <section className="report-section">
            <h2>Extended Mileage Records</h2>

            <DataTable
              headers={["Date", "Mileage", "Source"]}
              rows={mileageHistory}
            />

            <p className="report-note">
              The supplied example flags a reduction of 11,420
              miles between recorded readings. Mileage records
              should always be checked against available evidence.
            </p>
          </section>

          <section className="report-section">
            <h2>Extended Mileage Chart</h2>

            <p>
              Recently recorded mileages for the illustrative
              vehicle.
            </p>

            <div className="mileage-chart">
              {[
                ["2019", 48],
                ["2020", 56],
                ["2021", 68],
                ["2021*", 42],
                ["2022", 72],
              ].map(([year, height], index) => (
                <div
                  className="mileage-bar-wrap"
                  key={`${year}-${index}`}
                >
                  <div
                    className="mileage-bar"
                    style={{ height: `${height}%` }}
                  />
                  <span>{year}</span>
                </div>
              ))}
            </div>

            <p className="report-note">
              Illustrative visual only, not a verified mileage dataset.
            </p>
          </section>

          <section className="report-section">
            <h2>MOT History</h2>

            <p>
              <strong>MOT Vehicle Description:</strong> Audi Q3,
              Grey, 1984 cc, Petrol, 2016
            </p>

            <p>
              <strong>Mileage Notes:</strong> The supplied report
              says the most recent recorded mileage is below the
              stated average for a vehicle of this age.
            </p>

            {motHistory.map((mot) => (
              <article className="mot-card" key={mot.date}>
                <div className="mot-date">
                  <strong>{mot.date}</strong>
                  <span>{mot.time}</span>
                </div>

                <div>
                  <strong className="mot-pass">
                    {mot.result}
                  </strong>

                  <p>Mileage: {mot.mileage}</p>

                  {mot.note && <p>{mot.note}</p>}

                  {mot.advisory && (
                    <p className="mot-advisory">
                      <strong>Advisory Notices:</strong>{" "}
                      {mot.advisory}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </section>

          <section className="report-section">
            <h2>Why Total Car Check?</h2>

            <p>
              Vehicle history checks can help buyers investigate
              recorded vehicle information before a purchase.
              Reports may include stolen markers, write-off
              information, finance, MOT history and registration
              changes, depending on the product.
            </p>

            <p>
              Always verify vehicle identity, condition and records
              independently before making a purchase.
            </p>

            <Link className="blue-button" to="/prices">
              View Check Prices
            </Link>
          </section>

          <div className="demo-notice">
            <strong>Demonstration report:</strong> This page
            reproduces the structure and example values supplied
            for a sample report. It does not connect to DVLA,
            police, MOT, finance, insurance or valuation databases.
            Some dates and durations are historical values from
            the supplied example and are not current vehicle status.
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

/* BLOG PAGE */

function BlogPage() {
  const articles = [
    {
      icon: <CarFront />,
      title: "How to Check a Used Car",
      text: "Things to consider before buying a used vehicle.",
    },
    {
      icon: <FileCheck />,
      title: "Understanding Vehicle History Reports",
      text: "Learn about recorded vehicle history information.",
    },
    {
      icon: <Gauge />,
      title: "Mileage and MOT History",
      text: "Understand recorded mileage and MOT information.",
    },
    {
      icon: <Shield />,
      title: "Stolen Vehicle Checks",
      text:
        "Learn about the role and limits of stolen vehicle checks.",
    },
    {
      icon: <Clock />,
      title: "Before You Buy",
      text: "Prepare for a used-car viewing and test drive.",
    },
    {
      icon: <CircleDollarSign />,
      title: "Vehicle Value and Ownership",
      text: "Explore factors that can affect a vehicle's value.",
    },
  ];

  return (
    <PageLayout
      title="Vehicle Advice & Blog"
      subtitle="Helpful information for used-car buyers"
    >
      <div className="article-grid">
        {articles.map((article) => (
          <article
            className="article-card"
            key={article.title}
          >
            {article.icon}
            <h2>{article.title}</h2>
            <p>{article.text}</p>

            <Link to="/sample">
              Explore vehicle checks <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}

/* LOGIN AND REGISTER */

function AccountPage({ register = false }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();

    setMessage(
      "This is a frontend demonstration. Account authentication has not been connected."
    );
  }

  return (
    <PageLayout
      title={register ? "Register" : "Login"}
      subtitle={
        register
          ? "Create your account"
          : "Access your account"
      }
    >
      <form className="account-form" onSubmit={submit}>
        <h2>
          {register ? "Create an account" : "Welcome back"}
        </h2>

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          minLength={6}
          required
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <button type="submit" className="blue-button">
          {register ? "Create Account" : "Login"}
        </button>

        {message && (
          <p className="demo-notice">{message}</p>
        )}

        <p>
          {register ? "Already registered?" : "New here?"}{" "}
          <Link to={register ? "/login" : "/register"}>
            {register ? "Login" : "Register"}
          </Link>
        </p>
      </form>
    </PageLayout>
  );
}

/* NOT FOUND PAGE */

function NotFoundPage() {
  return (
    <PageLayout
      title="Page Not Found"
      subtitle="Sorry, we couldn't find that page."
    >
      <div className="not-found">
        <Search size={42} />

        <p>
          The page you requested does not exist on this website.
        </p>

        <Link className="blue-button" to="/">
          Return Home
        </Link>
      </div>
    </PageLayout>
  );
}

/* APP ROUTES */

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sample" element={<SamplePage />} />
      <Route path="/prices" element={<PricesPage />} />
      <Route path="/trade" element={<TradePage />} />
      <Route path="/blog" element={<BlogPage />} />

      <Route
        path="/register"
        element={<AccountPage register />}
      />

      <Route
        path="/login"
        element={<AccountPage />}
      />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
