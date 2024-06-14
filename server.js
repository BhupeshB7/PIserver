const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: '',
  api_key: '',
  api_secret: ''
});

async function deleteAllCloudinaryFiles() {
  try {
    let nextCursor = null;
    let deletedCount = 0;

    do {
      // List resources from Cloudinary with pagination
      const { resources, next_cursor } = await cloudinary.api.resources({
        type: 'upload',
        max_results: 100,
        next_cursor: nextCursor // Use the next cursor
      });

      // Extract public IDs of resources for this page
      const publicIds = resources.map(resource => resource.public_id);

      // Delete resources by public IDs
      const deletionResult = await cloudinary.api.delete_resources(publicIds);

      // Update deleted count
      deletedCount += publicIds.length;

      // Update next cursor for pagination
      nextCursor = next_cursor;
    } while (nextCursor); // Continue until there are no more pages

    console.log('All files deleted successfully');
  } catch (error) {
    console.error('Error deleting files from Cloudinary:', error);
  }
}

// Call the function to delete all files
deleteAllCloudinaryFiles();