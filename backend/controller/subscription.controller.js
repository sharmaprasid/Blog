const Subscription = require("../models/subscription.model"); // Adjust the path accordingly

// Create a new subscription
const createSubscription = async (req, res) => {
  try {
    const newSubscription = await Subscription.create(req.body);
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find().populate(
      "user category author"
    );
    res.status(200).json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get a specific subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id).populate(
      "user category author"
    );
    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Update a subscription by ID
const updateSubscriptionById = async (req, res) => {
  try {
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("user category author");
    if (!updatedSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(200).json(updatedSubscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Delete a subscription by ID
const deleteSubscriptionById = async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndRemove(
      req.params.id
    ).populate("user category author");
    if (!deletedSubscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }
    res.status(204).end(); // No content
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscriptionById,
  deleteSubscriptionById,
};
