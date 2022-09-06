const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const { BASE_DIR, LOGIN_TIME } = require("./config");


let startOptions = {
    headless: false,
    executable_path: path.join(BASE_DIR, "source/chrome-103/Application/chrome.exe"),
    url: "https://seller.tiktok.com/",
    timeout: 30 * 1000,
}


let getRequestCookies = async (page) => {
    let cookie_arr = await page.cookies();
    let cookie_str = "";
    cookie_arr.forEach(element => {
        cookie_str += (element.name + "=" + element.value + "; ");
    });
    cookie_str = cookie_str.slice(0, cookie_str.length - 2);
    return cookie_str;
}


module.exports = async () => {
    let init_params = {
        headless: startOptions.headless,
        // executablePath: startOptions.executable_path,
        dumpio: true,
        handleSIGINT: false,
        handleSIGTERM: false,
        handleSIGHUP: false,
        autoClose: true,
        ignoreHTTPSErrors: true,
        ignoreDefaultArgs: ["--enable-automation"],
        args: ["--start-maximized",],
    };

    let browser = await puppeteer.launch(init_params),
        page = await browser.newPage();

    let _js = fs.readFileSync(path.join(BASE_DIR, "source/stealth.min.js"), {"encoding": "utf-8", "flag": "r"});
    await page.evaluateOnNewDocument(_js);

    let width = await page.evaluate(() => {return window.screen.width;}), 
        height = await page.evaluate(() => {return window.screen.height;});
    await page.setViewport({width, height});

    page.setDefaultNavigationTimeout(startOptions.timeout);
    await page.goto(startOptions.url);

    await page.waitForTimeout(LOGIN_TIME * 1000);
    let _cookies = await getRequestCookies(page);

    await page.close();
    await browser.close();
    return _cookies;
}
