const tableServices = require('../../../table/services/table.services.js')
module.exports = {
  async beforeCreate(event) {
    const data = event.params.data
    await tableServices.createTableCode(data);
  },  
}

