require("dotenv").config();
const cheerio = require("cheerio");
const unirest = require("unirest");
const Url = require("url-parse");

const { updateSheetWithCrawledData } = require("./sheets");

/**
 * Convert crawled DOM to JS object
 * @param {DOM} dom
 */
const domToObject = (dom) => {
  const $ = cheerio.load(dom);
  const rows = $("#messageindex > table > tbody > tr");
  const crawledList = [];

  rows.each((i, elem) => {
    const link = $(elem).find(".subject span a");
    const updatedOn = $(elem).find(".lastpost");
    const dateStr = updatedOn.text().trim().split("by")[0];

    const formattedUrl = new Url(link.attr("href"), true);
    delete formattedUrl.query.PHPSESSID;

    const item = {
      title: link.text(),
      url: formattedUrl.toString(),
      status: "new",
      interest: 0,
    };

    if (item.url && !item.url.includes("topic=36672.0")) {
      crawledList.push(item);
    }
  });

  return crawledList;
};

/**
 * Merge rows that are not duplicate
 * @param {Array} currentRows
 * @param {Array} newRows
 */
const mergeLists = (currentRows, newRows) => {
  const filteredNewRows = newRows.filter((row) => {
    return !currentRows.find(({ url }) => row.url === url);
  });

  return [...currentRows, ...filteredNewRows];
};

/**
 * Crawl pages
 */
const run = async () => {
  console.log("Crawling page...");
  const responses = await Promise.all([
    unirest.get("https://geekhack.org/index.php?board=132.0"),
    unirest.get("https://geekhack.org/index.php?board=132.50"),
  ]);
  console.log("Crawling page completed!");

  console.log("Formatting crawled rows...");
  const list = responses.reduce((acc, data) => {
    const crawledList = domToObject(data.body);
    return mergeLists(acc, crawledList);
  }, []);
  console.log(`Formatting ${list.length} crawled rows completed!`);

  updateSheetWithCrawledData(list);
};

run();
