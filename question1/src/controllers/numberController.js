const numberService = require('../services/numberService')

const processNumbers = async (req, res) => {
    try {
        const { numberId } = req.params;
        const result = await numberService.getNumberById(numberId);
        res.json(result);
    } catch (error) {
        if (error.message === 'Number not found in mapping') {
            res.status(404).json({ 
                error: 'Not Found',
                message: 'The requested number ID does not exist in our mapping'
            });
        } else {
            res.status(500).json({ 
                error: 'Internal Server Error',
                message: error.message 
            });
        }
    }
};

module.exports = {
    processNumbers
}; 