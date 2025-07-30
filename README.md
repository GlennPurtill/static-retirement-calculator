
# static-retirement-calculator
Static retirement calculator website hosted on S3

# Static Retirement Calculator Website

## Deploying HTML, CSS, and JS Files to S3 Using AWS CLI

After you have created and configured your S3 bucket, you can deploy (upload) your website files (`index.html`, `styles.css`, `script.js`) using the AWS CLI:

1. Open a terminal and navigate to your project directory.
2. Run the following commands, replacing `YOUR_BUCKET_NAME` with your actual bucket name (e.g., `retirement-calculator-website-dev` or `retirement-calculator-website-prod`):

   ```powershell
   aws s3 cp index.html s3://YOUR_BUCKET_NAME/
   aws s3 cp styles.css s3://YOUR_BUCKET_NAME/
   aws s3 cp script.js s3://YOUR_BUCKET_NAME/
   ```

   These commands upload only the HTML, CSS, and JS files to your S3 bucket.

3. To ensure files are not cached by browsers, you can add cache control headers (optional):

   ```powershell
   aws s3 cp index.html s3://YOUR_BUCKET_NAME/ --cache-control "no-cache, no-store, must-revalidate"
   aws s3 cp styles.css s3://YOUR_BUCKET_NAME/ --cache-control "no-cache, no-store, must-revalidate"
   aws s3 cp script.js s3://YOUR_BUCKET_NAME/ --cache-control "no-cache, no-store, must-revalidate"
   ```

4. After upload, visit your S3 static website endpoint to see your deployed site.

For more options, see the [AWS CLI S3 documentation](https://docs.aws.amazon.com/cli/latest/reference/s3/index.html).

## Manual S3 Bucket Setup for Deployment

This project is deployed as a static website using Amazon S3. Due to account-level restrictions on public access, S3 buckets must be created and configured manually.

### S3 Bucket Names
- **Development:** `retirement-calculator-website-dev`
- **Production:** `retirement-calculator-website-prod`

### Manual Setup Instructions
1. Go to the AWS S3 Console.
2. Create a new bucket with the appropriate name for your environment (see above).
3. In the bucket's Permissions tab, under "Block public access (bucket settings)", uncheck "Block all public access" and confirm.
4. In the Permissions tab, add a Bucket Policy to allow public read access:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
    }
  ]
}
```
Replace `YOUR_BUCKET_NAME` with the actual bucket name.

5. In the Properties tab, enable static website hosting. Set the index and error document to `index.html`.
6. Upload your website files (`index.html`, `styles.css`, `script.js`) to the bucket.
7. Access your site using the S3 website endpoint provided in the bucket's static website hosting settings.

---

For more details, see the AWS S3 documentation.
