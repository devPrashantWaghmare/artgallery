const Portfolio = require('../models/Portfolio');

exports.getPortfolio = async (req, res) => {
    try {
        const portfolio = await Portfolio.findOne({ userId });
        if (!portfolio) {
            return res.status(404).json({ message: 'Portfolio not found' });
        }
        res.status(200).json({ data: portfolio });
    } catch (error) {
        console.error('Error fetching portfolio:', error); // Enhanced logging
        res.status(500).json({ message: 'Error fetching portfolio', error });
    }
    
};

exports.updatePortfolio = async (req, res) => {
    try {
        const { userId, updates } = req.body;
        const updatedPortfolio = await Portfolio.findOneAndUpdate({ userId }, updates, { new: true });
        res.status(200).json({ message: 'Portfolio updated successfully', data: updatedPortfolio });
    } catch (error) {
        res.status(500).json({ message: 'Error updating portfolio', error });
    }
};
