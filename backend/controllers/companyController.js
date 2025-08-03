const Company = require('../models/Company');

const getCompanies = async (req, res) => {
  try {
    const { sortBy } = req.query;

    let sortOption = {};
    switch (sortBy) {
      case 'Name A-Z':
        sortOption = { name: 1 };
        break;
      case 'Name Z-A':
        sortOption = { name: -1 };
        break;
      case 'Most Jobs':
        sortOption = { openPositions: -1 };
        break;
      case 'Least Jobs':
        sortOption = { openPositions: 1 };
        break;
      default:
        sortOption = { name: 1 }; // Default sort
    }

    const companies = await Company.find({}).sort(sortOption);
    res.json(companies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getCompanies };