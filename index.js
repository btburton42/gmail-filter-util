const fs = require('fs');
const parser = require('xml2json');

fs.readFile( './mailFilters.xml', function(err, data) {
    const json = JSON.parse(parser.toJson(data));
    const cat = json.feed.entry.reduce((accum, item) => {
      const label = item['apps:property'].filter(item => item.name === 'label');
      const from = item['apps:property'].filter(item => item.name === 'from');
      if (label.length) {
        let labelVal =label[0].value;
        let fromVal = from[0].value.split(' OR ')
        if (!accum[labelVal]) {
          accum[labelVal] = ''
        }
        console.log(`Label: ${labelVal}`);
        console.log(`Length: ${fromVal.length}`);
        accum[labelVal] = accum[labelVal] + `${accum[labelVal] !== '' ? ' OR ' : ''}` + fromVal.join(' OR ');
      }
      return accum
    }, {})
    fs.writeFile('myMailFilters.json', JSON.stringify(cat), function (err) {
      if (err) return console.log(err);
      console.log('Wrote mail filters');
    });
 });