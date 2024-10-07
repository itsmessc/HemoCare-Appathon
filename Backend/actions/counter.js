app.post('/add-counter', async (req, res) => {
    const { name } = req.body;

    try {
        // Check if a counter with the same name already exists
        const existingCounter = await Counter.findOne({ name });
        if (existingCounter) {
            return res.status(400).json({ message: 'Counter with this name already exists' });
        }

        // Create a new counter
        const counter = new Counter({ name });
        await counter.save();

        res.status(200).json({ message: 'Counter successfully added', counter });
    } catch (error) {
        console.error('Error adding counter:', error);
        res.status(500).json({ message: 'Error adding counter' });
    }
});