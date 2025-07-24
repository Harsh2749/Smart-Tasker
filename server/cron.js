import cron from "node-cron";
import Task from "./models/Task.js";
import { sendEmail, sendSMS, sendWhatsApp } from "./utils/reminders.js";

export function startReminderCron() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    console.log("Cron tick at:", now);

    const dueTasks = await Task.find({
      remindAt: { $lte: now },
      reminded: false
    });

    console.log("Tasks found:", dueTasks.length);

    for (const task of dueTasks) {
      await sendEmail(task);       // Email Reminder
      await sendSMS(task);         // SMS Reminder
      await sendWhatsApp(task);    // WhatsApp Reminder
      task.reminded = true;
      await task.save();
      console.log(`Reminded task "${task.title}"`);
    }
  });
}
