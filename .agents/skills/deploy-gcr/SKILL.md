---
name: deploy-gcr
description: >-
  Use this skill when the user asks to "push to gcr", "deploy to cloud run",
  "deploy playr", or trigger a Google Cloud Run release for StreetPlayR.
---

# StreetPlayR Google Cloud Run Deployment Runbook

Deploy the `apps/playr` storefront to Google Cloud Run via Google Cloud Build.

## Deployment Prerequisites

1. **Verify IAM Account**:
   Ensure `tech@playr.in` is active (default accounts like `adminairborne@gmail.com` lack permissions on `streetplayr-production`):
   ```powershell
   gcloud config set account tech@playr.in
   gcloud config set project streetplayr-production
   ```

2. **Verify Ignore Files**:
   Ensure `.gcloudignore` exists at workspace root to prevent uploading `node_modules`, `scripts/`, or large scratch files.

## Execution Steps

1. **Extract Commit SHA**:
   ```powershell
   $COMMIT_SHA = (git rev-parse --short HEAD).Trim()
   ```

2. **Submit Cloud Build**:
   ```powershell
   gcloud builds submit --config=cloudbuild.yaml --substitutions=_COMMIT_SHA=$COMMIT_SHA
   ```
   *Note: Cloud Build takes ~6-7 minutes to compile the Docker container, push to Artifact Registry (`asia-south1-docker.pkg.dev/streetplayr-production/cloud-run-source-deploy/playr`), and roll out the new Cloud Run revision.*

3. **Verify Deployment & Fetch Service URL**:
   ```powershell
   gcloud run services describe playr --region=asia-south1 --format="value(status.url,status.latestReadyRevisionName)"
   ```

4. **Update Memory**:
   Append the new deployment revision, build ID, and live URL to `.memory/topics/gcr-deployment.md`.
