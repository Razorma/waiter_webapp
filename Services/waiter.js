//Define a function for Database queries
export default function WaiterSchedule(db, bcrypt) {

  //Define a function to add waiters
  async function addWeiter(name, enteredPassword, type) {

  //Insert waiter in the waiter table
    const insertQuery = `
                INSERT INTO waiters (user_name, password,role)
                VALUES ($1, $2,$3);
            `;
    
    await db.query(insertQuery, [name, enteredPassword, type]);

  }

  //Define a function to login
  async function login(name, enteredPassword) {

    //Retrieve the detailes for the specified user
    const checkUsernameQuery = `
            SELECT user_name , password,role FROM waiters WHERE user_name = $1;
            `;
    const [result] = await db.query(checkUsernameQuery, [name]);

    //Throw error if the User is not found
    if (!result) {
      throw new Error("Username not found");
    }
    // console.log('Query result:', result);
    const storedPassword = result.password;
    const role = result.role;

    //Check if the password matches
    const passwordMatch = await bcrypt.compare(enteredPassword, storedPassword)

    //Return role if password is correct and throw error if they dont match
    if (passwordMatch) {
      return role;
    } else {
      throw new Error("Incorrect password");
    }

  }

   //Define a function to add Waiter Working Date
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
      
      //If booked throw error
      if (isDayAlreadyBooked) {
        throw new Error(`You have already booked ${day}`);
      } else {

        //Retrieve id for the selected day
        const setScheduleQuery = `
                SELECT id FROM days WHERE day = $1;
              `;

        const [result] = await db.query(setScheduleQuery, [day]);
        const dayIdValue = result.id;


        //Insert shift information
        const insertQuery = `
                INSERT INTO shifts (day_id, waiter_name)
                VALUES ($1, $2);
              `;

        await db.query(insertQuery, [dayIdValue, waiterName]);
        //console.log(`${waiterName} successfully booked ${day}`);//debug
      }
    }
  }


   //Define a function to get Waiter Working Date
  async function getWaiterWorkingDate(waiterName) {
   //Join the tables to get more acurate results
    const setScheduleQuery = `
        SELECT *
        FROM shifts s
        JOIN days d ON s.day_id = d.id
        WHERE waiter_name = $1;
      `;

    const result = await db.query(setScheduleQuery, [waiterName])
    return result;
  }


  //Define a function to delete Waiter Working Date
  async function deletWaiterWorkingDate(waiterName, workday) {

  //Delete data based on name and day id
    const deleteScheduleQuery = `
        DELETE
        FROM shifts s
        WHERE waiter_name = $1 AND day_id = $2;
      `;

    const result = await db.query(deleteScheduleQuery, [waiterName, workday])

    return result;
  }

  //Define a function to get every schedule from database
  async function getEachDay() {

    //Retrieve every shift booked
    const setScheduleQuery = `
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