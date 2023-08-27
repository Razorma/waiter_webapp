


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
        const setScheduleQuery =`
        SELECT *
        FROM shifts s
        JOIN days d ON s.day_id = d.id
      `;

      const result = await db.query(setScheduleQuery)

        return result
        
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