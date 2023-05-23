import 'dotenv/config';
const environment = process.env.NODE_ENV;

if (environment === 'multi') {
  import('./cluster');
} else {
  import('./server');
}
