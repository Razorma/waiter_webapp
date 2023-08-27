


export default function WaiterSchedule(db, bcrypt) {

    async function addWeiter(name, enteredPassword, type) {

        const insertQuery = `
                INSERT INTO waiters (user_name, password,role)
                VALUES ($1, $2,$3);
            `;

        await db.query(insertQuery, [name, enteredPassword, type]);

    }
    async function login(name, enteredPassword) {

        const checkUsernameQuery = `
            SELECT user_name , password,role FROM waiters WHERE user_name = $1;
            `;
        const [result] = await db.query(checkUsernameQuery, [name]);


        if (!result) {
            throw new Error("Username not found");
        }
        // console.log('Query result:', result);
        const storedPassword = result.password;
        const role = result.role;
        const passwordMatch = await bcrypt.compare(enteredPassword, storedPassword)
        if (passwordMatch) {
            return role;
        } else {
            throw new Error("Incorrect password");
        }

    }

    async function addWaiterWorkingDate(waiterName, dayNames) {
        
        for (const day of dayNames) {
            // Check if the waiter has already booked the specified day
            const checkDuplicateQuery = `
              SELECT EXISTS (
                SELECT 1
                FROM shifts s
                JOIN days d ON s.day_id = d.id
                WHERE s.waiter_name = $1 AND d.day = $2
              ) AS exists;
            `;

               const [rows] = await db.query(checkDuplicateQuery, [waiterName, day]);

            
            const isDayAlreadyBooked = rows.exists;

            if (isDayAlreadyBooked) {
                throw new Error(`You have already booked ${day}`);
            } else {
              const setScheduleQuery = `
                SELECT id FROM days WHERE day = $1;
              `;
      
              const [result] = await db.query(setScheduleQuery, [day]);
              const dayIdValue = result.id;
      
              const insertQuery = `
                INSERT INTO shifts (day_id, waiter_name)
                VALUES ($1, $2);
              `;
      
              await db.query(insertQuery, [dayIdValue, waiterName]);
              console.log(`${waiterName} successfully booked ${day}`);//debug
            }
          }
    }
    
  
    async function getWaiterWorkingDate(waiterName) {

        const setScheduleQuery =`
        SELECT *
        FROM shifts s
        JOIN days d ON s.day_id = d.id
        WHERE waiter_name = $1;
      `;

      const result = await db.query(setScheduleQuery, [waiterName])
        return result;
    }
    // getWaiterWorkingDate('bheka')
    async function deletWaiterWorkingDate(waiterName,workday) {
        

        const deleteScheduleQuery =`
        DELETE
        FROM shifts s
        WHERE waiter_name = $1 AND day_id = $2;
      `;

      const result = await db.query(deleteScheduleQuery, [waiterName,workday])

        return result;
    }
  
    async function getEachDay() {
        let Days = { sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }
        let allDays = { sunday: [], monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] }
        let overDaysObject = { sunday: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: "", saturday: "" }
        let overDays = []
        const setScheduleQuery =`
        SELECT *
        FROM shifts s
        JOIN days d ON s.day_id = d.id
      `;

      const result = await db.query(setScheduleQuery)


        result.forEach(item => {
            const day = item.day;
            if (Days.hasOwnProperty(day)) {
                Days[day].push(item);
            }
        });
        
        result.forEach(item => {
            const day = item.day;
            if (allDays.hasOwnProperty(day)) {
                allDays[day].push(item);
            }
        });
        for(let day in Days){    
            Days[day]= Days[day].slice(0,3) 
        }


        for(let day in allDays){    
            if(allDays[day].length > 3){
                overDays.push(day)
            }
        }

        overDays.forEach(item => {
            const day = item;
            if (allDays.hasOwnProperty(day)) {
                overDaysObject[day]='over';
                
            }
        });
        
        return{
            Days,
            allDays,
            overDaysObject,
        }
    }


    return {
        addWeiter,
        login,
        getEachDay,
        addWaiterWorkingDate,
        getWaiterWorkingDate,
        deletWaiterWorkingDate
    };
};