const cloudinary = require("cloudinary").v2;
require("dotenv").config();

const uploadToCloudinary = async (fileBuffer) => {
	try {
		const cloudinaryResponse = await new Promise((resolve, reject) => {
			cloudinary.uploader
				.upload_stream({folder: "sbd"}, (error, result) => {
					if (error) {
						reject(error);
					} else {
						resolve(result);
					}
				})
				.end(fileBuffer);
		});

		return cloudinaryResponse;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	uploadToCloudinary,
};
