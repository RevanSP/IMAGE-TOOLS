# IMG Tools - Image Converter

A web-based image format converter built with Express and Sharp, deployed on Netlify as serverless functions.

## Prerequisites

- Node.js >= 18.14.0
- npm
- Netlify CLI

## Project Structure

```
├── netlify/
│   └── functions/
│       └── api.js        # Express serverless function
├── public/
│   ├── index.html        # Frontend
│   └── assets/           # Static assets
├── netlify.toml          # Netlify configuration
└── package.json
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/image-converter.git
cd image-converter
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Netlify CLI globally (if not already installed)

```bash
npm install netlify-cli -g
```

### 4. Run locally

```bash
npm run dev
```

The app will be available at: **http://localhost:8888**

## API Endpoints

### Convert Image (returns base64 JSON)

```
POST /api/convert?format=<target_format>
Content-Type: multipart/form-data

Body: image (file)
```

### Convert & Download Image (returns file directly)

```
POST /api/convert-download?format=<target_format>
Content-Type: multipart/form-data

Body: image (file)
```

### Supported Formats

| Format | Value |
|--------|-------|
| JPEG | `jpeg` or `jpg` |
| PNG | `png` |
| WebP | `webp` |
| AVIF | `avif` |
| TIFF | `tiff` |
| GIF | `gif` |

### Example using cURL

```bash
# Convert to WebP (returns JSON with base64)
curl -X POST "http://localhost:8888/api/convert?format=webp" \
  -F "image=@/path/to/your/image.png"

# Convert and download directly
curl -X POST "http://localhost:8888/api/convert-download?format=webp" \
  -F "image=@/path/to/your/image.png" \
  --output converted.webp
```

### Example Response (`/api/convert`)

```json
{
  "message": "Gambar berhasil dikonversi ke webp!",
  "originalName": "photo.png",
  "convertedName": "photo.webp",
  "dataUrl": "data:image/webp;base64,...",
  "mimeType": "image/webp"
}
```

## Deployment

### Deploy via Git (Recommended)

1. Push the project to GitHub/GitLab
2. Go to [netlify.com](https://netlify.com) and import your repository
3. Build settings are auto-detected from `netlify.toml`
4. Click **Deploy**

### Deploy via Netlify CLI

```bash
netlify init
```

## Notes

- Maximum file size is subject to Netlify's serverless function payload limit (6MB by default)
- `sharp` uses native binaries — if the deploy fails, add this to `package.json`:

```json
"optionalDependencies": {
  "@img/sharp-linux-x64": "*"
}
```