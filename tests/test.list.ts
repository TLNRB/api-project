process.env.NODE_ENV = 'test';

import dotenvFlow from 'dotenv-flow';
import { connect, disconnect } from '../src/repository/database';
import { userModel } from '../src/models/userModel';
import { gameModel } from '../src/models/gameModel';
import { test } from '@playwright/test';
import health from './health.test';
import userTestCollection from './user.test';

dotenvFlow.config();

function setup() {
   // beforeEach clear the database
   test.beforeEach(async () => {
      try {
         await connect();
         await userModel.deleteMany({});
         await gameModel.deleteMany({});
      }
      finally {
         await disconnect();
      }
   })
   // afterAll clear the database
   test.afterAll(async () => {
      try {
         await connect();
         await userModel.deleteMany({});
         await gameModel.deleteMany({});
      }
      finally {
         await disconnect();
      }
   })
}

setup();
test.describe(health);
test.describe(userTestCollection);
