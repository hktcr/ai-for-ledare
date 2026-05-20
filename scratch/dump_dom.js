const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));
    
    const testUrl = 'http://localhost:8000/?setlist=4%2C5%2C17%2C18%2C19%2C20%2C21%2C22%2C8%2C10%2C6%2C26%2C28%2C34%2C40%2C41%2C42%2C33%2C43%2C44%2C45';
    await page.goto(testUrl, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#setlistInput');
    
    const html = await page.evaluate(() => {
        return document.getElementById('cardView').innerHTML;
    });
    
    console.log('--- CARD VIEW DOM ---');
    console.log(html);
    
    await browser.close();
})().catch(err => {
    console.error(err);
});
