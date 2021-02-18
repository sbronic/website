//const { GoogleSpreadsheet } = require('google-spreadsheet');

// Initialize the sheet - doc ID is the long id in the sheets URL
//const doc = new GoogleSpreadsheet('1eiLqg62_aompAHH4_1aTSNtvKJBMxdspclsM8F_aOII');

exports.handler = async (event, context, callback) => {
  try {
    const body = JSON.parse(event.body)
    if (body.eventName === "order.completed") {
      console.log("Nova narudžba")
    }
    return {
      statusCode: 200
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}