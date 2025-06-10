const { create,getAll,update } = require('../services/application.service');

class ApplicationController {
    async create(req, res) {
        try {
            const data = req.body;
            if (!data) {
                return res.status(400).json({ success: false, message: 'Invalid data' });
            }

            const application = await create(data);
            if (application.success === true) {
                return res.status(201).json({ success: true, message: application.message });
            }

            return res.status(500).json(application);
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Server error', error: error.message });
        }
    }
		async getAll(req, res) {
			try {
				const application = await getAll();
				if (application) {
					if (application.success === true) {
						return res.status(200).json(application);
					}
					return res.status(200).json(application);
				}
				return res.status(500).json({ success: false, message: 'Server error' });
			} catch (error) {
				return res.status(500).json({ success: false, message: 'Server error', error: error.message });
			}
		}
		async update(req, res) {
			try {
				const { id } = req.params;
				const { isActive } = req.body;
		
				// Call the update function in the service
				const application = await update(id, isActive);
		
				// Check if the application update was successful
				if (application.success === true) {
					return res.status(200).json(application);  // Return success response
				}
		
				// If the update was not successful
				return res.status(400).json(application);  // Return failure response with appropriate message
			} catch (error) {
				return res.status(500).json({ success: false, message: 'Server error', error: error.message });
			}
		}
		
		
}

module.exports = new ApplicationController();
