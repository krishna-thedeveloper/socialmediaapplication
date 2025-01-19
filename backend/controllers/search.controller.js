import User from "../models/user.model.js";

export const search = async (req, res) => {
    const { query } = req.body;  // Get search term from query string
  
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
  
    try {
      // Use a case-insensitive search to match the name or description
      const results = await User.find({
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { fullName: { $regex: query, $options: 'i' } }
          ]
      });//{ $regex: query, $options: 'i' }
      console.log(results)
      return res.status(200).json(results);
    } catch (error) {
        console.log(error)
      return res.status(500).json({ message: 'Error while searching', error });
    }
  }