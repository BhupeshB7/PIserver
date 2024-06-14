// const fs = require('fs');

// // Read the count from a file or set it to 0
// let count = 0;
// try {
//   const data = fs.readFileSync('count.txt', 'utf8');
//   count = parseInt(data);
// } catch (err) {
//   console.error(err);
// }

//   //  const generateUserId = () => {
  
//   //   const prefix = 'GSP';
//   //   count ++;
//   //   let year = '2023';
//   //   const randomNumbers = Math.floor(Math.random() * 90000000) + 10000000;
//   //   return prefix+ count.toString().padStart(4, '0') +randomNumbers.toString();
//   //   return prefix+ year+ count.toString().padStart(5, '0'); 
//   // };


//   exports.generateUserId =() => {
//     count++;
//     const randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1) + 1000000);
//     const userID = `PI${count.toString()}${randomNumber}`;
//     return userID;
//   }
//   fs.writeFileSync('count.txt', count.toString(), 'utf8');
// // module.exports = generateUserId;

let count = 0;

// Function to generate a random user ID
exports.generateUserId = () => {
    // Increment the count for each user ID generated
    count++;
    // Generate a random number between 1000000 and 9999999
    const randomNumber = Math.floor(Math.random() * (9999999 - 1000000 + 1) + 1000000);
    // Construct the user ID using the incremented count and the random number
    const userID = `PI${count.toString()}${randomNumber}`;
    return userID;
}
