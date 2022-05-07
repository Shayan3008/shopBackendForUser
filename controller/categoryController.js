const oracle = require('../DATABASE/oraclequery')
const connection = require('../DATABASE/oracleConnection')
const category = require('../backend_models/category')

const getCategory = async (req, res) => {
    const temp = []
    const respo = await oracle('select * from category')
    for(var i = 0 ; i < respo.rows.length; i++)
      temp.push(new category(respo.rows[i][0],respo.rows[i][1]))
    
    res.send(JSON.stringify(temp))
  
  }

module.exports = {getCategory}