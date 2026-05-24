const Shipment = require('../models/Shipment');
const Package = require('../models/Package');
const { fn, col, literal } = require('sequelize');

class AdminService {
    async getDashboardOverview() {
        // 1. Fetch total counts and global financial statistics
        const overallStats = await Shipment.findOne({
            attributes: [
                [fn('COUNT', col('tracking_id')), 'totalShipments'],
                [fn('SUM', col('billing_total')), 'totalRevenue']
            ],
            raw: true
        });

        // 2. Fetch the total number of physical packages handled across the system
        const totalPackages = await Package.count();

        // 3. Fetch shipment volume grouped dynamically by their operational status
        const statusCountsRaw = await Shipment.findAll({
            attributes: [
                'status',
                [fn('COUNT', col('tracking_id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // Format status group results cleanly into a key-value object mappings dictionary
        const statusBreakdown = {
            Confirmed: 0,
            "In Transit": 0,
            Delivered: 0,
            Cancelled: 0,
            Pending: 0
        };
        
        statusCountsRaw.forEach(item => {
            if (item.status) {
                statusBreakdown[item.status] = parseInt(item.count, 10) || 0;
            }
        });

        // 4. Fetch the 5 most recent shipments to display on the live feed ticker
        const recentShipments = await Shipment.findAll({
            limit: 5,
            order: [['created_at', 'DESC']],
            attributes: ['tracking_id', 'sender_name', 'receiver_name', 'billing_total', 'status', 'created_at']
        });

        return {
            metrics: {
                totalShipments: parseInt(overallStats?.totalShipments, 10) || 0,
                totalRevenue: parseFloat(overallStats?.totalRevenue) || 0.00,
                totalPackages: totalPackages || 0
            },
            statusDistribution: statusBreakdown,
            recentShipments
        };
    }
    async getYearlyMonthVolume(startYear, endYear) {
        if (!startYear || !endYear) {
            throw new Error("A valid year range must be provided.");
        }
        
        // Auto-correct if user accidentally chooses a startYear greater than endYear
        if (startYear > endYear) {
            [startYear, endYear] = [endYear, startYear];
        }

        // Aggregate directly inside the MySQL database ledger
        const rawResults = await Shipment.findAll({
            where: literal(`YEAR(created_at) BETWEEN ${startYear} AND ${endYear}`),
            attributes: [
                [fn('YEAR', col('created_at')), 'volume_year'],
                [fn('MONTH', col('created_at')), 'volume_month'],
                [fn('COUNT', col('tracking_id')), 'shipmentCount']
            ],
            group: ['volume_year', 'volume_month'],
            order: [
                [literal('volume_year'), 'ASC'],
                [literal('volume_month'), 'ASC']
            ],
            raw: true
        });

        // Initialize a clean map where every month (Jan-Dec) starts at 0 for each year
        const formattedData = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        for (let year = startYear; year <= endYear; year++) {
            formattedData[year] = {};
            monthNames.forEach(month => {
                formattedData[year][month] = 0;
            });
        }

        // Map database counts directly into our structured year-month grid mapping
        rawResults.forEach(item => {
            const year = parseInt(item.volume_year, 10);
            const monthIndex = parseInt(item.volume_month, 10) - 1; // MySQL months are 1-12, JS arrays are 0-11
            const count = parseInt(item.shipmentCount, 10);

            if (formattedData[year] && monthNames[monthIndex]) {
                formattedData[year][monthNames[monthIndex]] = count;
            }
        });

        return formattedData;
    }
}

module.exports = new AdminService();