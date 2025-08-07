import { HealthcareAPI } from './api';
import { DataProcessor } from './processor';

async function main() {
  console.log('🏥 Healthcare Staff Scheduler\n');

  try {
    // Step 1: Fetch data from API
    const { users, posts } = await HealthcareAPI.fetchAllData();

    if (!users.success || !posts.success) {
      throw new Error(`API Error - Users: ${users.error}, Posts: ${posts.error}`);
    }

    if (!users.data || !posts.data) {
      throw new Error('No data received from API');
    }

    // Step 2: Process the data
    const healthcareWorkers = DataProcessor.processData(users.data, posts.data);

    // Step 3: Generate and display report
    const report = DataProcessor.generateReport(healthcareWorkers);
    console.log(report);

    // Step 4: Show some detailed examples
    console.log('🔍 Detailed Examples:');
    healthcareWorkers.slice(0, 3).forEach(worker => {
      console.log(`   ${worker.name} - ${worker.specialty} - ${worker.availability} - $${worker.hourlyRate}/hr`);
    });

  } catch (error) {
    console.error('❌ Application Error:', error);
    process.exit(1);
  }
}

// Run the application
main();