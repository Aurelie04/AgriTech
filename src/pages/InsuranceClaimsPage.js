import React, { useState } from "react";
import { Card } from "../components/ui/Card";
import { CardContent } from "../components/ui/CardContent";
import { Input } from "../components/ui/Input";
import { TextArea } from "../components/ui/TextArea";
import { Button } from "../components/ui/Button";

const InsuranceClaimsPage = () => {
  const [policyNumber, setPolicyNumber] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Future: send to backend with file upload
    setSubmitted(true);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Submit an Insurance Claim</h2>

          {submitted ? (
            <div className="text-green-700 font-medium">
              ✅ Your claim has been submitted successfully!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Policy Number"
                value={policyNumber}
                onChange={(e) => setPolicyNumber(e.target.value)}
              />

              <TextArea
                label="Claim Description"
                value={claimDetails}
                onChange={(e) => setClaimDetails(e.target.value)}
              />

              <Input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <Button type="submit">Submit Claim</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceClaimsPage;
