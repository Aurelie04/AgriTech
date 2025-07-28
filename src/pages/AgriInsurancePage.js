import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Card } from "../components/ui/Card";
import { CardContent } from "../components/ui/CardContent";
import { Input } from "../components/ui/Input";
import { TextArea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";

const AgriInsurancePage = () => {
  const [fullName, setFullName] = useState("");
  const [insuranceType, setInsuranceType] = useState("");
  const [bundle, setBundle] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !insuranceType) {
      setError("Full name and insurance type are required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8081/api/insurance/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          type: insuranceType,
          bundle,
          description
        })
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setError("");
      } else {
        setError(data.message || "Failed to submit insurance application.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Server error while submitting.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col text-sm md:text-base">
      {/* Topbar */}
      <Topbar />

      {/* Page layout */}
      <div className="pt-24 px-4 md:px-8 flex-1 flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col items-center justify-start mt-8">
          <Card className="w-full max-w-2xl">
            <CardContent>
              <h2 className="text-xl font-semibold mb-4">Apply for Agriculture Insurance</h2>

              {submitted ? (
                <div className="text-green-700 font-medium">
                  ✅ Your insurance application has been submitted!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && <div className="text-red-600">{error}</div>}

                  <Input
                    label="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />

                  <Select
                    label="Insurance Type"
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                    options={["Crop Insurance", "Asset Insurance", "Weather-indexed Insurance"]}
                    required
                  />

                  <Select
                    label="Bundle With"
                    value={bundle}
                    onChange={(e) => setBundle(e.target.value)}
                    options={["None", "Agri-Loan", "Equipment"]}
                  />

                  <TextArea
                    label="Additional Notes"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write any notes or extra details"
                  />

                  <Button type="submit">Submit Application</Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AgriInsurancePage;
