console.log("🚀 Healthcare Scheduler Setup Complete!");
console.log("Node version:", process.version);
console.log("Current directory:", process.cwd());

// Test async/await
async function testAsync() {
    return new Promise(resolve => {
        setTimeout(() => resolve("✅ Async working!"), 1000);
    });
}

testAsync().then(console.log);