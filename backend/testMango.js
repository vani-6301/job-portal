import dns from "dns";
import mongoose from "mongoose";

dns.setServers(["8.8.8.8"]);

const uri = "mongodb+srv://vaninaravi07_db_user:dF5wzvOL7kOagP9a@cluster0.8mbyanz.mongodb.net/job_portal?retryWrites=true&w=majority&appName=Cluster0";

try {
    await mongoose.connect(uri);
    console.log("✅ Connected!");
} catch (err) {
    console.error(err);
}