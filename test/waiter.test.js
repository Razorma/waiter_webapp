import assert from 'assert';
import pgPromise from "pg-promise";
import WaiterSchedule from '../Services/waiter.js';
import bcrypt from "bcrypt";
import dotenv from 'dotenv'
dotenv.config();

const pgp = pgPromise();

const connectionString = process.env.DATABASE_URL_TEST 

const db = pgp({ connectionString});

const waiterSchedule = WaiterSchedule(db, bcrypt);

describe('WaiterSchedule', function () {
    before(async function () {
        await db.query(`DELETE FROM waiters;`);
        await db.query(`DELETE FROM shifts;`);
      });

  describe('Add User', function () {
    const saltRounds = 10;
    it('should add a user to the database', async function () {
        const user_name = 'bheka';
        const user_password = 'myPassword';
        const user_role= 'waiter';
        const surname = "lushaba"
        const email = "bheka@gmail.com"
        const checkTableQuery = `SELECT * FROM waiters;`
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);
        
        await waiterSchedule.addWeiter(user_name, hashedPassword,user_role,surname,email);
    
        const tableRows = await db.query(checkTableQuery);
    
        assert.equal(tableRows.length, 1);
      });
    });

  describe('login', function () {
    it('should return role if login credentials are correct', async function () {
    const user_name = 'bheka';
    const user_password = 'myPassword';

      const role = await waiterSchedule.login(user_name, user_password);
      assert.strictEqual(role, 'waiter');
    });

    it('should throw an error if username is not found', async function () {
        try {
            await waiterSchedule.login('nonexistentUser', 'myPassword');
            assert.fail('Expected an error to be thrown.');
        } catch (error) {
            assert.strictEqual(error.message, 'Username not found');
        }
    });

    it('should throw an error if password is incorrect', async function () {

        try {
            await waiterSchedule.login('bheka', 'incorrectPassword');
            assert.fail('Expected an error to be thrown.');
        } catch (error) {
            assert.strictEqual(error.message, 'Incorrect password');
        }
    });
  });

  describe('Book a day', function () {
    it('should be able to add working schedule', async function () {
    const waiter_name = 'bheka';
    const day_name = 'sunday';
    const checkTableQuery = `SELECT * FROM shifts;`

    await waiterSchedule.addWaiterWorkingDate(waiter_name,[day_name])


    const tableRows = await db.query(checkTableQuery)

      assert.equal(tableRows.length, 1);
    });
    
    it('should be able to retrieve working waiter working schedule', async function () {
        const waiter_name = 'bheka';
    
    
        const [tableRows] = await waiterSchedule.getWaiterWorkingDate(waiter_name)
    
        assert.equal(tableRows.waiter_name,'bheka')
        assert.equal(tableRows.day,'sunday')
    });

    it('should throw an error if the waiter has already booked the day', async function () {
        const waiter_name = 'bheka';
        const day_name = 'sunday';
        try {
            await waiterSchedule.addWaiterWorkingDate(waiter_name,[day_name]);
            assert.fail('Expected an error to be thrown.');
        } catch (error) {
            assert.strictEqual(error.message, `You have already booked ${day_name}`);
        }
    });
   });
   it('should be able to delete a working schedule', async function () {
    const waiter_name = 'bheka';
    const day_id = 1;
    const checkTableQuery = `SELECT * FROM shifts;`

    await waiterSchedule.deletWaiterWorkingDate(waiter_name,day_id)


    const tableRows = await db.query(checkTableQuery)

    assert.equal(tableRows.length,0)

    });
    describe('Get every working day', function () {
        before(async function () {
            await db.query(`DELETE FROM shifts;`);
          });
        it('should be able to get all working schedules', async function () {
            const waiter_name = 'bheka';
            const day_names = ['sunday', 'monday'];


            await waiterSchedule.addWaiterWorkingDate(waiter_name, day_names)


            const tableRows = await waiterSchedule.getEachDay()


            assert.equal(tableRows.length, 2);

            assert.equal(tableRows[0].waiter_name,'bheka')
            assert.equal(tableRows[0].day,'sunday')
            assert.equal(tableRows[1].waiter_name,'bheka')
            assert.equal(tableRows[1].day,'monday')

        });
    });

    
});
   
