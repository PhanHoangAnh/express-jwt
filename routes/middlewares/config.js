var fs = require('fs');
var keyPair = JSON.parse(fs.readFileSync('temp', 'utf8'));
module.exports = {
    'secret': 'convitbuocloai1',
    'database': 'mongodb://localhost/VirtualMarket',
    'keyPair': keyPair
};
