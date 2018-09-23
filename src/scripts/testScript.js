function testScript() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Test script running!');
            resolve();
        }, 5000);
    })
}

module.exports = testScript;