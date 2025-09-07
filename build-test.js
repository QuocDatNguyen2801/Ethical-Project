// Simple build test script
const { execSync } = require('child_process');

console.log('🔧 Testing build process...');

try {
  // Test TypeScript compilation
  console.log('📝 Checking TypeScript compilation...');
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compilation successful');

  // Test Vite build
  console.log('🏗️ Testing Vite build...');
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('✅ Vite build successful');

  console.log('🎉 All tests passed! Ready for deployment.');
} catch (error) {
  console.error('❌ Build test failed:', error.message);
  process.exit(1);
}
