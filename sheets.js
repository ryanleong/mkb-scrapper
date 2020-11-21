const { GoogleSpreadsheet } = require("google-spreadsheet");

// spreadsheet key is the long id in the sheets URL
const doc = new GoogleSpreadsheet(process.env.GOOGLE_DOC_ID || "");

const updateSheetWithCrawledData = async (newRows) => {
  console.log("Initialising sheet...");
  // use service account creds
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsByIndex[0];
  const currentRows = await sheet.getRows();
  console.log("Sheet initialised!");

  const filteredNewRows = newRows.filter((newRow) => {
    const exists = currentRows.find(({ url }) => newRow.url === url);
    return !exists;
  });

  if (filteredNewRows.length > 0) {
    console.log("Adding new rows...");
    const addedRows = await sheet.addRows(filteredNewRows);
    console.log(`${addedRows.length} rows added!`);
  } else {
    console.log("No new rows to add");
  }
};

module.exports = {
  updateSheetWithCrawledData,
};
