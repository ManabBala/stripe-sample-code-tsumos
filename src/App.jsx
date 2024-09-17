import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CheckoutForm from "./CheckoutForm";
import CompletePage from "./CompletePage";
import "./App.css";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripePromise = loadStripe(
  "pk_test_51PknCSEZJ7e3kUkzZZ0hhiuNN9j7e8xnc9GDnTMPCF5wHzUstXXlEQSnrrXF7t96bJrWlMFqtx8Kvem9Eqbg4AXM00eBMy1MeL",
);

export default function App() {
  const [clientSecret, setClientSecret] = useState("");
  const [dpmCheckerLink, setDpmCheckerLink] = useState("");

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch("/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: "xl-tshirt", amount: 1000 }] }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        // [DEV] For demo purposes only
        setDpmCheckerLink(data.dpmCheckerLink);
      });
  }, []);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Router>
      <div className="App">
        {clientSecret && (
          <Elements options={options} stripe={stripePromise}>
            <Routes>
              <Route
                path="/checkout"
                element={<CheckoutForm dpmCheckerLink={dpmCheckerLink} />}
              />
              <Route path="/complete" element={<CompletePage />} />
            </Routes>
          </Elements>
        )}
      </div>
    </Router>
  );
}
