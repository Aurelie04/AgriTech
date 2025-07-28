import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

const AgriBankingPage = () => {
  const [user, setUser] = useState({});
  const [accountType, setAccountType] = useState("wallet");
  const [diasporaWalletFor, setDiasporaWalletFor] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionReference, setTransactionReference] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    console.log("Stored user from localStorage:", storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleTransaction = async (e) => {
    e.preventDefault();

    const transactionData = {
      userId: user?.id,
      accountType,
      diasporaWalletFor,
      amount,
      transactionReference,
    };

    console.log("Submitting transaction:", transactionData);


    try {
      const response = await fetch("http://localhost:8081/api/agri-banking/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ " + result.message);
        // Optionally reset form:
        setAmount("");
        setDiasporaWalletFor("");
        setTransactionReference("");
      } else {
        alert("❌ Error: " + result.message);
      }
    } catch (error) {
      console.error("Error submitting transaction:", error);
      alert("❌ Submission failed. Please try again later.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Agri-Banking Services</h1>

      <Card className="mb-6">
        <CardContent>
          <form onSubmit={handleTransaction} className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Account Type</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="wallet">Agri-Wallet</option>
                <option value="savings">Mobile Savings Account</option>
                <option value="diaspora">Diaspora Health/Farm Wallet</option>
              </select>
            </div>

            {accountType === "diaspora" && (
              <div>
                <label className="block font-semibold mb-1">Diaspora Wallet For (Family Member)</label>
                <Input
                  value={diasporaWalletFor}
                  onChange={(e) => setDiasporaWalletFor(e.target.value)}
                  placeholder="e.g., Mother, Father, Sister"
                />
              </div>
            )}

            <div>
              <label className="block font-semibold mb-1">Amount</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Transaction Reference</label>
              <Input
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                placeholder="Enter QR code ref or any identifier"
              />
            </div>

            <Button type="submit">Submit Transaction</Button>
          </form>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600">
        Note: This connects to the backend and stores Agri-Banking transaction data in the database.
      </p>
    </div>
  );
};

export default AgriBankingPage;
