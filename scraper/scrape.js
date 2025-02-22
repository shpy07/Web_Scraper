const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

require('dotenv').config();
const url = process.env.SCRAPE_URL || 'https://example.com';

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: true, 
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            protocolTimeout: 60000 
        });

        const page = await browser.newPage();

        let attempts = 0;
        const maxAttempts = 3;
        let success = false;

        while (attempts < maxAttempts && !success) {
            try {
                console.log(`Attempt ${attempts + 1}: Navigating to ${url}`);
                await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
                success = true;
            } catch (error) {
                console.error(`Attempt ${attempts + 1} failed:`, error.message);
                attempts++;
                if (attempts >= maxAttempts) {
                    throw new Error(`Failed to load ${url} after ${maxAttempts} attempts.`);
                }
            }
        }

        // Extracting data
        const data = await page.evaluate(() => ({
            title: document.title || 'No Title Found',
            heading: document.querySelector('h1')?.innerText || 'No H1 Found'
        }));

        console.log('Scraped Data:', data);

        // Ensuring output directory exists
        const outputDir = path.join(__dirname, 'data');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Save data to JSON file
        const outputFile = path.join(outputDir, 'scraped_data.json');
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));

        console.log(`Scraped data saved to ${outputFile}`);
    } catch (error) {
        console.error('Error during scraping:', error);
    } finally {
        if (browser) await browser.close();
    }
})();
