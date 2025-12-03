const { body } = require('express-validator');

const validZodiacSigns = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                          'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];

exports.validateCalculateChart = [
  body('birthDate')
    .notEmpty()
    .withMessage('Birth date is required')
    .isISO8601()
    .withMessage('Birth date must be a valid date (YYYY-MM-DD)'),
  
  body('birthTime')
    .notEmpty()
    .withMessage('Birth time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Birth time must be in HH:MM format (24-hour)'),
  
  body('birthLocation')
    .notEmpty()
    .withMessage('Birth location is required')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Birth location must be between 2 and 200 characters'),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude must be between -90 and 90'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude must be between -180 and 180'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  
  body('createdBy')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('CreatedBy must not exceed 100 characters')
];

exports.validateUpdateChart = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),
  
  body('birthDate')
    .optional()
    .isISO8601()
    .withMessage('Birth date must be a valid date (YYYY-MM-DD)'),
  
  body('birthTime')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Birth time must be in HH:MM format (24-hour)'),
  
  body('birthLocation')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Birth location must be between 2 and 200 characters'),
  
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must not exceed 1000 characters'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

