const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mastimeet/src/pages/app/VideoChat.jsx');
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all bg-gradient-to- with bg-linear-to-
content = content.replace(/bg-gradient-to-/g, 'bg-linear-to-');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('✅ Fixed all gradient classes in VideoChat.jsx');
