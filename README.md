# Web Scraper & Server Application

This project scrapes data from a user-specified URL using Node.js & Puppeteer and serves the scraped data via a Python Flask server. The application is containerized using Docker multi-stage builds to keep the final image lightweight.

## Prerequisites

Ensure you have the following installed before proceeding:
```
Node.js 
Python 
Docker
```

## Setup & Installation

### 1. Clone the Repository
```
git clone <repository_url>
cd <repository_name>
```
Install Puppeteer (headless browser automation tool) and other required dependencies:
```
npm install puppeteer
```

### 2. Install Required Packages for Python

Create a requirements.txt file and add:

```
flask
```

Install Python dependencies:

```
pip install -r requirements.txt
```

## Running the Application

### 3. Run the Scraper (Node.js)

Set the URL to scrape (Replace YOUR_URL_HERE with the target URL):
```
export SCRAPE_URL=YOUR_URL_HERE
node scrape.js
```
This will generate a scraped_data.json file inside the scraper/data/ directory.

### 4. Run the Flask Server (Python)

Start the Flask server to serve the scraped data:

```
python server.py
```

The server will be running at: http://localhost:5000/

## Running with Docker

### 5. Build the Docker Image

```
docker build -t webscraper-app .
```

### 6. Run the Docker Container

```
docker run -p 5000:5000 --name flask-server webscraper-app
```

Now, access the scraped data at: http://localhost:5000/
