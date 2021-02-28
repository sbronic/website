//const { GoogleSpreadsheet } = require('google-spreadsheet');

// Initialize the sheet - doc ID is the long id in the sheets URL
//const doc = new GoogleSpreadsheet('1eiLqg62_aompAHH4_1aTSNtvKJBMxdspclsM8F_aOII');

exports.handler = async (event, context, callback) => {
  try {
    const body = JSON.parse(event.body)
    if (body.eventName === "order.completed") {
      return { statusCode: 200, body: body };
    }
    else if ((body.eventName === "order.paymentStatus.changed") && (body.to === "Paid") ) { 
      return { statusCode: 200, body: `Ovo je bila plaćena Narudžba` };
    }
    return {
      statusCode: 200
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}