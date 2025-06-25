
# VisionShopper Backend

## Setup

1. Install Python 3.8+
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your Brave API key
   ```

5. Run the server:
   ```bash
   python main.py
   ```

## API Endpoints

- POST `/analyze-image` - Upload image for ML analysis
- GET `/search-products` - Search for products using Brave API

## Environment Variables

- `BRAVE_API_KEY` - Your Brave Search API key (required)
- `PORT` - Server port (default: 8000)
- `HOST` - Server host (default: 0.0.0.0)
