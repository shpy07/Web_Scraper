########## First Stage: Node.js Puppeteer Scraper ##########
    FROM node:20-alpine AS scraper

    WORKDIR /app
    
    # Install dependencies
    COPY scraper/package.json scraper/package-lock.json ./
    RUN npm install --omit=dev
    
    # Install Puppeteer dependencies
    RUN apk add --no-cache \
        nss \
        freetype \
        freetype-dev \
        harfbuzz \
        ca-certificates \
        ttf-freefont
    
    # Set Puppeteer environment variable
    ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser
    
    # Copy scraper files
    COPY scraper/ .
    
    # Run scraper to generate scraped_data.json
    RUN node scrape.js
    
    
########## Second Stage: Flask Server ##########
    FROM python:3.11-slim AS builder
    
    WORKDIR /app
    
    # Install Python dependencies
    COPY server/requirements.txt .
    RUN pip install --no-cache-dir -r requirements.txt
    
    # Copy Python server files
    COPY server/ /app/server
    
    # Copy scraped data from the scraper stage
    COPY --from=scraper /app/data /app/scraper/data
    

########## Final Stage ##########
    FROM python:3.11-slim
    
    WORKDIR /app
    
    # Copy installed Python dependencies from builder
    COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
    COPY --from=builder /usr/local/bin /usr/local/bin
    
    # Copy application files
    COPY --from=builder /app /app
    
    EXPOSE 5000
    
    CMD ["python3", "/app/server/server.py"]
    