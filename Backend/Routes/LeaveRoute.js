const express = require('express');
const router = express.Router();
const prisma = require('../db.js');
const TokenVerification = require('../middleware/TokenVerification.js')
const GetUploadMiddleWare = require('../multer.js')
const path = require('path')
const uploadFile = GetUploadMiddleWare("./files")

router.post('/apply-leave', TokenVerification, uploadFile.single("document"), async (req, res) => {
    try {
        const { startDate, endDate, reason, leaveType } = req.body;
        const userId = req.user.id;
        const start = new Date(startDate);
        const end = new Date(endDate);

        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const totalDays = Math.round((end - start) / oneDay) + 1;
        let documentPath = null;
        if (req.file) {
            documentPath = req.file.path; // multer saves file path
        }
        const leaveApplication = await prisma.leaveRequest.create({
            data: {
                userId: userId,
                startDate: start,
                endDate: end,
                reason: reason,
                totalDays,
                Type: leaveType,
                document: documentPath
            }
        });
        return res.status(200).json({ message: 'Leave application submitted', leaveApplication });
    } catch (error) {
        return res.status(500).json(error);
    }
})
// count weekends

function countWeekendDays(startDate, endDate) {
    let weekends = 0;
    const current = new Date(startDate);

    while (current <= endDate) {
        const day = current.getDay(); // 0 = Sunday, 6 = Saturday
        if (day === 0 || day === 6) weekends++;
        current.setDate(current.getDate() + 1);
    }

    return weekends;
}



router.put('/update-leave/:id/:status', TokenVerification, async (req, res) => {
    const leaveId = req.params.id;
    // console.log(leaveId)
    const status = req.params.status.toUpperCase(); // make sure status is consistent
    const adminId = req.user.id;

    try {
        // 1️ Check if requester is admin
        const admin = await prisma.user.findUnique({ where: { id: adminId } });
        if (!admin || admin.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }

        // 2️ Fetch leave request with user in one query 
        const leave = await prisma.leaveRequest.findUnique({
            where: { id: leaveId }
        });
        if (!leave) {
            return res.status(404).json({ error: 'Leave application not found' });
        }

        // 3️⃣ Update leave status
        await prisma.leaveRequest.update({
            where: { id: leaveId },
            data: { status }
        });

        // 4️⃣ If approved → deduct leave from user
        if (status === 'APPROVED') {
            const user = await prisma.user.findUnique({ where: { id: leave.userId } });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const leaveType = leave.Type.toUpperCase(); // "CL", "SL", "EL"
            const updatedData = {};

            const startDate = new Date(leave.startDate);
            const endDate = new Date(leave.endDate);

            const totalDays = leave.totalDays;
            const weekendDays = countWeekendDays(startDate, endDate);

            const effectiveDays = Math.max(0, totalDays - weekendDays);

            if (leaveType === 'CL') updatedData.CL = Math.max(0, user.CL - effectiveDays);
            else if (leaveType === 'SL') updatedData.SL = Math.max(0, user.SL - effectiveDays);
            else if (leaveType === 'EL') updatedData.EL = Math.max(0, user.EL - effectiveDays);

            if (Object.keys(updatedData).length > 0) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: updatedData
                });
            }
        }

        return res.status(200).json({ message: `Leave application ${status}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong', detail: error.message });
    }
});
// user specific leavs
router.post('/getLeaves', TokenVerification, async (req, res) => {
    const Id = req.user.id;
    try {
        const data = await prisma.leaveRequest.findMany({
            where: { userId: Id },
            select: {
                userId: true,
                startDate: true,
                endDate: true,
                reason: true,
                totalDays: true,
                Type: true,
                status: true,
                createdAt: true,
                document: true
            }
        })
        if (!data) return res.status(404).json({ error: 'data not found' });
        return res.status(200).json(data);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong', detail: error.message });
    }
})

// user All leavs
router.post('/getAllLeaves', TokenVerification, async (req, res) => {
    const Id = req.user.id;

    try {
        // verify it is admin or not
        const admin = await prisma.user.findUnique({ where: { id: Id } });
        if (!admin || admin.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Access denied' });
        }
        //  find all data (leaves) if user is admin
        const data = await prisma.leaveRequest.findMany({
            where: { status: "PENDING" },
            select: {
                id: true,
                userId: true,
                startDate: true,
                endDate: true,
                reason: true,
                totalDays: true,
                Type: true,
                status: true,
                createdAt: true,
                document: true,
                user: { // assuming relation is defined in schema
                    select: {
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })


        if (!data) return res.status(404).json({ error: 'data not found' });
        return res.status(200).json(data);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong', detail: error.message });
    }
})

// downlaod document attact to the request

router.get("/download/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const filename = await prisma.leaveRequest.findUnique({
            where: { id: id },
            select: {
                document: true
            }
        })

        if (!filename) return res.status(404).send("File not found");

        const filePath = path.join(__dirname, "../", filename.document);

        // Send the file
        res.download(filePath, path.basename(filename.document), (err) => {
            if (err) {
                console.error("File download error:", err);
                res.status(500).json({ error: "Error downloading file" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Something went wrong', detail: error.message });
    }

});



module.exports = router;