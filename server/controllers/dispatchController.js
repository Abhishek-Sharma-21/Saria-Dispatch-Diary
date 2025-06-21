const Dispatch = require('../models/Dispatch');

// Bulk create dispatches
exports.createDispatchesBulk = async (req, res) => {
  try {
    const { dispatches } = req.body;
    if (!Array.isArray(dispatches) || dispatches.length === 0) {
      return res.status(400).json({ error: 'No dispatches provided' });
    }
    const result = await Dispatch.insertMany(dispatches);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all dispatches (newest first)
exports.getDispatches = async (req, res) => {
  try {
    const dispatches = await Dispatch.find().sort({ createdAt: -1 });
    res.json(dispatches);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single dispatch by ID
exports.getDispatchById = async (req, res) => {
  try {
    const dispatch = await Dispatch.findById(req.params.id);
    if (!dispatch) return res.status(404).json({ error: 'Dispatch not found' });
    res.json(dispatch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a dispatch
exports.updateDispatch = async (req, res) => {
  try {
    const { supplier, vehicle, weight } = req.body;
    const dispatch = await Dispatch.findByIdAndUpdate(
      req.params.id,
      { supplier, vehicle, weight },
      { new: true }
    );
    if (!dispatch) return res.status(404).json({ error: 'Dispatch not found' });
    res.json(dispatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a dispatch
exports.deleteDispatch = async (req, res) => {
  try {
    const dispatch = await Dispatch.findByIdAndDelete(req.params.id);
    if (!dispatch) return res.status(404).json({ error: 'Dispatch not found' });
    res.json({ message: 'Dispatch deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 