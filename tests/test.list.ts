process.env.NODE_ENV = 'test';

import dotenvFlow from 'dotenv-flow';
import { test } from '@playwright/test';
import health from './health.test';

dotenvFlow.config();

test.describe(health);
