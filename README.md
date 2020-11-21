# Customer Mechanical Keyboard IC crawler

Scrapper crawls GeekHack's Interest Check forum and populates the data into a Google Sheet.
Where you can label the IC as whether to watch or not.
Code will make sure there will be no duplicates when writing to Google sheet.

# Setup

- Set up API key

  - Go to `https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account`
  - Follow instructuctions to set up with Service Account

- Copy `.env.sample` to `.env`
- Update `.env` with create API key
- Copy doc ID from url
  - e.g. https://docs.google.com/spreadsheets/d/<DOC_ID>/edit#gid=0
- Update `.env` with doc ID

# Running

- Execute `node index.js`
