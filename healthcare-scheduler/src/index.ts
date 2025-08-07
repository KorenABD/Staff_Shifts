import { HealthcareAPI } from './api';

async function testAPI() {
  console.log('🏥 Healthcare Staff Scheduler - API Test\n');

  // Test fetching data
  const { users, posts } = await HealthcareAPI.fetchAllData();

  if (!users.success || !posts.success) {
    console.error('❌ API test failed');
    console.error('Users error:', users.error);
    console.error('Posts error:', posts.error);
    return;
  }

  console.log('\n📊 API Test Results:');
  console.log(`👥 Users fetched: ${users.data?.length}`);
  console.log(`📜 Posts fetched: ${posts.data?.length}`);

  // Show sample data
  if (users.data && users.data.length > 0) {
    console.log('\n👤 Sample User:');
    const sampleUser = users.data[0];
    console.log(`  Name: ${sampleUser.name}`);
    console.log(`  Email: ${sampleUser.email}`);
    console.log(`  Company: ${sampleUser.company.name}`);
    console.log(`  Phone: ${sampleUser.phone}`);
  }

  if (posts.data && posts.data.length > 0) {
    console.log('\n📋 Sample Post:');
    const samplePost = posts.data[0];
    console.log(`  User ID: ${samplePost.userId}`);
    console.log(`  Title: ${samplePost.title.substring(0, 50)}...`);
  }
}

// Run the test
testAPI().catch(console.error);