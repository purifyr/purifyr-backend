const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const reportValidation = require('../../validations/report.validation');
const reportController = require('../../controllers/report.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('createReport'), validate(reportValidation.createReport), reportController.createReport)
  .get(auth('getReports'), validate(reportValidation.getReports), reportController.getReports);

router.route('/approved-urls').get(reportController.getDistinctApprovedUrls);

router
  .route('/:reportId')
  .get(auth('getReports'), validate(reportValidation.getReport), reportController.getReport)
  .patch(auth('manageReports'), validate(reportValidation.updateReport), reportController.updateReport)
  .delete(auth('manageReports'), validate(reportValidation.deleteReport), reportController.deleteReport);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report management and retrieval
 */

/**
 * @swagger
 * /reports:
 *   post:
 *     summary: Create a report
 *     description: Authenticated users can create a report to flag a suspicious URL. Each user can only report a specific URL once.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *               - cause
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: URL of the reported content
 *               cause:
 *                 type: string
 *                 enum: [harassment, terrorism, phishing, fraud, illegal_content, other]
 *                 description: Cause of the report
 *               description:
 *                 type: string
 *                 description: Optional description of the report
 *             example:
 *               url: https://example.com
 *               cause: harassment
 *               description: This site contains harassing content
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Signalement enregistré et URL approuvée automatiquement."
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *
 *   get:
 *     summary: Get all reports
 *     description: Retrieve a list of all reports. Only admins can view all reports. Filters can be applied by URL and cause.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: url
 *         schema:
 *           type: string
 *           format: uri
 *         description: Filter by URL
 *       - in: query
 *         name: cause
 *         schema:
 *           type: string
 *         description: Filter by cause of report
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status of report
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sorting option, e.g., "createdAt:desc"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of reports
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /reports/{reportId}:
 *   get:
 *     summary: Get a specific report by ID
 *     description: Retrieve a specific report by its ID. Only admins can view any report.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the report
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a report
 *     description: Allows an admin to update the status or cause of a report.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the report
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cause:
 *                 type: string
 *                 enum: [harassment, terrorism, phishing, fraud, illegal_content, other]
 *                 description: Updated cause of the report
 *               status:
 *                 type: string
 *                 enum: [pending, reviewed, resolved, rejected]
 *                 description: Update the status of the report
 *             example:
 *               cause: fraud
 *               status: reviewed
 *     responses:
 *       "200":
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Report'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a report
 *     description: Allows an admin to delete a report.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the report
 *     responses:
 *       "204":
 *         description: No content, report deleted successfully
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
