import React, { useState } from "react";
import { Box } from "@mui/material";
import SampleUpload from "./SampleUpload";
import UploadNormalArtworks from "./UploadNormalArtworks";
import {
  Collapse,
  Card,
  CardContent,
  Typography,
  Button,
  LinearProgress,
} from "@mui/material";
import KYCComponent from "./KYCComponent";

const ManageProfile = ({ profileData, verificationStatus}) => {
  const [isKycOpen, setIsKycOpen] = useState(true);
  const [isSampleArtworksOpen, setIsSampleArtworksOpen] = useState(false);
  const [isNormalArtworksOpen, setIsNormalArtworksOpen] = useState(false);
  const username = profileData?.name || "Artist";

  return (
    <Card
      variant="outlined"
      sx={{ padding: 3, margin: "20px auto", maxWidth: 800 }}
    >
      {/* <Typography variant="h4" gutterBottom>
        Welcome to {username}'s Dashboard
      </Typography> */}

      {/* KYC Steps Section */}
      <Card variant="outlined" sx={{ marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h6">Artist Onboarding</Typography>
          <Button onClick={() => setIsKycOpen(!isKycOpen)}>
            {isKycOpen ? "Hide KYC Steps" : "Show KYC Steps"}
          </Button>
          <Collapse in={isKycOpen}>
            <Typography variant="subtitle1" gutterBottom>
              Complete the following steps:
            </Typography>

            {/* Progress Tracker */}
            <LinearProgress
              variant="determinate"
              value={
                [
                  verificationStatus?.aadhaarVerified,
                  verificationStatus?.panVerified,
                  verificationStatus?.contactDetailsVerified,
                  verificationStatus?.sampleArtworksSubmitted,
                ].filter(Boolean).length * 25
              }
              sx={{ marginTop: 1, marginBottom: 2 }}
            />

            {/* Steps List */}
            <Typography
              color={
                verificationStatus?.aadhaarVerified ? "primary" : "text.secondary"
              }
            >
              1. Aadhaar Verification
            </Typography>
            <Typography
              color={verificationStatus?.panVerified ? "primary" : "text.secondary"}
            >
              2. PAN Verification
            </Typography>
            <Typography
              color={
                verificationStatus?.contactDetailsVerified
                  ? "primary"
                  : "text.secondary"
              }
            >
              3. Contact Details Submission
            </Typography>
            <Typography
              color={
                verificationStatus?.sampleArtworksSubmitted
                  ? "primary"
                  : "text.secondary"
              }
            >
              4. Upload Sample Artworks
            </Typography>

            {/* Upload Sample Artworks Section */}
            <Box sx={{ marginTop: 2 }}>
              <Button
                variant="contained"
                color="success"
                onClick={() => setIsSampleArtworksOpen(!isSampleArtworksOpen)}
              >
                {verificationStatus?.sampleArtworksSubmitted
                  ? "View Uploaded Samples"
                  : "Upload Sample Artworks"}
              </Button>
              <Collapse in={isSampleArtworksOpen}>
                <SampleUpload
                  baseDirectory={`artist/sampleArtworks/${username}`}
                  username={username}
                />
              </Collapse>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {/* Upload Normal Artworks Section */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6">Upload Normal Artworks</Typography>
          <Button
            onClick={() => setIsNormalArtworksOpen(!isNormalArtworksOpen)}
            variant="contained"
            color="primary"
          >
            {isNormalArtworksOpen ? "Hide Upload Section" : "Show Upload Section"}
          </Button>
          <Collapse in={isNormalArtworksOpen}>
            <UploadNormalArtworks
              baseDirectory={`artist/artworks/${profileData.name}`}
              username={profileData.name}
              isOnboarded={verificationStatus?.onboarded || false}
            />
          </Collapse>
        </CardContent>
      </Card>
    </Card>
  );
};

export default ManageProfile;
