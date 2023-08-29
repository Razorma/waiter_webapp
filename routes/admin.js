import bcrypt from "bcrypt";
import WaiterDays from "../waiter_days.js";
const waiterDays = WaiterDays()
let currentUser = ""

export default function adminRoutes(waiterSchedule) {
    // Get users for admin home page
    async function getUsers(req, res) {

        try {
    //get the Schedules of all the waiters 

            const result = await waiterSchedule.getEachDay()
            const groupedDays = waiterDays.cutShedule(result)
            const overGroupedDaysClass = waiterDays.returnAllShedule(result).overDaysObject

    //Render the home page
            res.render('Admin/home', { groupedDays, overGroupedDaysClass });
        } catch (error) {
    //Send error using flash
            req.flash('error', error.message)
        }

    }

    // Get list of all users for admin list page
    async function getListUsers(req, res) {

        try {

    //get the Schedules of all the waiters 
            const result = await waiterSchedule.getEachDay()
            const allDays = waiterDays.returnAllShedule(result).allDays

    //Render the list of all the waiters of each day
            res.render('Admin/list', { allDays });
        } catch (error) {
    //Send error using flash
            req.flash('error', error.message)
        }

    }
    
    //Remove a waiter from the list 
    async function removeWaiters(req, res) {
        const username = req.params.username;
        const day = req.body.day;
        try {
            await waiterSchedule.deletWaiterWorkingDate(username, day)
        } catch (error) {
            req.flash('error', error.message)
        }
        res.redirect('/list');
    }
    return {
        getUsers,
        getListUsers,
        removeWaiters

    }
}