import assert from 'assert';
import WaiterDays from '../waiter_days.js';
const waiterDays = WaiterDays()

 let results = [
    { id: 2, waiter_name: 'bheka', day_id: 2, day: 'monday' },
    { id: 3, waiter_name: 'bheka', day_id: 3, day: 'tuesday' },
    { id: 4, waiter_name: 'bheka', day_id: 4, day: 'wednesday' },
    { id: 1, waiter_name: 'bheka', day_id: 1, day: 'sunday' },
    { id: 1, waiter_name: 'Bhekac', day_id: 1, day: 'sunday' },
    { id: 2, waiter_name: 'Bhekac', day_id: 2, day: 'monday' },
    { id: 3, waiter_name: 'Bhekac', day_id: 3, day: 'tuesday' },
    { id: 4, waiter_name: 'Bhekac', day_id: 4, day: 'wednesday' },
    { id: 7, waiter_name: 'Bhekac', day_id: 7, day: 'saturday' },
    { id: 6, waiter_name: 'Bhekac', day_id: 6, day: 'friday' },
    { id: 1, waiter_name: 'Sizwile', day_id: 1, day: 'sunday' },
    { id: 3, waiter_name: 'Sizwile', day_id: 3, day: 'tuesday' },
    { id: 7, waiter_name: 'Sizwile', day_id: 7, day: 'saturday' },
    { id: 1, waiter_name: 'Jayson', day_id: 1, day: 'sunday' }
]
describe('WaiterSchedule', function () {
    let cutShedule = {
        sunday: [
          { id: 1, waiter_name: 'bheka', day_id: 1, day: 'sunday' },
          { id: 1, waiter_name: 'Bhekac', day_id: 1, day: 'sunday' },
          { id: 1, waiter_name: 'Sizwile', day_id: 1, day: 'sunday' }
        ]
    }
    let allSchedule = {
        sunday: [
            { id: 1, waiter_name: 'bheka', day_id: 1, day: 'sunday' },
            { id: 1, waiter_name: 'Bhekac', day_id: 1, day: 'sunday' },
            { id: 1, waiter_name: 'Sizwile', day_id: 1, day: 'sunday' },
            { id: 1, waiter_name: 'Jayson', day_id: 1, day: 'sunday' }
        ]
    }      
    it('should be able to return the shedules with their associated days reduced to only three or less each', async function () {
     
      let cutdays = waiterDays.cutShedule(results).sunday

    
        assert.deepEqual(cutdays, cutShedule.sunday);
    });

    it('should be able to return all shedules with their associated days', async function () {

        let alldaysRoster = waiterDays.returnAllShedule(results).allDays.sunday
  
      
          assert.deepEqual(allSchedule.sunday, alldaysRoster);
    });
    it('should return the day that is over booked', async function () {

        let overday = waiterDays.returnAllShedule(results).overDaysObject
  
      
          assert.equal(overday.sunday, "over");
      });

});
   
